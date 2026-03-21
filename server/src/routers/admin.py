from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from src.database.core import get_db

router = APIRouter()


def _format_rupees_compact(amount: float) -> str:
    lakhs = amount / 100000 if amount else 0
    return f"\u20b9{lakhs:.1f}L"


def _to_float(value: object) -> float:
    try:
        if value is None:
            return 0.0
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _to_int(value: object) -> int:
    try:
        if value is None:
            return 0
        return int(value)
    except (TypeError, ValueError):
        return 0


def _normalize_risk_level(value: str | None) -> str:
    if not value:
        return "Low"
    lowered = value.strip().lower()
    if lowered == "high":
        return "High"
    if lowered == "medium":
        return "Medium"
    return "Low"


def _risk_priority(value: str) -> int:
    priorities = {"low": 1, "medium": 2, "high": 3}
    return priorities.get(value.lower(), 1)


def _month_buckets() -> list[tuple[int, int, str]]:
    now = datetime.utcnow()
    buckets: list[tuple[int, int, str]] = []
    for offset in range(5, -1, -1):
        month = now.month - offset
        year = now.year
        while month <= 0:
            month += 12
            year -= 1
        buckets.append((year, month, datetime(year, month, 1).strftime("%b")))
    return buckets


def _safe_datetime(raw_value: object) -> datetime | None:
    if raw_value is None:
        return None
    if isinstance(raw_value, datetime):
        return raw_value
    try:
        return datetime.fromisoformat(str(raw_value).replace("Z", "+00:00"))
    except ValueError:
        return None


def _percent_change(current: float, previous: float) -> float:
    if previous <= 0:
        return 0.0
    return ((current - previous) / previous) * 100.0


@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)) -> dict:
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable for admin dashboard",
        ) from exc

    users_rows = db.execute(
        text(
            """
            SELECT id, full_name, email, is_active, created_at
            FROM users
            ORDER BY created_at DESC
            """
        )
    ).mappings().all()

    policies_rows = db.execute(
        text(
            """
            SELECT id, name, provider, policy_type, coverage_amount, premium_amount, claim_ratio,
                   risk_level, is_active, user_id, created_at
            FROM policies
            ORDER BY created_at DESC
            """
        )
    ).mappings().all()

    claims_rows = db.execute(
        text(
            """
            SELECT id, claim_type, amount, status, risk_level, user_id, policy_id, created_at
            FROM claims
            ORDER BY created_at DESC
            """
        )
    ).mappings().all()

    fraud_rules_rows = db.execute(
        text(
            """
            SELECT id, name, condition, severity, is_active, created_at
            FROM fraud_rules
            ORDER BY created_at DESC
            """
        )
    ).mappings().all()

    try:
        activity_rows = db.execute(
            text(
                """
                SELECT id, action, description, entity_type, created_at
                FROM activity_logs
                ORDER BY created_at DESC
                LIMIT 10
                """
            )
        ).mappings().all()
    except Exception:
        activity_rows = []

    user_id_to_name = {row["id"]: row.get("full_name") or "-" for row in users_rows}
    policy_id_to_name = {row["id"]: row.get("name") or "-" for row in policies_rows}

    total_claims = len(claims_rows)
    high_risk_claims = sum(1 for row in claims_rows if str(row.get("risk_level") or "").lower() == "high")
    active_policies_rows = [row for row in policies_rows if bool(row.get("is_active"))]
    active_policies = len(active_policies_rows)

    users_with_plans_set = {
        row.get("user_id")
        for row in active_policies_rows
        if row.get("user_id") is not None
    }
    users_with_plans = len(users_with_plans_set)

    approved_claims = sum(
        1
        for row in claims_rows
        if str(row.get("status") or "").lower() in {"approved", "paid"}
    )
    approval_rate = round((approved_claims / total_claims) * 100, 1) if total_claims else 0

    claims_paid = sum(
        _to_float(row.get("amount"))
        for row in claims_rows
        if str(row.get("status") or "").lower() in {"approved", "paid"}
    )
    total_revenue = sum(_to_float(row.get("premium_amount")) for row in active_policies_rows)

    policies_by_user: dict[int, list[dict]] = {}
    for row in active_policies_rows:
        user_id = row.get("user_id")
        if user_id is None:
            continue
        policies_by_user.setdefault(user_id, []).append(row)

    users_data = []
    for row in users_rows:
        user_id = row.get("id")
        user_policies = policies_by_user.get(user_id, [])
        coverage_sum = sum(_to_float(policy.get("coverage_amount")) for policy in user_policies)
        full_name = str(row.get("full_name") or "User")
        initials = "".join(part[0].upper() for part in full_name.split()[:2]) or "U"
        users_data.append(
            {
                "id": user_id,
                "initials": initials,
                "name": full_name,
                "email": str(row.get("email") or ""),
                "plans": len(user_policies),
                "coverage": _format_rupees_compact(coverage_sum),
                "status": "active" if bool(row.get("is_active")) else "inactive",
            }
        )

    policies_data = []
    for row in policies_rows:
        policies_data.append(
            {
                "id": row.get("id"),
                "name": str(row.get("name") or ""),
                "provider": str(row.get("provider") or ""),
                "type": str(row.get("policy_type") or ""),
                "coverage": _format_rupees_compact(_to_float(row.get("coverage_amount"))),
                "premium": _format_rupees_compact(_to_float(row.get("premium_amount"))),
                "ratio": f"{_to_float(row.get('claim_ratio')):.0f}%",
                "risk_level": _normalize_risk_level(str(row.get("risk_level") or "Low")),
                "user_id": row.get("user_id"),
            }
        )

    claims_data = []
    for row in claims_rows:
        claims_data.append(
            {
                "id": row.get("id"),
                "claim_id": f"CLM-{_to_int(row.get('id')):04d}",
                "user": user_id_to_name.get(row.get("user_id"), "-"),
                "policy": policy_id_to_name.get(row.get("policy_id"), "-"),
                "type": str(row.get("claim_type") or "General"),
                "amount": _format_rupees_compact(_to_float(row.get("amount"))),
                "status": str(row.get("status") or "pending"),
                "risk": _normalize_risk_level(str(row.get("risk_level") or "Low")),
            }
        )

    fraud_rules_data = []
    for row in fraud_rules_rows:
        fraud_rules_data.append(
            {
                "id": row.get("id"),
                "name": str(row.get("name") or ""),
                "condition": str(row.get("condition") or ""),
                "severity": _normalize_risk_level(str(row.get("severity") or "Medium")),
                "status": "active" if bool(row.get("is_active")) else "inactive",
            }
        )

    user_risk_map: dict[int, str] = {}
    for policy in policies_data:
        user_id = policy.get("user_id")
        if user_id is None:
            continue
        policy_risk = _normalize_risk_level(str(policy.get("risk_level") or "Low"))
        current = user_risk_map.get(user_id)
        if current is None or _risk_priority(policy_risk) > _risk_priority(current):
            user_risk_map[user_id] = policy_risk

    active_users_table = []
    for user in users_data:
        active_users_table.append(
            {
                "name": user["name"],
                "email": user["email"],
                "plans": user["plans"],
                "coverage": user["coverage"],
                "risk_level": user_risk_map.get(user["id"], "Low"),
                "status": user["status"],
                "initials": user["initials"],
            }
        )

    active_provider_counts: dict[str, int] = {}
    for row in active_policies_rows:
        provider_name = str(row.get("provider_name") or "Unknown")
        active_provider_counts[provider_name] = active_provider_counts.get(provider_name, 0) + 1

    month_index = _month_buckets()
    month_lookup = {(year, month): idx for idx, (year, month, _) in enumerate(month_index)}
    policy_counts = [0] * len(month_index)
    claim_counts = [0] * len(month_index)
    high_risk_counts = [0] * len(month_index)
    user_counts = [0] * len(month_index)
    premium_sums = [0.0] * len(month_index)
    paid_claim_sums = [0.0] * len(month_index)

    for row in policies_rows:
        created_at = _safe_datetime(row.get("created_at"))
        if created_at is None:
            continue
        key = (created_at.year, created_at.month)
        if key in month_lookup:
            idx = month_lookup[key]
            policy_counts[idx] += 1
            premium_sums[idx] += _to_float(row.get("premium_amount"))

    for row in users_rows:
        created_at = _safe_datetime(row.get("created_at"))
        if created_at is None:
            continue
        key = (created_at.year, created_at.month)
        if key in month_lookup:
            user_counts[month_lookup[key]] += 1

    for row in claims_rows:
        created_at = _safe_datetime(row.get("created_at"))
        if created_at is None:
            continue
        key = (created_at.year, created_at.month)
        if key in month_lookup:
            idx = month_lookup[key]
            claim_counts[idx] += 1
            if str(row.get("risk_level") or "").lower() == "high":
                high_risk_counts[idx] += 1
            if str(row.get("status") or "").lower() in {"approved", "paid"}:
                paid_claim_sums[idx] += _to_float(row.get("amount"))

    month_over_month_growth = 0.0
    if len(policy_counts) >= 2 and policy_counts[-2] > 0:
        month_over_month_growth = ((policy_counts[-1] - policy_counts[-2]) / policy_counts[-2]) * 100

    claims_trend_percent = _percent_change(claim_counts[-1], claim_counts[-2]) if len(claim_counts) >= 2 else 0.0
    high_risk_trend_percent = _percent_change(high_risk_counts[-1], high_risk_counts[-2]) if len(high_risk_counts) >= 2 else 0.0
    users_with_plans_trend_percent = _percent_change(user_counts[-1], user_counts[-2]) if len(user_counts) >= 2 else 0.0
    revenue_trend_percent = _percent_change(premium_sums[-1], premium_sums[-2]) if len(premium_sums) >= 2 else 0.0
    claims_paid_trend_percent = _percent_change(paid_claim_sums[-1], paid_claim_sums[-2]) if len(paid_claim_sums) >= 2 else 0.0

    max_coverage = sum(_to_float(row.get("coverage_amount")) for row in active_policies_rows)
    claim_ratio = round((claims_paid / max_coverage) * 100, 1) if max_coverage else 0

    active_users_count = len([user for user in users_data if user["status"] == "active"])
    active_users_trend_percent = _percent_change(active_users_count, max(active_users_count - user_counts[-1], 0))

    closed_claim_durations = []
    now = datetime.utcnow()
    for row in claims_rows:
        status = str(row.get("status") or "").lower()
        if status in {"pending", "submitted"}:
            continue
        created_at = _safe_datetime(row.get("created_at"))
        if created_at is None:
            continue
        closed_claim_durations.append(max((now - created_at).days, 0))

    avg_processing_time_days = round(
        (sum(closed_claim_durations) / len(closed_claim_durations)) if closed_claim_durations else 0,
        1,
    )

    customer_satisfaction = round(min(5.0, max(0.0, 3.0 + (approval_rate / 50.0))), 1) if total_claims else 0
    total_policies = len(policies_rows)
    renewal_rate = round((active_policies / total_policies) * 100, 1) if total_policies else 0
    fraud_detection_rate = round((high_risk_claims / total_claims) * 100, 1) if total_claims else 0
    user_retention = round((active_users_count / len(users_rows)) * 100, 1) if users_rows else 0
    processing_speed_percent = round(max(0.0, min(100.0, 100.0 - (avg_processing_time_days * 4.0))), 1)
    claim_ratio_trend_percent = _percent_change(claim_ratio, max(claim_ratio - 1.0, 0.0)) if claim_ratio else 0.0

    performance_metrics = [
        {
            "label": "Customer Satisfaction",
            "value": f"{customer_satisfaction:.1f}/5.0",
            "percent": round((customer_satisfaction / 5.0) * 100, 1) if customer_satisfaction else 0,
        },
        {
            "label": "Claim Processing Speed",
            "value": f"{avg_processing_time_days:.1f} days avg",
            "percent": processing_speed_percent,
        },
        {
            "label": "Policy Renewal Rate",
            "value": f"{renewal_rate:.1f}%",
            "percent": renewal_rate,
        },
        {
            "label": "Fraud Detection Rate",
            "value": f"{fraud_detection_rate:.1f}%",
            "percent": fraud_detection_rate,
        },
        {
            "label": "User Retention",
            "value": f"{user_retention:.1f}%",
            "percent": user_retention,
        },
    ]

    claims_by_status = {
        "pending": 0,
        "approved": 0,
        "rejected": 0,
    }
    for row in claims_rows:
        status = str(row.get("status") or "").lower()
        if status in claims_by_status:
            claims_by_status[status] += 1

    policy_type_counts: dict[str, int] = {}
    for row in policies_rows:
        policy_type = str(row.get("policy_type") or "Unknown")
        policy_type_counts[policy_type] = policy_type_counts.get(policy_type, 0) + 1

    recent_activity = []
    if activity_rows:
        for row in activity_rows:
            recent_activity.append(
                {
                    "id": row.get("id"),
                    "title": str(row.get("action") or "Activity"),
                    "description": str(row.get("description") or ""),
                    "type": str(row.get("entity_type") or "System"),
                    "timestamp": (_safe_datetime(row.get("created_at")) or datetime.utcnow()).isoformat(),
                }
            )
    else:
        for row in claims_rows[:5]:
            recent_activity.append(
                {
                    "id": row.get("id"),
                    "title": f"Claim {str(row.get('status') or 'updated').title()}",
                    "description": f"{str(row.get('claim_type') or 'General')} claim of {_format_rupees_compact(_to_float(row.get('amount')))}",
                    "type": "Claim",
                    "timestamp": (_safe_datetime(row.get("created_at")) or datetime.utcnow()).isoformat(),
                }
            )

    return {
        "overview": {
            "total_claims": total_claims,
            "high_risk_claims": high_risk_claims,
            "active_policies": active_policies,
            "users_with_plans": users_with_plans,
            "approval_rate": approval_rate,
            "avg_processing_time_days": avg_processing_time_days,
            "customer_satisfaction": customer_satisfaction,
            "high_priority_alerts": high_risk_claims,
            "medium_priority_alerts": max(total_claims - approved_claims, 0),
            "claims_trend_percent": round(claims_trend_percent, 1),
            "high_risk_trend_percent": round(high_risk_trend_percent, 1),
            "active_policies_trend_percent": round(month_over_month_growth, 1),
            "users_with_plans_trend_percent": round(users_with_plans_trend_percent, 1),
        },
        "recent_activity": recent_activity,
        "users": users_data,
        "policies": policies_data,
        "claims": claims_data,
        "fraud_rules": fraud_rules_data,
        "active_policies": {
            "total_active_policies": active_policies,
            "monthly_growth_percent": round(month_over_month_growth, 1),
            "users_with_active_plans": users_with_plans,
            "users": active_users_table,
            "by_provider": [
                {"provider": key, "count": value}
                for key, value in sorted(active_provider_counts.items(), key=lambda item: item[1], reverse=True)
            ],
        },
        "analytics": {
            "total_revenue": _format_rupees_compact(total_revenue),
            "claims_paid": _format_rupees_compact(claims_paid),
            "active_users": active_users_count,
            "claim_ratio": f"{claim_ratio:.1f}%",
            "total_revenue_trend_percent": round(revenue_trend_percent, 1),
            "claims_paid_trend_percent": round(claims_paid_trend_percent, 1),
            "active_users_trend_percent": round(active_users_trend_percent, 1),
            "claim_ratio_trend_percent": round(claim_ratio_trend_percent, 1),
            "monthly_trends": {
                "labels": [label for _, _, label in month_index],
                "policies": policy_counts,
                "claims": claim_counts,
            },
            "performance_metrics": performance_metrics,
            "claims_by_status": claims_by_status,
            "policies_by_type": [
                {"type": key, "count": value}
                for key, value in sorted(policy_type_counts.items())
            ],
        },
    }

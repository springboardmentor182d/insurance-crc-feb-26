from collections import Counter
from datetime import datetime

from fastapi import APIRouter, Depends
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


def _percent_change(current: int, previous: int) -> float:
    if previous <= 0:
        return 100.0 if current > 0 else 0.0
    return ((current - previous) / previous) * 100


def _build_performance_metrics(
    total_claims: int,
    approved_claims: int,
    claims_paid: float,
    high_risk_claims: int,
    users_count: int,
    users_with_plans: int,
    total_policies: int,
    active_policies: int,
    total_policy_coverage: float,
) -> list[dict]:
    average_claim_amount = (claims_paid / approved_claims) if approved_claims else 0.0
    average_policy_coverage = (total_policy_coverage / total_policies) if total_policies else 0.0
    approval_rate = (approved_claims / total_claims) * 100 if total_claims else 0.0
    high_risk_rate = (high_risk_claims / total_claims) * 100 if total_claims else 0.0
    policy_adoption = (users_with_plans / users_count) * 100 if users_count else 0.0
    active_policy_rate = (active_policies / total_policies) * 100 if total_policies else 0.0

    return [
        {
            "label": "Approval Rate",
            "value": f"{approval_rate:.1f}%",
            "percent": round(approval_rate, 1),
        },
        {
            "label": "Average Approved Claim",
            "value": _format_rupees_compact(average_claim_amount),
            "percent": min(round((average_claim_amount / 100000) * 100, 1), 100) if average_claim_amount else 0,
        },
        {
            "label": "Average Policy Coverage",
            "value": _format_rupees_compact(average_policy_coverage),
            "percent": min(round((average_policy_coverage / 100000) * 100, 1), 100) if average_policy_coverage else 0,
        },
        {
            "label": "High Risk Claim Rate",
            "value": f"{high_risk_rate:.1f}%",
            "percent": round(high_risk_rate, 1),
        },
        {
            "label": "User Policy Adoption",
            "value": f"{policy_adoption:.1f}%",
            "percent": round(policy_adoption, 1),
        },
        {
            "label": "Active Policy Rate",
            "value": f"{active_policy_rate:.1f}%",
            "percent": round(active_policy_rate, 1),
        },
    ]


@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)) -> dict:
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

    user_id_to_name = {row["id"]: row.get("full_name") or "-" for row in users_rows}
    policy_id_to_name = {row["id"]: row.get("name") or "-" for row in policies_rows}

    total_claims = len(claims_rows)
    total_policies = len(policies_rows)
    total_users = len(users_rows)
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
    total_policy_coverage = sum(_to_float(row.get("coverage_amount")) for row in policies_rows)

    now = datetime.utcnow()
    current_year = now.year
    current_month = now.month
    previous_year = current_year if current_month > 1 else current_year - 1
    previous_month = current_month - 1 if current_month > 1 else 12

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

    provider_breakdown_counter = Counter(
        str(row.get("provider") or "Unknown")
        for row in active_policies_rows
    )
    provider_breakdown = [
        {"provider": provider, "count": count}
        for provider, count in provider_breakdown_counter.most_common()
    ]

    month_index = _month_buckets()
    month_lookup = {(year, month): idx for idx, (year, month, _) in enumerate(month_index)}
    policy_counts = [0] * len(month_index)
    claim_counts = [0] * len(month_index)

    for row in policies_rows:
        created_at = _safe_datetime(row.get("created_at"))
        if created_at is None:
            continue
        key = (created_at.year, created_at.month)
        if key in month_lookup:
            policy_counts[month_lookup[key]] += 1

    for row in claims_rows:
        created_at = _safe_datetime(row.get("created_at"))
        if created_at is None:
            continue
        key = (created_at.year, created_at.month)
        if key in month_lookup:
            claim_counts[month_lookup[key]] += 1

    month_over_month_growth = 0.0
    if len(policy_counts) >= 2 and policy_counts[-2] > 0:
        month_over_month_growth = ((policy_counts[-1] - policy_counts[-2]) / policy_counts[-2]) * 100

    claim_ratio = round((claims_paid / total_policy_coverage) * 100, 1) if total_policy_coverage else 0

    current_month_claims = [
        row for row in claims_rows
        if (created_at := _safe_datetime(row.get("created_at")))
        and created_at.year == current_year
        and created_at.month == current_month
    ]
    previous_month_claims = [
        row for row in claims_rows
        if (created_at := _safe_datetime(row.get("created_at")))
        and created_at.year == previous_year
        and created_at.month == previous_month
    ]
    current_month_policies = [
        row for row in policies_rows
        if (created_at := _safe_datetime(row.get("created_at")))
        and created_at.year == current_year
        and created_at.month == current_month
    ]
    previous_month_policies = [
        row for row in policies_rows
        if (created_at := _safe_datetime(row.get("created_at")))
        and created_at.year == previous_year
        and created_at.month == previous_month
    ]

    current_month_high_risk = sum(
        1 for row in current_month_claims if str(row.get("risk_level") or "").lower() == "high"
    )
    previous_month_high_risk = sum(
        1 for row in previous_month_claims if str(row.get("risk_level") or "").lower() == "high"
    )
    current_month_active_policies = sum(1 for row in current_month_policies if bool(row.get("is_active")))
    previous_month_active_policies = sum(1 for row in previous_month_policies if bool(row.get("is_active")))
    current_month_users_with_plans = len({
        row.get("user_id")
        for row in current_month_policies
        if bool(row.get("is_active")) and row.get("user_id") is not None
    })
    previous_month_users_with_plans = len({
        row.get("user_id")
        for row in previous_month_policies
        if bool(row.get("is_active")) and row.get("user_id") is not None
    })

    overview_trends = {
        "total_claims": round(_percent_change(len(current_month_claims), len(previous_month_claims)), 1),
        "high_risk_claims": round(_percent_change(current_month_high_risk, previous_month_high_risk), 1),
        "active_policies": round(_percent_change(current_month_active_policies, previous_month_active_policies), 1),
        "users_with_plans": round(_percent_change(current_month_users_with_plans, previous_month_users_with_plans), 1),
    }

    claims_by_status_counter = Counter()
    for row in claims_rows:
        status = str(row.get("status") or "unknown").strip().lower()
        claims_by_status_counter[status] += 1

    policy_type_counter = Counter()
    for row in policies_rows:
        policy_type = str(row.get("policy_type") or "Unknown").strip()
        policy_type_counter[policy_type] += 1

    activity_feed = []
    for row in claims_rows[:5]:
        activity_feed.append(
            {
                "title": f"Claim {f'CLM-{_to_int(row.get('id')):04d}'} updated",
                "description": f"Status: {str(row.get('status') or 'pending').title()}",
                "type": "Claim",
                "timestamp": row.get("created_at"),
            }
        )
    for row in policies_rows[:5]:
        activity_feed.append(
            {
                "title": f"Policy {row.get('name') or '-'} available",
                "description": f"Provider: {row.get('provider') or '-'}",
                "type": "Policy",
                "timestamp": row.get("created_at"),
            }
        )
    for row in users_rows[:5]:
        activity_feed.append(
            {
                "title": f"User {row.get('full_name') or 'User'} registered",
                "description": str(row.get("email") or ""),
                "type": "User",
                "timestamp": row.get("created_at"),
            }
        )

    recent_activity = sorted(
        activity_feed,
        key=lambda item: _safe_datetime(item.get("timestamp")) or datetime.min,
        reverse=True,
    )[:8]

    performance_metrics = _build_performance_metrics(
        total_claims=total_claims,
        approved_claims=approved_claims,
        claims_paid=claims_paid,
        high_risk_claims=high_risk_claims,
        users_count=total_users,
        users_with_plans=users_with_plans,
        total_policies=total_policies,
        active_policies=active_policies,
        total_policy_coverage=total_policy_coverage,
    )

    return {
        "overview": {
            "total_claims": total_claims,
            "high_risk_claims": high_risk_claims,
            "active_policies": active_policies,
            "users_with_plans": users_with_plans,
            "trends": overview_trends,
            "approval_rate": approval_rate,
            "avg_processing_time_days": None,
            "customer_satisfaction": None,
            "high_priority_alerts": high_risk_claims,
            "medium_priority_alerts": max(total_claims - approved_claims, 0),
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
            "provider_breakdown": provider_breakdown,
            "users": active_users_table,
        },
        "analytics": {
            "total_revenue": _format_rupees_compact(total_revenue),
            "claims_paid": _format_rupees_compact(claims_paid),
            "active_users": len([user for user in users_data if user["status"] == "active"]),
            "claim_ratio": f"{claim_ratio:.1f}%",
            "monthly_trends": {
                "labels": [label for _, _, label in month_index],
                "policies": policy_counts,
                "claims": claim_counts,
            },
            "performance_metrics": performance_metrics,
            "claims_by_status": dict(sorted(claims_by_status_counter.items())),
            "policies_by_type": [
                {"type": key, "count": value}
                for key, value in sorted(policy_type_counter.items())
            ],
        },
    }

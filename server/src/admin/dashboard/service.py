from datetime import date, datetime
from decimal import Decimal
from typing import Any, TypedDict

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from src.database.admin_dashboard.models.claims import Claim
from src.database.admin_dashboard.models.policies import Policy
from src.admin.dashboard.models import (
    AdminStatsData,
    AdminStatsResponse,
    ClaimsTrend,
    ClaimsTrendsResponse,
    PolicyDistributionItem,
    PolicyDistributionResponse,
    RecentActivityItem,
    RecentActivityResponse,
    RevenuePoint,
    RevenueResponse,
    TopAdjuster,
    TopAdjustersResponse,
)
from src.admin.manage_policies.service import get_policy_stats
from src.auth.models import AdminLogin, RegisterRequest
from src.auth.service import AuthService
from src.database.admin_dashboard.models.users import User, UserRole
from src.database.admin_dashboard.repository import (
    get_admin_stats_snapshot,
    get_claims_trends_snapshot,
    get_policy_distribution_snapshot,
    get_recent_activity_snapshot,
    get_revenue_snapshot,
    get_top_adjusters_snapshot,
)

class DashboardPolicyItem(TypedDict):
    id: int
    policy_number: str
    policy_type: str
    status: str
    premium_amount: float
    coverage_amount: float
    start_date: str
    end_date: str


class DashboardClaimItem(TypedDict):
    id: str
    type: str
    date: str
    amount: str
    status: str


def admin_signup(data: RegisterRequest, db: Session) -> dict[str, str]:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    full_name = data.name.strip()
    first_name, _, remaining = full_name.partition(" ")
    last_name = remaining.strip() or None

    new_admin = User(
        email=data.email,
        first_name=first_name or None,
        last_name=last_name,
        full_name=full_name,
        role=UserRole.ADMIN,
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "Admin created successfully"}


def admin_login(data: AdminLogin, db: Session) -> dict[str, Any]:
    # Reuse AuthService so /admin/login and /auth/admin/login behave consistently.
    return AuthService(db).admin_login(data)


async def get_admin_stats() -> AdminStatsResponse:
    stats = get_admin_stats_snapshot()
    policies_stats = get_policy_stats()
    stats["activePolicies"] = policies_stats.activePolicies
    return AdminStatsResponse(data=AdminStatsData(**stats))


async def get_claims_trends() -> ClaimsTrendsResponse:
    trends = [ClaimsTrend(**row) for row in get_claims_trends_snapshot()]
    return ClaimsTrendsResponse(data=trends)


async def get_revenue_data() -> RevenueResponse:
    revenue = [RevenuePoint(**row) for row in get_revenue_snapshot()]
    return RevenueResponse(data=revenue)


async def get_policy_distribution() -> PolicyDistributionResponse:
    distribution = [
        PolicyDistributionItem(**row) for row in get_policy_distribution_snapshot()
    ]
    return PolicyDistributionResponse(data=distribution)


async def get_top_adjusters() -> TopAdjustersResponse:
    adjusters = [TopAdjuster(**row) for row in get_top_adjusters_snapshot()]
    return TopAdjustersResponse(data=adjusters)


async def get_recent_activity() -> RecentActivityResponse:
    activities = [
        RecentActivityItem(**row) for row in get_recent_activity_snapshot(limit=5)
    ]
    return RecentActivityResponse(data=activities)


def _to_title(value: str | None) -> str:
    if not value:
        return ""
    return value.replace("_", " ").title()


def _enum_value(value: Any) -> str:
    return getattr(value, "value", str(value))


def _to_float(value: Decimal | float | int | None) -> float:
    if value is None:
        return 0.0
    return float(value)


def _to_iso_date(value: datetime | date | None) -> str:
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.date().isoformat()
    return value.isoformat()


def _serialize_policy(policy: Policy) -> DashboardPolicyItem:
    return {
        "id": policy.id,
        "policy_number": policy.policy_number,
        "policy_type": _to_title(_enum_value(policy.policy_type)),
        "status": _to_title(_enum_value(policy.status)),
        "premium_amount": _to_float(policy.premium_amount),
        "coverage_amount": _to_float(policy.coverage_amount),
        "start_date": _to_iso_date(policy.start_date),
        "end_date": _to_iso_date(policy.end_date),
    }


def _serialize_claim(claim: Claim) -> DashboardClaimItem:
    raw_status = _enum_value(claim.status).lower()
    status_map = {
        "pending": "Pending",
        "approved": "Resolved",
        "rejected": "Rejected",
        "fraudulent": "Fraudulent",
    }
    policy_type = (
        _to_title(_enum_value(claim.policy.policy_type))
        if claim.policy is not None
        else "Policy"
    )

    return {
        "id": claim.claim_number or f"CLM-{claim.id}",
        "type": policy_type,
        "date": _to_iso_date(claim.submitted_at),
        "amount": f"${_to_float(claim.claim_amount):,.2f}",
        "status": status_map.get(raw_status, _to_title(raw_status)),
    }


async def get_all_policies(
    db: Session, current_user: User
) -> list[DashboardPolicyItem]:
    query = db.query(Policy)
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Policy.user_id == current_user.id)
    policies = query.order_by(Policy.created_at.desc()).all()
    return [_serialize_policy(policy) for policy in policies]


async def get_all_claims(
    db: Session, current_user: User
) -> list[DashboardClaimItem]:
    query = db.query(Claim).options(joinedload(Claim.policy))
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Claim.user_id == current_user.id)
    claims = query.order_by(Claim.submitted_at.desc()).all()
    return [_serialize_claim(claim) for claim in claims]

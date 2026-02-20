from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.database.admin_dashboard.models.claims import Claim
try:
    from src.database.admin_dashboard.models.policies import Policy
except ImportError:
    # If the above fails, we might need to look in the 'admin' models
    from src.admin.models import Policy
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
from src.auth.security import hash_password
from src.auth.db_models import AuthCredential
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

ADMIN_SECRET = "bimaverse-admin-2026"


def admin_signup(data: RegisterRequest, db: Session):
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
    db.flush()
    db.add(AuthCredential(user_id=new_admin.id, password_hash=hash_password(data.password)))
    db.commit()
    db.refresh(new_admin)
    return {"message": "Admin created successfully"}


def admin_login(data: AdminLogin, db: Session):
    # Reuse AuthService so /admin/login and /auth/admin/login behave consistently.
    return AuthService(db).admin_login(data)


async def get_admin_stats():
    stats = get_admin_stats_snapshot()
    policies_stats = get_policy_stats()
    stats["activePolicies"] = policies_stats.activePolicies
    return AdminStatsResponse(data=AdminStatsData(**stats))


async def get_claims_trends():
    trends = [ClaimsTrend(**row) for row in get_claims_trends_snapshot()]
    return ClaimsTrendsResponse(data=trends)


async def get_revenue_data():
    revenue = [RevenuePoint(**row) for row in get_revenue_snapshot()]
    return RevenueResponse(data=revenue)


async def get_policy_distribution():
    distribution = [
        PolicyDistributionItem(**row) for row in get_policy_distribution_snapshot()
    ]
    return PolicyDistributionResponse(data=distribution)


async def get_top_adjusters():
    adjusters = [TopAdjuster(**row) for row in get_top_adjusters_snapshot()]
    return TopAdjustersResponse(data=adjusters)


async def get_recent_activity():
    activities = [
        RecentActivityItem(**row) for row in get_recent_activity_snapshot(limit=5)
    ]
    return RecentActivityResponse(data=activities)

async def get_all_policies(db: Session):
    return db.query(Policy).all()

async def get_all_claims(db: Session):
    return db.query(Claim).all()

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from src.auth.models import RegisterRequest, AdminLogin
from src.auth.jwt import create_access_token
from src.admin.models import (
    AdminStatsResponse,
    AdminStatsData,
    ClaimsTrend,
    ClaimsTrendsResponse,
    RevenuePoint,
    RevenueResponse,
    PolicyDistributionItem,
    PolicyDistributionResponse,
    TopAdjuster,
    TopAdjustersResponse,
    RecentActivityItem,
    RecentActivityResponse,
)
from src.database.repositories.admin_stats import get_admin_stats_snapshot
from src.database.repositories.claims_trends import get_claims_trends_snapshot
from src.database.repositories.policy_distribution import get_policy_distribution_snapshot
from src.database.repositories.recent_activity import get_recent_activity_snapshot
from src.database.repositories.revenue import get_revenue_snapshot
from src.database.repositories.top_adjusters import get_top_adjusters_snapshot

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_SECRET = "bimaverse-admin-2026"


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


# ─── Auth ────────────────────────────────────
def admin_signup(data: RegisterRequest, db: Session):
    from src.entities.user import User
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_admin = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        first_name=data.name,
        role="admin"
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "Admin created successfully"}


def admin_login(data: AdminLogin, db: Session):
    from src.entities.user import User
    if data.admin_secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid admin secret")

    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}


# ─── Dashboard ───────────────────────────────
async def get_admin_stats():
    stats = get_admin_stats_snapshot()
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
    activities = [RecentActivityItem(**row) for row in get_recent_activity_snapshot()]
    return RecentActivityResponse(data=activities)
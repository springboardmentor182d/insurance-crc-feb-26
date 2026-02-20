from fastapi import APIRouter
from .service import (
    get_admin_stats,
    get_claims_trends,
    get_revenue_data,
    get_policy_distribution,
    get_top_adjusters,
    get_recent_activity,
)
from .models import (
    AdminStatsResponse,
    ClaimsTrendsResponse,
    RevenueResponse,
    PolicyDistributionResponse,
    TopAdjustersResponse,
    RecentActivityResponse,
)

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=AdminStatsResponse)
async def stats():
    return await get_admin_stats()


@router.get("/claims-trends", response_model=ClaimsTrendsResponse)
async def claims_trends():
    return await get_claims_trends()


@router.get("/revenue", response_model=RevenueResponse)
async def revenue():
    return await get_revenue_data()


@router.get("/policy-distribution", response_model=PolicyDistributionResponse)
async def policy_distribution():
    return await get_policy_distribution()


@router.get("/top-adjusters", response_model=TopAdjustersResponse)
async def top_adjusters():
    return await get_top_adjusters()


@router.get("/recent-activity", response_model=RecentActivityResponse)
async def recent_activity():
    return await get_recent_activity()

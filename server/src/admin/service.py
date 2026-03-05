from .models import (
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


# ------------------------
# Admin Stats
# ------------------------

async def get_admin_stats():
    stats = get_admin_stats_snapshot()
    return AdminStatsResponse(data=AdminStatsData(**stats))


# ------------------------
# Claims Trends
# ------------------------
async def get_claims_trends():
    trends = [ClaimsTrend(**row) for row in get_claims_trends_snapshot()]
    return ClaimsTrendsResponse(data=trends)


# ------------------------
# Revenue Data
# ------------------------
async def get_revenue_data():
    revenue = [RevenuePoint(**row) for row in get_revenue_snapshot()]
    return RevenueResponse(data=revenue)


# ------------------------
# Policy Distribution
# ------------------------
async def get_policy_distribution():
    distribution = [
        PolicyDistributionItem(**row) for row in get_policy_distribution_snapshot()
    ]
    return PolicyDistributionResponse(data=distribution)


# ------------------------
# Top Adjusters
# ------------------------
async def get_top_adjusters():
    adjusters = [TopAdjuster(**row) for row in get_top_adjusters_snapshot()]
    return TopAdjustersResponse(data=adjusters)


# ------------------------
# Recent Activity
# ------------------------
async def get_recent_activity():
    activities = [RecentActivityItem(**row) for row in get_recent_activity_snapshot()]
    return RecentActivityResponse(data=activities)

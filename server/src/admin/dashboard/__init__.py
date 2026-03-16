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
from src.database.admin_dashboard.repository import (
    get_admin_stats_snapshot,
    get_claims_trends_snapshot,
    get_policy_distribution_snapshot,
    get_recent_activity_snapshot,
    get_revenue_snapshot,
    get_top_adjusters_snapshot,
)
from src.admin.manage_policies.service import get_policy_stats

# ------------------------
# Admin Stats
# ------------------------


async def get_admin_stats():
    stats = get_admin_stats_snapshot()
    policies_stats = get_policy_stats()
    stats["activePolicies"] = policies_stats.activePolicies
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

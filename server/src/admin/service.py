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


# ------------------------
# Admin Stats
# ------------------------

async def get_admin_stats():
    return AdminStatsResponse(
        data=AdminStatsData(
            totalUsers=12458,
            usersGrowth=12.5,

            activePolicies=45823,
            policiesGrowth=8.2,

            totalClaims=2847,
            claimsGrowth=5.4,

            fraudDetected=127,
            fraudGrowth= -3.1,
        )
    )


# ------------------------
# Claims Trends
# ------------------------
async def get_claims_trends():
    trends = [
        ClaimsTrend(month="Jan", approved=180, rejected=40, fraudulent=15),
        ClaimsTrend(month="Feb", approved=210, rejected=50, fraudulent=18),
        ClaimsTrend(month="Mar", approved=230, rejected=60, fraudulent=20),
    ]

    return ClaimsTrendsResponse(data=trends)


# ------------------------
# Revenue Data
# ------------------------
async def get_revenue_data():
    revenue = [
        RevenuePoint(month="Jan", revenue=120000, expenses=90000),
        RevenuePoint(month="Feb", revenue=140000, expenses=95000),
        RevenuePoint(month="Mar", revenue=160000, expenses=100000),
    ]

    return RevenueResponse(data=revenue)


# ------------------------
# Policy Distribution
# ------------------------
async def get_policy_distribution():
    distribution = [
        PolicyDistributionItem(policyType="Auto", percentage=35, count=350),
        PolicyDistributionItem(policyType="Home", percentage=28, count=280),
        PolicyDistributionItem(policyType="Life", percentage=22, count=220),
        PolicyDistributionItem(policyType="Health", percentage=15, count=150),
    ]

    return PolicyDistributionResponse(data=distribution)


# ------------------------
# Top Adjusters
# ------------------------
async def get_top_adjusters():
    adjusters = [
        TopAdjuster(name="Sarah Johnson", totalClaims=145, approvalRate=92.5, avgProcessingDays=2.3),
        TopAdjuster(name="Michael Chen", totalClaims=132, approvalRate=89.0, avgProcessingDays=2.8),
        TopAdjuster(name="Emily Rodriguez", totalClaims=128, approvalRate=94.0, avgProcessingDays=2.1),
    ]

    return TopAdjustersResponse(data=adjusters)


# ------------------------
# Recent Activity
# ------------------------
async def get_recent_activity():
    activities = [
        RecentActivityItem(
            title="New fraud rule activated",
            actor="Admin",
            timestamp="2 hours ago",
            severity="fraud",
        ),
        RecentActivityItem(
            title="Claim CLM-2026-045 approved",
            actor="John Smith",
            timestamp="3 hours ago",
            severity="approved",
        ),
        RecentActivityItem(
            title="High-risk claim flagged",
            actor="System",
            timestamp="5 hours ago",
            severity="flagged",
        ),
         RecentActivityItem(
            title="New policy activated",
            actor="Jane Doe",
            timestamp="5 hours ago",
            severity="info",
        ),
    ]

    return RecentActivityResponse(data=activities)

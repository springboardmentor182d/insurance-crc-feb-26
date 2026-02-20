from pydantic import BaseModel
from typing import List


class AdminStatsData(BaseModel):
    totalUsers: int
    activePolicies: int
    totalClaims: int
    fraudDetected: int

class AdminStatsResponse(BaseModel):
    data: AdminStatsData


class ClaimsTrend(BaseModel):
    month: str
    approved: int
    rejected: int
    fraudulent: int


class ClaimsTrendsResponse(BaseModel):
    data: List[ClaimsTrend]


class RevenuePoint(BaseModel):
    month: str
    revenue: float
    expenses: float


class RevenueResponse(BaseModel):
    data: List[RevenuePoint]


class PolicyDistributionItem(BaseModel):
    policyType: str
    percentage: float
    count: int


class PolicyDistributionResponse(BaseModel):
    data: List[PolicyDistributionItem]


class TopAdjuster(BaseModel):
    name: str
    totalClaims: int
    approvalRate: float
    avgProcessingDays: float


class TopAdjustersResponse(BaseModel):
    data: List[TopAdjuster]


class RecentActivityItem(BaseModel):
    title: str
    description: str
    timestamp: str
    severity: str


class RecentActivityResponse(BaseModel):
    data: List[RecentActivityItem]
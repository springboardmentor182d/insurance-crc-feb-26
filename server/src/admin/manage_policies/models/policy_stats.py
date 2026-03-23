from pydantic import BaseModel


class PolicyStatsData(BaseModel):
    totalPolicies: int
    activePolicies: int
    autoInsurance: int
    homeInsurance: int


class PolicyStatsResponse(BaseModel):
    data: PolicyStatsData

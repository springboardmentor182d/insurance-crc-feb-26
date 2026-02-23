from pydantic import BaseModel

class AdminStatsData(BaseModel):
    totalUsers: int
    activePolicies: int
    totalClaims: int
    fraudDetected: int

class AdminStatsResponse(BaseModel):
    data: AdminStatsData
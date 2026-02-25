from pydantic import BaseModel

class AdminStatsData(BaseModel):
    totalUsers: int
    usersGrowth: float

    activePolicies: int
    policiesGrowth: float

    totalClaims: int
    claimsGrowth: float

    fraudDetected: int
    fraudGrowth: float


class AdminStatsResponse(BaseModel):
    data: AdminStatsData
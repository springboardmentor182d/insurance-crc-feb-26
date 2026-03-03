from pydantic import BaseModel
from typing import List   

class TopAdjuster(BaseModel):
    name: str
    totalClaims: int
    approvalRate: float
    avgProcessingDays: float


class TopAdjustersResponse(BaseModel):
    data: List[TopAdjuster]
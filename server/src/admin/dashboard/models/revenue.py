from pydantic import BaseModel
from typing import List


class RevenuePoint(BaseModel):
    month: str
    revenue: float
    expenses: float


class RevenueResponse(BaseModel):
    data: List[RevenuePoint]

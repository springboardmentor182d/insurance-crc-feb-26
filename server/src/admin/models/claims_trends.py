from pydantic import BaseModel
from typing import List

class ClaimsTrend(BaseModel):
    month: str
    approved: int
    rejected: int
    fraudulent: int


class ClaimsTrendsResponse(BaseModel):
    data: List[ClaimsTrend]
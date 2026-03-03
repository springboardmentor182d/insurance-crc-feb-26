from pydantic import BaseModel
from typing import List

class PolicyDistributionItem(BaseModel):
    policyType: str
    percentage: float
    count: int


class PolicyDistributionResponse(BaseModel):
    data: List[PolicyDistributionItem]

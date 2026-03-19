from pydantic import BaseModel
from typing import Literal


class PolicyDetails(BaseModel):
    id: int
    policyName: str
    provider: str
    type: str
    premium: float
    coverage: float
    deductible: float
    description: str
    status: Literal["active", "inactive"]


class PolicyDetailsResponse(BaseModel):
    data: PolicyDetails

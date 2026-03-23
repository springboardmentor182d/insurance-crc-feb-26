from pydantic import BaseModel
from typing import Literal


class PolicyItem(BaseModel):
    id: int
    policyName: str
    provider: str
    type: str
    premium: float
    coverage: float
    deductible: float
    description: str
    status: Literal["active", "inactive"]


class PoliciesListResponse(BaseModel):
    data: list[PolicyItem]

from pydantic import BaseModel
from typing import Literal


class UpdatePolicyRequest(BaseModel):
    policyName: str
    provider: str
    type: str
    premium: float
    coverage: float
    deductible: float
    description: str | None = None
    status: Literal["active", "inactive"] | None = None

from pydantic import BaseModel


class CreatePolicyRequest(BaseModel):
    policyName: str
    provider: str
    type: str
    premium: float
    coverage: float
    deductible: float
    description: str = ""

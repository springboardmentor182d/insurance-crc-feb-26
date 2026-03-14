from pydantic import BaseModel

class FraudCase(BaseModel):
    case_id: str
    claim_id: str
    policy_id: str
    claimant: str
    amount: int
    risk: str
    confidence: int
    rules: str


class DetectionRule(BaseModel):
    rule_name: str
    description: str
    severity: str

from pydantic import BaseModel

class DetectionRule(BaseModel):
    rule_id: str
    rule_name: str
    description: str
    severity: str
    created_date: str
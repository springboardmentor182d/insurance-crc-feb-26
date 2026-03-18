from pydantic import BaseModel


class DetectionRuleCreate(BaseModel):
    rule_id: str
    rule_name: str
    description: str
    severity: str
    detections: int
    created_date: str
    status: str


class FraudCaseCreate(BaseModel):
    case_id: str
    claim_id: str
    policy_id: str
    claimant: str
    amount: float
    risk_level: str
    confidence: int
    triggered_rules: str
    status: str

class DetectionRuleCreate(BaseModel):
    rule_id: str
    rule_name: str
    description: str
    severity: str
    detections: int
    created_date: str
    status: str
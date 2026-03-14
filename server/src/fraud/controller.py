from fastapi import APIRouter
from src.fraud.models import DetectionRule
from src.fraud.service import get_fraud_cases, get_detection_rules, create_rule

router = APIRouter(prefix="/fraud", tags=["Fraud Detection"])




# GET FRAUD CASES
@router.get("/cases")
def fraud_cases():
    return get_fraud_cases()


# GET DETECTION RULES
@router.get("/rules")
def detection_rules():
    return get_detection_rules()

# ADD RULE
@router.post("/rules")
def add_rule(rule: DetectionRule):
    return create_rule(rule)

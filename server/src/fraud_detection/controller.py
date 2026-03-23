from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.fraud_detection.service import (
    detect_fraud_for_claim,
    get_all_fraud_flags,
    get_filtered_flags,
    get_fraud_stats,
    update_fraud_status
)

from src.fraud_detection.schemas import FraudStatusUpdate
from src.fraud_detection.models import FraudRule

router = APIRouter(prefix="/fraud", tags=["Fraud Detection"])


# -------------------------------
# Fraud Detection APIs
# -------------------------------

@router.get("/check-claim")
def check_claim(amount: float, db: Session = Depends(get_db)):
    return detect_fraud_for_claim(amount, db)


@router.get("/flags")
def get_flags(db: Session = Depends(get_db)):
    return get_all_fraud_flags(db)


@router.get("/filter")
def filter_flags(severity: str, db: Session = Depends(get_db)):
    return get_filtered_flags(severity, db)


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return get_fraud_stats(db)


@router.put("/update-status/{flag_id}")
def update_status(flag_id: int, data: FraudStatusUpdate, db: Session = Depends(get_db)):
    return update_fraud_status(flag_id, data.status, db)


# -------------------------------
# Fraud Rules Management APIs
# -------------------------------

@router.get("/rules")
def get_rules(db: Session = Depends(get_db)):
    return db.query(FraudRule).all()


@router.post("/rules")
def add_rule(rule: dict = Body(...), db: Session = Depends(get_db)):

    new_rule = FraudRule(
        rule_name=rule["rule_name"],
        field_name=rule["field_name"],
        operator=rule["operator"],
        rule_value=rule["rule_value"],
        severity=rule["severity"],
        recommendation=rule["recommendation"],
        status="ACTIVE"
    )

    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    return new_rule


@router.put("/rules/{rule_id}")
def update_rule(rule_id: int, data: dict = Body(...), db: Session = Depends(get_db)):

    rule = db.query(FraudRule).filter(FraudRule.id == rule_id).first()

    if not rule:
        return {"error": "Rule not found"}

    rule.rule_name = data.get("rule_name", rule.rule_name)
    rule.field_name = data.get("field_name", rule.field_name)
    rule.operator = data.get("operator", rule.operator)
    rule.rule_value = data.get("rule_value", rule.rule_value)
    rule.severity = data.get("severity", rule.severity)
    rule.recommendation = data.get("recommendation", rule.recommendation)

    db.commit()
    db.refresh(rule)

    return rule


@router.delete("/rules/{rule_id}")
def delete_rule(rule_id: int, db: Session = Depends(get_db)):

    rule = db.query(FraudRule).filter(FraudRule.id == rule_id).first()

    if not rule:
        return {"error": "Rule not found"}

    db.delete(rule)
    db.commit()

    return {"message": "Rule deleted successfully"}
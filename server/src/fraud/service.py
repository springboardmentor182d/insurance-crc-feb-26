from sqlalchemy.orm import Session
from src.fraud.models import DetectionRule, FraudCase


def get_dashboard(db: Session):
    active_cases = db.query(FraudCase).filter(FraudCase.status == "Under Review").count()
    confirmed_fraud = db.query(FraudCase).filter(FraudCase.status == "Confirmed Fraud").count()
    active_rules = db.query(DetectionRule).filter(DetectionRule.status == "Active").count()

    return {
        "activeCases": active_cases,
        "confirmedFraud": confirmed_fraud,
        "amountSaved": "$1.2M",
        "activeRules": active_rules,
    }


def get_cases(db: Session):
    cases = db.query(FraudCase).all()

    return [
        {
            "case_id": case.case_id,
            "claim_id": case.claim_id,
            "policy_id": case.policy_id,
            "claimant": case.claimant,
            "amount": case.amount,
            "risk_level": case.risk_level,
            "confidence": case.confidence,
            "rules": case.rules,
            "status": case.status,
        }
        for case in cases
    ]


def get_rules(db: Session):
    rules = db.query(DetectionRule).all()

    return [
        {
            "rule_id": rule.rule_id,
            "rule_name": rule.rule_name,
            "description": rule.description,
            "severity": rule.severity,
            "detections": rule.detections,
            "created_date": rule.created_date,
            "status": rule.status,
        }
        for rule in rules
    ]


def create_rule(db: Session, rule):
    new_rule = DetectionRule(**rule.dict())
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    return new_rule


def update_rule(db: Session, rule_id: str, data: dict):
    rule = db.query(DetectionRule).filter(DetectionRule.rule_id == rule_id).first()

    if not rule:
        return None

    for key, value in data.items():
        setattr(rule, key, value)

    db.commit()
    db.refresh(rule)
    return rule


def delete_rule(db: Session, rule_id: str):
    rule = db.query(DetectionRule).filter(DetectionRule.rule_id == rule_id).first()

    if not rule:
        return {"message": "Rule not found"}

    db.delete(rule)
    db.commit()
    return {"message": "Rule deleted successfully"}
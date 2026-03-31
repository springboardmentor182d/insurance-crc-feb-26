from sqlalchemy.orm import Session
from src.fraud_detection.models import FraudFlag
from src.fraud_detection.rules_engine import evaluate_rules


def detect_fraud_for_claim(amount, db: Session):

    # Prepare claim data for rules engine
    claim_data = {
        "claim_amount": amount
    }

    # Run rules engine
    result = evaluate_rules(claim_data, db)

    rule_triggered = result["rule_triggered"]
    severity = result["severity"]
    recommendation = result["recommendation"]

    # Save fraud flag in database
    fraud_flag = FraudFlag(
        claim_id="TEST123",
        rule_code=rule_triggered,
        severity=severity.lower(),
        details=recommendation,
        status="new"
    )

    db.add(fraud_flag)
    db.commit()
    db.refresh(fraud_flag)

    return {
        "fraud_detected": True,
        "rule_triggered": rule_triggered,
        "severity": severity,
        "recommendation": recommendation
    }


def get_all_fraud_flags(db: Session):
    return db.query(FraudFlag).all()


def get_filtered_flags(severity: str, db: Session):

    return db.query(FraudFlag).filter(
        FraudFlag.severity == severity
    ).all()


def get_fraud_stats(db: Session):

    total_flags = db.query(FraudFlag).count()

    high_severity = db.query(FraudFlag).filter(
        FraudFlag.severity == "high"
    ).count()

    new_cases = db.query(FraudFlag).filter(
        FraudFlag.status == "new"
    ).count()

    escalated = db.query(FraudFlag).filter(
        FraudFlag.status == "escalated"
    ).count()

    return {
        "total_flags": total_flags,
        "high_severity": high_severity,
        "new_cases": new_cases,
        "escalated": escalated
    }


def update_fraud_status(flag_id: int, status: str, db: Session):

    fraud_flag = db.query(FraudFlag).filter(
        FraudFlag.id == flag_id
    ).first()

    if not fraud_flag:
        return {"error": "Fraud flag not found"}

    fraud_flag.status = status

    db.commit()
    db.refresh(fraud_flag)

    return fraud_flag
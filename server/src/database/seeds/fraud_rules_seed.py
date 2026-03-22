from __future__ import annotations

from sqlalchemy import select

from src.database.core import SessionLocal
from src.database.admin_dashboard.models import FraudRule, FraudSeverity

SEED_RULES = [
    {
        "rule_name": "DUPLICATE_CLAIM",
        "severity": FraudSeverity.HIGH,
        "trigger_threshold": None,
        "description": "Flags claims with similar description and same policy within 90 days",
    },
    {
        "rule_name": "EXCESSIVE_AMOUNT",
        "severity": FraudSeverity.HIGH,
        "trigger_threshold": 3.0,
        "description": "Claim amount exceeds 3x the average approved amount for the same policy type",
    },
    {
        "rule_name": "RAPID_POLICY_CLAIM",
        "severity": FraudSeverity.MEDIUM,
        "trigger_threshold": 30.0,
        "description": "Claim filed within 30 days of policy start date",
    },
    {
        "rule_name": "MULTIPLE_CLAIMS_SHORT_PERIOD",
        "severity": FraudSeverity.MEDIUM,
        "trigger_threshold": 2.0,
        "description": "More than 2 claims from same user within a 60-day window",
    },
    {
        "rule_name": "SUSPICIOUS_TIMING",
        "severity": FraudSeverity.LOW,
        "trigger_threshold": 50000.0,
        "description": "Claim submitted on weekend with amount above threshold",
    },
    {
        "rule_name": "DUPLICATE_DOCUMENTS",
        "severity": FraudSeverity.HIGH,
        "trigger_threshold": None,
        "description": "Reserved: duplicate document detection (future)",
    },
    {
        "rule_name": "LOW_FRAUD_SCORE_OVERRIDE",
        "severity": FraudSeverity.LOW,
        "trigger_threshold": 0.7,
        "description": "Pre-existing fraud score above threshold before rule execution",
    },
]


def seed_fraud_rules() -> None:
    with SessionLocal() as session:
        for rule in SEED_RULES:
            existing = session.execute(
                select(FraudRule).where(FraudRule.rule_name == rule["rule_name"])
            ).scalar_one_or_none()
            if existing:
                continue
            session.add(
                FraudRule(
                    rule_name=rule["rule_name"],
                    description=rule["description"],
                    severity=rule["severity"],
                    trigger_threshold=rule["trigger_threshold"],
                    is_active=True,
                )
            )
        session.commit()

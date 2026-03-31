from sqlalchemy.orm import Session
from database.core import SessionLocal   # ✅ FIXED IMPORT
from fraud_detection.models import FraudRule


def seed_rules():
    db: Session = SessionLocal()

    # 🔥 CLEAR OLD RULES
    db.query(FraudRule).delete()

    rules = [
        # 🔴 HIGH
        {
            "rule_name": "High Claim Amount",
            "field_name": "claim_amount",
            "operator": ">",
            "rule_value": "10000",
            "severity": "high",
            "recommendation": "Reject Claim",
            "status": "ACTIVE"
        },
        {
            "rule_name": "Blacklisted User",
            "field_name": "user_blacklisted",
            "operator": "=",
            "rule_value": "true",
            "severity": "high",
            "recommendation": "Reject Claim",
            "status": "ACTIVE"
        },
        {
            "rule_name": "Multiple Claims Short Time",
            "field_name": "claims_last_1h",
            "operator": ">",
            "rule_value": "5",
            "severity": "high",
            "recommendation": "Reject Claim",
            "status": "ACTIVE"
        },
        {
            "rule_name": "IP Location Mismatch",
            "field_name": "ip_location_mismatch",
            "operator": "=",
            "rule_value": "true",
            "severity": "high",
            "recommendation": "Escalate Case",
            "status": "ACTIVE"
        },

        # 🟡 MEDIUM
        {
            "rule_name": "Medium Claim Amount",
            "field_name": "claim_amount",
            "operator": ">",
            "rule_value": "5000",
            "severity": "medium",
            "recommendation": "Review Case",
            "status": "ACTIVE"
        },
        {
            "rule_name": "Frequent Claims",
            "field_name": "claims_last_24h",
            "operator": ">",
            "rule_value": "3",
            "severity": "medium",
            "recommendation": "Review Case",
            "status": "ACTIVE"
        },

        # 🟢 LOW
        {
            "rule_name": "Small Claim Review",
            "field_name": "claim_amount",
            "operator": ">",
            "rule_value": "1000",
            "severity": "low",
            "recommendation": "Review Case",
            "status": "ACTIVE"
        },
        {
            "rule_name": "Frequent Small Claims",
            "field_name": "claims_last_24h",
            "operator": ">",
            "rule_value": "2",
            "severity": "low",
            "recommendation": "Review Case",
            "status": "ACTIVE"
        }
    ]

    for rule in rules:
        db_rule = FraudRule(**rule)
        db.add(db_rule)

    db.commit()
    db.close()

    print("✅ Rules inserted successfully!")


if __name__ == "__main__":
    seed_rules()
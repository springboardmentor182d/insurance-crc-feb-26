from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker,declarative_base

DATABASE_URL = "postgresql://postgres:lakshmidevi%4012@localhost:5432/insurance_db"

engine = create_engine(
    DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_fraud_cases():
    return fraud_cases


def get_detection_rules():
    return detection_rules



def create_rule(rule):
    new_rule = {
        "rule_id": rule.rule_id,
        "rule_name": rule.rule_name,
        "description": rule.description,
        "severity": rule.severity,
        "detections": 0,
        "created_date": rule.created_date,
        "status": "Active"
    }

    detection_rules.append(new_rule)

    return {
        "message": "Rule created successfully",
        "data": new_rule
    }


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
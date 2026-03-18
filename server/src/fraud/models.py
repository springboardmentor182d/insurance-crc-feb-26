from sqlalchemy import Column, String, Integer, Text
from src.database.core import Base

class FraudCase(Base):
    __tablename__ = "fraud_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True, nullable=False)
    claim_id = Column(String, nullable=False)
    policy_id = Column(String, nullable=False)
    claimant = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    confidence = Column(Integer, nullable=False)
    rules = Column(Text, nullable=False)
    status = Column(String, nullable=False)


class DetectionRule(Base):
    __tablename__ = "detection_rules"

    rule_id = Column(String, primary_key=True, index=True, nullable=False)
    rule_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    detections = Column(Integer, nullable=False)
    created_date = Column(String, nullable=False)
    status = Column(String, nullable=False)
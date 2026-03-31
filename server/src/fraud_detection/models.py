from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from src.database.core import Base

class FraudFlag(Base):
    __tablename__ = "fraud_flags"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String)
    rule_code = Column(String)
    severity = Column(String)
    details = Column(String)
    status = Column(String, default="new")
    created_at = Column(DateTime, default=datetime.utcnow)


class FraudRule(Base):
    __tablename__ = "fraud_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String)
    field_name = Column(String)
    operator = Column(String)
    rule_value = Column(String)
    severity = Column(String)
    recommendation = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
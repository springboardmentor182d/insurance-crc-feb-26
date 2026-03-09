from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, default="Active")


class FraudRule(Base):
    __tablename__ = "fraud_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    priority = Column(String, default="Medium")
    status = Column(String, default="Active")


class ClaimStats(Base):
    __tablename__ = "claim_stats"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    claims = Column(Integer, default=0)


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, unique=True, nullable=False)
    claimant = Column(String, nullable=False)
    amount = Column(String, nullable=False)
    status = Column(String, default="Pending")
    date = Column(String, nullable=False)
    claim_type = Column(String, nullable=False)
    priority = Column(String, default="Low")


class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    policy_type = Column(String, nullable=False, index=True)
    coverage = Column(String, nullable=False)  # e.g., "₹5.0L"
    premium = Column(String, nullable=False)  # e.g., "₹15,000/yr"
    claim_ratio = Column(String, default="0%")
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)  # Health, Life, Auto, etc.
    title = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    match_score = Column(Float, default=0.0)  # 0-100
    coverage = Column(String, nullable=False)
    premium = Column(String, nullable=False)
    claim_ratio = Column(String, default="0%")
    risk_level = Column(String, default="Medium")  # Low, Medium, High
    why = Column(String, nullable=True)  # Reason for recommendation
    family_health = Column(String, nullable=True)  # Family health context
    is_top_recommendation = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)  # e.g., "Claim Created", "Claim Approved", "User Registered"
    description = Column(String, nullable=False)  # Detailed description
    entity_type = Column(String, nullable=False, index=True)  # e.g., "Claim", "User", "Policy"
    entity_id = Column(Integer, nullable=True, index=True)  # ID of the entity being acted upon
    user_id = Column(Integer, nullable=True)  # Admin/User who performed the action
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    status = Column(String, default="Success")  # Success, Failed, Pending
    severity = Column(String, default="Info")  # Info, Warning, Error


from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from src.database import Base

# =========================
# USER MODEL (FIXED)
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # ✅ MUST MATCH DATABASE
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=True)

    dob = Column(String, nullable=True)

    income = Column(Integer, nullable=True)
    risk_level = Column(String, nullable=True)
    insurance_type = Column(String, nullable=True)

    recommended_plan = Column(String, nullable=True)
    coverage = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# FRAUD RULE MODEL
# =========================
class FraudRule(Base):
    __tablename__ = "fraud_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    severity = Column(String, default="Medium")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# CLAIM STATS MODEL
# =========================
class ClaimStats(Base):
    __tablename__ = "claim_stats"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    claims = Column(Integer, default=0)


# =========================
# CLAIM MODEL
# =========================
class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claim_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="Pending")
    risk_level = Column(String, default="Low")

    user_id = Column(Integer, nullable=True)
    policy_id = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# POLICY MODEL
# =========================
class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)

    policy_type = Column(String, nullable=False, index=True)

    coverage_amount = Column(Float, nullable=False)
    premium_amount = Column(Float, nullable=False)

    claim_ratio = Column(Float, default=0.0)
    risk_level = Column(String, default="Medium")

    is_active = Column(Boolean, default=True)

    user_id = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# RECOMMENDATION MODEL
# =========================
class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)

    type = Column(String)
    title = Column(String)
    provider = Column(String)

    match = Column(Integer)
    reason = Column(Text)

    coverage = Column(String)
    premium = Column(String)
    claim_ratio = Column(String)
    risk_level = Column(String)

    tags = Column(ARRAY(String))

    category = Column(String, nullable=False, index=True)

    match_score = Column(Float, default=0.0)
    why = Column(String, nullable=True)

    family_health = Column(String, nullable=True)

    is_top_recommendation = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)


# =========================
# ACTIVITY LOG MODEL
# =========================
class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)

    action = Column(String, nullable=False)
    description = Column(String, nullable=False)

    entity_type = Column(String, nullable=False, index=True)
    entity_id = Column(Integer, nullable=True, index=True)

    user_id = Column(Integer, nullable=True)

    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    status = Column(String, default="Success")
    severity = Column(String, default="Info")
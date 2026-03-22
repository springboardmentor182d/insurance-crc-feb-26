from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def name(self):
        return self.full_name

    @name.setter
    def name(self, value):
        self.full_name = value

    @property
    def status(self):
        return "Active" if self.is_active else "Inactive"

    @status.setter
    def status(self, value):
        self.is_active = str(value).lower() == "active"


class FraudRule(Base):
    __tablename__ = "fraud_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    severity = Column(String, default="Medium")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def description(self):
        return self.condition

    @description.setter
    def description(self, value):
        self.condition = value

    @property
    def priority(self):
        return self.severity

    @priority.setter
    def priority(self, value):
        self.severity = value

    @property
    def status(self):
        return "Active" if self.is_active else "Inactive"

    @status.setter
    def status(self, value):
        self.is_active = str(value).lower() == "active"


class ClaimStats(Base):
    __tablename__ = "claim_stats"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    claims = Column(Integer, default=0)


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

    @property
    def claim_id(self):
        return f"CLM-{self.id}" if self.id else "CLM-NEW"

    @property
    def claimant(self):
        return f"User #{self.user_id}" if self.user_id else "Unknown"

    @property
    def date(self):
        return self.created_at.strftime("%b %d, %Y") if self.created_at else ""

    @property
    def priority(self):
        return self.risk_level

    @priority.setter
    def priority(self, value):
        self.risk_level = value


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

    @property
    def coverage(self):
        return str(self.coverage_amount)

    @coverage.setter
    def coverage(self, value):
        self.coverage_amount = float(value)

    @property
    def premium(self):
        return str(self.premium_amount)

    @premium.setter
    def premium(self, value):
        self.premium_amount = float(value)

    @property
    def description(self):
        return ""


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


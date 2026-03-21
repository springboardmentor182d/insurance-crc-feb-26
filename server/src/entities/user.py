from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, JSON, Enum
from sqlalchemy.sql import func
from src.database.core import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    hashed_password = Column(String, nullable=False)

    phone = Column(String, nullable=True)

    date_of_birth = Column(Date, nullable=True)

    gender = Column(String, nullable=True)

    address = Column(Text, nullable=True)

    city = Column(String, nullable=True)

    state = Column(String, nullable=True)

    zip_code = Column(String, nullable=True)

    country = Column(String, nullable=True)

    occupation = Column(String, nullable=True)

    company = Column(String, nullable=True)

    insurance_preferences = Column(JSON, nullable=True)

    # ⭐ Role for Admin/User
    role = Column(Enum("user", "admin", name="user_role_enum"), default="user")

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class UserPreferences(Base):
    __tablename__ = "user_preferences"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False, unique=True, index=True)

    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    push_notifications = Column(Boolean, default=True)

    claim_updates = Column(Boolean, default=True)
    policy_renewals = Column(Boolean, default=True)
    payment_reminders = Column(Boolean, default=True)

    marketing_emails = Column(Boolean, default=False)
    promotional_emails = Column(Boolean, default=False)

    weekly_digest = Column(Boolean, default=True)

    two_factor_auth = Column(Boolean, default=True)
    biometric_login = Column(Boolean, default=False)

    session_timeout = Column(String, default="30")

    preferred_language = Column(String, default="en")
    preferred_currency = Column(String, default="USD")
    timezone = Column(String, default="UTC")

    theme = Column(String, default="light")
    date_format = Column(String, default="MM/DD/YYYY")

    share_data_with_partners = Column(Boolean, default=False)
    allow_analytics = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
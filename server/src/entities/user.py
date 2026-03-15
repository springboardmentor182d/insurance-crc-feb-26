from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, JSON
from sqlalchemy.sql import func
from src.database.core import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
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
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True, index=True)

    # Notification preferences
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    push_notifications = Column(Boolean, default=True)
    claim_updates = Column(Boolean, default=True)
    policy_renewals = Column(Boolean, default=True)
    payment_reminders = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=False)
    promotional_emails = Column(Boolean, default=False)
    weekly_digest = Column(Boolean, default=True)

    # Security preferences
    two_factor_auth = Column(Boolean, default=True)
    biometric_login = Column(Boolean, default=False)
    session_timeout = Column(String, default="30")

    # Communication preferences
    preferred_language = Column(String, default="en")
    preferred_currency = Column(String, default="USD")
    timezone = Column(String, default="UTC")

    # Display preferences
    theme = Column(String, default="light")
    date_format = Column(String, default="MM/DD/YYYY")

    # Privacy preferences
    share_data_with_partners = Column(Boolean, default=False)
    allow_analytics = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

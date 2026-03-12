from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from src.database.core import Base


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, unique=True, index=True)

    email_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sms_notifications: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    push_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    claim_updates: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    policy_renewals: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payment_reminders: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    marketing_emails: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    promotional_emails: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    weekly_digest: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    two_factor_auth: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    biometric_login: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    session_timeout: Mapped[str] = mapped_column(String, default="30", nullable=False)

    preferred_language: Mapped[str] = mapped_column(String, default="en", nullable=False)
    preferred_currency: Mapped[str] = mapped_column(String, default="USD", nullable=False)
    timezone: Mapped[str] = mapped_column(String, default="UTC", nullable=False)

    theme: Mapped[str] = mapped_column(String, default="light", nullable=False)
    date_format: Mapped[str] = mapped_column(String, default="MM/DD/YYYY", nullable=False)

    share_data_with_partners: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    allow_analytics: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

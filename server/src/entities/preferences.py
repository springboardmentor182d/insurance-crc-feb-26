from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.core import Base


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id                      = Column(Integer, primary_key=True, index=True)
    user_id                 = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Insurance Preferences
    risk_tolerance          = Column(String,  default="medium")  # "low" | "medium" | "high"
    policy_interests        = Column(String,  default="")        # "health,life,vehicle"
    budget_min              = Column(Float,   default=1000.0)
    budget_max              = Column(Float,   default=1500.0)

    # Notification Preferences
    email_notifications     = Column(Boolean, default=True)
    sms_notifications       = Column(Boolean, default=True)
    push_notifications      = Column(Boolean, default=False)

    # Additional Settings
    marketing_communications = Column(Boolean, default=False)
    ai_recommendations      = Column(Boolean, default=True)
    weekly_summary          = Column(Boolean, default=True)

    created_at              = Column(DateTime(timezone=True), server_default=func.now())
    updated_at              = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="preferences")
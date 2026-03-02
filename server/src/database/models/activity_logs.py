from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.core import Base
from src.database.enums.activity import ActivitySeverity, ActivityType


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    action_type: Mapped[ActivityType] = mapped_column(
        SQLEnum(ActivityType, name="activity_type"),
        nullable=False,
    )
    severity: Mapped[ActivitySeverity] = mapped_column(
        SQLEnum(ActivitySeverity, name="activity_severity"),
        nullable=False,
        default=ActivitySeverity.INFO,
    )
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    entity_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User | None"] = relationship("User", back_populates="activity_logs")

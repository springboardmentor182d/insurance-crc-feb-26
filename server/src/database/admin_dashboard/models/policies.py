from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import List

from sqlalchemy import (
    Date,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.core import Base


class PolicyType(str, Enum):
    AUTO = "auto"
    HOME = "home"
    LIFE = "life"
    HEALTH = "health"


class PolicyStatus(str, Enum):
    ACTIVE = "active"
    LAPSED = "lapsed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class Policy(Base):
    __tablename__ = "policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    policy_number: Mapped[str] = mapped_column(
        String(64), nullable=False, unique=True, index=True
    )
    policy_type: Mapped[PolicyType] = mapped_column(
        SQLEnum(PolicyType, name="policy_type"),
        nullable=False,
    )
    status: Mapped[PolicyStatus] = mapped_column(
        SQLEnum(PolicyStatus, name="policy_status"),
        nullable=False,
        default=PolicyStatus.ACTIVE,
    )
    premium_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    coverage_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="policies")
    claims: Mapped[List["Claim"]] = relationship("Claim", back_populates="policy")

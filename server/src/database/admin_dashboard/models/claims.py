from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional

from sqlalchemy import (
    DateTime,
    Enum as SQLEnum,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy import DateTime, Integer, String, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.core import Base
from enum import Enum


class ClaimStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"
    FRAUDULENT = "fraudulent"


class Claim(Base):
    __tablename__ = "claims"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    claim_number: Mapped[str] = mapped_column(
        String(64), nullable=False, unique=True, index=True
    )

    claim_number: Mapped[str] = mapped_column(String(64), unique=True)

    policy_id: Mapped[int] = mapped_column(
        ForeignKey("policies.id"), nullable=False, index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )

    adjuster_id: Mapped[int | None] = mapped_column(
        ForeignKey("adjusters.id"), nullable=True, index=True
    )

    status: Mapped[ClaimStatus] = mapped_column(
        SQLEnum(ClaimStatus, name="claim_status"),
        nullable=False,
        default=ClaimStatus.PENDING,
    )

    user_id: Mapped[int] = mapped_column(Integer)

    adjuster_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("adjusters.id"), nullable=True
    )

    claim_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    approved_amount: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2), nullable=True
    )

    status: Mapped[str] = mapped_column(
        String, default=ClaimStatus.PENDING.value
    )

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    fraud_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    claim_amount: Mapped[int] = mapped_column(Integer)

    description: Mapped[str] = mapped_column(String)

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    policy: Mapped["Policy"] = relationship(
        "Policy", back_populates="claims"
    )

    policy: Mapped["Policy"] = relationship("Policy", back_populates="claims")

    user: Mapped["User"] = relationship("User", back_populates="claims")

    adjuster: Mapped["Adjuster | None"] = relationship(
        "Adjuster", back_populates="claims"
    )

    fraud_flags: Mapped[list["FraudFlag"]] = relationship(
        "FraudFlag", back_populates="claim", cascade="all, delete-orphan"
    )
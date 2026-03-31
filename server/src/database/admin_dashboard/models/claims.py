from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Integer, String, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.core import Base
from enum import Enum


# ✅ KEEP ENUM (for admin dashboard)
class ClaimStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"
    FRAUDULENT = "fraudulent"


class Claim(Base):
    __tablename__ = "claims"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    claim_number: Mapped[str] = mapped_column(String(64), unique=True)

    # ✅ FIX (IMPORTANT)
    policy_id: Mapped[int] = mapped_column(
        ForeignKey("policies.id"), nullable=False
    )

    user_id: Mapped[int] = mapped_column(Integer)

    adjuster_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("adjusters.id"), nullable=True
    )

    status: Mapped[str] = mapped_column(
        String, default=ClaimStatus.PENDING.value
    )

    claim_amount: Mapped[int] = mapped_column(Integer)

    description: Mapped[str] = mapped_column(String)

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # ✅ RELATION (MATCHES POLICY)
    policy: Mapped["Policy"] = relationship(
        "Policy", back_populates="claims"
    )

    adjuster: Mapped["Adjuster | None"] = relationship(
        "Adjuster", back_populates="claims"
    )
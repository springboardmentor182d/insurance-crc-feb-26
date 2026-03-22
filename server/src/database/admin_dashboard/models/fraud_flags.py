from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.core import Base
from src.database.admin_dashboard.models.fraud_rules import FraudSeverity


class FraudFlag(Base):
    __tablename__ = "fraud_flags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    claim_id: Mapped[int] = mapped_column(
        ForeignKey("claims.id"), nullable=False, index=True
    )
    rule_id: Mapped[int] = mapped_column(
        ForeignKey("fraud_rules.id"), nullable=False, index=True
    )
    rule_name: Mapped[str] = mapped_column(String(120), nullable=False)
    severity: Mapped[FraudSeverity] = mapped_column(
        SQLEnum(FraudSeverity, name="fraud_severity"), nullable=False
    )
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    claim: Mapped["Claim"] = relationship("Claim", back_populates="fraud_flags")
    rule: Mapped["FraudRule"] = relationship("FraudRule", back_populates="flags")

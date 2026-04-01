from sqlalchemy import Column, Integer, String, Numeric, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.core import Base


class ActivePolicy(Base):
    __tablename__ = "active_policies"

    id = Column(Integer, primary_key=True, index=True)

    # Relations
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=True, index=True)

    # Identification
    policy_number = Column(String, nullable=False)
    status = Column(String, nullable=False, default="ACTIVE")  # ACTIVE, EXPIRED, CANCELLED, etc.
    category = Column(String, nullable=False)  # HOME, AUTO, LIFE, HEALTH

    # Descriptive
    insurer_name = Column(String, nullable=False)
    product_name = Column(String, nullable=False)

    # Financials
    premium_annual = Column(Numeric(10, 2), nullable=False)
    coverage_amount = Column(Numeric(14, 2), nullable=False)
    deductible_amount = Column(Numeric(10, 2), nullable=True)

    # Period
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    # Optional tags / warning text (e.g. \"Expiring soon\")
    tags = Column(Text, nullable=True)
    warning_text = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    documents = relationship(
        "PolicyDocument",
        back_populates="active_policy",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


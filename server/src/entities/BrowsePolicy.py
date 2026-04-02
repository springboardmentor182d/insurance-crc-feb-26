from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, Text
from sqlalchemy.sql import func
from src.database.core import Base


class BrowsePolicy(Base):
    """Insurance product catalog rows (distinct from user-owned `policies` records)."""

    __tablename__ = "catalog_policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    insurer_name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # e.g. HOME, AUTO, LIFE, HEALTH

    # Pricing details
    premium_annual = Column(Numeric(10, 2), nullable=False)
    coverage_amount = Column(Numeric(14, 2), nullable=False)
    deductible_amount = Column(Numeric(10, 2), nullable=True)

    # Ratings
    average_rating = Column(Numeric(2, 1), nullable=True)
    rating_count = Column(Integer, nullable=True)

    # Short marketing copy
    tagline = Column(String, nullable=True)
    key_features = Column(Text, nullable=True)  # comma‑separated list for now

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


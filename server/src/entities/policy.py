from sqlalchemy import Column, Integer, String, Float, Text
from src.database.core import Base


class Policy(Base):
    """
    SQLAlchemy model for the 'policies' table.
    Stores all available insurance policy listings in the catalog.
    """
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Health, Auto, Home, Life, Travel
    description = Column(Text, nullable=True)
    coverage = Column(String, nullable=False)   # e.g. "$100,000"
    premium = Column(String, nullable=False)    # e.g. "$299"
    duration = Column(String, nullable=True)    # e.g. "1 Year"

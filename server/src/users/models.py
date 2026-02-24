from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base  # This imports the base class from your database.py

class Policy(Base):
    """
    Represents the 'Active Policies' seen on the dashboard.
    """
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)           # e.g., "Home Insurance Premium"
    category = Column(String)       # e.g., "Home", "Auto", "Life"
    renewal_date = Column(String)   # e.g., "Jun 2026"
    amount = Column(String)         # e.g., "$1,200/year"
    status = Column(String, default="Active") # Matches the 'Active' badge in UI
    user_id = Column(Integer, ForeignKey("users.id"))

class Claim(Base):
    """
    Represents the 'Recent Claims' table entries.
    """
    __tablename__ = "claims"

    # Using String for ID to match identifiers like 'CLM-2026-001'
    id = Column(String, primary_key=True, index=True) 
    category = Column(String)       # e.g., "Auto", "Home"
    description = Column(String)    # e.g., "BIMA-4492-X"
    incident_date = Column(String)  # e.g., "2026-02-08"
    amount = Column(String)         # e.g., "$3,500"
    status = Column(String)         # e.g., "In Review", "Approved"
    user_id = Column(Integer, ForeignKey("users.id"))
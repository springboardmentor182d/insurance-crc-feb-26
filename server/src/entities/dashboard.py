from sqlalchemy import Column, Integer, JSON, String
from src.database.core import Base

class DashboardData(Base):
    __tablename__ = "dashboard_data"
    
    id: Column[int] = Column(Integer, primary_key=True, index=True)
    total_policies: Column[int] = Column(Integer, default=8)
    active_claims: Column[int] = Column(Integer, default=2)
    recommended_policies: Column[int] = Column(Integer, default=5)
    claim_status: Column[str] = Column(String, default="Approved")
    
    recent_policies: Column[list[dict]] = Column(JSON, nullable=False)
    recent_claims: Column[list[dict]] = Column(JSON, nullable=True)

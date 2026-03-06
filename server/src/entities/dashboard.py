from sqlalchemy import Column, Integer, JSON
from src.database.core import Base

class DashboardData(Base):
    __tablename__ = "dashboard_data"
    
    id = Column(Integer, primary_key=True, index=True)
    total_claims = Column(Integer, default=314)
    monthly_revenue = Column(Integer, default=261000)
    satisfaction = Column(Integer, default=96)
    
    revenue_data = Column(JSON, nullable=False)
    radar_data = Column(JSON, nullable=False)
    pie_data = Column(JSON, nullable=False)
    claims_data = Column(JSON, nullable=False)
    top_performers = Column(JSON, nullable=False)
    top_stats = Column(JSON, nullable=False)
    kpi_growth = Column(JSON, nullable=False)

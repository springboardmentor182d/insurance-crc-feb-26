from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from src.database import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String, unique=True)
    type = Column(String)
    description = Column(String)
    date_filed = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float)
    status = Column(String, default="In Review")
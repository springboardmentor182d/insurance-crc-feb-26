# models.py
from sqlalchemy import Column, Integer, String, Float, Text
from database import Base 

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    policy_name = Column(String)
    claim_type = Column(String)
    amount = Column(Float)
    description = Column(Text)
    status = Column(String, default="Pending") 
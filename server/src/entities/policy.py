from sqlalchemy import Column, Integer, String, Float
from src.database.core import Base

class PolicyDB(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    company = Column(String)
    price = Column(Integer)
    coverage = Column(String)
    rating = Column(Float)
    category = Column(String)
    deductible = Column(Integer)
    benefits = Column(String)  
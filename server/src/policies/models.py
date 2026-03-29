from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ARRAY
from ..database import Base
from typing import List

class Policy(BaseModel):
    name: str
    provider: str
    coverage: str
    premium: str
    features: List[str]
    class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    coverage = Column(String, nullable=False)
    premium = Column(String, nullable=False)
    features = Column(ARRAY(String))
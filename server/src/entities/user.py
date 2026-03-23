from sqlalchemy import Column, Integer, String, Date, JSON, TIMESTAMP
from sqlalchemy.sql import func
from src.database.core import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String)
    phone = Column(String)
    address = Column(String)
    occupation = Column(String)
    dob = Column(Date)
    preferences = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())
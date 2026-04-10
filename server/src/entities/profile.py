from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.core import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Personal Information
    full_name      = Column(String,  nullable=True)
    phone_number   = Column(String,  nullable=True)
    date_of_birth  = Column(String,  nullable=True)   # "DD-MM-YYYY"
    occupation     = Column(String,  nullable=True)
    annual_income  = Column(Float,   nullable=True)

    # Address Information
    street_address = Column(String,  nullable=True)
    city           = Column(String,  nullable=True)
    state          = Column(String,  nullable=True)
    zip_code       = Column(String,  nullable=True)

    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")
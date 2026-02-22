from pydantic import BaseModel
from datetime import date
from typing import Optional, Dict


class UserBase(BaseModel):
    name: str
    email: str
    dob: date
    risk_profile: Optional[Dict] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True
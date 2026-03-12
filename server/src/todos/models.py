from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    risk_profile: Optional[dict] = None


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    dob: Optional[str] = None
    risk_profile: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True
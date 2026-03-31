from pydantic import BaseModel
from typing import Optional, List


class ProfileUpdate(BaseModel):
    full_name:      Optional[str]   = None
    phone_number:   Optional[str]   = None
    date_of_birth:  Optional[str]   = None   # "DD-MM-YYYY"
    occupation:     Optional[str]   = None
    annual_income:  Optional[float] = None
    street_address: Optional[str]   = None
    city:           Optional[str]   = None
    state:          Optional[str]   = None
    zip_code:       Optional[str]   = None


class AccountStats(BaseModel):
    active_policies:  int
    claims_approved:  int
    years_member:     int
    claims_paid:      float          # 15000.0 → shown as "$15K" on frontend


class ProfileResponse(BaseModel):
    id:             int
    user_id:        int
    full_name:      Optional[str]
    email:          str
    phone_number:   Optional[str]
    date_of_birth:  Optional[str]
    occupation:     Optional[str]
    annual_income:  Optional[float]
    street_address: Optional[str]
    city:           Optional[str]
    state:          Optional[str]
    zip_code:       Optional[str]
    is_verified:    bool
    stats:          AccountStats

    class Config:
        from_attributes = True
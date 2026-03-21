from datetime import date, datetime
from typing import Dict, Optional
from pydantic import BaseModel, EmailStr

class ProfileBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    company: Optional[str] = None
    insurance_preferences: Optional[Dict[str, bool]] = None


class ProfileResponse(ProfileBase):
    id: int
    email: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PreferencesBase(BaseModel):
    email_notifications: Optional[bool] = True
    sms_notifications: Optional[bool] = False
    push_notifications: Optional[bool] = True
    claim_updates: Optional[bool] = True
    policy_renewals: Optional[bool] = True
    payment_reminders: Optional[bool] = True
    marketing_emails: Optional[bool] = False
    promotional_emails: Optional[bool] = False
    weekly_digest: Optional[bool] = True
    two_factor_auth: Optional[bool] = True
    biometric_login: Optional[bool] = False
    session_timeout: Optional[str] = "30"
    preferred_language: Optional[str] = "en"
    preferred_currency: Optional[str] = "USD"
    timezone: Optional[str] = "UTC"
    theme: Optional[str] = "light"
    date_format: Optional[str] = "MM/DD/YYYY"
    share_data_with_partners: Optional[bool] = False
    allow_analytics: Optional[bool] = True


class PreferencesResponse(PreferencesBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import date
from pydantic import BaseModel
from typing import Dict, List


class EmailNotifications(BaseModel):
    policyUpdates: bool
    claimStatus: bool
    paymentReminders: bool
    recommendations: bool
    marketing: bool
    newsletter: bool


class SmsNotifications(BaseModel):
    claimApproval: bool
    paymentDue: bool
    emergencyAlerts: bool
    policyExpiry: bool


class PushNotifications(BaseModel):
    enabled: bool
    claimUpdates: bool
    messages: bool
    promotions: bool


class Notifications(BaseModel):
    email: EmailNotifications
    sms: SmsNotifications
    push: PushNotifications


class PrivacySettings(BaseModel):
    profileVisibility: str
    shareDataWithPartners: bool
    allowAnalytics: bool
    showOnlineStatus: bool


class DisplayPreferences(BaseModel):
    language: str
    timezone: str
    dateFormat: str
    currency: str
    theme: str


class InsurancePreferences(BaseModel):
    interestedPolicies: List[str]
    autoRenewal: bool
    paperlessBilling: bool
    preferredPaymentMethod: str


class UpdatePreferencesRequest(BaseModel):
    notifications: Notifications
    privacy: PrivacySettings
    display: DisplayPreferences
    insurance: InsurancePreferences

class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    address: Optional[str]
    occupation: Optional[str]
    dob: Optional[date]
    preferences: Optional[UpdatePreferencesRequest]   # ✅ FIXED

    class Config:
        from_attributes = True
   


class UpdateProfileRequest(BaseModel):
    name: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    occupation: Optional[str]
    dob: Optional[date]



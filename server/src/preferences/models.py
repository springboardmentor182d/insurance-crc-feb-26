from pydantic import BaseModel
from typing import Optional, List


class InsurancePreferencesUpdate(BaseModel):
    risk_tolerance:   Optional[str]        = None   # "low" | "medium" | "high"
    policy_interests: Optional[List[str]]  = None   # ["health", "life", "vehicle"]
    budget_min:       Optional[float]      = None
    budget_max:       Optional[float]      = None


class NotificationPreferencesUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    sms_notifications:   Optional[bool] = None
    push_notifications:  Optional[bool] = None


class AdditionalSettingsUpdate(BaseModel):
    marketing_communications: Optional[bool] = None
    ai_recommendations:       Optional[bool] = None
    weekly_summary:           Optional[bool] = None


class PreferencesResponse(BaseModel):
    id:                       int
    user_id:                  int
    risk_tolerance:           str
    policy_interests:         List[str]
    budget_min:               float
    budget_max:               float
    email_notifications:      bool
    sms_notifications:        bool
    push_notifications:       bool
    marketing_communications: bool
    ai_recommendations:       bool
    weekly_summary:           bool

    class Config:
        from_attributes = True
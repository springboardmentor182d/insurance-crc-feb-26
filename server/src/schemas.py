from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    status: str

    class Config:
        from_attributes = True


class FraudRuleBase(BaseModel):
    name: str
    description: str
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Active"


class FraudRuleCreate(FraudRuleBase):
    pass


class FraudRuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None


class FraudRuleResponse(FraudRuleBase):
    id: int

    class Config:
        from_attributes = True


class ClaimBase(BaseModel):
    claim_id: str
    claimant: str
    amount: str
    status: str
    date: str
    claim_type: str
    priority: str


class ClaimCreate(ClaimBase):
    pass


class ClaimResponse(ClaimBase):
    id: int

    class Config:
        from_attributes = True


class ClaimStatsResponse(BaseModel):
    month: str
    claims: int

    class Config:
        from_attributes = True


class OverviewStats(BaseModel):
    total_users: int
    active_policies: int
    claims: int
    fraud_alerts: int


class ComprehensiveAnalytics(BaseModel):
    # Claim statistics
    total_claims: int
    approved_claims: int
    pending_claims: int
    rejected_claims: int
    under_review_claims: int
    
    # Metrics
    average_claim_amount: float
    approval_rate: float
    fraud_rate: float
    
    # Distribution by type
    claims_by_type: Dict[str, int]
    
    # Distribution by priority
    claims_by_priority: Dict[str, int]


# Policy Schemas
class PolicyBase(BaseModel):
    name: str
    provider: str
    policy_type: str
    coverage: str
    premium: str
    claim_ratio: Optional[str] = "0%"
    description: Optional[str] = None
    is_active: Optional[bool] = True


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    policy_type: Optional[str] = None
    coverage: Optional[str] = None
    premium: Optional[str] = None
    claim_ratio: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class PolicyResponse(PolicyBase):
    id: int

    class Config:
        from_attributes = True


# Recommendation Schemas
class RecommendationBase(BaseModel):
    category: str
    title: str
    provider: str
    match_score: float
    coverage: str
    premium: str
    claim_ratio: Optional[str] = "0%"
    risk_level: Optional[str] = "Medium"
    why: Optional[str] = None
    family_health: Optional[str] = None
    is_top_recommendation: Optional[bool] = False
    is_active: Optional[bool] = True


class RecommendationCreate(RecommendationBase):
    pass


class RecommendationUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    provider: Optional[str] = None
    match_score: Optional[float] = None
    coverage: Optional[str] = None
    premium: Optional[str] = None
    claim_ratio: Optional[str] = None
    risk_level: Optional[str] = None
    why: Optional[str] = None
    family_health: Optional[str] = None
    is_top_recommendation: Optional[bool] = None
    is_active: Optional[bool] = None


class RecommendationResponse(RecommendationBase):
    id: int

    class Config:
        from_attributes = True


class RecommendationListResponse(BaseModel):
    recommendations: List[RecommendationResponse]
    total_count: int


# Activity Log Schemas
class ActivityLogBase(BaseModel):
    action: str
    description: str
    entity_type: str
    entity_id: Optional[int] = None
    user_id: Optional[int] = None
    status: Optional[str] = "Success"
    severity: Optional[str] = "Info"


class ActivityLogCreate(ActivityLogBase):
    pass


class ActivityLogResponse(ActivityLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class RecentActivityResponse(BaseModel):
    activities: List[ActivityLogResponse]
    total_count: int


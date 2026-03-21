from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class FlaggedClaimSummary(BaseModel):
    claim_id: int
    claim_number: str
    user_name: str
    policy_type: str
    claim_amount: float
    status: str
    fraud_score: float
    fraud_risk_percentage: int
    fraud_indicators: list[str]
    submitted_at: datetime


class FlaggedClaimsStats(BaseModel):
    total_flagged: int
    pending_review: int
    fraud_confirmed: int
    cleared: int


class FraudFlagDetail(BaseModel):
    id: int
    rule_name: str
    severity: str
    details: Optional[str]
    created_at: datetime


class ClaimDetailResponse(BaseModel):
    claim: dict
    user: dict
    policy: dict
    adjuster: Optional[dict]
    fraud_flags: list[FraudFlagDetail]
    activity_logs: list[dict]


class FlaggedClaimsListResponse(BaseModel):
    items: list[FlaggedClaimSummary]
    total: int
    page: int
    page_size: int

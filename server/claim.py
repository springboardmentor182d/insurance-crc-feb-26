from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClaimSubmit(BaseModel):
    """Model for submitting an insurance claim"""
    policy_number: str
    reason: str
    amount: float

class Claim(BaseModel):
    """Claim model stored in database"""
    id: int
    claim_id: str
    policy_number: str
    reason: str
    amount: float
    status: str
    created_at: datetime

class ClaimResponse(BaseModel):
    """Response model for claim submission"""
    claim_id: str
    status: str
    message: str

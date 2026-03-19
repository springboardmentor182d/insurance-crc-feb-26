from pydantic import BaseModel
from typing import Optional


class PolicyResponse(BaseModel):
    """Schema for a single policy returned by the API."""
    id: int
    name: str
    provider: str
    category: str
    description: Optional[str] = None
    coverage: str
    premium: str
    duration: Optional[str] = None

    class Config:
        from_attributes = True


class PolicyCreate(BaseModel):
    """Schema for creating a new policy (admin use)."""
    name: str
    provider: str
    category: str
    description: Optional[str] = None
    coverage: str
    premium: str
    duration: Optional[str] = None

from pydantic import BaseModel
from typing import List
from enum import Enum

    
class RecentActivitySeverity(str, Enum):
    FRAUD = "fraud"
    APPROVED = "approved"
    FLAGGED = "flagged"
    INFO = "info"


class RecentActivityItem(BaseModel):
    title: str
    actor: str
    timestamp: str
    severity: str


class RecentActivityResponse(BaseModel):
    data: List[RecentActivityItem]
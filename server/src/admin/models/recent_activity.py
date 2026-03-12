from pydantic import BaseModel
from typing import List

from src.database.enums.activity import ActivitySeverity


class RecentActivityItem(BaseModel):
    title: str
    actor: str
    timestamp: str
    severity: ActivitySeverity


class RecentActivityResponse(BaseModel):
    data: List[RecentActivityItem]

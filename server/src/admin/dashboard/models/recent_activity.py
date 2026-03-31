from pydantic import BaseModel
from typing import List

from src.database.admin_dashboard.enums.activity import ActivitySeverity


class RecentActivityItem(BaseModel):
    title: str
    actor: str
    timestamp: str
    severity: ActivitySeverity


class RecentActivityResponse(BaseModel):
    data: List[RecentActivityItem]
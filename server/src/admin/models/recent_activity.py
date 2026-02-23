from pydantic import BaseModel
from typing import List


class RecentActivityItem(BaseModel):
    title: str
    description: str
    timestamp: str
    severity: str


class RecentActivityResponse(BaseModel):
    data: List[RecentActivityItem]
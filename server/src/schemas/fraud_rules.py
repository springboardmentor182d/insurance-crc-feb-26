from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict


class FraudRuleBase(BaseModel):
    rule_name: str
    description: Optional[str] = None
    severity: Literal["low", "medium", "high"]
    trigger_threshold: Optional[float] = None
    is_active: bool


class FraudRuleCreate(FraudRuleBase):
    pass


class FraudRuleUpdate(BaseModel):
    rule_name: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[Literal["low", "medium", "high"]] = None
    trigger_threshold: Optional[float] = None
    is_active: Optional[bool] = None


class FraudRuleResponse(FraudRuleBase):
    id: int
    trigger_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FraudRulesListResponse(BaseModel):
    rules: list[FraudRuleResponse]
    active_count: int
    total_triggers: int
    high_severity_count: int
    total_rules: int

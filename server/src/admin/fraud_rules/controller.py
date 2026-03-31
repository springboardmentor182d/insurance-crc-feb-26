from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.auth import require_admin
from src.database.core import get_db
from src.database.admin_dashboard.enums.activity import ActivitySeverity, ActivityType
from src.database.admin_dashboard.models import ActivityLog, FraudRule, FraudSeverity
from src.schemas.fraud_rules import (
    FraudRuleCreate,
    FraudRuleResponse,
    FraudRulesListResponse,
    FraudRuleUpdate,
)

router = APIRouter(prefix="/admin/fraud-rules", tags=["Admin"])


@router.get("", response_model=FraudRulesListResponse)
def list_fraud_rules(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    rules = db.execute(select(FraudRule)).scalars().all()

    active_count = sum(1 for rule in rules if rule.is_active)
    total_triggers = sum(rule.trigger_count for rule in rules)
    high_severity_count = sum(1 for rule in rules if rule.severity == FraudSeverity.HIGH)

    return FraudRulesListResponse(
        rules=[FraudRuleResponse.model_validate(rule) for rule in rules],
        active_count=active_count,
        total_triggers=total_triggers,
        high_severity_count=high_severity_count,
        total_rules=len(rules),
    )


@router.post("", response_model=FraudRuleResponse, status_code=status.HTTP_201_CREATED)
def create_fraud_rule(
    payload: FraudRuleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    existing = db.execute(
        select(FraudRule).where(FraudRule.rule_name == payload.rule_name)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Rule name already exists")

    rule = FraudRule(
        rule_name=payload.rule_name,
        description=payload.description,
        severity=FraudSeverity(payload.severity),
        trigger_threshold=payload.trigger_threshold,
        is_active=payload.is_active,
    )
    db.add(rule)
    db.flush()

    db.add(
        ActivityLog(
            user_id=current_user.id,
            title=f"Fraud rule created: {payload.rule_name}",
            action_type=ActivityType.FRAUD_RULE_ACTIVATED,
            severity=ActivitySeverity.INFO,
            entity_type="fraud_rule",
            entity_id=rule.id,
        )
    )
    db.commit()
    db.refresh(rule)
    return FraudRuleResponse.model_validate(rule)


@router.put("/{rule_id}", response_model=FraudRuleResponse)
def update_fraud_rule(
    rule_id: int,
    payload: FraudRuleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    rule = db.execute(select(FraudRule).where(FraudRule.id == rule_id)).scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    if payload.rule_name and payload.rule_name != rule.rule_name:
        duplicate = db.execute(
            select(FraudRule).where(FraudRule.rule_name == payload.rule_name)
        ).scalar_one_or_none()
        if duplicate:
            raise HTTPException(status_code=409, detail="Rule name already exists")

    if "rule_name" in payload.model_fields_set:
        rule.rule_name = payload.rule_name
    if "description" in payload.model_fields_set:
        rule.description = payload.description
    if "severity" in payload.model_fields_set and payload.severity is not None:
        rule.severity = FraudSeverity(payload.severity)
    if "trigger_threshold" in payload.model_fields_set:
        rule.trigger_threshold = payload.trigger_threshold
    if "is_active" in payload.model_fields_set:
        rule.is_active = payload.is_active

    db.add(
        ActivityLog(
            user_id=current_user.id,
            title=f"Fraud rule updated: {rule.rule_name}",
            action_type=ActivityType.FRAUD_RULE_ACTIVATED,
            severity=ActivitySeverity.INFO,
            entity_type="fraud_rule",
            entity_id=rule.id,
        )
    )

    db.commit()
    db.refresh(rule)
    return FraudRuleResponse.model_validate(rule)


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_fraud_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    rule = db.execute(select(FraudRule).where(FraudRule.id == rule_id)).scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    rule.is_active = False
    db.add(
        ActivityLog(
            user_id=current_user.id,
            title=f"Fraud rule deactivated: {rule.rule_name}",
            action_type=ActivityType.FRAUD_RULE_ACTIVATED,
            severity=ActivitySeverity.INFO,
            entity_type="fraud_rule",
            entity_id=rule.id,
        )
    )
    db.commit()
    return None
@router.patch("/{rule_id}/toggle", response_model=FraudRuleResponse)
def toggle_fraud_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    rule = db.execute(
        select(FraudRule).where(FraudRule.id == rule_id)
    ).scalar_one_or_none()

    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    rule.is_active = not rule.is_active

    db.add(
        ActivityLog(
            user_id=current_user.id,
            title=f"Fraud rule {'activated' if rule.is_active else 'deactivated'}: {rule.rule_name}",
            action_type=ActivityType.FRAUD_RULE_ACTIVATED,
            severity=ActivitySeverity.INFO,
            entity_type="fraud_rule",
            entity_id=rule.id,
        )
    )

    db.commit()
    db.refresh(rule)
    return FraudRuleResponse.model_validate(rule)
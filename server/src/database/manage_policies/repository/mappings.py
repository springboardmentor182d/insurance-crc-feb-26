from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select

from src.database.manage_policies.models.policy_profiles import PolicyProfile
from src.database.admin_dashboard.models.policies import (
    Policy,
    PolicyStatus,
    PolicyType,
)
from src.database.admin_dashboard.models.users import User, UserRole


def to_policy_type(raw_type: str) -> PolicyType:
    normalized = raw_type.strip().lower()
    if normalized.startswith("auto"):
        return PolicyType.AUTO
    if normalized.startswith("home"):
        return PolicyType.HOME
    if normalized.startswith("life"):
        return PolicyType.LIFE
    if normalized.startswith("health"):
        return PolicyType.HEALTH
    raise ValueError(f"Unsupported policy type: {raw_type}")


def to_policy_type_label(policy_type: PolicyType) -> str:
    return policy_type.value.title()


def to_api_status(status: PolicyStatus) -> str:
    return "active" if status == PolicyStatus.ACTIVE else "inactive"


def to_db_status(status: str) -> PolicyStatus:
    if status.strip().lower() == "active":
        return PolicyStatus.ACTIVE
    return PolicyStatus.LAPSED


def build_policy_name(policy: Policy, profile: PolicyProfile | None) -> str:
    if profile and profile.policy_name:
        return profile.policy_name
    return f"{to_policy_type_label(policy.policy_type)} Policy {policy.policy_number}"


def build_provider(profile: PolicyProfile | None, user_full_name: str | None) -> str:
    if profile and profile.provider:
        return profile.provider
    if user_full_name:
        return user_full_name
    return "BimaVerse Insurance"


def build_snapshot(
    policy: Policy,
    profile: PolicyProfile | None,
    user_full_name: str | None,
) -> dict[str, Any]:
    deductible = (
        Decimal(profile.deductible_amount)
        if profile and profile.deductible_amount is not None
        else Decimal("0")
    )
    description = profile.description if profile and profile.description else ""

    return {
        "id": policy.id,
        "policyName": build_policy_name(policy, profile),
        "provider": build_provider(profile, user_full_name),
        "type": to_policy_type_label(policy.policy_type),
        "premium": float(policy.premium_amount),
        "coverage": float(policy.coverage_amount),
        "deductible": float(deductible),
        "description": description,
        "status": to_api_status(policy.status),
    }


def get_default_user_id(session) -> int:
    admin_user_id = session.execute(
        select(User.id)
        .where(User.role == UserRole.ADMIN)
        .order_by(User.id.asc())
        .limit(1)
    ).scalar_one_or_none()
    if admin_user_id is not None:
        return int(admin_user_id)

    any_user_id = session.execute(
        select(User.id).order_by(User.id.asc()).limit(1)
    ).scalar_one_or_none()
    if any_user_id is not None:
        return int(any_user_id)

    raise LookupError(
        "No users available. Seed at least one user before creating policies."
    )


def generate_policy_number(session) -> str:
    max_policy_id = session.execute(select(func.max(Policy.id))).scalar_one()
    next_serial = int(max_policy_id or 0) + 1
    return f"POL-MP-{date.today():%Y%m%d}-{next_serial:04d}"

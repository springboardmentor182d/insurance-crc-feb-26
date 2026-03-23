from typing import Any, List, Optional

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from src.browse_policies.models import PolicyFilter
from src.database.admin_dashboard.models.policies import Policy, PolicyStatus, PolicyType
from src.database.manage_policies.models.policy_profiles import PolicyProfile


def _normalize_category(raw_category: str) -> str:
    category = raw_category.strip().lower()
    if category.startswith("home"):
        return "home"
    if category.startswith("auto"):
        return "auto"
    if category.startswith("life"):
        return "life"
    if category.startswith("health"):
        return "health"
    return category


def _to_policy_type(raw_category: str) -> PolicyType | None:
    normalized = _normalize_category(raw_category)
    mapping = {
        "auto": PolicyType.AUTO,
        "home": PolicyType.HOME,
        "life": PolicyType.LIFE,
        "health": PolicyType.HEALTH,
    }
    return mapping.get(normalized)


def _build_policy_payload(policy: Policy, profile: PolicyProfile | None) -> dict[str, Any]:
    policy_name = (
        profile.policy_name
        if profile and profile.policy_name
        else f"{policy.policy_type.value.title()} Policy {policy.policy_number}"
    )
    provider_name = (
        profile.provider if profile and profile.provider else "BimaVerse Insurance"
    )
    description = profile.description if profile and profile.description else ""

    return {
        "id": policy.id,
        "name": policy_name,
        "insurer_name": provider_name,
        "category": policy.policy_type.value.upper(),
        "premium_annual": policy.premium_amount,
        "coverage_amount": policy.coverage_amount,
        "deductible_amount": (
            profile.deductible_amount
            if profile and profile.deductible_amount is not None
            else None
        ),
        "average_rating": None,
        "rating_count": None,
        "tagline": description,
        "key_features": [],
        "is_active": policy.status == PolicyStatus.ACTIVE,
        "created_at": policy.created_at,
        "updated_at": None,
    }


def list_policies(
    db: Session,
    filters: Optional[PolicyFilter] = None,
) -> List[dict[str, Any]]:
    """Return all active catalog policies, optionally filtered by search/category."""
    stmt = (
        select(Policy, PolicyProfile)
        .outerjoin(PolicyProfile, PolicyProfile.policy_id == Policy.id)
        .where(Policy.status == PolicyStatus.ACTIVE)
    )

    if filters:
        if filters.category:
            policy_type = _to_policy_type(filters.category)
            if policy_type is not None:
                stmt = stmt.where(Policy.policy_type == policy_type)

        if filters.search:
            search_term = f"%{filters.search.strip()}%"
            stmt = stmt.where(
                or_(
                    PolicyProfile.policy_name.ilike(search_term),
                    PolicyProfile.provider.ilike(search_term),
                    PolicyProfile.description.ilike(search_term),
                )
            )

    rows = db.execute(stmt.order_by(Policy.created_at.desc())).all()
    return [_build_policy_payload(policy, profile) for policy, profile in rows]


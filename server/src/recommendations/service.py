"""
recommendations/service.py
Returns real DB recommendations when available, falls back to dummy data.
"""

from decimal import Decimal
from typing import Any, Optional
from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.recommendations.models import RecommendationFilter
from src.database.admin_dashboard.models.policies import Policy, PolicyStatus, PolicyType
from src.database.manage_policies.models.policy_profiles import PolicyProfile

try:
    from src.entities.active_policy import ActivePolicy
    HAS_ACTIVE_POLICY_MODEL = True
except ImportError:
    HAS_ACTIVE_POLICY_MODEL = False


# ── Dummy fallback data ───────────────────────────────────────────────────────
DUMMY_RECOMMENDATIONS = [
    {
        "id": 9001,
        "title": "Health Insurance Coverage Gap",
        "policy": "Family Health Plan",
        "provider": "HealthFirst Insurance",
        "premium": "$3,600/year",
        "coverage": "$500,000",
        "match": "95%",
        "priority": "high",
        "category": "high_priority",
        "policyCategory": "HEALTH",
        "benefits": [
            "Age-appropriate coverage",
            "Covers pre-existing conditions",
            "Includes preventive care",
            "Family coverage available",
        ],
        "premium_annual": Decimal("3600.00"),
        "coverage_amount": Decimal("500000.00"),
    },
    {
        "id": 9002,
        "title": "Save on Auto Insurance",
        "policy": "Comprehensive Auto Plan",
        "provider": "Shield General Insurance",
        "premium": "$1,200/year",
        "coverage": "$150,000",
        "match": "88%",
        "priority": "medium",
        "category": "cost_savings",
        "policyCategory": "AUTO",
        "benefits": [
            "Same coverage limits as your current plan",
            "Better claim satisfaction rating",
            "Includes roadside assistance",
            "Lower deductible options",
        ],
        "premium_annual": Decimal("1200.00"),
        "coverage_amount": Decimal("150000.00"),
    },
    {
        "id": 9003,
        "title": "Increase Life Insurance Coverage",
        "policy": "Term Life 20-Year Plan",
        "provider": "SecureLife Insurance",
        "premium": "$2,400/year",
        "coverage": "$1,000,000",
        "match": "82%",
        "priority": "high",
        "category": "coverage_upgrades",
        "policyCategory": "LIFE",
        "benefits": [
            "Matches 10x annual income rule",
            "Cash value accumulation",
            "Living benefits included",
            "Premium guaranteed for 20 years",
        ],
        "premium_annual": Decimal("2400.00"),
        "coverage_amount": Decimal("1000000.00"),
    },
    {
        "id": 9004,
        "title": "Home Contents Protection",
        "policy": "Home Contents Shield",
        "provider": "HomeSafe Insurance",
        "premium": "$900/year",
        "coverage": "$200,000",
        "match": "74%",
        "priority": "low",
        "category": "additional_coverage",
        "policyCategory": "HOME",
        "benefits": [
            "Covers theft and damage",
            "Includes electronics and jewellery",
            "No-claims discount available",
            "24/7 claims support",
        ],
        "premium_annual": Decimal("900.00"),
        "coverage_amount": Decimal("200000.00"),
    },
]


# ── Scoring maps ──────────────────────────────────────────────────────────────
_BASE_MATCH = {
    PolicyType.HEALTH: 95,
    PolicyType.LIFE:   82,
    PolicyType.AUTO:   88,
    PolicyType.HOME:   74,
}

_PRIORITY_MAP = {
    PolicyType.HEALTH: "high",
    PolicyType.LIFE:   "high",
    PolicyType.AUTO:   "medium",
    PolicyType.HOME:   "low",
}

_CATEGORY_MAP = {
    PolicyType.HEALTH: "high_priority",
    PolicyType.LIFE:   "coverage_upgrades",
    PolicyType.AUTO:   "cost_savings",
    PolicyType.HOME:   "additional_coverage",
}

_TITLE_MAP = {
    PolicyType.HEALTH: "Health Insurance Coverage Gap",
    PolicyType.LIFE:   "Increase Life Insurance Coverage",
    PolicyType.AUTO:   "Save on Auto Insurance",
    PolicyType.HOME:   "Home Contents Protection",
}

_BENEFITS_MAP = {
    PolicyType.HEALTH: [
        "Age-appropriate coverage",
        "Covers pre-existing conditions",
        "Includes preventive care",
        "Family coverage available",
    ],
    PolicyType.LIFE: [
        "Matches 10x annual income rule",
        "Cash value accumulation",
        "Living benefits included",
        "Premium guaranteed for 20 years",
    ],
    PolicyType.AUTO: [
        "Same coverage limits",
        "Better claim satisfaction rating",
        "Includes roadside assistance",
        "Lower deductible options",
    ],
    PolicyType.HOME: [
        "Covers theft and damage",
        "Includes electronics and jewellery",
        "No-claims discount available",
        "24/7 claims support",
    ],
}

_TAB_TO_INTERNAL = {
    "additional_coverage": "additional_coverage",
    "high_priority":       "high_priority",
    "cost_savings":        "cost_savings",
    "coverage_upgrades":   "coverage_upgrades",
}


# ── Helpers ───────────────────────────────────────────────────────────────────
def _fmt_currency(value) -> str:
    if value is None:
        return "N/A"
    return f"${Decimal(value):,.0f}"


def _fmt_premium(value) -> str:
    if value is None:
        return "N/A"
    return f"${Decimal(value):,.0f}/year"


def _get_user_categories(db: Session, user_id: int) -> set[str]:
    """Return category strings (uppercase) the user already holds."""
    if not HAS_ACTIVE_POLICY_MODEL:
        return set()
    today = date.today()
    rows = db.query(ActivePolicy.category).filter(
        ActivePolicy.user_id == user_id,
        ActivePolicy.status == "ACTIVE",
        ActivePolicy.end_date >= today,
    ).all()
    return {row.category.upper() for row in rows if row.category}


def _build_recommendation(policy: Policy, profile, idx: int) -> dict[str, Any]:
    ptype = policy.policy_type
    policy_name = (
        profile.policy_name if profile and profile.policy_name
        else f"{ptype.value.title()} Policy {policy.policy_number}"
    )
    provider = (
        profile.provider if profile and profile.provider
        else "BimaVerse Insurance"
    )
    return {
        "id":              policy.id,
        "title":           _TITLE_MAP.get(ptype, policy_name),
        "policy":          policy_name,
        "provider":        provider,
        "premium":         _fmt_premium(policy.premium_amount),
        "coverage":        _fmt_currency(policy.coverage_amount),
        "match":           f"{_BASE_MATCH.get(ptype, 70)}%",
        "priority":        _PRIORITY_MAP.get(ptype, "low"),
        "category":        _CATEGORY_MAP.get(ptype, "additional_coverage"),
        "policyCategory":  ptype.value.upper(),
        "benefits":        _BENEFITS_MAP.get(ptype, []),
        "premium_annual":  policy.premium_amount,
        "coverage_amount": policy.coverage_amount,
    }


# ── Public API ────────────────────────────────────────────────────────────────
def list_recommendations(
    db: Session,
    user_id: int,
    filters: Optional[RecommendationFilter] = None,
) -> list[dict[str, Any]]:
    """
    1. Try to build recommendations from real DB policies.
    2. If DB returns nothing, fall back to DUMMY_RECOMMENDATIONS.
    3. Apply category tab filter either way.
    4. Sort by match score descending.
    """
    # ── Real DB path ──────────────────────────────────────────────────────────
    try:
        stmt = (
            select(Policy, PolicyProfile)
            .outerjoin(PolicyProfile, PolicyProfile.policy_id == Policy.id)
            .where(Policy.status == PolicyStatus.ACTIVE)
        )

        existing_categories = _get_user_categories(db, user_id)
        if existing_categories:
            excluded_types = [
                PolicyType[c]
                for c in existing_categories
                if c in PolicyType.__members__
            ]
            if excluded_types:
                stmt = stmt.where(Policy.policy_type.notin_(excluded_types))

        if filters and filters.policy_type:
            pt = filters.policy_type.strip().upper()
            if pt in PolicyType.__members__:
                stmt = stmt.where(Policy.policy_type == PolicyType[pt])

        if filters and filters.max_premium:
            stmt = stmt.where(Policy.premium_amount <= filters.max_premium)

        rows = db.execute(stmt.order_by(Policy.created_at.desc())).all()
        recommendations = [
            _build_recommendation(policy, profile, idx)
            for idx, (policy, profile) in enumerate(rows)
        ]

    except Exception:
        recommendations = []

    # ── Fallback to dummy data if DB returned nothing ─────────────────────────
    if not recommendations:
        recommendations = list(DUMMY_RECOMMENDATIONS)

    # ── Tab-category filter ───────────────────────────────────────────────────
    if filters and filters.category and filters.category in _TAB_TO_INTERNAL:
        target = _TAB_TO_INTERNAL[filters.category]
        recommendations = [r for r in recommendations if r["category"] == target]

    # ── Sort by match score ───────────────────────────────────────────────────
    recommendations.sort(
        key=lambda r: int(str(r["match"]).replace("%", "")),
        reverse=True,
    )

    return recommendations
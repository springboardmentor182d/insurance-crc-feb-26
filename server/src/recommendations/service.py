"""
recommendations/service.py

Generates personalised insurance recommendations by:
  1. Pulling all ACTIVE policies from DB.
  2. Pulling the user's existing active policy types so we know what they hold.
  3. Enriching each recommendation with user profile & preferences data.
  4. Applying tab filter (category) if provided.
  5. Returning sorted list (highest match first).
"""

from decimal import Decimal
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.recommendations.models import RecommendationFilter
from src.database.admin_dashboard.models.policies import Policy, PolicyStatus, PolicyType
from src.database.manage_policies.models.policy_profiles import PolicyProfile

# ── Try to import user profile & preferences models ───────────────────────────
try:
    from src.users.models import User
    HAS_USER_MODEL = True
except ImportError:
    HAS_USER_MODEL = False

try:
    from src.users.preferences_models import UserPreferences
    HAS_PREFERENCES_MODEL = True
except ImportError:
    HAS_PREFERENCES_MODEL = False

try:
    from src.active_policies.models import ActivePolicy
    HAS_ACTIVE_POLICY_MODEL = True
except ImportError:
    HAS_ACTIVE_POLICY_MODEL = False


# ── Scoring constants ─────────────────────────────────────────────────────────
_BASE_MATCH: dict[str, int] = {
    PolicyType.HEALTH: 95,
    PolicyType.LIFE:   82,
    PolicyType.AUTO:   88,
    PolicyType.HOME:   74,
}

_PRIORITY_MAP: dict[str, str] = {
    PolicyType.HEALTH: "high",
    PolicyType.LIFE:   "high",
    PolicyType.AUTO:   "medium",
    PolicyType.HOME:   "low",
}

_CATEGORY_MAP: dict[str, str] = {
    PolicyType.HEALTH: "high_priority",
    PolicyType.LIFE:   "coverage_upgrades",
    PolicyType.AUTO:   "cost_savings",
    PolicyType.HOME:   "additional_coverage",
}

_TITLE_MAP: dict[str, str] = {
    PolicyType.HEALTH: "Health Insurance Coverage Gap",
    PolicyType.LIFE:   "Increase Life Insurance Coverage",
    PolicyType.AUTO:   "Save on Auto Insurance",
    PolicyType.HOME:   "Home Contents Protection",
}

_BENEFITS_MAP: dict[str, list[str]] = {
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

# Tab → internal category mapping
_TAB_TO_INTERNAL: dict[str, str] = {
    "additional_coverage": "additional_coverage",
    "high_priority":       "high_priority",
    "cost_savings":        "cost_savings",
    "coverage_upgrades":   "coverage_upgrades",
}

# ── Dummy profile data used when DB fields are missing ────────────────────────
# These mirror realistic values so the frontend always renders something useful.
_DUMMY_PROFILE: dict[str, Any] = {
    "occupation":   "Software Engineer",
    "city":         "Mumbai",
    "state":        "Maharashtra",
    "risk_profile": "moderate",         # from preferences
    "budget":       50000,              # annual budget from preferences (INR)
}


# ── Helpers ───────────────────────────────────────────────────────────────────
def _fmt_currency(value: Decimal | None) -> str:
    if value is None:
        return "N/A"
    return f"${value:,.0f}"


def _fmt_premium(value: Decimal | None) -> str:
    if value is None:
        return "N/A"
    return f"${value:,.0f}/year"


def _get_user_profile(db: Session, user_id: int) -> dict[str, Any]:
    """Fetch user profile fields; fall back to dummy values if model unavailable."""
    profile: dict[str, Any] = dict(_DUMMY_PROFILE)
    if HAS_USER_MODEL:
        user = db.get(User, user_id)
        if user:
            profile["occupation"] = getattr(user, "occupation", None) or profile["occupation"]
            profile["city"]       = getattr(user, "city",       None) or profile["city"]
            profile["state"]      = getattr(user, "state",      None) or profile["state"]
    return profile


def _get_user_preferences(db: Session, user_id: int) -> dict[str, Any]:
    """Fetch user preferences; fall back to empty dict if model unavailable."""
    prefs: dict[str, Any] = {}
    if HAS_PREFERENCES_MODEL:
        pref_obj = db.execute(
            select(UserPreferences).where(UserPreferences.user_id == user_id)
        ).scalar_one_or_none()
        if pref_obj:
            prefs["risk_profile"]     = getattr(pref_obj, "risk_profile",     None)
            prefs["budget"]           = getattr(pref_obj, "annual_budget",     None)
            prefs["preferred_types"]  = getattr(pref_obj, "preferred_types",   None)
            prefs["occupation"]       = getattr(pref_obj, "occupation",        None)
            prefs["city"]             = getattr(pref_obj, "city",              None)
            prefs["state"]            = getattr(pref_obj, "state",             None)
    return prefs


def _get_user_policy_types(db: Session, user_id: int) -> set[PolicyType]:
    """Return the set of PolicyType values the user already holds (ACTIVE)."""
    if not HAS_ACTIVE_POLICY_MODEL:
        return set()
    rows = db.execute(
        select(Policy.policy_type)
        .join(ActivePolicy, ActivePolicy.policy_id == Policy.id)
        .where(
            ActivePolicy.user_id == user_id,
            Policy.status == PolicyStatus.ACTIVE,
        )
    ).scalars().all()
    return set(rows)


def _personalise_benefits(
    ptype: PolicyType,
    profile: dict[str, Any],
    prefs: dict[str, Any],
) -> list[str]:
    """
    Take the base benefits list and optionally prepend a profile-driven reason.
    e.g. if user's occupation is 'self-employed', mention it for health.
    """
    base = list(_BENEFITS_MAP.get(ptype, []))
    occupation = prefs.get("occupation") or profile.get("occupation", "")
    risk       = prefs.get("risk_profile") or profile.get("risk_profile", "moderate")

    if ptype == PolicyType.HEALTH and occupation.lower() in ("self-employed", "freelancer"):
        base.insert(0, "Designed for self-employed individuals")

    if ptype == PolicyType.LIFE and risk == "conservative":
        base.insert(0, "Low-risk, guaranteed-return plan")

    if ptype == PolicyType.AUTO and risk == "moderate":
        base.insert(0, "Balanced premium vs. coverage for moderate-risk drivers")

    return base[:4]  # cap at 4 bullets


def _build_recommendation(
    policy: Policy,
    profile_row: PolicyProfile | None,
    user_profile: dict[str, Any],
    user_prefs: dict[str, Any],
    rank_index: int,
) -> dict[str, Any]:
    ptype = policy.policy_type

    policy_name = (
        profile_row.policy_name
        if profile_row and profile_row.policy_name
        else f"{ptype.value.title()} Policy {policy.policy_number}"
    )
    provider = (
        profile_row.provider if profile_row and profile_row.provider else "BimaVerse Insurance"
    )

    benefits = _personalise_benefits(ptype, user_profile, user_prefs)

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
        "benefits":        benefits,
        "premium_annual":  policy.premium_amount,
        "coverage_amount": policy.coverage_amount,
        # profile context (not exposed to frontend but useful for future sorting)
        "_occupation":     user_profile.get("occupation"),
        "_location":       f"{user_profile.get('city', '')}, {user_profile.get('state', '')}".strip(", "),
    }


# ── Public API ────────────────────────────────────────────────────────────────
def list_recommendations(
    db: Session,
    user_id: int,
    filters: Optional[RecommendationFilter] = None,
) -> list[dict[str, Any]]:
    """
    Return personalised recommendations for `user_id`.

    Steps:
      1. Fetch user profile & preferences (with dummy fallback).
      2. Fetch all active policies (same join as browse_policies).
      3. Exclude policy types the user already holds.
      4. Build enriched recommendation dicts.
      5. Optionally apply tab-category filter.
      6. Sort by match score descending.
    """
    # 1. User context (profile + preferences, with dummy fallback)
    user_profile = _get_user_profile(db, user_id)
    user_prefs   = _get_user_preferences(db, user_id)

    # Merge: preferences override profile where both exist
    merged = {**user_profile, **{k: v for k, v in user_prefs.items() if v is not None}}

    # 2. All active policies
    stmt = (
        select(Policy, PolicyProfile)
        .outerjoin(PolicyProfile, PolicyProfile.policy_id == Policy.id)
        .where(Policy.status == PolicyStatus.ACTIVE)
    )

    # 3. Exclude what the user already has
    existing_types = _get_user_policy_types(db, user_id)
    if existing_types:
        stmt = stmt.where(Policy.policy_type.notin_(existing_types))

    # Optional: filter by policy_type (HOME / AUTO / LIFE / HEALTH)
    if filters and filters.policy_type:
        pt = filters.policy_type.strip().upper()
        try:
            stmt = stmt.where(Policy.policy_type == PolicyType[pt])
        except KeyError:
            pass

    # Optional: budget ceiling (prefer preferences budget over filter)
    budget_ceiling = (
        merged.get("budget")
        or (filters.max_premium if filters else None)
    )
    if budget_ceiling:
        stmt = stmt.where(Policy.premium_amount <= Decimal(str(budget_ceiling)))

    # Optional: preferred_types filter from preferences
    preferred_types = merged.get("preferred_types")
    if preferred_types and isinstance(preferred_types, list):
        valid_types = []
        for pt_str in preferred_types:
            try:
                valid_types.append(PolicyType[pt_str.strip().upper()])
            except KeyError:
                pass
        if valid_types:
            stmt = stmt.where(Policy.policy_type.in_(valid_types))

    rows = db.execute(stmt.order_by(Policy.created_at.desc())).all()

    recommendations = [
        _build_recommendation(policy, profile_row, merged, user_prefs, idx)
        for idx, (policy, profile_row) in enumerate(rows)
    ]

    # 5. Tab-category filter (applied in-memory)
    if filters and filters.category and filters.category in _TAB_TO_INTERNAL:
        target = _TAB_TO_INTERNAL[filters.category]
        recommendations = [r for r in recommendations if r["category"] == target]

    # 6. Sort by match score descending
    recommendations.sort(
        key=lambda r: int(r["match"].replace("%", "")), reverse=True
    )

    return recommendations
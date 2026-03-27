from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.recommendations.models import RecommendationFilter, RecommendationListResponse
from src.recommendations.service import list_recommendations
from src.auth.jwt import get_current_user_id

router = APIRouter()


@router.get("", response_model=RecommendationListResponse)
def get_recommendations(
    category: Optional[str] = Query(
        default=None,
        description=(
            "Tab filter: "
            "additional_coverage | high_priority | cost_savings | coverage_upgrades"
        ),
    ),
    policy_type: Optional[str] = Query(
        default=None,
        description="Policy type filter: HOME | AUTO | LIFE | HEALTH",
    ),
    max_premium: Optional[float] = Query(
        default=None,
        description="Maximum annual premium (budget ceiling)",
    ),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Return personalised insurance recommendations for the authenticated user.

    - Excludes policy types the user already holds.
    - Optionally filtered by tab category, policy type, or budget.
    - Sorted by match score descending.
    """
    filters = RecommendationFilter(
        category=category,
        policy_type=policy_type,
        max_premium=max_premium,
    )
    results = list_recommendations(db, current_user_id, filters)
    return RecommendationListResponse(recommendations=results, total=len(results))
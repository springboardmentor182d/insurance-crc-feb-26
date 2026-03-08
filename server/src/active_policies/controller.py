from datetime import date, timedelta
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.active_policies.models import ActivePolicyResponse, ActivePoliciesSummary
from src.active_policies.service import list_active_policies, compute_summary, EXPIRING_SOON_DAYS
from src.auth.jwt import get_current_user_id
from src.database.core import get_db

router = APIRouter()


@router.get("/active", response_model=List[ActivePolicyResponse])
def get_active_policies(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Return all active policies for the current user."""
    policies = list_active_policies(db, current_user_id)

    today = date.today()
    expiring_threshold = today + timedelta(days=EXPIRING_SOON_DAYS)

    # Manually map SQLAlchemy models to Pydantic responses so we can add
    # the computed \"is_expiring_soon\" flag.
    response: List[ActivePolicyResponse] = []
    for p in policies:
        is_expiring_soon = p.end_date is not None and today <= p.end_date <= expiring_threshold
        response.append(
            ActivePolicyResponse(
                id=p.id,
                user_id=p.user_id,
                policy_id=p.policy_id,
                policy_number=p.policy_number,
                status=p.status,
                category=p.category,
                insurer_name=p.insurer_name,
                product_name=p.product_name,
                premium_annual=p.premium_annual,
                coverage_amount=p.coverage_amount,
                deductible_amount=p.deductible_amount,
                start_date=p.start_date,
                end_date=p.end_date,
                tags=p.tags,
                warning_text=p.warning_text,
                is_expiring_soon=is_expiring_soon,
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
        )

    return response


@router.get("/active/summary", response_model=ActivePoliciesSummary)
def get_active_policies_summary(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Return aggregate summary data for the current user's active policies."""
    policies = list_active_policies(db, current_user_id)
    return compute_summary(policies)


from datetime import date, timedelta
from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.active_policies.models import ActivePolicyResponse, ActivePoliciesSummary
from src.active_policies.service import list_active_policies, compute_summary, EXPIRING_SOON_DAYS
from src.auth.jwt import get_current_user_id
from src.database.core import get_db
from src.entities.active_policy import ActivePolicy

router = APIRouter()


class ActivePolicyCreate(BaseModel):
  policy_id: int | None = None
  policy_number: str
  status: str = "PENDING"
  category: str
  insurer_name: str
  product_name: str
  premium_annual: float
  coverage_amount: float
  deductible_amount: float | None = None
  start_date: date
  end_date: date
  tags: str | None = None
  warning_text: str | None = None

@router.get("/")
def get_pending_policies(db: Session = Depends(get_db)):
    policies = db.query(ActivePolicy).filter(ActivePolicy.status == "PENDING").all()

    return [
        {
            "id": p.id,
            "policy_number": p.policy_number,
            "product_name": p.product_name,
            "category": p.category,
            "insurer": p.insurer_name,
            "status": p.status,
        }
        for p in policies
    ]
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


@router.post("/active/external", response_model=ActivePolicyResponse, status_code=201)
def add_external_policy(
    payload: ActivePolicyCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Create a new external active policy for the current user."""
    policy = ActivePolicy(
        user_id=current_user_id,
        policy_id=payload.policy_id,
        policy_number=payload.policy_number,
        status=payload.status,
        category=payload.category,
        insurer_name=payload.insurer_name,
        product_name=payload.product_name,
        premium_annual=payload.premium_annual,
        coverage_amount=payload.coverage_amount,
        deductible_amount=payload.deductible_amount,
        start_date=payload.start_date,
        end_date=payload.end_date,
        tags=payload.tags,
        warning_text=payload.warning_text,
    )

    db.add(policy)
    db.commit()
    db.refresh(policy)

    today = date.today()
    expiring_threshold = today + timedelta(days=EXPIRING_SOON_DAYS)
    is_expiring_soon = policy.end_date is not None and today <= policy.end_date <= expiring_threshold

    return ActivePolicyResponse(
        id=policy.id,
        user_id=policy.user_id,
        policy_id=policy.policy_id,
        policy_number=policy.policy_number,
        status=policy.status,
        category=policy.category,
        insurer_name=policy.insurer_name,
        product_name=policy.product_name,
        premium_annual=policy.premium_annual,
        coverage_amount=policy.coverage_amount,
        deductible_amount=policy.deductible_amount,
        start_date=policy.start_date,
        end_date=policy.end_date,
        tags=policy.tags,
        warning_text=policy.warning_text,
        is_expiring_soon=is_expiring_soon,
        created_at=policy.created_at,
        updated_at=policy.updated_at,
    )


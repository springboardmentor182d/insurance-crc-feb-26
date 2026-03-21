from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.models import Claim, Policy, User

router = APIRouter(tags=["platform"])


class PolicyPayload(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    provider: str = Field(min_length=2, max_length=200)
    policy_type: str = Field(min_length=2, max_length=80)
    coverage_amount: float | str = 0
    premium_amount: float | str = 0
    claim_ratio: float | str = 0
    risk_level: str = "Low"
    is_active: bool = True
    user_id: Optional[int] = None


class PolicyResponse(BaseModel):
    id: int
    name: str
    provider: str
    policy_type: str
    coverage_amount: float
    premium_amount: float
    claim_ratio: float
    risk_level: str
    is_active: bool
    user_id: Optional[int]


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    status: str
    active_policies: int
    total_coverage: float


class AnalyticsResponse(BaseModel):
    users: int
    active_policies: int
    total_policies: int
    total_claims: int
    high_risk_claims: int
    approved_claims: int
    claim_approval_rate: float


class RecommendationResponse(BaseModel):
    policy_id: int
    category: str
    title: str
    provider: str
    match_score: float
    coverage: str
    premium: str
    claim_ratio: str
    risk_level: str
    why: str
    is_top_recommendation: bool


def _to_float(value: float | str | None) -> float:
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    cleaned = (
        str(value)
        .replace("\u20b9", "")
        .replace(",", "")
        .replace("L", "00000")
        .replace("%", "")
        .strip()
    )
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def _rupees_compact(amount: float) -> str:
    return f"\u20b9{(amount / 100000):.1f}L"


def _normalize_policy_payload(payload: PolicyPayload) -> dict:
    return {
        "name": payload.name.strip(),
        "provider": payload.provider.strip(),
        "policy_type": payload.policy_type.strip(),
        "coverage_amount": _to_float(payload.coverage_amount),
        "premium_amount": _to_float(payload.premium_amount),
        "claim_ratio": _to_float(payload.claim_ratio),
        "risk_level": payload.risk_level.strip() or "Low",
        "is_active": payload.is_active,
        "user_id": payload.user_id,
    }


def _policy_to_response(policy: Policy) -> PolicyResponse:
    return PolicyResponse(
        id=policy.id,
        name=policy.name,
        provider=policy.provider,
        policy_type=policy.policy_type,
        coverage_amount=float(policy.coverage_amount or 0),
        premium_amount=float(policy.premium_amount or 0),
        claim_ratio=float(policy.claim_ratio or 0),
        risk_level=policy.risk_level or "Low",
        is_active=bool(policy.is_active),
        user_id=policy.user_id,
    )


@router.get("/policies", response_model=list[PolicyResponse])
def get_policies(db: Session = Depends(get_db)) -> list[PolicyResponse]:
    policies = db.query(Policy).order_by(Policy.id.desc()).all()
    return [_policy_to_response(policy) for policy in policies]


@router.post("/policies", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
def create_policy(payload: PolicyPayload, db: Session = Depends(get_db)) -> PolicyResponse:
    policy = Policy(**_normalize_policy_payload(payload))
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return _policy_to_response(policy)


@router.put("/policies/{policy_id}", response_model=PolicyResponse)
def update_policy(policy_id: int, payload: PolicyPayload, db: Session = Depends(get_db)) -> PolicyResponse:
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if policy is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")

    for field, value in _normalize_policy_payload(payload).items():
        setattr(policy, field, value)

    db.commit()
    db.refresh(policy)
    return _policy_to_response(policy)


@router.delete("/policies/{policy_id}")
def delete_policy(policy_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if policy is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")

    db.delete(policy)
    db.commit()
    return {"status": "deleted"}


@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)) -> list[UserResponse]:
    users = db.query(User).order_by(User.id.desc()).all()

    response: list[UserResponse] = []
    for user in users:
        active_user_policies = [policy for policy in user.policies if policy.is_active]
        total_coverage = sum(float(policy.coverage_amount or 0) for policy in active_user_policies)
        response.append(
            UserResponse(
                id=user.id,
                name=user.full_name,
                email=user.email,
                status="active" if user.is_active else "inactive",
                active_policies=len(active_user_policies),
                total_coverage=round(total_coverage, 2),
            )
        )

    return response


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)) -> AnalyticsResponse:
    users = db.query(User).count()
    total_policies = db.query(Policy).count()
    active_policies = db.query(Policy).filter(Policy.is_active == True).count()  # noqa: E712
    total_claims = db.query(Claim).count()
    high_risk_claims = db.query(Claim).filter(Claim.risk_level.ilike("high")).count()
    approved_claims = db.query(Claim).filter(Claim.status.in_(["approved", "paid"])).count()

    approval_rate = round((approved_claims / total_claims) * 100, 2) if total_claims else 0.0

    return AnalyticsResponse(
        users=users,
        active_policies=active_policies,
        total_policies=total_policies,
        total_claims=total_claims,
        high_risk_claims=high_risk_claims,
        approved_claims=approved_claims,
        claim_approval_rate=approval_rate,
    )


@router.get("/recommendations", response_model=list[RecommendationResponse])
def get_recommendations(
    user_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
) -> list[RecommendationResponse]:
    query = db.query(Policy).filter(Policy.is_active == True)  # noqa: E712
    if user_id is not None:
        query = query.filter(Policy.user_id == user_id)

    policies = query.all()
    recommendations: list[RecommendationResponse] = []

    for policy in policies:
        claim_ratio = float(policy.claim_ratio or 0)
        risk_level = (policy.risk_level or "Low").strip().lower()
        risk_penalty = {"high": 18.0, "medium": 8.0}.get(risk_level, 2.0)
        score = max(0.0, min(100.0, 100.0 - claim_ratio - risk_penalty))

        reason = (
            f"Low risk profile with {claim_ratio:.0f}% claim ratio"
            if risk_level == "low"
            else f"Balanced option for {policy.policy_type} coverage"
        )

        recommendations.append(
            RecommendationResponse(
                policy_id=policy.id,
                category=policy.policy_type,
                title=policy.name,
                provider=policy.provider,
                match_score=round(score, 2),
                coverage=_rupees_compact(float(policy.coverage_amount or 0)),
                premium=_rupees_compact(float(policy.premium_amount or 0)),
                claim_ratio=f"{claim_ratio:.0f}%",
                risk_level=policy.risk_level or "Low",
                why=reason,
                is_top_recommendation=False,
            )
        )

    recommendations.sort(key=lambda item: item.match_score, reverse=True)
    for index, item in enumerate(recommendations):
        item.is_top_recommendation = index == 0

    return recommendations

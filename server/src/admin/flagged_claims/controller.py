from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, func, or_, select
from sqlalchemy.orm import Session

from src.auth import require_admin
from src.database.core import get_db
from src.database.admin_dashboard.enums.activity import ActivitySeverity, ActivityType
from src.database.admin_dashboard.models import (
    ActivityLog,
    Adjuster,
    Claim,
    ClaimStatus,
    FraudFlag,
    Policy,
    User,
)
from src.schemas.flagged_claims import (
    ClaimDetailResponse,
    FlaggedClaimsListResponse,
    FlaggedClaimsStats,
    FlaggedClaimSummary,
    FraudFlagDetail,
)

router = APIRouter(prefix="/admin/flagged-claims", tags=["Admin"])


def _risk_percentage(score: float | None) -> int:
    return int(round((score or 0.0) * 100))


def _normalize_status(value: str | None) -> str | None:
    if not value:
        return None
    return value.strip().lower()


@router.get("", response_model=FlaggedClaimsListResponse)
def list_flagged_claims(
    status_filter: str | None = Query(None, alias="status"),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    status_value = _normalize_status(status_filter)

    base_filters = [
        or_(Claim.fraud_score > 0, Claim.status == ClaimStatus.FRAUDULENT)
    ]

    if status_value and status_value != "all":
        try:
            base_filters.append(Claim.status == ClaimStatus(status_value))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status filter")

    if search:
        like = f"%{search.strip()}%"
        base_filters.append(or_(Claim.claim_number.ilike(like), User.full_name.ilike(like)))

    count_stmt = (
        select(func.count())
        .select_from(Claim)
        .join(User, Claim.user_id == User.id)
        .join(Policy, Claim.policy_id == Policy.id)
        .where(*base_filters)
    )
    total = int(db.execute(count_stmt).scalar_one())

    stmt = (
        select(Claim, User, Policy)
        .join(User, Claim.user_id == User.id)
        .join(Policy, Claim.policy_id == Policy.id)
        .where(*base_filters)
        .order_by(Claim.submitted_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()

    claim_ids = [claim.id for claim, _, _ in rows]
    indicators_map: dict[int, list[str]] = {cid: [] for cid in claim_ids}
    if claim_ids:
        flag_stmt = select(FraudFlag.claim_id, FraudFlag.rule_name).where(
            FraudFlag.claim_id.in_(claim_ids)
        )
        for claim_id, rule_name in db.execute(flag_stmt).all():
            indicators_map.setdefault(claim_id, []).append(rule_name)

    items: list[FlaggedClaimSummary] = []
    for claim, user, policy in rows:
        fraud_score = float(claim.fraud_score or 0.0)
        items.append(
            FlaggedClaimSummary(
                claim_id=claim.id,
                claim_number=claim.claim_number,
                user_name=user.full_name,
                policy_type=policy.policy_type.value,
                claim_amount=float(claim.claim_amount),
                status=claim.status.value,
                fraud_score=fraud_score,
                fraud_risk_percentage=_risk_percentage(fraud_score),
                fraud_indicators=indicators_map.get(claim.id, []),
                submitted_at=claim.submitted_at,
            )
        )

    return FlaggedClaimsListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/stats", response_model=FlaggedClaimsStats)
def flagged_claims_stats(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    total_stmt = select(func.count()).select_from(Claim).where(
        or_(Claim.fraud_score > 0, Claim.status == ClaimStatus.FRAUDULENT)
    )
    pending_stmt = select(func.count()).select_from(Claim).where(
        Claim.status == ClaimStatus.PENDING,
        Claim.fraud_score.is_not(None),
        Claim.fraud_score > 0,
    )
    fraud_stmt = select(func.count()).select_from(Claim).where(
        Claim.status == ClaimStatus.FRAUDULENT
    )
    cleared_stmt = select(func.count()).select_from(Claim).where(
        Claim.status == ClaimStatus.APPROVED,
        Claim.fraud_score.is_not(None),
        Claim.fraud_score > 0,
    )

    total_flagged = int(db.execute(total_stmt).scalar_one())
    pending_review = int(db.execute(pending_stmt).scalar_one())
    fraud_confirmed = int(db.execute(fraud_stmt).scalar_one())
    cleared = int(db.execute(cleared_stmt).scalar_one())

    return FlaggedClaimsStats(
        total_flagged=total_flagged,
        pending_review=pending_review,
        fraud_confirmed=fraud_confirmed,
        cleared=cleared,
    )


@router.post("/{claim_id}/confirm-fraud", status_code=status.HTTP_200_OK)
def confirm_fraud(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    claim = db.get(Claim, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim.status = ClaimStatus.FRAUDULENT
    claim.processed_at = datetime.utcnow()

    db.add(
        ActivityLog(
            user_id=current_user.id,
            title=f"Claim {claim.claim_number} marked fraudulent",
            action_type=ActivityType.CLAIM_REJECTED,
            severity=ActivitySeverity.FRAUD,
            entity_type="claim",
            entity_id=claim.id,
        )
    )
    db.commit()
    return {"status": "ok"}


@router.post("/{claim_id}/clear", status_code=status.HTTP_200_OK)
def clear_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    claim = db.get(Claim, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim.fraud_score = 0.0
    claim.status = ClaimStatus.PENDING

    db.execute(delete(FraudFlag).where(FraudFlag.claim_id == claim_id))

    db.add(
        ActivityLog(
            user_id=current_user.id,
            title=f"Claim {claim.claim_number} cleared",
            action_type=ActivityType.CLAIM_APPROVED,
            severity=ActivitySeverity.APPROVED,
            entity_type="claim",
            entity_id=claim.id,
        )
    )
    db.commit()
    return {"status": "ok"}
@router.get("/export")
def export_flagged_claims(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    stmt = (
        select(Claim, User, Policy)
        .join(User, Claim.user_id == User.id)
        .join(Policy, Claim.policy_id == Policy.id)
        .where(Claim.fraud_score > 0)
        .order_by(Claim.submitted_at.desc())
    )

    rows = db.execute(stmt).all()

    result = []
    for claim, user, policy in rows:
        result.append({
            "claim_number": claim.claim_number,
            "user_name": user.full_name,
            "amount": float(claim.claim_amount),
            "status": claim.status.value,
            "fraud_score": float(claim.fraud_score or 0),
            "submitted_at": claim.submitted_at.isoformat()
        })

    return result

@router.get("/{claim_id}/details", response_model=ClaimDetailResponse)
def claim_details(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    stmt = (
        select(Claim, User, Policy, Adjuster)
        .join(User, Claim.user_id == User.id)
        .join(Policy, Claim.policy_id == Policy.id)
        .outerjoin(Adjuster, Claim.adjuster_id == Adjuster.id)
        .where(Claim.id == claim_id)
    )
    row = db.execute(stmt).first()
    if not row:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim, user, policy, adjuster = row

    flags = db.execute(
        select(FraudFlag)
        .where(FraudFlag.claim_id == claim_id)
        .order_by(FraudFlag.created_at.desc())
    ).scalars().all()

    activity_logs = db.execute(
        select(ActivityLog)
        .where(
            ActivityLog.entity_type == "claim",
            ActivityLog.entity_id == claim_id,
        )
        .order_by(ActivityLog.created_at.desc())
    ).scalars().all()

    return ClaimDetailResponse(
        claim={
            "id": claim.id,
            "claim_number": claim.claim_number,
            "status": claim.status.value,
            "claim_amount": float(claim.claim_amount),
            "approved_amount": float(claim.approved_amount) if claim.approved_amount else None,
            "description": claim.description,
            "fraud_score": float(claim.fraud_score or 0.0),
            "submitted_at": claim.submitted_at,
            "processed_at": claim.processed_at,
            "created_at": claim.created_at,
        },
        user={
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role.value,
        },
        policy={
            "id": policy.id,
            "policy_number": policy.policy_number,
            "policy_type": policy.policy_type.value,
            "status": policy.status.value,
            "premium_amount": float(policy.premium_amount),
            "coverage_amount": float(policy.coverage_amount),
            "start_date": policy.start_date,
            "end_date": policy.end_date,
        },
        adjuster=(
            {
                "id": adjuster.id,
                "name": adjuster.name,
                "email": adjuster.email,
                "is_active": adjuster.is_active,
            }
            if adjuster
            else None
        ),
        fraud_flags=[
            FraudFlagDetail(
                id=flag.id,
                rule_name=flag.rule_name,
                severity=flag.severity.value,
                details=flag.details,
                created_at=flag.created_at,
            )
            for flag in flags
        ],
        activity_logs=[
            {
                "id": log.id,
                "title": log.title,
                "action_type": log.action_type.value,
                "severity": log.severity.value,
                "details": log.details,
                "entity_type": log.entity_type,
                "entity_id": log.entity_id,
                "created_at": log.created_at,
            }
            for log in activity_logs
        ],
    )

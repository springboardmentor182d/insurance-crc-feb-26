"""
Claims Controller — FastAPI router.
─────────────────────────────────────────────────────────────────────────────
Mount this router in your main app with:

    from manage_claims\controller.py import router as claims_router
    app.include_router(claims_router, prefix="/api/claims", tags=["Claims"])
─────────────────────────────────────────────────────────────────────────────

Endpoints:
  GET    /api/claims                       → list all claims + stats
  GET    /api/claims/{claim_id}            → single claim detail (for modal)
  PATCH  /api/claims/{claim_id}/status     → approve or reject a claim
"""

from fastapi import APIRouter, Query
from typing import Optional

from src.admin.manage_claims.models import (
    ClaimsListResponse,
    ClaimDetail,
    UpdateClaimStatusRequest,
    ClaimActionResponse,
)
from src.admin.manage_claims.service import fetch_all_claims, fetch_claim_detail, process_claim_action

router = APIRouter()


# ---------------------------------------------------------------------------
# GET /api/claims
# ---------------------------------------------------------------------------
@router.get("", response_model=ClaimsListResponse)
def get_all_claims(
    status: Optional[str] = Query(
        default=None,
        description="Filter by status: under_review | approved | rejected",
    )
):
    """
    Returns stats (total, under_review, approved, rejected) and
    a list of claim summaries for the main table.

    Pass ?status=under_review (or approved / rejected) to filter the list.
    Stats are always computed over ALL claims regardless of filter.
    """
    return fetch_all_claims(status_filter=status)


# ---------------------------------------------------------------------------
# GET /api/claims/{claim_id}
# ---------------------------------------------------------------------------
@router.get("/{claim_id}", response_model=ClaimDetail)
def get_claim_detail(claim_id: str):
    """
    Returns full detail for a single claim.
    Used when the admin clicks the eye (👁) icon to open the Claim Details modal.
    """
    return fetch_claim_detail(claim_id)


# ---------------------------------------------------------------------------
# PATCH /api/claims/{claim_id}/status
# ---------------------------------------------------------------------------
@router.patch("/{claim_id}/status", response_model=ClaimActionResponse)
def update_claim_status(claim_id: str, body: UpdateClaimStatusRequest):
    """
    Approve or reject a claim.

    Body:
      {
        "status": "approved" | "rejected",
        "review_notes": "optional for approval, required for rejection"
      }

    Error responses:
      400 — invalid status value
      404 — claim not found
      409 — claim already approved/rejected (terminal, cannot change)
      422 — rejection attempted without review_notes
    """
    return process_claim_action(
        claim_id     = claim_id,
        new_status   = body.status,
        review_notes = body.review_notes,
    )
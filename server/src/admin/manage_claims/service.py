"""
Claims service layer.
─────────────────────────────────────────────────────────────────────────────
All business logic lives here. The controller (manage_claims\controller.py) only
handles HTTP concerns — it delegates everything to these functions.

When you switch to a real DB:
  • Replace the imports from mock_data with SQLAlchemy session calls.
  • Keep the function signatures identical so the controller needs zero changes.
─────────────────────────────────────────────────────────────────────────────
"""

from fastapi import HTTPException
from src.admin.manage_claims.models import (
    ClaimSummary,
    ClaimDetail,
    ClaimUserInfo,
    ClaimDocument,
    ClaimsStatsResponse,
    ClaimsListResponse,
    ClaimActionResponse,
)
from src.admin.manage_claims.mock_data import get_all_claims, get_claim_by_id, update_claim_status

# Valid statuses that an admin can SET via the API
ACTIONABLE_STATUSES = {"approved", "rejected"}

# Statuses that are already terminal (no further action allowed)
TERMINAL_STATUSES = {"approved", "rejected"}


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _build_claim_summary(raw: dict) -> ClaimSummary:
    return ClaimSummary(
        claim_id       = raw["claim_id"],
        user_name      = raw["user"]["full_name"],
        user_email     = raw["user"]["email"],
        policy_type    = raw["policy_type"],
        policy_number  = raw["policy_number"],
        incident_type  = raw["incident_type"],
        amount         = raw["amount"],
        submitted_date = raw["submitted_date"],
        status         = raw["status"],
    )


def _build_claim_detail(raw: dict) -> ClaimDetail:
    return ClaimDetail(
        claim_id             = raw["claim_id"],
        status               = raw["status"],
        policy_type          = raw["policy_type"],
        policy_number        = raw["policy_number"],
        incident_type        = raw["incident_type"],
        incident_date        = raw["incident_date"],
        amount               = raw["amount"],
        submitted_date       = raw["submitted_date"],
        user                 = ClaimUserInfo(**raw["user"]),
        incident_description = raw["incident_description"],
        documents            = [ClaimDocument(**d) for d in raw["documents"]],
    )


def _compute_stats(claims: list[dict]) -> ClaimsStatsResponse:
    return ClaimsStatsResponse(
        total        = len(claims),
        under_review = sum(1 for c in claims if c["status"] == "under_review"),
        approved     = sum(1 for c in claims if c["status"] == "approved"),
        rejected     = sum(1 for c in claims if c["status"] == "rejected"),
    )


# ---------------------------------------------------------------------------
# Public service functions (called by the controller)
# ---------------------------------------------------------------------------

def fetch_all_claims(status_filter: str | None = None) -> ClaimsListResponse:
    """
    Return stats + claim list.
    Optional `status_filter` narrows the list but stats always reflect ALL claims.
    """
    all_raw = get_all_claims()
    stats   = _compute_stats(all_raw)

    if status_filter and status_filter in {"under_review", "approved", "rejected"}:
        filtered = [c for c in all_raw if c["status"] == status_filter]
    else:
        filtered = all_raw

    return ClaimsListResponse(
        stats  = stats,
        claims = [_build_claim_summary(c) for c in filtered],
    )


def fetch_claim_detail(claim_id: str) -> ClaimDetail:
    """Return full detail for a single claim. Raises 404 if not found."""
    raw = get_claim_by_id(claim_id)
    if not raw:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")
    return _build_claim_detail(raw)


def process_claim_action(claim_id: str, new_status: str, review_notes: str | None) -> ClaimActionResponse:
    """
    Approve or reject a claim.

    Rules enforced here:
      • new_status must be 'approved' or 'rejected'.
      • Rejection requires review_notes.
      • Already-terminal claims cannot be changed again.
    """
    # Validate requested status
    if new_status not in ACTIONABLE_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{new_status}'. Must be one of: {ACTIONABLE_STATUSES}",
        )

    # Rejection must include notes
    if new_status == "rejected" and not (review_notes and review_notes.strip()):
        raise HTTPException(
            status_code=422,
            detail="Review notes are required when rejecting a claim.",
        )

    # Fetch existing claim
    raw = get_claim_by_id(claim_id)
    if not raw:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")

    # Block re-processing terminal claims
    if raw["status"] in TERMINAL_STATUSES:
        raise HTTPException(
            status_code=409,
            detail=f"Claim '{claim_id}' is already '{raw['status']}' and cannot be changed.",
        )

    # Apply update
    updated = update_claim_status(
        claim_id     = claim_id,
        new_status   = new_status,
        review_notes = review_notes.strip() if review_notes else None,
    )

    action_word = "approved" if new_status == "approved" else "rejected"
    return ClaimActionResponse(
        success    = True,
        message    = f"Claim {claim_id} has been {action_word} successfully.",
        claim_id   = claim_id,
        new_status = new_status,
    )
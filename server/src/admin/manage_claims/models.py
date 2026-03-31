"""
Claims Pydantic Models
─────────────────────────────────────────────────────────────────────────────
Organised into 5 sections:

  1. SHARED        — enums / constants used across sections
  2. STATS         — models for the 4 summary cards at the top of the page
  3. TABLE         — models for the claims list table
  4. DETAIL        — models for the Claim Details modal
  5. ACTIONS       — request / response models for Approve & Reject
─────────────────────────────────────────────────────────────────────────────
"""

from pydantic import BaseModel
from typing import Optional, List


# =============================================================================
# 1. SHARED — Status constants
# =============================================================================

class ClaimStatus:
    UNDER_REVIEW = "under_review"
    APPROVED     = "approved"
    REJECTED     = "rejected"


# =============================================================================
# 2. STATS — Powers the 4 summary cards at the top of the page
# =============================================================================

class ClaimsStatsResponse(BaseModel):
    """
    Returned as part of every GET /api/claims response.
    Each field maps directly to one stat card in the UI.

    UI mapping:
      total        → "Total Claims"   card
      under_review → "Under Review"   card
      approved     → "Approved"       card
      rejected     → "Rejected"       card
    """
    total:        int
    under_review: int
    approved:     int
    rejected:     int


# =============================================================================
# 3. TABLE — Powers the claims list table
# =============================================================================

class ClaimSummary(BaseModel):
    """
    Lightweight row model — only the columns needed for the table.
    Returned as a list inside ClaimsListResponse.

    UI mapping  (column → field):
      Claim #        → claim_id
      User           → user_name + user_email
      Policy         → policy_type + policy_number
      Incident Type  → incident_type
      Amount         → amount
      Submitted      → submitted_date
      Status         → status
    """
    claim_id:       str     # e.g. "CLM-2026-001"
    user_name:      str
    user_email:     str
    policy_type:    str     # e.g. "Auto Insurance"
    policy_number:  str     # e.g. "AUTO-2025-5678"
    incident_type:  str     # e.g. "Vehicle Collision"
    amount:         float
    submitted_date: str     # ISO date string  "YYYY-MM-DD"
    status:         str     # ClaimStatus value


class ClaimsListResponse(BaseModel):
    """
    Top-level response for GET /api/claims.
    One call populates both the stats cards and the table.
    """
    stats:  ClaimsStatsResponse
    claims: List[ClaimSummary]


# =============================================================================
# 4. DETAIL — Powers the Claim Details modal (eye icon)
# =============================================================================

class ClaimUserInfo(BaseModel):
    """
    User info section inside the Claim Details modal.
    """
    full_name: str
    email:     str
    phone:     str
    address:   str


class ClaimDocument(BaseModel):
    """
    Single uploaded document row inside the Claim Details modal.
    """
    name:          str      # e.g. "police-report.pdf"
    doc_type:      str      # e.g. "Police Report"
    size_mb:       float
    uploaded_date: str      # ISO date string


class ClaimDetail(BaseModel):
    """
    Full claim model returned by GET /api/claims/{claim_id}.
    Populates every section of the Claim Details modal.

    Modal sections:
      Claim Information    → claim_id, status, policy_type, policy_number,
                             incident_type, incident_date, amount, submitted_date
      User Information     → user  (ClaimUserInfo)
      Incident Description → incident_description
      Uploaded Documents   → documents  (list of ClaimDocument)
    """
    claim_id:             str
    status:               str
    policy_type:          str
    policy_number:        str
    incident_type:        str
    incident_date:        str
    amount:               float
    submitted_date:       str
    user:                 ClaimUserInfo
    incident_description: str
    documents:            List[ClaimDocument]


# =============================================================================
# 5. ACTIONS — Request / response for Approve & Reject modals
# =============================================================================

class UpdateClaimStatusRequest(BaseModel):
    """
    Request body for PATCH /api/claims/{claim_id}/status.

    Sent by:
      • Approve modal → status = "approved", review_notes optional
      • Reject modal  → status = "rejected", review_notes REQUIRED
    """
    status:       str             # "approved" | "rejected"
    review_notes: Optional[str] = None


class ClaimActionResponse(BaseModel):
    """
    Response after a successful approve or reject action.
    Frontend uses new_status to update the row in the table without a re-fetch.
    """
    success:    bool
    message:    str
    claim_id:   str
    new_status: str
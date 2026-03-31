"""
Mock data store for Claims.
─────────────────────────────────────────────────────────────────────────────
When you connect to a real DB, delete this file and replace the service
functions in manage_claims\service.py with actual SQLAlchemy / raw SQL calls.
─────────────────────────────────────────────────────────────────────────────
"""

from typing import Dict
from copy import deepcopy

# ---------------------------------------------------------------------------
# Raw store  (keyed by claim_id for O(1) lookups)
# ---------------------------------------------------------------------------

_MOCK_CLAIMS: Dict[str, dict] = {
    "CLM-2026-001": {
        "claim_id":    "CLM-2026-001",
        "status":      "under_review",
        "policy_type": "Auto Insurance",
        "policy_number": "AUTO-2025-5678",
        "incident_type": "Vehicle Collision",
        "incident_date": "2026-03-10",
        "amount":      5200.0,
        "submitted_date": "2026-03-15",
        "review_notes": None,
        "user": {
            "full_name": "John Anderson",
            "email":     "john.anderson@email.com",
            "phone":     "+1 (555) 123-4567",
            "address":   "123 Main Street, New York, NY 10001",
        },
        "incident_description": (
            "Rear-end collision at intersection. Other driver ran red light. "
            "Police report filed."
        ),
        "documents": [
            {"name": "police-report.pdf",   "doc_type": "Police Report", "size_mb": 2.4, "uploaded_date": "2026-03-15"},
            {"name": "damage-photos-1.jpg", "doc_type": "Photo",         "size_mb": 1.8, "uploaded_date": "2026-03-15"},
            {"name": "damage-photos-2.jpg", "doc_type": "Photo",         "size_mb": 2.1, "uploaded_date": "2026-03-15"},
            {"name": "repair-estimate.pdf", "doc_type": "Estimate",      "size_mb": 0.86,"uploaded_date": "2026-03-15"},
        ],
    },
    "CLM-2026-002": {
        "claim_id":    "CLM-2026-002",
        "status":      "under_review",
        "policy_type": "Home Insurance",
        "policy_number": "HOME-2024-9012",
        "incident_type": "Water Damage",
        "incident_date": "2026-03-05",
        "amount":      12500.0,
        "submitted_date": "2026-03-12",
        "review_notes": None,
        "user": {
            "full_name": "Sarah Mitchell",
            "email":     "sarah.mitchell@email.com",
            "phone":     "+1 (555) 234-5678",
            "address":   "456 Oak Avenue, Chicago, IL 60601",
        },
        "incident_description": (
            "Burst pipe in kitchen caused extensive water damage to flooring "
            "and cabinetry. Plumber report and contractor estimate attached."
        ),
        "documents": [
            {"name": "plumber-report.pdf",      "doc_type": "Plumber Report", "size_mb": 1.2, "uploaded_date": "2026-03-12"},
            {"name": "damage-photos.jpg",        "doc_type": "Photo",          "size_mb": 3.1, "uploaded_date": "2026-03-12"},
            {"name": "contractor-estimate.pdf",  "doc_type": "Estimate",       "size_mb": 1.5, "uploaded_date": "2026-03-12"},
        ],
    },
    "CLM-2026-003": {
        "claim_id":    "CLM-2026-003",
        "status":      "approved",
        "policy_type": "Auto Insurance",
        "policy_number": "AUTO-2025-3456",
        "incident_type": "Theft",
        "incident_date": "2026-03-01",
        "amount":      8900.0,
        "submitted_date": "2026-03-08",
        "review_notes": "All documents verified. Theft confirmed by police report.",
        "user": {
            "full_name": "Michael Chen",
            "email":     "michael.chen@email.com",
            "phone":     "+1 (555) 345-6789",
            "address":   "789 Pine Road, San Francisco, CA 94102",
        },
        "incident_description": (
            "Vehicle stolen from parking garage overnight. "
            "Police report filed the following morning."
        ),
        "documents": [
            {"name": "police-report.pdf",  "doc_type": "Police Report", "size_mb": 1.9, "uploaded_date": "2026-03-08"},
            {"name": "ownership-docs.pdf", "doc_type": "Ownership",     "size_mb": 0.7, "uploaded_date": "2026-03-08"},
        ],
    },
    "CLM-2026-004": {
        "claim_id":    "CLM-2026-004",
        "status":      "rejected",
        "policy_type": "Home Insurance",
        "policy_number": "HOME-2025-7890",
        "incident_type": "Storm Damage",
        "incident_date": "2026-03-07",
        "amount":      3200.0,
        "submitted_date": "2026-03-10",
        "review_notes": "Damage pre-dates policy effective date. Claim not covered.",
        "user": {
            "full_name": "Emily Rodriguez",
            "email":     "emily.rodriguez@email.com",
            "phone":     "+1 (555) 456-7890",
            "address":   "321 Elm Street, Austin, TX 73301",
        },
        "incident_description": (
            "Roof damage and broken windows due to hailstorm. "
            "Contractor assessment and photos submitted."
        ),
        "documents": [
            {"name": "contractor-report.pdf", "doc_type": "Contractor Report", "size_mb": 2.0, "uploaded_date": "2026-03-10"},
            {"name": "hail-damage.jpg",        "doc_type": "Photo",             "size_mb": 1.4, "uploaded_date": "2026-03-10"},
        ],
    },
}


# ---------------------------------------------------------------------------
# Accessor helpers  (used only by claims_service.py)
# ---------------------------------------------------------------------------

def get_all_claims() -> list:
    """Return a shallow copy of all claims as a list."""
    return [deepcopy(c) for c in _MOCK_CLAIMS.values()]


def get_claim_by_id(claim_id: str) -> dict | None:
    claim = _MOCK_CLAIMS.get(claim_id)
    return deepcopy(claim) if claim else None


def update_claim_status(claim_id: str, new_status: str, review_notes: str | None) -> dict | None:
    """Mutate the in-memory store. Replace with a DB UPDATE when ready."""
    if claim_id not in _MOCK_CLAIMS:
        return None
    _MOCK_CLAIMS[claim_id]["status"]       = new_status
    _MOCK_CLAIMS[claim_id]["review_notes"] = review_notes
    return deepcopy(_MOCK_CLAIMS[claim_id])
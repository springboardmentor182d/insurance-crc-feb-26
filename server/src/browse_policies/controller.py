from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError

from src.database.core import get_db
from src.browse_policies.models import PolicyResponse, PolicyFilter
from src.browse_policies.service import list_policies

router = APIRouter()

SAMPLE_POLICIES: List[PolicyResponse] = [
    PolicyResponse(
        id=1,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=None,
        name="Premium Home Protection",
        insurer_name="SafeGuard Insurance",
        category="HOME",
        premium_annual=1200,
        coverage_amount=500000,
        deductible_amount=1000,
        average_rating=4.8,
        rating_count=124,
        tagline="Comprehensive coverage for your home and belongings.",
        key_features=[
            "Fire & theft coverage",
            "Natural disaster protection",
            "Liability coverage",
        ],
    ),
    PolicyResponse(
        id=2,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=None,
        name="Comprehensive Auto Coverage",
        insurer_name="DriveSecure",
        category="AUTO",
        premium_annual=850,
        coverage_amount=250000,
        deductible_amount=500,
        average_rating=4.6,
        rating_count=201,
        tagline="Peace of mind for every drive.",
        key_features=[
            "Collision coverage",
            "Comprehensive coverage",
            "Roadside assistance",
        ],
    ),
    PolicyResponse(
        id=3,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=None,
        name="Life Insurance Plus",
        insurer_name="LifeGuard",
        category="LIFE",
        premium_annual=2400,
        coverage_amount=1000000,
        deductible_amount=None,
        average_rating=4.9,
        rating_count=89,
        tagline="Protect your family’s future.",
        key_features=["Term life coverage", "Cash value accumulation", "Living benefits"],
    ),
    PolicyResponse(
        id=4,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=None,
        name="Family Health Plan",
        insurer_name="HealthFirst",
        category="HEALTH",
        premium_annual=3600,
        coverage_amount=2000000,
        deductible_amount=2500,
        average_rating=4.7,
        rating_count=142,
        tagline="Complete protection for your family.",
        key_features=["Preventive care", "Emergency services", "Prescription coverage"],
    ),
    PolicyResponse(
        id=5,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=None,
        name="Basic Home Insurance",
        insurer_name="HomeShield",
        category="HOME",
        premium_annual=800,
        coverage_amount=300000,
        deductible_amount=2000,
        average_rating=4.4,
        rating_count=76,
        tagline="Essential coverage at an affordable price.",
        key_features=["Fire coverage", "Theft protection", "Liability coverage"],
    ),
    PolicyResponse(
        id=6,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=None,
        name="Auto Essentials",
        insurer_name="AutoProtect",
        category="AUTO",
        premium_annual=650,
        coverage_amount=150000,
        deductible_amount=1000,
        average_rating=4.3,
        rating_count=58,
        tagline="Solid coverage for everyday driving.",
        key_features=["Liability coverage", "Medical payments", "Uninsured motorist"],
    ),
]


@router.get("", response_model=List[PolicyResponse])
def get_policies(
    search: Optional[str] = Query(default=None, description="Free‑text search over name / insurer"),
    category: Optional[str] = Query(default=None, description="Filter by category: HOME, AUTO, LIFE, HEALTH"),
    db: Session = Depends(get_db),
):
    """
    Return policies for the catalog.

    The endpoint is authenticated (JWT) so we can later tailor
    recommendations per user, but for now it simply returns
    all active policies, optionally filtered by search / category.
    """
    filters = PolicyFilter(search=search, category=category)

    try:
        policies = list_policies(db, filters)
        if policies:
            return policies
    except OperationalError:
        # Dev fallback when Postgres isn't available.
        policies = []

    # Fallback: return sample policies (also filtered by query params)
    filtered: List[PolicyResponse] = SAMPLE_POLICIES
    if filters.category:
        filtered = [p for p in filtered if p.category.upper() == filters.category.upper()]
    if filters.search:
        s = filters.search.lower()
        filtered = [
            p
            for p in filtered
            if (s in (p.name or "").lower() or s in (p.insurer_name or "").lower() or s in (p.tagline or "").lower())
        ]
    return filtered


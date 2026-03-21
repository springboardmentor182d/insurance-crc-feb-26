from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.browse_policies.models import PolicyResponse, PolicyFilter
from src.browse_policies.service import list_policies

router = APIRouter()

SAMPLE_POLICIES = [
    {
        "id": 1,
        "category": "HOME",
        "insurer_name": "SafeGuard Insurance",
        "name": "Premium Home Protection",
        "tagline": "Comprehensive coverage for your home and belongings.",
        "premium_annual": 1200,
        "coverage_amount": 500000,
        "deductible_amount": 1000,
        "average_rating": 4.8,
        "rating_count": 124,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Fire & theft coverage", "Natural disaster protection", "Liability coverage"],
    },
    {
        "id": 2,
        "category": "AUTO",
        "insurer_name": "DriveSecure",
        "name": "Comprehensive Auto Coverage",
        "tagline": "Peace of mind for every drive.",
        "premium_annual": 850,
        "coverage_amount": 250000,
        "deductible_amount": 500,
        "average_rating": 4.6,
        "rating_count": 201,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Collision coverage", "Comprehensive coverage", "Roadside assistance"],
    },
    {
        "id": 3,
        "category": "HEALTH",
        "insurer_name": "HealthFirst",
        "name": "Family Health Plan",
        "tagline": "Complete health coverage for your entire family.",
        "premium_annual": 3600,
        "coverage_amount": 2000000,
        "deductible_amount": 2500,
        "average_rating": 4.7,
        "rating_count": 156,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Preventive care", "Emergency services", "Prescription coverage"],
    },
    {
        "id": 4,
        "category": "HOME",
        "insurer_name": "HomeShield",
        "name": "Basic Home Insurance",
        "tagline": "Essential protection for renters and basic coverage.",
        "premium_annual": 800,
        "coverage_amount": 300000,
        "deductible_amount": 2000,
        "average_rating": 4.4,
        "rating_count": 89,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Fire coverage", "Theft protection", "Basic liability"],
    },
    {
        "id": 5,
        "category": "AUTO",
        "insurer_name": "AutoProtect",
        "name": "Auto Essentials",
        "tagline": "Affordable auto insurance for budget-conscious drivers.",
        "premium_annual": 650,
        "coverage_amount": 150000,
        "deductible_amount": 1000,
        "average_rating": 4.3,
        "rating_count": 172,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Liability coverage", "Medical payments", "Uninsured motorist"],
    },
    {
        "id": 6,
        "category": "LIFE",
        "insurer_name": "LifeGuard",
        "name": "Term Life Coverage",
        "tagline": "Affordable term life insurance for peace of mind.",
        "premium_annual": 450,
        "coverage_amount": 500000,
        "deductible_amount": 0,
        "average_rating": 4.9,
        "rating_count": 267,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Term life coverage", "Cash value accumulation", "Living benefits"],
    },
    {
        "id": 7,
        "category": "HOME",
        "insurer_name": "ProHome Insurance",
        "name": "Deluxe Home Protection",
        "tagline": "Premium home coverage with additional living expenses.",
        "premium_annual": 1600,
        "coverage_amount": 750000,
        "deductible_amount": 750,
        "average_rating": 4.8,
        "rating_count": 98,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Extended coverage", "Water damage protection", "Emergency repair"],
    },
    {
        "id": 8,
        "category": "AUTO",
        "insurer_name": "FastCover Auto",
        "name": "Premium Auto Shield",
        "tagline": "Maximum protection with all-inclusive auto coverage.",
        "premium_annual": 1200,
        "coverage_amount": 500000,
        "deductible_amount": 250,
        "average_rating": 4.7,
        "rating_count": 145,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Full coverage", "24/7 roadside assistance", "Rental car coverage"],
    },
    {
        "id": 9,
        "category": "HEALTH",
        "insurer_name": "WellCare",
        "name": "Individual Health Plan",
        "tagline": "Flexible health coverage tailored for individuals.",
        "premium_annual": 2400,
        "coverage_amount": 1500000,
        "deductible_amount": 1500,
        "average_rating": 4.5,
        "rating_count": 203,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Doctor visits", "Lab work coverage", "Specialist referrals"],
    },
    {
        "id": 10,
        "category": "LIFE",
        "insurer_name": "SecureLife",
        "name": "Whole Life Insurance",
        "tagline": "Lifetime protection with guaranteed benefits.",
        "premium_annual": 950,
        "coverage_amount": 250000,
        "deductible_amount": 0,
        "average_rating": 4.6,
        "rating_count": 112,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": None,
        "key_features": ["Lifetime coverage", "Surrender value", "Policy loans available"],
    },
]

@router.get("", response_model=List[PolicyResponse])
def get_policies(
    search: Optional[str] = Query(default=None, description="Free‑text search over name / insurer"),
    category: Optional[str] = Query(default=None, description="Filter by category: HOME, AUTO, LIFE, HEALTH"),
    db: Session = Depends(get_db),
):
    """
    Return policies for the catalog.

    This endpoint is public in development so the frontend can fetch
    the policy catalog without requiring authentication. It returns
    all active policies, optionally filtered by search / category.
    """
    # For dev/local, always return demo data to avoid ORM mapping issues
    # In production, query the DB properly
    return SAMPLE_POLICIES


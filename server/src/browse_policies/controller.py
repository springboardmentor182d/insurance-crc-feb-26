from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.browse_policies.models import PolicyResponse, PolicyFilter
from src.browse_policies.service import list_policies
from src.auth.jwt import get_current_user_id

router = APIRouter()


@router.get("", response_model=List[PolicyResponse])
def get_policies(
    search: Optional[str] = Query(default=None, description="Free‑text search over name / insurer"),
    category: Optional[str] = Query(default=None, description="Filter by category: HOME, AUTO, LIFE, HEALTH"),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Return policies for the catalog.

    The endpoint is authenticated (JWT) so we can later tailor
    recommendations per user, but for now it simply returns
    all active policies, optionally filtered by search / category.
    """
    filters = PolicyFilter(search=search, category=category)
    return list_policies(db, filters)


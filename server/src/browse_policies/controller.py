from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.browse_policies.models import PolicyCatalogResponse, PolicyFilter
from src.browse_policies.service import list_policies
from src.auth.jwt import get_current_user_id

router = APIRouter()


@router.get("", response_model=List[PolicyCatalogResponse])
def get_policies(
    search: Optional[str] = Query(default=None, description="Free‑text search over name / insurer / tagline"),
    category: Optional[str] = Query(default=None, description="Filter by category: HOME, AUTO, LIFE, HEALTH"),
    db: Session = Depends(get_db),
):
    """
    Return all active catalog policies from PostgreSQL (`catalog_policies` table).
    `key_features` is stored as comma-separated text and returned as a list.
    """
    filters = PolicyFilter(search=search, category=category)
    try:
        rows = list_policies(db, filters)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=503,
            detail="Unable to load policies from the database.",
        ) from exc

    return [PolicyCatalogResponse.model_validate(row) for row in rows]

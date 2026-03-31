from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_

from src.entities.BrowsePolicy import BrowsePolicy
from src.browse_policies.models import PolicyFilter


def list_policies(db: Session, filters: Optional[PolicyFilter] = None) -> List[BrowsePolicy]:
    """Return all active browse policies, optionally filtered by search / category."""
    query = db.query(BrowsePolicy).filter(BrowsePolicy.is_active.is_(True))

    if filters:
        if filters.category:
            query = query.filter(BrowsePolicy.category == filters.category.upper())

        if filters.search:
            search_term = f"%{filters.search.lower()}%"
            query = query.filter(
                or_(
                    BrowsePolicy.name.ilike(search_term),
                    BrowsePolicy.insurer_name.ilike(search_term),
                    BrowsePolicy.tagline.ilike(search_term),
                )
            )

    # For the catalog view it is helpful to have a stable ordering
    query = query.order_by(BrowsePolicy.category.asc(), BrowsePolicy.premium_annual.asc())
    return query.all()

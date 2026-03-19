from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.database.core import SessionLocal
from src.policies import service
from src.policies.models import PolicyResponse

router = APIRouter(prefix="/api/policies", tags=["Policies"])


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[PolicyResponse])
def list_all_policies(db: Session = Depends(get_db)):
    """
    Fetch all insurance policies from the catalog.
    """
    return service.get_all_policies(db)


@router.get("/{policy_id}", response_model=PolicyResponse)
def get_policy_details(policy_id: int, db: Session = Depends(get_db)):
    """
    Fetch a single policy by its ID.
    """
    policy = service.get_policy_by_id(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail=f"Policy with id {policy_id} not found")
    return policy

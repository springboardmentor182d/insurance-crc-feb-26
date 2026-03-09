"""
API endpoints for Policy and Recommendation management
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/catalog", tags=["catalog"])


# ============================================================================
# POLICY ENDPOINTS
# ============================================================================

@router.get("/policies", response_model=List[schemas.PolicyResponse])
def get_policies(
    policy_type: str = Query(None, description="Filter by policy type"),
    is_active: bool = Query(True, description="Filter by active status"),
    db: Session = Depends(get_db)
):
    """
    Get all policies with optional filtering by type and active status.
    
    Query Parameters:
    - policy_type: Optional filter (Health, Auto, Life, Home, Travel, etc.)
    - is_active: Filter by active status (default: True)
    """
    query = db.query(models.Policy).filter(models.Policy.is_active == is_active)
    
    if policy_type:
        query = query.filter(models.Policy.policy_type == policy_type)
    
    policies = query.all()
    return policies


@router.get("/policies/{policy_id}", response_model=schemas.PolicyResponse)
def get_policy(policy_id: int, db: Session = Depends(get_db)):
    """Get a single policy by ID"""
    policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id {policy_id} not found"
        )
    
    return policy


@router.post("/policies", response_model=schemas.PolicyResponse)
def create_policy(
    policy: schemas.PolicyCreate,
    db: Session = Depends(get_db)
):
    """Create a new policy"""
    db_policy = models.Policy(**policy.dict())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy


@router.put("/policies/{policy_id}", response_model=schemas.PolicyResponse)
def update_policy(
    policy_id: int,
    policy_update: schemas.PolicyUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing policy"""
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    
    if not db_policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id {policy_id} not found"
        )
    
    update_data = policy_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_policy, field, value)
    
    db.commit()
    db.refresh(db_policy)
    return db_policy


@router.delete("/policies/{policy_id}")
def delete_policy(policy_id: int, db: Session = Depends(get_db)):
    """Delete a policy (soft delete by marking as inactive)"""
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    
    if not db_policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id {policy_id} not found"
        )
    
    db_policy.is_active = False
    db.commit()
    
    return {"message": "Policy deleted successfully"}


@router.get("/policy-types")
def get_policy_types(db: Session = Depends(get_db)):
    """Get all unique policy types"""
    types = db.query(models.Policy.policy_type).distinct().all()
    return {"types": [t[0] for t in types]}


# ============================================================================
# RECOMMENDATION ENDPOINTS
# ============================================================================

@router.get("/recommendations", response_model=schemas.RecommendationListResponse)
def get_recommendations(
    category: str = Query(None, description="Filter by category"),
    top_only: bool = Query(False, description="Show only top recommendations"),
    is_active: bool = Query(True, description="Filter by active status"),
    db: Session = Depends(get_db)
):
    """
    Get all recommendations with optional filtering.
    
    Query Parameters:
    - category: Optional filter (Health, Life, Auto, etc.)
    - top_only: Show only top recommendations (default: False)
    - is_active: Filter by active status (default: True)
    """
    query = db.query(models.Recommendation).filter(models.Recommendation.is_active == is_active)
    
    if category:
        query = query.filter(models.Recommendation.category == category)
    
    if top_only:
        query = query.filter(models.Recommendation.is_top_recommendation == True)
    
    recommendations = query.order_by(models.Recommendation.match_score.desc()).all()
    
    return {
        "recommendations": recommendations,
        "total_count": len(recommendations)
    }


@router.get("/recommendations/{recommendation_id}", response_model=schemas.RecommendationResponse)
def get_recommendation(recommendation_id: int, db: Session = Depends(get_db)):
    """Get a single recommendation by ID"""
    recommendation = db.query(models.Recommendation).filter(
        models.Recommendation.id == recommendation_id
    ).first()
    
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation with id {recommendation_id} not found"
        )
    
    return recommendation


@router.post("/recommendations", response_model=schemas.RecommendationResponse)
def create_recommendation(
    recommendation: schemas.RecommendationCreate,
    db: Session = Depends(get_db)
):
    """Create a new recommendation"""
    db_recommendation = models.Recommendation(**recommendation.dict())
    db.add(db_recommendation)
    db.commit()
    db.refresh(db_recommendation)
    return db_recommendation


@router.put("/recommendations/{recommendation_id}", response_model=schemas.RecommendationResponse)
def update_recommendation(
    recommendation_id: int,
    recommendation_update: schemas.RecommendationUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing recommendation"""
    db_recommendation = db.query(models.Recommendation).filter(
        models.Recommendation.id == recommendation_id
    ).first()
    
    if not db_recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation with id {recommendation_id} not found"
        )
    
    update_data = recommendation_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_recommendation, field, value)
    
    db.commit()
    db.refresh(db_recommendation)
    return db_recommendation


@router.delete("/recommendations/{recommendation_id}")
def delete_recommendation(recommendation_id: int, db: Session = Depends(get_db)):
    """Delete a recommendation (soft delete by marking as inactive)"""
    db_recommendation = db.query(models.Recommendation).filter(
        models.Recommendation.id == recommendation_id
    ).first()
    
    if not db_recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation with id {recommendation_id} not found"
        )
    
    db_recommendation.is_active = False
    db.commit()
    
    return {"message": "Recommendation deleted successfully"}


@router.get("/recommendation-categories")
def get_recommendation_categories(db: Session = Depends(get_db)):
    """Get all unique recommendation categories"""
    categories = db.query(models.Recommendation.category).distinct().all()
    return {"categories": [c[0] for c in categories]}

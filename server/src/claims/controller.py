from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from sqlalchemy import or_
from typing import List
from uuid import uuid4

from src.auth.jwt import get_current_user_id
from src.database.core import get_db
from src.database.admin_dashboard.models.claims import Claim, ClaimStatus
from src.entities.active_policy import ActivePolicy
from src.entities.claim_document import ClaimDocument
from src.storage.document_storage import get_document_storage

# ✅ ROUTER
router = APIRouter(prefix="/claims", tags=["Claims"])


# ✅ STATUS MAP (UI friendly)
def map_status(status):
    if status == "pending":
        return "IN_REVIEW"
    if status == "approved":
        return "APPROVED"
    if status == "paid":
        return "PAID"
    if status == "rejected":
        return "REJECTED"
    return status


# ✅ CREATE CLAIM
@router.post("")
@router.post("/")
def create_claim(
    active_policy_id: int | None = Form(None),
    policy_id: int = Form(...),
    claim_amount: float = Form(...),
    description: str = Form(None),
    files: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    try:
        active_policy = None
        if active_policy_id is not None:
            active_policy = (
                db.query(ActivePolicy)
                .filter(
                    ActivePolicy.id == active_policy_id,
                    ActivePolicy.user_id == current_user_id,
                )
                .first()
            )
            if not active_policy:
                raise HTTPException(status_code=404, detail="Active policy not found")
            if active_policy.status != "ACTIVE":
                raise HTTPException(
                    status_code=400,
                    detail="Claims can only be filed for active policies",
                )
            if active_policy.policy_id is None:
                raise HTTPException(
                    status_code=400,
                    detail="This active policy is not linked to a claimable policy record",
                )
            if active_policy.policy_id != policy_id:
                raise HTTPException(
                    status_code=400,
                    detail="Selected policy does not match the active policy",
                )

        claim = Claim(
            claim_number=f"TEMP-{uuid4().hex}",
            policy_id=policy_id,
            user_id=current_user_id,
            claim_amount=claim_amount,
            description=description,
            status=ClaimStatus.PENDING  # ✅ FIXED
        )

        db.add(claim)
        db.flush()

        # Generate claim number
        claim.claim_number = f"CLM-{datetime.utcnow().year}-{claim.id:05d}"

        # ✅ Copy documents from active_policy to claim (instead of deleting)
        if active_policy is not None:
            for doc in active_policy.documents:
                claim_doc = ClaimDocument(
                    claim_id=claim.id,
                    file_name=doc.file_name,
                    content_type=doc.content_type,
                    file_size=doc.file_size,
                    storage_key=doc.storage_key,
                )
                db.add(claim_doc)
            
            # Delete active policy but keep documents (they're now linked to claim)
            db.delete(active_policy)

        # ✅ Handle file uploads during claim creation
        storage = get_document_storage()
        for file in files:
            try:
                file_content = file.file.read()
                storage_key = f"claim_{claim.id}_{uuid4().hex}_{file.filename}"
                
                # Save file to storage
                file.file.seek(0)  # Reset file pointer
                with open(storage.resolve_path(storage_key), 'wb') as f:
                    f.write(file_content)
                
                claim_doc = ClaimDocument(
                    claim_id=claim.id,
                    file_name=file.filename,
                    content_type=file.content_type or "application/octet-stream",
                    file_size=len(file_content),
                    storage_key=storage_key,
                )
                db.add(claim_doc)
            except Exception as e:
                print(f"Error saving file {file.filename}: {e}")
                # Continue with other files instead of failing

        db.commit()
        db.refresh(claim)

        return {
            "id": claim.id,
            "claim_number": claim.claim_number,
            "status": map_status(claim.status.value if hasattr(claim.status, "value") else claim.status)
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ GET ALL CLAIMS
@router.get("")
@router.get("/")
def get_claims(
    status: str = None,
    search: str = None,
    page: int = 1,
    limit: int = 100,  # ✅ Increased from 10 to 100
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),  # ✅ ADDED authentication
):
    try:
        # ✅ Filter by current user, order by newest claims first
        query = db.query(Claim).filter(
            Claim.user_id == current_user_id  # ✅ Only show own claims
        ).order_by(Claim.submitted_at.desc()).options(  # ✅ Show newest first
            joinedload(Claim.policy),
            joinedload(Claim.adjuster)
        )

        # FILTER
        if status:
            status = status.lower()
            if status == "in_review":
                status = ClaimStatus.PENDING.value
            query = query.filter(Claim.status == status)

        # SEARCH
        if search:
            query = query.filter(
                or_(
                    Claim.claim_number.ilike(f"%{search}%"),
                    Claim.description.ilike(f"%{search}%")
                )
            )

        # PAGINATION
        offset = (page - 1) * limit
        claims = query.offset(offset).limit(limit).all()

        return [
            {
                "id": c.id,
                "claim_number": c.claim_number,
                "claim_amount": float(c.claim_amount),
                "status": map_status(c.status.value if hasattr(c.status, "value") else c.status),
                "submitted_at": c.submitted_at,
                "processed_at": c.processed_at,
                "description": c.description,
                "policy": {
                    "policy_number": c.policy.policy_number if c.policy else None,
                    "policy_type": (
                        c.policy.policy_type.value
                        if c.policy and hasattr(c.policy.policy_type, "value")
                        else c.policy.policy_type if c.policy else None
                    ),
                }
            }
            for c in claims
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ GET SINGLE CLAIM (For ClaimDetails.js - client view)
@router.get("/{claim_id}")
def get_claim_detail(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    """
    Returns full detail for a single claim including documents.
    """
    try:
        claim = (
            db.query(Claim)
            .options(
                joinedload(Claim.policy),
                joinedload(Claim.adjuster),
                joinedload(Claim.documents)  # ✅ Load documents
            )
            .filter(
                Claim.id == claim_id,
                Claim.user_id == current_user_id  # ✅ Only own claims
            )
            .first()
        )

        if not claim:
            raise HTTPException(status_code=404, detail="Claim not found")

        # ✅ Build documents list
        documents = []
        if claim.documents:
            for doc in claim.documents:
                documents.append({
                    "name": doc.file_name,
                    "size_mb": round(doc.file_size / (1024 * 1024), 2),
                    "uploaded_date": doc.created_at.isoformat() if doc.created_at else None,
                    "url": f"/api/v1/documents/{doc.id}/download"  # Download link
                })

        return {
            "id": claim.id,
            "claim_number": claim.claim_number,
            "policy_number": claim.policy.policy_number if claim.policy else None,
            "policy_type": (
                claim.policy.policy_type.value
                if claim.policy and hasattr(claim.policy.policy_type, "value")
                else claim.policy.policy_type if claim.policy else None
            ),
            "claim_amount": float(claim.claim_amount),
            "status": map_status(claim.status.value if hasattr(claim.status, "value") else claim.status),
            "submitted_at": claim.submitted_at.isoformat() if claim.submitted_at else None,
            "incident_date": claim.submitted_at.isoformat() if claim.submitted_at else None,  # ✅ Added for component
            "processed_at": claim.processed_at.isoformat() if claim.processed_at else None,
            "description": claim.description,
            "review_notes": claim.review_notes,  # ✅ For approval/rejection message
            "deductible": None,  # TODO: Get from policy
            "location": None,  # TODO: Get from claim details
            "report_number": None,  # TODO: Get from claim details
            "adjuster": {
                "name": claim.adjuster.name if claim.adjuster else None,
                "email": claim.adjuster.email if claim.adjuster else None,
                "phone": claim.adjuster.phone if claim.adjuster else None,
            } if claim.adjuster else None,
            "fraud_score": claim.fraud_score,
            "documents": documents,  # ✅ Return documents
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

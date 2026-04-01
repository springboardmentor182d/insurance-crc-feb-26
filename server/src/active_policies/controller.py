from datetime import date, timedelta
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.active_policies.models import (
    ActivePoliciesSummary,
    ActivePolicyResponse,
    PolicyDocumentResponse,
)
from src.active_policies.service import list_active_policies, compute_summary, EXPIRING_SOON_DAYS
from src.auth.jwt import get_current_user_id
from src.database.core import get_db
from src.entities.active_policy import ActivePolicy
from src.entities.policy_document import PolicyDocument
from src.storage.document_storage import get_document_storage

router = APIRouter()

MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_DOCUMENT_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
}
ALLOWED_DOCUMENT_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}


class ActivePolicyCreate(BaseModel):
    policy_id: int | None = None
    policy_number: str
    status: str = "ACTIVE"
    category: str
    insurer_name: str
    product_name: str
    premium_annual: float
    coverage_amount: float
    deductible_amount: float | None = None
    start_date: date
    end_date: date
    tags: str | None = None
    warning_text: str | None = None


class ActivePolicyUpdate(BaseModel):
    policy_number: str
    status: str = "ACTIVE"
    category: str
    insurer_name: str
    product_name: str
    premium_annual: float
    coverage_amount: float
    deductible_amount: float | None = None
    start_date: date
    end_date: date
    tags: str | None = None
    warning_text: str | None = None


def _serialize_document(document: PolicyDocument) -> PolicyDocumentResponse:
    return PolicyDocumentResponse.model_validate(document)


def _serialize_policy(policy: ActivePolicy) -> ActivePolicyResponse:
    today = date.today()
    expiring_threshold = today + timedelta(days=EXPIRING_SOON_DAYS)
    is_expiring_soon = (
        policy.end_date is not None and today <= policy.end_date <= expiring_threshold
    )

    return ActivePolicyResponse(
        id=policy.id,
        user_id=policy.user_id,
        policy_id=policy.policy_id,
        policy_number=policy.policy_number,
        status=policy.status,
        category=policy.category,
        insurer_name=policy.insurer_name,
        product_name=policy.product_name,
        premium_annual=policy.premium_annual,
        coverage_amount=policy.coverage_amount,
        deductible_amount=policy.deductible_amount,
        start_date=policy.start_date,
        end_date=policy.end_date,
        tags=policy.tags,
        warning_text=policy.warning_text,
        is_expiring_soon=is_expiring_soon,
        documents=[_serialize_document(document) for document in policy.documents],
        created_at=policy.created_at,
        updated_at=policy.updated_at,
    )


def _get_user_active_policy(db: Session, current_user_id: int, active_policy_id: int) -> ActivePolicy:
    policy = (
        db.query(ActivePolicy)
        .filter(
            ActivePolicy.id == active_policy_id,
            ActivePolicy.user_id == current_user_id,
        )
        .first()
    )
    if not policy:
        raise HTTPException(status_code=404, detail="Active policy not found")
    return policy


def _validate_document(upload: UploadFile) -> None:
    file_name = upload.filename or ""
    file_extension = Path(file_name).suffix.lower()
    content_type = (upload.content_type or "").lower()

    if (
        content_type not in ALLOWED_DOCUMENT_CONTENT_TYPES
        and file_extension not in ALLOWED_DOCUMENT_EXTENSIONS
    ):
        raise HTTPException(
            status_code=400,
            detail=f"{file_name or 'Uploaded file'} must be a PDF, JPG, or PNG document",
        )


@router.get("/active", response_model=List[ActivePolicyResponse])
def get_active_policies(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Return all active policies for the current user."""
    policies = list_active_policies(db, current_user_id)
    return [_serialize_policy(policy) for policy in policies]


@router.get("/active/summary", response_model=ActivePoliciesSummary)
def get_active_policies_summary(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Return aggregate summary data for the current user's active policies."""
    policies = list_active_policies(db, current_user_id)
    return compute_summary(policies)


@router.post("/active/external", response_model=ActivePolicyResponse, status_code=201)
def add_external_policy(
    payload: ActivePolicyCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Create a new external active policy for the current user."""

    # Step 2: Prevent duplicates for this user
    existing_q = db.query(ActivePolicy).filter(
        ActivePolicy.user_id == current_user_id,
        ActivePolicy.status == "ACTIVE",
    )

    if payload.policy_id is not None:
        existing_q = existing_q.filter(ActivePolicy.policy_id == payload.policy_id)
    else:
        existing_q = existing_q.filter(
            ActivePolicy.policy_number == payload.policy_number
        )

    if existing_q.first():
        raise HTTPException(
            status_code=409,
            detail="Policy already exists in your active policies",
        )

    policy = ActivePolicy(
        user_id=current_user_id,
        policy_id=payload.policy_id,
        policy_number=payload.policy_number,
        status=payload.status,
        category=payload.category,
        insurer_name=payload.insurer_name,
        product_name=payload.product_name,
        premium_annual=payload.premium_annual,
        coverage_amount=payload.coverage_amount,
        deductible_amount=payload.deductible_amount,
        start_date=payload.start_date,
        end_date=payload.end_date,
        tags=payload.tags,
        warning_text=payload.warning_text,
    )

    db.add(policy)
    db.commit()
    db.refresh(policy)
    return _serialize_policy(policy)


@router.put("/active/{active_policy_id}", response_model=ActivePolicyResponse)
def update_active_policy(
    active_policy_id: int,
    payload: ActivePolicyUpdate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    policy = _get_user_active_policy(db, current_user_id, active_policy_id)

    duplicate = (
        db.query(ActivePolicy)
        .filter(
            ActivePolicy.user_id == current_user_id,
            ActivePolicy.status == "ACTIVE",
            ActivePolicy.policy_number == payload.policy_number,
            ActivePolicy.id != active_policy_id,
        )
        .first()
    )
    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Another active policy already uses this policy number",
        )

    policy.policy_number = payload.policy_number
    policy.status = payload.status
    policy.category = payload.category
    policy.insurer_name = payload.insurer_name
    policy.product_name = payload.product_name
    policy.premium_annual = payload.premium_annual
    policy.coverage_amount = payload.coverage_amount
    policy.deductible_amount = payload.deductible_amount
    policy.start_date = payload.start_date
    policy.end_date = payload.end_date
    policy.tags = payload.tags
    policy.warning_text = payload.warning_text

    db.commit()
    db.refresh(policy)
    return _serialize_policy(policy)


@router.get(
    "/active/{active_policy_id}/documents",
    response_model=List[PolicyDocumentResponse],
)
def list_policy_documents(
    active_policy_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    policy = _get_user_active_policy(db, current_user_id, active_policy_id)
    documents = (
        db.query(PolicyDocument)
        .filter(PolicyDocument.active_policy_id == policy.id)
        .order_by(PolicyDocument.created_at.desc(), PolicyDocument.id.desc())
        .all()
    )
    return [_serialize_document(document) for document in documents]


@router.post(
    "/active/{active_policy_id}/documents",
    response_model=List[PolicyDocumentResponse],
    status_code=status.HTTP_201_CREATED,
)
def upload_policy_documents(
    active_policy_id: int,
    files: List[UploadFile] = File(...),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    if not files:
        raise HTTPException(status_code=400, detail="At least one document is required")

    policy = _get_user_active_policy(db, current_user_id, active_policy_id)
    storage = get_document_storage()
    saved_storage_keys: list[str] = []
    created_documents: list[PolicyDocument] = []

    try:
        for upload in files:
            _validate_document(upload)
            stored = storage.save_policy_document(active_policy_id=policy.id, upload=upload)
            if stored.file_size > MAX_DOCUMENT_SIZE_BYTES:
                storage.delete(stored.storage_key)
                raise HTTPException(
                    status_code=400,
                    detail=f"{upload.filename or 'Uploaded file'} exceeds the 10MB size limit",
                )

            saved_storage_keys.append(stored.storage_key)
            document = PolicyDocument(
                active_policy_id=policy.id,
                uploaded_by_user_id=current_user_id,
                file_name=upload.filename or "document",
                content_type=(upload.content_type or "application/octet-stream").lower(),
                file_size=stored.file_size,
                storage_provider=stored.provider,
                storage_key=stored.storage_key,
            )
            db.add(document)
            created_documents.append(document)

        db.commit()

        for document in created_documents:
            db.refresh(document)

        return [_serialize_document(document) for document in created_documents]
    except HTTPException:
        db.rollback()
        for storage_key in saved_storage_keys:
            storage.delete(storage_key)
        raise
    except Exception as exc:
        db.rollback()
        for storage_key in saved_storage_keys:
            storage.delete(storage_key)
        raise HTTPException(
            status_code=500,
            detail="Failed to upload policy documents",
        ) from exc


@router.get("/active/{active_policy_id}/documents/{document_id}")
def download_policy_document(
    active_policy_id: int,
    document_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    _get_user_active_policy(db, current_user_id, active_policy_id)
    document = (
        db.query(PolicyDocument)
        .filter(
            PolicyDocument.id == document_id,
            PolicyDocument.active_policy_id == active_policy_id,
        )
        .first()
    )
    if not document:
        raise HTTPException(status_code=404, detail="Policy document not found")

    storage = get_document_storage()
    path = storage.resolve_path(document.storage_key)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Stored policy document is missing")

    return FileResponse(
        path=path,
        media_type=document.content_type,
        filename=document.file_name,
    )


# Step 1: Delete active policy (user can delete own policy only)
@router.delete("/active/{active_policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_active_policy(
    active_policy_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    policy = _get_user_active_policy(db, current_user_id, active_policy_id)
    storage = get_document_storage()
    for document in policy.documents:
        storage.delete(document.storage_key)

    db.delete(policy)
    db.commit()



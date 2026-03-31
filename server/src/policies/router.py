from fastapi import APIRouter
from sqlalchemy.orm import Session
from src.database.core import SessionLocal
from src.entities.policy import PolicyDB
from .schema import Policy

router = APIRouter(prefix="/policy", tags=["Policy"])


# CREATE
@router.post("/")
def create_policy(policy: Policy):
    db: Session = SessionLocal()

    new_policy = PolicyDB(
        name=policy.name,
        company=policy.company,
        price=policy.price,
        coverage=policy.coverage,
        rating=policy.rating,
        category=policy.category,
        deductible=policy.deductible
    )

    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)

    return new_policy


# GET ALL
@router.get("/")
def get_all_policies():
    db: Session = SessionLocal()
    return db.query(PolicyDB).all()


# GET BY ID
@router.get("/{id}")
def get_policy(id: int):
    db: Session = SessionLocal()
    return db.query(PolicyDB).filter(PolicyDB.id == id).first()


# DELETE
@router.delete("/{id}")
def delete_policy(id: int):
    db: Session = SessionLocal()
    policy = db.query(PolicyDB).filter(PolicyDB.id == id).first()

    if policy:
        db.delete(policy)
        db.commit()
        return {"message": "Deleted"}

    return {"error": "Not found"}


# FILTER
@router.get("/category/{category}")
def filter_policy(category: str):
    db: Session = SessionLocal()
    return db.query(PolicyDB).filter(PolicyDB.category == category).all()
from sqlalchemy.orm import Session
from src.entities.policy import Policy


def get_all_policies(db: Session):
    """Retrieve all policies from the database."""
    return db.query(Policy).all()


def get_policy_by_id(db: Session, policy_id: int):
    """Retrieve a single policy by its ID."""
    return db.query(Policy).filter(Policy.id == policy_id).first()


def get_policies_by_category(db: Session, category: str):
    """Retrieve all policies that match a given category."""
    return db.query(Policy).filter(Policy.category == category).all()

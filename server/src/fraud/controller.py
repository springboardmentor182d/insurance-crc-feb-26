from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.core import SessionLocal
from src.fraud.service import (
    get_dashboard,
    get_cases,
    get_rules,
    create_rule,
    update_rule,
    delete_rule,
)
from src.fraud.schemas import DetectionRuleCreate

router = APIRouter(prefix="/fraud", tags=["Fraud"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return get_dashboard(db)


@router.get("/cases")
def fetch_cases(db: Session = Depends(get_db)):
    return get_cases(db)


@router.get("/rules")
def fetch_rules(db: Session = Depends(get_db)):
    return get_rules(db)


@router.post("/rules")
def add_rule(rule: DetectionRuleCreate, db: Session = Depends(get_db)):
    return create_rule(db, rule)


@router.put("/rules/{rule_id}")
def edit_rule(rule_id: str, data: dict, db: Session = Depends(get_db)):
    return update_rule(db, rule_id, data)


@router.delete("/rules/{rule_id}")
def remove_rule(rule_id: str, db: Session = Depends(get_db)):
    return delete_rule(db, rule_id)
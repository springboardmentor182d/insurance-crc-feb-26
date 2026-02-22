from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from datetime import datetime

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# ================= CREATE USER =================
@router.post("/")
def create_user(
    name: str,
    email: str,
    password: str,
    dob: str,
    income: int,
    risk_level: str,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=name.strip(),
        email=email.strip(),
        password=password,
        dob=datetime.strptime(dob.strip(), "%Y-%m-%d"),
        income=income,
        risk_level=risk_level.strip()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "dob": new_user.dob,
        "income": new_user.income,
        "risk_level": new_user.risk_level
    }


# ================= GET ALL USERS =================
@router.get("/")
def get_users(db: Session = Depends(get_db)):

    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "dob": user.dob,
            "income": user.income,
            "risk_level": user.risk_level
        }
        for user in users
    ]


# ================= GET SINGLE USER =================
@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "dob": user.dob,
        "income": user.income,
        "risk_level": user.risk_level,
        "recommended_plan": user.recommended_plan
    }


# ================= UPDATE PREFERENCES =================
@router.put("/{user_id}/preferences")
def update_preferences(
    user_id: int,
    income: int,
    risk_level: str,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # ✅ simple column update (NO JSON)
    user.income = income
    user.risk_level = risk_level.strip()

    db.commit()
    db.refresh(user)

    return {
    "id": user.id,
    "name": user.name,
    "email": user.email,
    "dob": user.dob,
    "income": user.income,
    "risk_level": user.risk_level,
    "recommended_plan": user.recommended_plan
}
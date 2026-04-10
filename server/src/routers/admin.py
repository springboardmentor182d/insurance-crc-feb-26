from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import database
from src.auth import models

router = APIRouter(prefix="/admin", tags=["admin"])


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================
# USERS API (FINAL FIXED)
# ============================
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(models.User).all()

        return [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "status": "active"
            }
            for user in users
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================
# SINGLE USER
# ============================
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(models.User).all()

        return [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "dob": user.dob,
                "income": user.income,
                "risk_level": user.risk_level,
                "insurance_type": user.insurance_type,
                "coverage": user.coverage,
                "status": user.status or "active"
            }
            for user in users
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================
# CREATE USER
# ============================
@router.post("/users")
def create_user(data: dict, db: Session = Depends(get_db)):
    try:
        new_user = models.User(
            name=data.get("name"),
            email=data.get("email")
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "status": "active"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ============================
# UPDATE USER
# ============================
@router.put("/users/{user_id}")
def update_user(user_id: int, data: dict, db: Session = Depends(get_db)):
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)

        db.commit()
        db.refresh(user)

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "status": "active"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ============================
# DELETE USER
# ============================
@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        db.delete(user)
        db.commit()

        return {"message": "User deleted"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
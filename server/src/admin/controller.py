from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.auth.models import RegisterRequest, AdminLogin
from src.admin.service import admin_signup, admin_login

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/signup")
def signup(data: RegisterRequest, db: Session = Depends(get_db)):
    return admin_signup(data, db)


@router.post("/login")
def login(data: AdminLogin, db: Session = Depends(get_db)):
    return admin_login(data, db)
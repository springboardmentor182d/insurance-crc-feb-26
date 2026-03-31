from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.core import get_db
from auth.models import RegisterRequest, LoginRequest, TokenResponse
import auth.service as service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    return service.register(payload, db)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return service.login(payload, db)
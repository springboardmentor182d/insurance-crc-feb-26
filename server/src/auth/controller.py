from fastapi import APIRouter
from .models import LoginRequest
from .service import login_service

router = APIRouter(prefix="/auth")

@router.post("/login")
def login(data: LoginRequest):
    return login_service(data.email)
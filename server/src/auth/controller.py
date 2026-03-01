from fastapi import APIRouter
from .service import login_service

router = APIRouter()

@router.post("/login")
def login(data: dict):
    email = data.get("email")
    return login_service(email)
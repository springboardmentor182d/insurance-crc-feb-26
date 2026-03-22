
from fastapi import APIRouter
from src.users.controller import router as users_router
from src.auth.controller import router as auth_router
from src.fraud.controller import router as fraud_router

router = APIRouter()

router.include_router(users_router)
router.include_router(auth_router)
router.include_router(fraud_router)
 

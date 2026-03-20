from fastapi import APIRouter

from src.admin.dashboard.controller import router as admin_router
from src.admin.manage_policies.controller import router as policies_router
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.active_policies.controller import router as policies_router
from src.active_policies.controller import router as active_policies_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(admin_router)
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(policies_router, prefix="/admin", tags=["Admin Policies"])

from fastapi import APIRouter
from .auth.controller import router as auth_router
from .users.controller import router as users_router
from .todos.controller import router as todos_router
from .policies.controller import router as policies_router


api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth")
api_router.include_router(users_router, prefix="/users")
api_router.include_router(todos_router, prefix="/todos")
api_router.include_router(policies_router, prefix="/policies", tags=["policies"])
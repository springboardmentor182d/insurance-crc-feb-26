from fastapi import APIRouter

from src.active_policies.controller import router as active_policies_router
from src.admin.dashboard.controller import router as admin_router
from src.admin.flagged_claims.controller import router as flagged_claims_router
from src.admin.fraud_rules.controller import router as fraud_rules_router
from src.admin.manage_policies.controller import router as manage_policies_router
from src.auth.controller import router as auth_router
from src.browse_policies.controller import router as browse_policies_router
from src.claims.controller import router as claims_router
from src.users.controller import router as users_router
from src.recommendations.controller import router as recommendations_router  # ⬅ add this
# [web:19]
from src.admin.policy_approvals.controller import router as policy_approvals_router

from src.admin.manage_claims.controller import router as manage_claims_router  # ⬅ add this

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(admin_router)
api_router.include_router(fraud_rules_router)
api_router.include_router(flagged_claims_router)
api_router.include_router(policy_approvals_router,prefix="/admin/policy-approvals", tags=["Policy Approvals"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])

api_router.include_router(manage_policies_router, prefix="/admin", tags=["Admin Policies"])
api_router.include_router(browse_policies_router, prefix="/api/policies", tags=["Policies"])
api_router.include_router(active_policies_router, prefix="/api/policies", tags=["Policies"])
api_router.include_router(claims_router)
api_router.include_router(recommendations_router,prefix="/recommendations",tags=["Recommendations"])
api_router.include_router(manage_claims_router, prefix="/admin/claims", tags=["Admin Claims"])

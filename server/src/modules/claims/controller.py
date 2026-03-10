# Claims controller - handles HTTP requests for insurance claims
from fastapi import APIRouter
from models.claim import ClaimSubmit
from modules.claims.service import submit_claim

# Create a router for claims endpoints
router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("/submit")
async def submit_claim_endpoint(claim: ClaimSubmit):
    """
    Submit a new insurance claim
    
    Args:
        claim: Claim data (policy_number, reason, amount)
        
    Returns:
        Claim confirmation with claim ID
    """
    result = submit_claim(claim.policy_number, claim.reason, claim.amount)
    return result

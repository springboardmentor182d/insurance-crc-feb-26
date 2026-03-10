# Claims service - handles business logic for insurance claims
from datetime import datetime
from models.database import claims_db
import uuid

def submit_claim(policy_number: str, reason: str, amount: float) -> dict:
    """
    Submit a new insurance claim
    
    Args:
        policy_number: The policy number
        reason: Reason for the claim
        amount: Claim amount
        
    Returns:
        Claim confirmation with claim ID
    """
    # Generate unique claim ID
    claim_id = str(uuid.uuid4())[:8].upper()
    
    # Create claim record
    claim = {
        "id": len(claims_db) + 1,
        "claim_id": claim_id,
        "policy_number": policy_number,
        "reason": reason,
        "amount": amount,
        "status": "submitted",
        "created_at": datetime.now()
    }
    
    # Add to database
    claims_db.append(claim)
    
    return {
        "claim_id": claim_id,
        "status": "submitted",
        "message": f"Claim submitted successfully. Claim ID: {claim_id}"
    }

def get_claim_status(claim_id: str) -> dict:
    """
    Get the status of a claim
    
    Args:
        claim_id: The claim ID to check
        
    Returns:
        Claim information or None if not found
    """
    for claim in claims_db:
        if claim["claim_id"] == claim_id:
            return claim
    return None

def get_all_claims() -> list:
    """
    Get all submitted claims
    
    Returns:
        List of all claims
    """
    return claims_db

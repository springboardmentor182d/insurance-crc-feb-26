from sqlalchemy.orm import Session
from .models import Policy, Claim # Imports the models we defined in the previous step

def get_dashboard_summary(db: Session, user_id: int):
    """
    Retrieves and calculates all data required for the BimaVerse dashboard.
    """
    # Fetch all policies and claims associated with the specific user
    policies = db.query(Policy).filter(Policy.user_id == user_id).all()
    claims = db.query(Claim).filter(Claim.user_id == user_id).all()
    
    # Calculate summary metrics for the top dashboard cards
    active_policies_count = len([p for p in policies if p.status == "Active"])
    
    # Logic to handle coverage calculation (example static value to match UI)
    total_coverage = "$2.5M" 
    
    pending_claims_count = len([c for c in claims if c.status == "In Review"])
    resolved_claims_count = len([c for c in claims if c.status == "Approved"])
    
    return {
        "summary": {
            "active_policies": active_policies_count,
            "total_coverage": total_coverage,
            "pending_claims": pending_claims_count,
            "resolved_claims": resolved_claims_count
        },
        "active_policies_list": [
            {
                "name": p.name,
                "category": p.category,
                "renews": p.renewal_date,
                "amount": p.amount,
                "status": p.status
            } for p in policies
        ],
        "recent_claims_list": [
            {
                "id": c.id,
                "category": c.category,
                "description": c.description,
                "date": c.incident_date,
                "amount": c.amount,
                "status": c.status
            } for c in claims
        ]
    }
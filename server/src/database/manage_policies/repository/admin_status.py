from sqlalchemy.orm import Session
from src.database.admin_dashboard.models.claims import Claim

def get_admin_stats_snapshot(db: Session):

    total = db.query(Claim).count()

    pending = db.query(Claim).filter(Claim.status == "pending").count()
    approved = db.query(Claim).filter(Claim.status == "approved").count()
    paid = db.query(Claim).filter(Claim.status == "paid").count()

    return {
        "total_claims": total,
        "pending": pending,
        "approved": approved,
        "paid": paid
    }
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

router = APIRouter(
    prefix="/ai",
    tags=["AI Recommendation"]
)


@router.post("/recommendation")
def generate_recommendation(
    data: dict,
    db: Session = Depends(get_db)
):

    user_id = 1   # later JWT user id
    user = db.query(User).filter(User.id == user_id).first()

    income = int(data.get("income", 0))
    risk = data.get("riskLevel")
    insurance_type = data.get("selectedType")
    policy_for = data.get("selectedFor")

    # ===== AI LOGIC =====
    if insurance_type == "health":
        plan = (
            "Premium Family Health Cover"
            if income >= 500000
            else "Basic Health Shield"
        )
    elif insurance_type == "life":
        plan = "Term Life Protection Plan"
    elif insurance_type == "education":
        plan = "Child Future Secure Plan"
    else:
        plan = "Balanced Insurance Portfolio"

    if risk == "low":
        strategy = "Safe Long-Term Protection"
    elif risk == "medium":
        strategy = "Balanced Growth Coverage"
    else:
        strategy = "High Return Investment Plan"

    # ✅ SAVE PLAN TO USER
    user.recommended_plan = plan
    db.commit()

    return {
        "plan": plan,
        "strategy": strategy,
        "suggested_coverage": income * 10,
        "message": f"Recommended for {policy_for}"
    }
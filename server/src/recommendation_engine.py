from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.models import User
from src.entities.policies_data import policies

print("🔥 NEW AI ROUTE LOADED")

# =========================
# ROUTER
# =========================
router = APIRouter(prefix="/ai", tags=["AI"])


# =========================
# SCHEMA
# =========================
class RecommendationRequest(BaseModel):
    income: int
    risk_level: str
    insurance_type: Optional[str] = None
    policy_for: Optional[str] = None
    medical_condition: Optional[str] = None
    budget: Optional[str] = None


# =========================
# CALCULATIONS
# =========================
def calculate_match(user_age: int, budget: int, policy):
    score = 0

    if policy.premium <= budget:
        score += 40

    if policy.coverage >= 500000:
        score += 30

    score += int(policy.claim_ratio * 30)

    return min(score, 100)


def risk_level(policy):
    if policy.claim_ratio >= 0.95:
        return "Low Risk"
    elif policy.claim_ratio >= 0.90:
        return "Medium Risk"
    else:
        return "High Risk"


# =========================
# MAIN LOGIC
# =========================
def analyze_policies(user_age: int, budget: int):
    results = []

    for policy in policies:
        match = calculate_match(user_age, budget, policy)

        results.append({
            "id": policy.id,
            "category": policy.category,
            "title": policy.title,
            "provider": policy.provider,
            "coverage_value": policy.coverage,  # 🔥 numeric (important)
            "coverage": f"₹{policy.coverage/100000:.1f}L",
            "premium": f"₹{policy.premium}",
            "claimRatio": f"{int(policy.claim_ratio*100)}%",
            "risk": risk_level(policy),
            "match": match,
            "why": "Best match based on budget & claim ratio",
            "features": policy.features
        })

    results.sort(key=lambda x: x["match"], reverse=True)

    return results


# =========================
# API ROUTE (FINAL)
# =========================
@router.post("/recommendation")
def recommend(data: RecommendationRequest, db: Session = Depends(get_db)):
    try:
        income = data.income

        if income == 0:
            return {"error": "Income missing"}

        # 🎯 Convert income → budget
        budget = int(income * 0.1)

        # 🎯 Get best policy
        results = analyze_policies(user_age=30, budget=budget)
        best = results[0]

        # =========================
        # 🔥 SAVE TO DATABASE (IMPORTANT)
        # =========================
        user = db.query(User).filter(User.id == 1).first()

        if user:
            user.recommended_plan = best["title"]
            user.coverage = best["coverage_value"] 
            user.income = income
            user.risk_level = data.risk_level
            user.insurance_type = data.insurance_type

            db.commit()

        # =========================
        # RESPONSE
        # =========================
        return {
            "plan": best["title"],
            "provider": best["provider"],
            "coverage": best["coverage_value"],  # 🔥 numeric
            "premium": best["premium"],
            "risk": best["risk"],
            "match_score": best["match"]
        }

    except Exception as e:
        return {"error": str(e)}
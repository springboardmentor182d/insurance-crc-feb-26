from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/recommendation")
def generate_recommendation(data: dict):
    try:
        # =========================
        # 1. Extract Inputs
        # =========================
        selected_for = data.get("selectedFor", "myself")
        selected_type = data.get("selectedType", "general")
        risk = data.get("riskLevel", "medium")
        income = data.get("income", 0)

        # =========================
        # 2. Validate Input
        # =========================
        if income is None:
            income = 0

        income = int(income)

        # =========================
        # 3. AI Logic (Rule-based)
        # =========================
        if risk == "low":
            plan = "Safe Insurance Plan"
            strategy = "Focus on stability and low-risk coverage"
            coverage_multiplier = 5

        elif risk == "medium":
            plan = "Balanced Insurance Portfolio"
            strategy = "Balance between protection and growth"
            coverage_multiplier = 10

        elif risk == "high":
            plan = "High Growth Insurance Plan"
            strategy = "Higher returns with higher risk coverage"
            coverage_multiplier = 15

        else:
            plan = "Standard Insurance Plan"
            strategy = "General protection plan"
            coverage_multiplier = 8

        # =========================
        # 4. Coverage Calculation
        # =========================
        suggested_coverage = income * coverage_multiplier if income > 0 else 500000

        # =========================
        # 5. Response
        # =========================
        return {
            "plan": plan,
            "strategy": f"{strategy} for {selected_type} insurance ({selected_for})",
            "suggested_coverage": suggested_coverage,
            "message": "This plan is customized based on your risk profile and income"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
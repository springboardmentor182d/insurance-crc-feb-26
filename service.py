# Recommendation service - handles business logic for insurance recommendations
from models.database import insurance_plans

def get_recommendation(age: int, budget: float) -> dict:
    """
    Get insurance recommendation based on age and budget
    
    Logic:
    - Age < 30: Basic Plan (cheapest)
    - Age 30-50: Standard Plan (mid-tier)
    - Age > 50: Premium Plan (best coverage)
    
    Also considers budget constraints
    
    Args:
        age: User's age
        budget: User's monthly budget
        
    Returns:
        Recommended insurance plan
    """
    # Determine plan based on age
    if age < 30:
        recommended_plan_id = 1  # Basic Plan
    elif age <= 50:
        recommended_plan_id = 2  # Standard Plan
    else:
        recommended_plan_id = 3  # Premium Plan
    
    # Get the recommended plan
    for plan in insurance_plans:
        if plan["id"] == recommended_plan_id:
            # Check if plan price is within budget
            if plan["price"] <= budget:
                return plan
            
            # If price exceeds budget, recommend the most affordable plan within budget
            for plan in insurance_plans:
                if plan["price"] <= budget:
                    return plan
            
            # If no plan is within budget, return the cheapest plan
            return min(insurance_plans, key=lambda x: x["price"])
    
    return insurance_plans[0]  # Fallback to first plan

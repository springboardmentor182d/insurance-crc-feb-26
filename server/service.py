
from models.database import insurance_plans

def get_recommendation(age: int, budget: float) -> dict:
    
    if age < 30:
        recommended_plan_id = 1  
    elif age <= 50:
        recommended_plan_id = 2  
    else:
        recommended_plan_id = 3  
    
    
    for plan in insurance_plans:
        if plan["id"] == recommended_plan_id:t
            if plan["price"] <= budget:
                return plan
            
            
            for plan in insurance_plans:
                if plan["price"] <= budget:
                    return plan
           
            return min(insurance_plans, key=lambda x: x["price"])
    
    return insurance_plans[0]  

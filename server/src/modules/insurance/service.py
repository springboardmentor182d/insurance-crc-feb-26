# Insurance service - handles business logic for insurance operations
from models.database import insurance_plans
from models.insurance import InsurancePlan

def get_all_plans() -> list:
    """
    Get all insurance plans
    
    Returns:
        List of all insurance plans
    """
    return insurance_plans

def get_plan_by_id(plan_id: int) -> dict:
    """
    Get a specific insurance plan by ID
    
    Args:
        plan_id: The ID of the plan
        
    Returns:
        The insurance plan or None if not found
    """
    for plan in insurance_plans:
        if plan["id"] == plan_id:
            return plan
    return None

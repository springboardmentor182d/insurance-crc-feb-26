from fastapi import APIRouter
from .service import get_policies

router = APIRouter()

@router.get("/")
def list_policies():
    return get_policies()

@router.get("/{policy_id}")
def get_policy(policy_id: int):
    policies = get_policies()
    if policy_id < 0 or policy_id >= len(policies):
        raise HTTPException(status_code=404, detail="Policy not found")
    return policies[policy_id]

@router.post("/compare")
def compare_policies(ids: list[int]):
    policies = get_policies()
    selected = []
    for i in ids:
        if i < 0 or i >= len(policies):
            raise HTTPException(status_code=404, detail=f"Policy {i} not found")
        selected.append(policies[i])
    return selected

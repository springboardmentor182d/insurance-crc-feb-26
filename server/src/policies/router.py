from fastapi import APIRouter
from .schema import Policy, CompareRequest
from .service import policies, create_policy_service

router = APIRouter(prefix="/policy", tags=["Policy"])


@router.post("/")
def create_policy(policy: Policy):
    return create_policy_service(policy)


@router.get("/")
def get_all_policies():
    return policies


@router.get("/{id}")
def get_policy(id: int):
    for p in policies:
        if p["id"] == id:
            return p
    return {"error": "Policy not found"}


@router.put("/{id}")
def update_policy(id: int, policy: Policy):
    for p in policies:
        if p["id"] == id:
            p.update(policy.dict())
            return {"message": "Policy updated", "data": p}
    return {"error": "Policy not found"}


@router.delete("/{id}")
def delete_policy(id: int):
    for p in policies:
        if p["id"] == id:
            policies.remove(p)
            return {"message": "Policy deleted"}
    return {"error": "Policy not found"}


@router.get("/category/{category}")
def filter_policy(category: str):
    return [p for p in policies if p["category"].lower() == category.lower()]


@router.post("/compare")
def compare_policies(request: CompareRequest):
    return [p for p in policies if p["id"] in request.ids]
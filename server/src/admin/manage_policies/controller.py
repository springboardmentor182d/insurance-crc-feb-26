from fastapi import APIRouter, HTTPException

from .service import (
    get_policy_stats,
    get_policies,
    get_policy_by_id,
    create_policy,
    update_policy,
    delete_policy,
)

from .models.policy_stats import PolicyStatsResponse
from .models.policy_item import PoliciesListResponse
from .models.policy_details import PolicyDetailsResponse
from .models.policy_create import CreatePolicyRequest
from .models.policy_update import UpdatePolicyRequest

router = APIRouter()


@router.get("/policies/stats", response_model=PolicyStatsResponse)
def policy_stats():
    stats = get_policy_stats()
    return {"data": stats}


@router.get("/policies", response_model=PoliciesListResponse)
def list_policies():
    policies = get_policies()
    return {"data": policies}


@router.get("/policies/{policy_id}", response_model=PolicyDetailsResponse)
def policy_details(policy_id: int):
    try:
        policy = get_policy_by_id(policy_id)
    except LookupError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return {"data": policy}


@router.post("/policies", response_model=PolicyDetailsResponse)
def create_new_policy(data: CreatePolicyRequest):
    policy = create_policy(data)
    return {"data": policy}


@router.put("/policies/{policy_id}", response_model=PolicyDetailsResponse)
def update_existing_policy(policy_id: int, data: UpdatePolicyRequest):
    try:
        policy = update_policy(policy_id, data)
    except LookupError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return {"data": policy}


@router.delete("/policies/{policy_id}")
def delete_existing_policy(policy_id: int):
    try:
        delete_policy(policy_id)
    except LookupError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return {"message": "Policy deleted successfully"}

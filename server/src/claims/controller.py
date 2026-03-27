# controller.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/submit-claim")
async def submit_claim(claim_data: dict):
    return {"message": "Claim submitted successfully!"}

@router.get("/get-claims")
async def get_claims():
    return []
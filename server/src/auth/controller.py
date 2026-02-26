from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
def login():
    return {"message": "Login successful"}

@router.post("/signup")
def signup():
    return {"message": "Signup successful"}

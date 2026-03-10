from fastapi import APIRouter
from .service import get_recommendations

router = APIRouter()

@router.get("/recommendations")

def recommendations():

    return get_recommendations()
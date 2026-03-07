from fastapi import APIRouter
from fastapi.responses import RedirectResponse

router = APIRouter()


@router.get("/auth/google")
def google_login():

    google_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?client_id=YOUR_GOOGLE_CLIENT_ID"
        "&response_type=code"
        "&scope=openid email profile"
        "&redirect_uri=http://127.0.0.1:8000/auth/google/callback"
    )

    return RedirectResponse(google_url)
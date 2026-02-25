from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/auth/google")
def google_login():
    return RedirectResponse(
        "https://accounts.google.com/o/oauth2/v2/auth?"
        "client_id=YOUR_GOOGLE_CLIENT_ID"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        "&redirect_uri=http://localhost:8000/auth/google/callback"
    )

@app.get("/auth/google/callback")
def google_callback(code: str):
    return {"message": "Google login successful", "code": code}

@app.post("/auth/phone")
def phone_login(phone: str):
    return {"message": f"OTP sent to {phone}"}
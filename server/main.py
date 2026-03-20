from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.get("/dashboard")
def dashboard():
    return {
        "totalUsers": 12458,
        "totalPolicies": 8234,
        "pendingClaims": 342,
        "approvedClaims": 1847,
        "underReview": 80,
        "rejected": 30,
        "approved": 95,
        "distribution": [
            {"label": "Health Insurance", "value": 38, "color": "#3b82f6"},
            {"label": "Life Insurance", "value": 26, "color": "#10b981"},
            {"label": "Auto Insurance", "value": 22, "color": "#f59e0b"},
            {"label": "Home Insurance", "value": 14, "color": "#8b5cf6"},
        ],
        "alerts": [
            {"text": "15 claims require immediate review", "color": "bg-orange-50", "border": "border-orange-200"},
            {"text": "Fraud detection alert: Claim #CL-8734", "color": "bg-red-50", "border": "border-red-200"},
            {"text": "3 policies expiring in next 7 days", "color": "bg-yellow-50", "border": "border-yellow-200"},
        ],
        "activity": [
            {"text": "Claim #CL-8743 submitted by John Doe", "time": "5 min ago"},
            {"text": "Policy #POL-2341 activated for Sarah Miller", "time": "12 min ago"},
            {"text": "Claim #CL-8721 approved - $2,500", "time": "23 min ago"},
            {"text": "New user registration: Mike Johnson", "time": "35 min ago"},
            {"text": "Claim #CL-8698 rejected - insufficient documentation", "time": "1 hour ago"},
            {"text": "Policy #POL-2298 renewed by Emma Wilson", "time": "2 hours ago"},
        ],
    }

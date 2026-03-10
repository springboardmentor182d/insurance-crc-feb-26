from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# USER MODEL
# ---------------------------

class UserProfile(BaseModel):
    age: int
    income: float
    vehicle_owner: bool
    family_members: int
    frequent_traveler: bool
    health_issues: bool


# ---------------------------
# POLICY DATABASE (Screenshot Exact)
# ---------------------------

policies = [
    {
        "id": 1,
        "title": "Health Insurance Plus",
        "company": "HealthGuard Insurance",
        "coverage": "$120,000",
        "premium": "$280/month",
        "base_premium": 280,
        "type": "health",
        "features": [
            "Covers pre-existing conditions",
            "No waiting period",
            "Dental and vision included",
            "Free annual checkup"
        ]
    },
    {
        "id": 2,
        "title": "AutoSecure Premium",
        "company": "AutoSecure Insurance",
        "coverage": "$60,000",
        "premium": "$140/month",
        "base_premium": 140,
        "type": "auto",
        "features": [
            "Zero depreciation coverage",
            "Quick claim settlement",
            "24/7 roadside assistance",
            "Engine protection"
        ]
    },
    {
        "id": 3,
        "title": "Life Protection Elite",
        "company": "LifeSecure Assurance",
        "coverage": "$600,000",
        "premium": "$180/month",
        "base_premium": 180,
        "type": "life",
        "features": [
            "Term life coverage",
            "Accidental death benefit",
            "Critical illness rider",
            "Tax savings benefits"
        ]
    },
    {
        "id": 4,
        "title": "Travel Safe Global",
        "company": "TravelSafe Insurance",
        "coverage": "$50,000",
        "premium": "$60/month",
        "base_premium": 60,
        "type": "travel",
        "features": [
            "Worldwide coverage",
            "Medical emergency",
            "Trip cancellation",
            "Lost baggage protection"
        ]
    }
]


# ---------------------------
# AI LOGIC (Match % + Reason)
# ---------------------------

def calculate_score(user, policy):

    score = 50
    reason = "Recommended based on your profile."

    if policy["type"] == "health":
        if user.health_issues:
            score += 25
            reason = "Best match for your health condition."
        if user.age > 40:
            score += 10

    if policy["type"] == "auto":
        if user.vehicle_owner:
            score += 30
            reason = "Perfect for vehicle owners."

    if policy["type"] == "life":
        if user.family_members > 2:
            score += 20
            reason = "Ideal for protecting your family."
        if user.income > 50000:
            score += 15

    if policy["type"] == "travel":
        if user.frequent_traveler:
            score += 30
            reason = "Great for frequent travelers."

    return min(score, 99), reason


# ---------------------------
# ROUTES
# ---------------------------

@app.get("/")
def home():
    return {"message": "Insurance Recommendation API Running"}


@app.post("/recommendations")
def get_recommendations(user: UserProfile):

    results = []

    for policy in policies:
        score, reason = calculate_score(user, policy)

        yearly_savings = int(policy["base_premium"] * 12 * 0.10)

        results.append({
            "id": policy["id"],
            "title": policy["title"],
            "company": policy["company"],
            "match_percentage": f"{score}%",
            "coverage_amount": policy["coverage"],
            "monthly_premium": policy["premium"],
            "estimated_savings": f"${yearly_savings}/year",
            "reason": reason,
            "features": policy["features"]
        })

    results.sort(key=lambda x: int(x["match_percentage"].replace("%","")), reverse=True)

    return {
        "hero_title": "✨ Personalized for You",
        "hero_subtitle": "Our AI has analyzed your profile and found the best insurance policies tailored to your needs.",
        "badges": [
            "🛡️ Based on your profile",
            "📈 Updated daily",
            "💲 Best value options"
        ],
        "recommendations": results
    }
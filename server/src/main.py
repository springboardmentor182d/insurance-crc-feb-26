from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Profile(BaseModel):
    name: str
    age: str
    occupation: str
    location: str
    coverage: List[str]


class Recommendation(BaseModel):
    icon: str
    accent: str
    category: str
    title: str
    description: str
    score: str
    scoreLabel: str
    policyLabel: str
    policyName: str
    provider: str
    premium: str
    coverage: str
    highlight: str
    reasons: List[str]


class StepItem(BaseModel):
    number: str
    title: str
    text: str


class DashboardResponse(BaseModel):
    profile: Profile
    tabs: List[str]
    recommendations: List[Recommendation]
    steps: List[StepItem]


app = FastAPI(title="BimaVerse AI Recommendations API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


dashboard_payload = DashboardResponse(
    profile=Profile(
        name="John Doe",
        age="35 years",
        occupation="Software Engineer",
        location="New York, NY",
        coverage=["Home Insurance", "Auto Insurance", "Life Insurance"],
    ),
    tabs=[
        "All Recommendations",
        "High Priority",
        "Cost Savings",
        "Coverage Upgrades",
        "Additional Coverage",
    ],
    recommendations=[
        Recommendation(
            icon="heart",
            accent="health",
            category="High Priority",
            title="Health Insurance Coverage Gap",
            description="Based on your profile, we noticed you don't have health insurance. This is critical for comprehensive protection.",
            score="95%",
            scoreLabel="Match",
            policyLabel="Recommended Policy",
            policyName="Family Health Plan",
            provider="HealthFirst",
            premium="$3600/year",
            coverage="$2,000,000",
            highlight="Up to 15% discount for new customers",
            reasons=[
                "Age-appropriate coverage",
                "Covers pre-existing conditions",
                "Includes preventive care",
                "Family coverage available",
            ],
        ),
        Recommendation(
            icon="car",
            accent="auto",
            category="Cost Savings",
            title="Save on Auto Insurance",
            description="We found a comparable auto policy that could save you $200/year while maintaining similar coverage.",
            score="88%",
            scoreLabel="Match",
            policyLabel="Recommended Policy",
            policyName="Auto Comprehensive Plus",
            provider="DriveSecure",
            premium="$850/year",
            coverage="$250,000",
            highlight="$200/year compared to current policy",
            reasons=[
                "Same coverage limits",
                "Better claim satisfaction rating",
                "Includes roadside assistance",
                "Lower deductible options",
            ],
        ),
        Recommendation(
            icon="shield",
            accent="life",
            category="Coverage Upgrades",
            title="Increase Life Insurance Coverage",
            description="Your current life insurance may be insufficient. Consider increasing coverage to match your income.",
            score="82%",
            scoreLabel="Match",
            policyLabel="Recommended Policy",
            policyName="Life Insurance Premium",
            provider="LifeGuard",
            premium="$2800/year",
            coverage="$1,500,000",
            highlight="Better value per $100k coverage",
            reasons=[
                "Matches 10x annual income rule",
                "Cash value accumulation",
                "Living benefits included",
                "Premium guaranteed for 20 years",
            ],
        ),
        Recommendation(
            icon="briefcase",
            accent="disability",
            category="Additional Coverage",
            title="Consider Disability Insurance",
            description="Protect your income in case of illness or injury. Essential for primary earners.",
            score="78%",
            scoreLabel="Match",
            policyLabel="Recommended Policy",
            policyName="Income Protection Plan",
            provider="SecureIncome",
            premium="$1200/year",
            coverage="60% of income",
            highlight="Tax-free benefits",
            reasons=[
                "Covers up to 60% of income",
                "Short and long-term options",
                "Covers partial disability",
                "No waiting period for accidents",
            ],
        ),
    ],
    steps=[
        StepItem(
            number="1",
            title="Analyze Your Profile",
            text="Our AI analyzes your age, location, occupation, and current coverage.",
        ),
        StepItem(
            number="2",
            title="Match Policies",
            text="Compare thousands of policies to find the best matches for your needs.",
        ),
        StepItem(
            number="3",
            title="Personalized Results",
            text="Get tailored recommendations with match scores and savings potential.",
        ),
    ],
)


@app.get("/")
def read_root():
    return {
        "message": "BimaVerse FastAPI backend is running",
        "endpoint": "/api/recommendations",
    }


@app.get("/api/recommendations", response_model=DashboardResponse)
def get_recommendations():
    return dashboard_payload

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .routers.admin import router as admin_router
from .routers.catalog import router as catalog_router
from . import database, models
from sqlalchemy.orm import Session

# Load environment variables
load_dotenv()

# Initialize database
database.init_db()

app = FastAPI(
    title="Insurance CRC Management API",
    description="Comprehensive insurance management system with admin dashboard",
    version="1.0.0"
)

# Configure CORS with environment-specific origins
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def populate_sample_data():
    """Populate database with realistic insurance data on first startup"""
    db = database.SessionLocal()
    try:
        # Check if data already exists
        if db.query(models.User).count() > 0:
            print("✓ Database already contains data, skipping population")
            return
        
        # Add realistic insurance policyholders
        users = [
            {"name": "Rajesh Kumar", "email": "rajesh.kumar@email.com", "status": "Active"},
            {"name": "Priya Singh", "email": "priya.singh@email.com", "status": "Active"},
            {"name": "Amit Patel", "email": "amit.patel@email.com", "status": "Active"},
            {"name": "Neha Sharma", "email": "neha.sharma@email.com", "status": "Inactive"},
            {"name": "Vikram Desai", "email": "vikram.desai@email.com", "status": "Active"},
            {"name": "Anjali Reddy", "email": "anjali.reddy@email.com", "status": "Active"},
            {"name": "Sanjay Gupta", "email": "sanjay.gupta@email.com", "status": "Active"},
            {"name": "Kavita Iyer", "email": "kavita.iyer@email.com", "status": "Active"},
            {"name": "Rahul Mehta", "email": "rahul.mehta@email.com", "status": "Active"},
            {"name": "Deepa Nair", "email": "deepa.nair@email.com", "status": "Inactive"},
        ]
        
        for user_data in users:
            user = models.User(**user_data)
            db.add(user)
        
        # Add realistic fraud detection rules
        fraud_rules = [
            {
                "name": "Multiple Claims Same Period",
                "description": "Flags policyholders submitting multiple high-value claims within 30 days",
                "priority": "High",
                "status": "Active"
            },
            {
                "name": "Claim Amount Exceeds Policy Limit",
                "description": "Detects claims where requested amount is significantly higher than policy coverage",
                "priority": "High",
                "status": "Active"
            },
            {
                "name": "Suspicious Medical Bills",
                "description": "Identifies medical claims with unusual billing patterns or unverified providers",
                "priority": "Medium",
                "status": "Active"
            },
            {
                "name": "Vehicle Damage Inconsistency",
                "description": "Checks if reported vehicle damage matches accident description",
                "priority": "High",
                "status": "Active"
            },
            {
                "name": "Pre-existing Condition Claim",
                "description": "Flags health insurance claims for conditions that existed before policy activation",
                "priority": "Medium",
                "status": "Active"
            },
            {
                "name": "Document Forgery Detection",
                "description": "Uses AI to detect forged or manipulated claim documents and receipts",
                "priority": "High",
                "status": "Active"
            },
            {
                "name": "Sudden Death Claims",
                "description": "Investigates life insurance claims within the first 2 years of policy activation",
                "priority": "Medium",
                "status": "Active"
            },
            {
                "name": "Inconsistent Information",
                "description": "Compares claim details with policyholder profile data",
                "priority": "Medium",
                "status": "Active"
            },
            {
                "name": "Claim Duplication",
                "description": "Detects if same claim has been submitted multiple times",
                "priority": "High",
                "status": "Active"
            },
            {
                "name": "Network Analysis",
                "description": "Identifies networks of related policies with suspicious claim patterns",
                "priority": "Medium",
                "status": "Active"
            },
        ]
        
        for rule_data in fraud_rules:
            rule = models.FraudRule(**rule_data)
            db.add(rule)
        
        # Add insurance policies to database
        policies = [
            {
                "name": "Comprehensive Health Shield",
                "provider": "HealthFirst Insurance",
                "policy_type": "Health",
                "coverage": "₹5.0L",
                "premium": "₹15,000/yr",
                "claim_ratio": "95%",
                "description": "Comprehensive health coverage for individuals",
                "is_active": True
            },
            {
                "name": "Family Health Plus",
                "provider": "StarCare Insurance",
                "policy_type": "Health",
                "coverage": "₹10.0L",
                "premium": "₹25,000/yr",
                "claim_ratio": "92%",
                "description": "Health coverage for entire family",
                "is_active": True
            },
            {
                "name": "Smart Drive Insurance",
                "provider": "AutoSecure",
                "policy_type": "Auto",
                "coverage": "₹3.0L",
                "premium": "₹8,000/yr",
                "claim_ratio": "88%",
                "description": "Comprehensive auto insurance coverage",
                "is_active": True
            },
            {
                "name": "Life Guard Premium",
                "provider": "LifeSecure Insurance",
                "policy_type": "Life",
                "coverage": "₹20.0L",
                "premium": "₹30,000/yr",
                "claim_ratio": "98%",
                "description": "Premium life insurance with guaranteed benefits",
                "is_active": True
            },
            {
                "name": "Home Protection Plan",
                "provider": "HomeSafe Insurance",
                "policy_type": "Home",
                "coverage": "₹50.0L",
                "premium": "₹12,000/yr",
                "claim_ratio": "90%",
                "description": "Complete home and property protection",
                "is_active": True
            },
        ]
        
        for policy_data in policies:
            policy = models.Policy(**policy_data)
            db.add(policy)
        
        # Add insurance recommendations
        recommendations = [
            {
                "category": "Health",
                "title": "Comprehensive Health Shield",
                "provider": "HealthFirst Insurance",
                "match_score": 95.0,
                "coverage": "₹5.0L",
                "premium": "₹15,000/yr",
                "claim_ratio": "95%",
                "risk_level": "Low",
                "why": "Best match for your age group and health profile.",
                "family_health": "Provides extensive coverage for hereditary heart conditions noted in your history.",
                "is_top_recommendation": True,
                "is_active": True
            },
            {
                "category": "Health",
                "title": "Senior Citizen Care",
                "provider": "ElderCare Insurance",
                "match_score": 82.0,
                "coverage": "₹7.5L",
                "premium": "₹20,000/yr",
                "claim_ratio": "94%",
                "risk_level": "Medium",
                "why": "Ideal for senior citizens with pre-existing conditions.",
                "family_health": "Covers age-related chronic issues common in your family history.",
                "is_top_recommendation": False,
                "is_active": True
            },
            {
                "category": "Life",
                "title": "Life Guard Premium",
                "provider": "LifeSecure Insurance",
                "match_score": 78.0,
                "coverage": "₹20.0L",
                "premium": "₹30,000/yr",
                "claim_ratio": "98%",
                "risk_level": "Low",
                "why": "Long-term security with high coverage.",
                "family_health": "Tailored protection based on genetic risk assessment.",
                "is_top_recommendation": False,
                "is_active": True
            },
        ]
        
        for rec_data in recommendations:
            recommendation = models.Recommendation(**rec_data)
            db.add(recommendation)
        
        # Add insurance claims
        claims = [
            {
                "claim_id": "ICRC-2026-001",
                "claimant": "Rajesh Kumar",
                "amount": "₹45,000",
                "status": "Approved",
                "date": "Feb 10, 2026",
                "claim_type": "Health Insurance",
                "priority": "Low"
            },
            {
                "claim_id": "ICRC-2026-002",
                "claimant": "Priya Singh",
                "amount": "₹1,20,000",
                "status": "Pending",
                "date": "Feb 20, 2026",
                "claim_type": "Auto Insurance",
                "priority": "Medium"
            },
            {
                "claim_id": "ICRC-2026-003",
                "claimant": "Amit Patel",
                "amount": "₹78,900",
                "status": "Approved",
                "date": "Feb 08, 2026",
                "claim_type": "Health Insurance",
                "priority": "Low"
            },
            {
                "claim_id": "ICRC-2026-004",
                "claimant": "Neha Sharma",
                "amount": "₹2,50,000",
                "status": "Under Review",
                "date": "Feb 22, 2026",
                "claim_type": "Life Insurance",
                "priority": "High"
            },
            {
                "claim_id": "ICRC-2026-005",
                "claimant": "Vikram Desai",
                "amount": "₹65,500",
                "status": "Rejected",
                "date": "Feb 18, 2026",
                "claim_type": "Auto Insurance",
                "priority": "Medium"
            },
            {
                "claim_id": "ICRC-2026-006",
                "claimant": "Anjali Reddy",
                "amount": "₹95,000",
                "status": "Approved",
                "date": "Feb 12, 2026",
                "claim_type": "Health Insurance",
                "priority": "Low"
            },
            {
                "claim_id": "ICRC-2026-007",
                "claimant": "Sanjay Gupta",
                "amount": "₹3,50,000",
                "status": "Under Review",
                "date": "Feb 23, 2026",
                "claim_type": "Property Insurance",
                "priority": "High"
            },
            {
                "claim_id": "ICRC-2026-008",
                "claimant": "Kavita Iyer",
                "amount": "₹35,200",
                "status": "Approved",
                "date": "Feb 05, 2026",
                "claim_type": "Health Insurance",
                "priority": "Low"
            },
            {
                "claim_id": "ICRC-2026-009",
                "claimant": "Rahul Mehta",
                "amount": "₹4,50,000",
                "status": "Under Review",
                "date": "Feb 24, 2026",
                "claim_type": "Property Insurance",
                "priority": "High"
            },
            {
                "claim_id": "ICRC-2026-010",
                "claimant": "Deepa Nair",
                "amount": "₹18,500",
                "status": "Rejected",
                "date": "Feb 14, 2026",
                "claim_type": "Travel Insurance",
                "priority": "Low"
            },
            {
                "claim_id": "ICRC-2026-011",
                "claimant": "Rajesh Kumar",
                "amount": "₹92,000",
                "status": "Pending",
                "date": "Feb 25, 2026",
                "claim_type": "Health Insurance",
                "priority": "Medium"
            },
            {
                "claim_id": "ICRC-2026-012",
                "claimant": "Priya Singh",
                "amount": "₹1,75,000",
                "status": "Approved",
                "date": "Feb 03, 2026",
                "claim_type": "Auto Insurance",
                "priority": "High"
            },
        ]
        
        for claim_data in claims:
            claim = models.Claim(**claim_data)
            db.add(claim)
        
        # Add analytics data (monthly claim statistics)
        analytics_data = [
            {"month": "Jan", "claims": 78},
            {"month": "Feb", "claims": 65},
            {"month": "Mar", "claims": 82},
            {"month": "Apr", "claims": 71},
            {"month": "May", "claims": 89},
            {"month": "Jun", "claims": 76},
        ]
        
        for data in analytics_data:
            stat = models.ClaimStats(**data)
            db.add(stat)
        
        db.commit()
        print("✓ Sample insurance data populated successfully")
        
    except Exception as e:
        print(f"✗ Error populating sample data: {e}")
        db.rollback()
    finally:
        db.close()


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    populate_sample_data()


# Include routers
app.include_router(admin_router)
app.include_router(catalog_router)


# Health check endpoints
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "Backend is running", "service": "Insurance CRC API"}


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Insurance CRC Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }

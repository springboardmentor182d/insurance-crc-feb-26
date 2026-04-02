# In-memory database for users
users_db = []

# In-memory database for insurance plans
insurance_plans = [
    {
        "id": 1,
        "name": "Basic Plan",
        "price": 50,
        "coverage": 100000,
        "deductible": 1000,
        "description": "Affordable basic coverage for young and healthy individuals",
        "features": ["Emergency coverage", "Doctor visits", "Hospital stays up to 5 days"]
    },
    {
        "id": 2,
        "name": "Standard Plan",
        "price": 100,
        "coverage": 250000,
        "deductible": 500,
        "description": "Comprehensive coverage with good benefits",
        "features": ["Emergency coverage", "Doctor visits", "Hospital stays up to 10 days", "Prescription coverage", "Preventive care"]
    },
    {
        "id": 3,
        "name": "Premium Plan",
        "price": 200,
        "coverage": 500000,
        "deductible": 250,
        "description": "Top-tier coverage with extensive benefits",
        "features": ["Emergency coverage", "Doctor visits", "Hospital stays (unlimited)", "Prescription coverage", "Preventive care", "Dental coverage", "Vision coverage", "Mental health services"]
    }
]

# In-memory database for claims
claims_db = []

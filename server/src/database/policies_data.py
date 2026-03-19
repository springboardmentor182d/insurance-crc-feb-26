from src.entities.policy import Policy

policies = [
    Policy(
        id=1,
        category="Health",
        title="Comprehensive Health Shield",
        provider="HealthFirst Insurance",
        coverage=500000,
        premium=15000,
        claim_ratio=0.95,
        features=["Hospitalization", "Daycare", "Ambulance"]
    ),
    Policy(
        id=2,
        category="Health",
        title="Senior Citizen Care",
        provider="ElderCare Insurance",
        coverage=750000,
        premium=20000,
        claim_ratio=0.94,
        features=["Pre-existing Cover", "Home Healthcare"]
    ),
    Policy(
        id=3,
        category="Life",
        title="Life Guard Premium",
        provider="LifeSecure Insurance",
        coverage=2000000,
        premium=30000,
        claim_ratio=0.98,
        features=["Death Benefit", "Maturity Benefit"]
    ),
]
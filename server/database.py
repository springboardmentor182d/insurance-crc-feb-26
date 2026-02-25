from models import Policy

POLICIES = [
    Policy(
        id=1,
        category="health",
        name="Family Health Plan",
        provider="HealthFirst",
        premium=3600,
        coverage="$2,000,000",
        description="Comprehensive family health coverage"
    ),
    Policy(
        id=2,
        category="auto",
        name="Auto Comprehensive Plus",
        provider="DriveSecure",
        premium=850,
        coverage="$250,000",
        description="Full auto protection with roadside assistance"
    ),
    Policy(
        id=3,
        category="life",
        name="Life Insurance Premium",
        provider="LifeGuard",
        premium=2800,
        coverage="$1,500,000",
        description="Income-based life protection plan"
    ),
    Policy(
        id=4,
        category="disability",
        name="Income Protection Plan",
        provider="SecureIncome",
        premium=1200,
        coverage="60% of income",
        description="Disability income protection"
    )
]
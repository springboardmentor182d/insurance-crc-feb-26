from __future__ import annotations

import os
import sys
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

from dotenv import load_dotenv
from sqlalchemy import select, text

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from src.database.admin_dashboard.enums.activity import ActivitySeverity, ActivityType  # noqa: E402
from src.database.admin_dashboard.models import (  # noqa: E402
    ActivityLog,
    Adjuster,
    Claim,
    ClaimStatus,
    FraudFlag,
    FraudRule,
    FraudSeverity,
    Policy,
    PolicyStatus,
    PolicyType,
    User,
    UserPreferences,
    UserRole,
)
from src.auth.db_models import AuthCredential  # noqa: E402
from src.auth.security import hash_password  # noqa: E402
from src.database.core import SessionLocal, create_tables  # noqa: E402
from src.database.manage_policies.models import PolicyProfile  # noqa: E402
from src.database.seeds import seed_fraud_rules  # noqa: E402
from src.entities.active_policy import ActivePolicy  # noqa: E402

load_dotenv()


def _sync_postgres_sequences(db) -> None:
    table_names = [
        "users",
        "adjusters",
        "policies",
        "claims",
        "fraud_rules",
        "fraud_flags",
        "activity_logs",
        "user_preferences",
        "active_policies",
    ]
    for table_name in table_names:
        db.execute(
            text(
                """
                SELECT setval(
                    pg_get_serial_sequence(:table_name, 'id'),
                    COALESCE((SELECT MAX(id) FROM """ + table_name + """), 0) + 1,
                    false
                )
                """
            ),
            {"table_name": table_name},
        )


def _upsert_user(
    db,
    *,
    email: str,
    full_name: str,
    role: UserRole,
    first_name: str | None = None,
    last_name: str | None = None,
) -> User:
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if user is None:
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            full_name=full_name,
            role=role,
            is_active=True,
        )
        db.add(user)
        db.flush()
    else:
        user.first_name = first_name
        user.last_name = last_name
        user.full_name = full_name
        user.role = role
        user.is_active = True

    return user


def _upsert_adjuster(db, *, email: str, name: str) -> Adjuster:
    adjuster = db.execute(select(Adjuster).where(Adjuster.email == email)).scalar_one_or_none()
    if adjuster is None:
        adjuster = Adjuster(name=name, email=email, is_active=True)
        db.add(adjuster)
        db.flush()
    else:
        adjuster.name = name
        adjuster.is_active = True

    return adjuster


def _upsert_credentials(db, *, user_id: int, password: str) -> AuthCredential:
    credentials = db.execute(
        select(AuthCredential).where(AuthCredential.user_id == user_id)
    ).scalar_one_or_none()
    password_hash = hash_password(password)

    if credentials is None:
        credentials = AuthCredential(user_id=user_id, password_hash=password_hash)
        db.add(credentials)
    else:
        credentials.password_hash = password_hash

    credentials.password_reset_token_hash = None
    credentials.password_reset_expires_at = None
    credentials.password_reset_requested_at = None
    return credentials


def _upsert_policy(
    db,
    *,
    policy_number: str,
    user_id: int,
    policy_type: PolicyType,
    status: PolicyStatus,
    premium_amount: Decimal,
    coverage_amount: Decimal,
    start_date: date,
    end_date: date,
    created_at: datetime,
) -> Policy:
    policy = db.execute(
        select(Policy).where(Policy.policy_number == policy_number)
    ).scalar_one_or_none()
    if policy is None:
        policy = Policy(
            policy_number=policy_number,
            user_id=user_id,
            policy_type=policy_type,
            status=status,
            premium_amount=premium_amount,
            coverage_amount=coverage_amount,
            start_date=start_date,
            end_date=end_date,
            created_at=created_at,
        )
        db.add(policy)
        db.flush()
    else:
        policy.user_id = user_id
        policy.policy_type = policy_type
        policy.status = status
        policy.premium_amount = premium_amount
        policy.coverage_amount = coverage_amount
        policy.start_date = start_date
        policy.end_date = end_date

    return policy


def _upsert_policy_profile(
    db,
    *,
    policy_id: int,
    policy_name: str,
    provider: str,
    deductible_amount: Decimal,
    description: str,
) -> PolicyProfile:
    profile = db.execute(
        select(PolicyProfile).where(PolicyProfile.policy_id == policy_id)
    ).scalar_one_or_none()
    if profile is None:
        profile = PolicyProfile(
            policy_id=policy_id,
            policy_name=policy_name,
            provider=provider,
            deductible_amount=deductible_amount,
            description=description,
        )
        db.add(profile)
    else:
        profile.policy_name = policy_name
        profile.provider = provider
        profile.deductible_amount = deductible_amount
        profile.description = description

    return profile


def _upsert_claim(
    db,
    *,
    claim_number: str,
    policy_id: int,
    user_id: int,
    adjuster_id: int | None,
    status: ClaimStatus,
    claim_amount: Decimal,
    approved_amount: Decimal | None,
    description: str,
    fraud_score: float,
    submitted_at: datetime,
    processed_at: datetime | None,
) -> Claim:
    claim = db.execute(
        select(Claim).where(Claim.claim_number == claim_number)
    ).scalar_one_or_none()
    if claim is None:
        claim = Claim(
            claim_number=claim_number,
            policy_id=policy_id,
            user_id=user_id,
            adjuster_id=adjuster_id,
            status=status,
            claim_amount=claim_amount,
            approved_amount=approved_amount,
            description=description,
            fraud_score=fraud_score,
            submitted_at=submitted_at,
            processed_at=processed_at,
            created_at=submitted_at,
        )
        db.add(claim)
        db.flush()
    else:
        claim.policy_id = policy_id
        claim.user_id = user_id
        claim.adjuster_id = adjuster_id
        claim.status = status
        claim.claim_amount = claim_amount
        claim.approved_amount = approved_amount
        claim.description = description
        claim.fraud_score = fraud_score
        claim.submitted_at = submitted_at
        claim.processed_at = processed_at

    return claim


def _upsert_fraud_flag(
    db,
    *,
    claim_id: int,
    rule: FraudRule,
    details: str,
) -> FraudFlag:
    flag = db.execute(
        select(FraudFlag).where(FraudFlag.claim_id == claim_id, FraudFlag.rule_id == rule.id)
    ).scalar_one_or_none()
    if flag is None:
        flag = FraudFlag(
            claim_id=claim_id,
            rule_id=rule.id,
            rule_name=rule.rule_name,
            severity=FraudSeverity(rule.severity.value),
            details=details,
        )
        db.add(flag)
    else:
        flag.rule_name = rule.rule_name
        flag.severity = FraudSeverity(rule.severity.value)
        flag.details = details

    return flag


def _upsert_activity_log(
    db,
    *,
    title: str,
    action_type: ActivityType,
    severity: ActivitySeverity,
    user_id: int | None,
    entity_type: str | None,
    entity_id: int | None,
    details: str | None,
    created_at: datetime,
) -> ActivityLog:
    existing = db.execute(
        select(ActivityLog).where(
            ActivityLog.title == title,
            ActivityLog.entity_type == entity_type,
            ActivityLog.entity_id == entity_id,
        )
    ).scalar_one_or_none()

    if existing is None:
        existing = ActivityLog(
            title=title,
            action_type=action_type,
            severity=severity,
            user_id=user_id,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details,
            created_at=created_at,
        )
        db.add(existing)
    else:
        existing.action_type = action_type
        existing.severity = severity
        existing.user_id = user_id
        existing.details = details

    return existing


def _upsert_preferences(db, *, user_id: int, currency: str = "INR") -> UserPreferences:
    pref = db.execute(
        select(UserPreferences).where(UserPreferences.user_id == user_id)
    ).scalar_one_or_none()
    if pref is None:
        pref = UserPreferences(user_id=user_id)
        db.add(pref)

    pref.preferred_currency = currency
    pref.timezone = "Asia/Kolkata"
    pref.preferred_language = "en"
    pref.theme = "light"
    return pref


def _upsert_active_policy(
    db,
    *,
    user_id: int,
    policy_id: int | None,
    policy_number: str,
    category: str,
    insurer_name: str,
    product_name: str,
    premium_annual: Decimal,
    coverage_amount: Decimal,
    deductible_amount: Decimal | None,
    start_date: date,
    end_date: date,
    warning_text: str | None,
) -> ActivePolicy:
    active_policy = db.execute(
        select(ActivePolicy).where(
            ActivePolicy.user_id == user_id,
            ActivePolicy.policy_number == policy_number,
        )
    ).scalar_one_or_none()

    if active_policy is None:
        active_policy = ActivePolicy(
            user_id=user_id,
            policy_id=policy_id,
            policy_number=policy_number,
            status="ACTIVE",
            category=category,
            insurer_name=insurer_name,
            product_name=product_name,
            premium_annual=premium_annual,
            coverage_amount=coverage_amount,
            deductible_amount=deductible_amount,
            start_date=start_date,
            end_date=end_date,
            tags=None,
            warning_text=warning_text,
        )
        db.add(active_policy)
    else:
        active_policy.policy_id = policy_id
        active_policy.status = "ACTIVE"
        active_policy.category = category
        active_policy.insurer_name = insurer_name
        active_policy.product_name = product_name
        active_policy.premium_annual = premium_annual
        active_policy.coverage_amount = coverage_amount
        active_policy.deductible_amount = deductible_amount
        active_policy.start_date = start_date
        active_policy.end_date = end_date
        active_policy.warning_text = warning_text

    return active_policy


def seed_database() -> None:
    create_tables()
    seed_fraud_rules()

    with SessionLocal() as db:
        _sync_postgres_sequences(db)
        now = datetime.now(timezone.utc)
    
        admin = _upsert_user(
            db,
            email="admin@bimaverse.com",
            full_name="Admin User",
            first_name="Admin",
            last_name="User",
            role=UserRole.ADMIN,
        )
        _upsert_credentials(db, user_id=admin.id, password="Admin@123")
        customer_one = _upsert_user(
            db,
            email="john.doe@example.com",
            full_name="John Doe",
            first_name="John",
            last_name="Doe",
            role=UserRole.CUSTOMER,
        )
        _upsert_credentials(db, user_id=customer_one.id, password="Password@123")
        customer_two = _upsert_user(
            db,
            email="jane.singh@example.com",
            full_name="Jane Singh",
            first_name="Jane",
            last_name="Singh",
            role=UserRole.CUSTOMER,
        )
        _upsert_credentials(db, user_id=customer_two.id, password="Password@123")
    
        adjuster_one = _upsert_adjuster(
            db,
            email="ajay.adjuster@bimaverse.com",
            name="Ajay Verma",
        )
        adjuster_two = _upsert_adjuster(
            db,
            email="meera.adjuster@bimaverse.com",
            name="Meera Nair",
        )
    
        db.flush()
    
        policy_health = _upsert_policy(
            db,
            policy_number="POL-HEALTH-0001",
            user_id=customer_one.id,
            policy_type=PolicyType.HEALTH,
            status=PolicyStatus.ACTIVE,
            premium_amount=Decimal("1800.00"),
            coverage_amount=Decimal("500000.00"),
            start_date=date.today() - timedelta(days=200),
            end_date=date.today() + timedelta(days=165),
            created_at=now - timedelta(days=85),
        )
        policy_auto = _upsert_policy(
            db,
            policy_number="POL-AUTO-0002",
            user_id=customer_one.id,
            policy_type=PolicyType.AUTO,
            status=PolicyStatus.ACTIVE,
            premium_amount=Decimal("1200.00"),
            coverage_amount=Decimal("300000.00"),
            start_date=date.today() - timedelta(days=150),
            end_date=date.today() + timedelta(days=215),
            created_at=now - timedelta(days=52),
        )
        policy_home = _upsert_policy(
            db,
            policy_number="POL-HOME-0003",
            user_id=customer_two.id,
            policy_type=PolicyType.HOME,
            status=PolicyStatus.LAPSED,
            premium_amount=Decimal("950.00"),
            coverage_amount=Decimal("400000.00"),
            start_date=date.today() - timedelta(days=400),
            end_date=date.today() - timedelta(days=35),
            created_at=now - timedelta(days=110),
        )
        policy_life = _upsert_policy(
            db,
            policy_number="POL-LIFE-0004",
            user_id=customer_two.id,
            policy_type=PolicyType.LIFE,
            status=PolicyStatus.ACTIVE,
            premium_amount=Decimal("2500.00"),
            coverage_amount=Decimal("1200000.00"),
            start_date=date.today() - timedelta(days=320),
            end_date=date.today() + timedelta(days=320),
            created_at=now - timedelta(days=18),
        )
    
        db.flush()
    
        _upsert_policy_profile(
            db,
            policy_id=policy_health.id,
            policy_name="Health Secure Gold",
            provider="HealthFirst",
            deductible_amount=Decimal("2500.00"),
            description="Comprehensive family health coverage with cashless hospitalization.",
        )
        _upsert_policy_profile(
            db,
            policy_id=policy_auto.id,
            policy_name="DriveShield Plus",
            provider="SafeDrive Insurance",
            deductible_amount=Decimal("1000.00"),
            description="Comprehensive auto insurance including roadside assistance.",
        )
        _upsert_policy_profile(
            db,
            policy_id=policy_home.id,
            policy_name="Home Protection Basic",
            provider="HomeGuard",
            deductible_amount=Decimal("2000.00"),
            description="Basic structure and contents protection for homeowners.",
        )
        _upsert_policy_profile(
            db,
            policy_id=policy_life.id,
            policy_name="Life Promise Ultra",
            provider="LifeSecure",
            deductible_amount=Decimal("0.00"),
            description="Long-term life cover with critical illness riders.",
        )
    
        claim_pending = _upsert_claim(
            db,
            claim_number="CLM-0001",
            policy_id=policy_health.id,
            user_id=customer_one.id,
            adjuster_id=adjuster_one.id,
            status=ClaimStatus.PENDING,
            claim_amount=Decimal("42000.00"),
            approved_amount=None,
            description="Hospitalization reimbursement for emergency treatment",
            fraud_score=0.82,
            submitted_at=now - timedelta(days=3),
            processed_at=None,
        )
        claim_approved = _upsert_claim(
            db,
            claim_number="CLM-0002",
            policy_id=policy_auto.id,
            user_id=customer_one.id,
            adjuster_id=adjuster_one.id,
            status=ClaimStatus.APPROVED,
            claim_amount=Decimal("18000.00"),
            approved_amount=Decimal("16500.00"),
            description="Minor collision repair reimbursement",
            fraud_score=0.07,
            submitted_at=now - timedelta(days=36),
            processed_at=now - timedelta(days=32),
        )
        claim_rejected = _upsert_claim(
            db,
            claim_number="CLM-0003",
            policy_id=policy_home.id,
            user_id=customer_two.id,
            adjuster_id=adjuster_two.id,
            status=ClaimStatus.REJECTED,
            claim_amount=Decimal("25000.00"),
            approved_amount=None,
            description="Water leakage claim outside coverage scope",
            fraud_score=0.21,
            submitted_at=now - timedelta(days=62),
            processed_at=now - timedelta(days=59),
        )
        claim_fraud = _upsert_claim(
            db,
            claim_number="CLM-0004",
            policy_id=policy_life.id,
            user_id=customer_two.id,
            adjuster_id=adjuster_two.id,
            status=ClaimStatus.FRAUDULENT,
            claim_amount=Decimal("250000.00"),
            approved_amount=None,
            description="Suspicious duplicate life cover incident report",
            fraud_score=0.94,
            submitted_at=now - timedelta(days=11),
            processed_at=now - timedelta(days=9),
        )
        _upsert_claim(
            db,
            claim_number="CLM-0005",
            policy_id=policy_life.id,
            user_id=customer_two.id,
            adjuster_id=adjuster_one.id,
            status=ClaimStatus.APPROVED,
            claim_amount=Decimal("50000.00"),
            approved_amount=Decimal("42000.00"),
            description="Routine approved payout for valid life policy event",
            fraud_score=0.12,
            submitted_at=now - timedelta(days=96),
            processed_at=now - timedelta(days=90),
        )
    
        rules = {
            rule.rule_name: rule
            for rule in db.execute(select(FraudRule)).scalars().all()
        }
        if "EXCESSIVE_AMOUNT" in rules:
            _upsert_fraud_flag(
                db,
                claim_id=claim_fraud.id,
                rule=rules["EXCESSIVE_AMOUNT"],
                details="Claim amount significantly exceeds expected threshold for similar profile.",
            )
        if "MULTIPLE_CLAIMS_SHORT_PERIOD" in rules:
            _upsert_fraud_flag(
                db,
                claim_id=claim_pending.id,
                rule=rules["MULTIPLE_CLAIMS_SHORT_PERIOD"],
                details="Multiple claims submitted by same user in short duration.",
            )
    
        _upsert_activity_log(
            db,
            title=f"Policy created: {policy_auto.policy_number}",
            action_type=ActivityType.POLICY_CREATED,
            severity=ActivitySeverity.INFO,
            user_id=admin.id,
            entity_type="policy",
            entity_id=policy_auto.id,
            details="Admin created a new auto policy entry.",
            created_at=now - timedelta(days=7),
        )
        _upsert_activity_log(
            db,
            title=f"Claim submitted: {claim_pending.claim_number}",
            action_type=ActivityType.CLAIM_SUBMITTED,
            severity=ActivitySeverity.FLAGGED,
            user_id=customer_one.id,
            entity_type="claim",
            entity_id=claim_pending.id,
            details="High fraud score detected at submission.",
            created_at=now - timedelta(days=3),
        )
        _upsert_activity_log(
            db,
            title=f"Claim approved: {claim_approved.claim_number}",
            action_type=ActivityType.CLAIM_APPROVED,
            severity=ActivitySeverity.APPROVED,
            user_id=admin.id,
            entity_type="claim",
            entity_id=claim_approved.id,
            details="Approved after adjuster review.",
            created_at=now - timedelta(days=31),
        )
        _upsert_activity_log(
            db,
            title=f"Claim marked fraudulent: {claim_fraud.claim_number}",
            action_type=ActivityType.CLAIM_REJECTED,
            severity=ActivitySeverity.FRAUD,
            user_id=admin.id,
            entity_type="claim",
            entity_id=claim_fraud.id,
            details="Fraud indicators confirmed by admin review.",
            created_at=now - timedelta(days=9),
        )
    
        _upsert_preferences(db, user_id=admin.id)
        _upsert_preferences(db, user_id=customer_one.id)
        _upsert_preferences(db, user_id=customer_two.id)
    
        _upsert_active_policy(
            db,
            user_id=customer_one.id,
            policy_id=policy_health.id,
            policy_number=policy_health.policy_number,
            category="HEALTH",
            insurer_name="HealthFirst",
            product_name="Health Secure Gold",
            premium_annual=Decimal("1800.00"),
            coverage_amount=Decimal("500000.00"),
            deductible_amount=Decimal("2500.00"),
            start_date=policy_health.start_date,
            end_date=policy_health.end_date,
            warning_text=None,
        )
        _upsert_active_policy(
            db,
            user_id=customer_one.id,
            policy_id=policy_auto.id,
            policy_number=policy_auto.policy_number,
            category="AUTO",
            insurer_name="SafeDrive Insurance",
            product_name="DriveShield Plus",
            premium_annual=Decimal("1200.00"),
            coverage_amount=Decimal("300000.00"),
            deductible_amount=Decimal("1000.00"),
            start_date=policy_auto.start_date,
            end_date=policy_auto.end_date,
            warning_text=None,
        )
        _upsert_active_policy(
            db,
            user_id=customer_one.id,
            policy_id=None,
            policy_number="EXT-HOME-9901",
            category="HOME",
            insurer_name="HomeGuard",
            product_name="External Home Cover",
            premium_annual=Decimal("1450.00"),
            coverage_amount=Decimal("650000.00"),
            deductible_amount=Decimal("3500.00"),
            start_date=date.today() - timedelta(days=220),
            end_date=date.today() + timedelta(days=20),
            warning_text="Policy expiring soon. Renewal recommended within 20 days.",
        )
    
        db.commit()
    

if __name__ == "__main__":
    seed_database()
    print("DONE")

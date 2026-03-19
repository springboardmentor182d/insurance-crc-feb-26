from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select

from src.database.core import SessionLocal, create_tables
from src.database.admin_dashboard.models import (
    ActivityLog,
    ActivitySeverity,
    ActivityType,
    Adjuster,
    Claim,
    ClaimStatus,
    FraudRule,
    FraudSeverity,
    Policy,
    PolicyStatus,
    PolicyType,
    User,
    UserRole,
)
from src.database.manage_policies.models.policy_profiles import PolicyProfile


def seed_database() -> None:
    create_tables()

    with SessionLocal() as session:
        existing_user = session.execute(select(User.id).limit(1)).scalar_one_or_none()
        if existing_user is not None:
            print("Seed skipped: data already exists.")
            return

        now = datetime.now(timezone.utc)

        users = [
            User(
                first_name="John",
                last_name="Smith",
                full_name="John Smith",
                email="john.smith@example.com",
                phone="+1-555-1001",
                role=UserRole.CUSTOMER,
                created_at=now - timedelta(days=52),
            ),
            User(
                first_name="Jane",
                last_name="Doe",
                full_name="Jane Doe",
                email="jane.doe@example.com",
                phone="+1-555-1002",
                role=UserRole.CUSTOMER,
                created_at=now - timedelta(days=28),
            ),
            User(
                first_name="Robert",
                last_name="Taylor",
                full_name="Robert Taylor",
                email="robert.taylor@example.com",
                phone="+1-555-1003",
                role=UserRole.CUSTOMER,
                created_at=now - timedelta(days=14),
            ),
            User(
                first_name="Priya",
                last_name="Kumar",
                full_name="Priya Kumar",
                email="priya.kumar@example.com",
                phone="+1-555-1004",
                role=UserRole.ADMIN,
                created_at=now - timedelta(days=80),
            ),
        ]
        session.add_all(users)
        session.flush()

        adjusters = [
            Adjuster(name="Sarah Johnson", email="sarah.johnson@bimaverse.com"),
            Adjuster(name="Michael Chen", email="michael.chen@bimaverse.com"),
            Adjuster(name="Emily Rodriguez", email="emily.rodriguez@bimaverse.com"),
        ]
        session.add_all(adjusters)
        session.flush()

        policies = [
            Policy(
                user_id=users[0].id,
                policy_number="POL-2026-1001",
                policy_type=PolicyType.AUTO,
                status=PolicyStatus.ACTIVE,
                premium_amount=1200,
                coverage_amount=25000,
                start_date=date.today() - timedelta(days=330),
                end_date=date.today() + timedelta(days=35),
                created_at=now - timedelta(days=58),
            ),
            Policy(
                user_id=users[1].id,
                policy_number="POL-2026-1002",
                policy_type=PolicyType.HEALTH,
                status=PolicyStatus.ACTIVE,
                premium_amount=1800,
                coverage_amount=50000,
                start_date=date.today() - timedelta(days=120),
                end_date=date.today() + timedelta(days=245),
                created_at=now - timedelta(days=25),
            ),
            Policy(
                user_id=users[2].id,
                policy_number="POL-2026-1003",
                policy_type=PolicyType.HOME,
                status=PolicyStatus.LAPSED,
                premium_amount=1500,
                coverage_amount=90000,
                start_date=date.today() - timedelta(days=420),
                end_date=date.today() - timedelta(days=55),
                created_at=now - timedelta(days=40),
            ),
            Policy(
                user_id=users[2].id,
                policy_number="POL-2026-1004",
                policy_type=PolicyType.LIFE,
                status=PolicyStatus.ACTIVE,
                premium_amount=2200,
                coverage_amount=120000,
                start_date=date.today() - timedelta(days=70),
                end_date=date.today() + timedelta(days=295),
                created_at=now - timedelta(days=8),
            ),
        ]
        session.add_all(policies)
        session.flush()

        policy_profiles = [
            PolicyProfile(
                policy_id=policies[0].id,
                policy_name="Comprehensive Auto Coverage",
                provider="DriveSecure",
                deductible_amount=500,
                description="Collision and liability coverage for personal vehicles.",
                created_at=now - timedelta(days=58),
            ),
            PolicyProfile(
                policy_id=policies[1].id,
                policy_name="Family Health Plan",
                provider="HealthFirst",
                deductible_amount=2500,
                description="Comprehensive health insurance for families.",
                created_at=now - timedelta(days=25),
            ),
            PolicyProfile(
                policy_id=policies[2].id,
                policy_name="Premium Home Protection",
                provider="SafeGuard Insurance",
                deductible_amount=1000,
                description="Broad home protection for owner-occupied properties.",
                created_at=now - timedelta(days=40),
            ),
            PolicyProfile(
                policy_id=policies[3].id,
                policy_name="Secure Life Shield",
                provider="LifeCare Assurance",
                deductible_amount=3000,
                description="Long-term life insurance with fixed annual premium.",
                created_at=now - timedelta(days=8),
            ),
        ]
        session.add_all(policy_profiles)

        claims = [
            Claim(
                claim_number="CLM-2026-045",
                policy_id=policies[0].id,
                user_id=users[0].id,
                adjuster_id=adjusters[0].id,
                status=ClaimStatus.APPROVED,
                claim_amount=4500,
                approved_amount=4200,
                submitted_at=now - timedelta(days=20),
                processed_at=now - timedelta(days=17),
                created_at=now - timedelta(days=20),
            ),
            Claim(
                claim_number="CLM-2026-046",
                policy_id=policies[1].id,
                user_id=users[1].id,
                adjuster_id=adjusters[1].id,
                status=ClaimStatus.REJECTED,
                claim_amount=3200,
                approved_amount=None,
                submitted_at=now - timedelta(days=12),
                processed_at=now - timedelta(days=10),
                created_at=now - timedelta(days=12),
            ),
            Claim(
                claim_number="CLM-2026-047",
                policy_id=policies[2].id,
                user_id=users[2].id,
                adjuster_id=adjusters[2].id,
                status=ClaimStatus.FRAUDULENT,
                claim_amount=9000,
                approved_amount=None,
                submitted_at=now - timedelta(days=4),
                processed_at=now - timedelta(days=2),
                created_at=now - timedelta(days=4),
                fraud_score=0.93,
            ),
            Claim(
                claim_number="CLM-2026-048",
                policy_id=policies[3].id,
                user_id=users[2].id,
                adjuster_id=adjusters[0].id,
                status=ClaimStatus.PENDING,
                claim_amount=5100,
                approved_amount=None,
                submitted_at=now - timedelta(days=1),
                processed_at=None,
                created_at=now - timedelta(days=1),
            ),
        ]
        session.add_all(claims)

        fraud_rules = [
            FraudRule(
                rule_name="High Claim Amount Threshold",
                description="Flag claims over threshold for manual verification.",
                severity=FraudSeverity.HIGH,
                trigger_threshold=8000,
                is_active=True,
                created_at=now - timedelta(days=45),
            ),
            FraudRule(
                rule_name="Multiple Claims in 7 Days",
                description="Detect repeated claims in short time window.",
                severity=FraudSeverity.MEDIUM,
                trigger_threshold=3,
                is_active=True,
                created_at=now - timedelta(days=30),
            ),
        ]
        session.add_all(fraud_rules)

        activity_logs = [
            ActivityLog(
                user_id=users[3].id,
                title="New fraud rule activated",
                action_type=ActivityType.FRAUD_RULE_ACTIVATED,
                severity=ActivitySeverity.FRAUD,
                entity_type="fraud_rule",
                entity_id=1,
                created_at=now - timedelta(hours=2),
            ),
            ActivityLog(
                user_id=users[0].id,
                title="Claim CLM-2026-045 approved",
                action_type=ActivityType.CLAIM_APPROVED,
                severity=ActivitySeverity.APPROVED,
                entity_type="claim",
                entity_id=1,
                created_at=now - timedelta(hours=3),
            ),
            ActivityLog(
                user_id=None,
                title="High-risk claim flagged",
                action_type=ActivityType.SYSTEM_EVENT,
                severity=ActivitySeverity.FLAGGED,
                entity_type="claim",
                entity_id=3,
                created_at=now - timedelta(hours=5),
            ),
            ActivityLog(
                user_id=users[1].id,
                title="New policy activated",
                action_type=ActivityType.POLICY_CREATED,
                severity=ActivitySeverity.INFO,
                entity_type="policy",
                entity_id=2,
                created_at=now - timedelta(hours=6),
            ),
        ]
        session.add_all(activity_logs)

        session.commit()
        print("Seed complete: sample records inserted.")


if __name__ == "__main__":
    seed_database()

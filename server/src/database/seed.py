import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from src.database.core import SessionLocal

with SessionLocal() as db:

    # users
    db.execute(text("""
    INSERT INTO users (id, full_name, email, role)
    VALUES (1, 'Admin', 'admin@bimaverse.com', 'admin')
    ON CONFLICT DO NOTHING
    """))

    # policy
    db.execute(text("""
    INSERT INTO policies (
        id, policy_number, user_id,
        policy_type, status,
        premium_amount, coverage_amount,
        start_date, end_date
    )
    VALUES (
        1, 'POL-001', 1,
        'HEALTH', 'ACTIVE',
        1000, 100000,
        NOW(), NOW()
    )
    ON CONFLICT DO NOTHING
    """))

    # claims
    db.execute(text("""
    INSERT INTO claims (
        id, claim_number, user_id, policy_id,
        status, claim_amount, fraud_score,
        submitted_at, created_at
    )
    VALUES
    (1, 'CLM-001', 1, 1, 'PENDING', 5000, 0.8, NOW(), NOW())
    ON CONFLICT DO NOTHING
    """))

    db.commit()

print("✅ DONE")
from datetime import datetime
from sqlalchemy import text

from src.database.core import engine, create_tables


def seed_browse_policies() -> None:
    """Insert demo browse-policy rows into the `policies` table for local dev.

    This uses a plain SQL INSERT so it is tolerant of the multiple ORM
    mappings that exist in the codebase during development.
    """
    create_tables()

    demo_rows = [
        {
            "name": "Premium Home Protection",
            "insurer_name": "SafeGuard Insurance",
            "category": "HOME",
            "premium_annual": 1200.00,
            "coverage_amount": 500000.00,
            "deductible_amount": 1000.00,
            "average_rating": 4.8,
            "rating_count": 124,
            "tagline": "Comprehensive coverage for your home and belongings.",
            "key_features": "Fire & theft coverage, Natural disaster protection, Liability coverage",
            "is_active": 1,
            "created_at": datetime.utcnow().isoformat(),
        },
        {
            "name": "Comprehensive Auto Coverage",
            "insurer_name": "DriveSecure",
            "category": "AUTO",
            "premium_annual": 850.00,
            "coverage_amount": 250000.00,
            "deductible_amount": 500.00,
            "average_rating": 4.6,
            "rating_count": 201,
            "tagline": "Peace of mind for every drive.",
            "key_features": "Collision coverage, Comprehensive coverage, Roadside assistance",
            "is_active": 1,
            "created_at": datetime.utcnow().isoformat(),
        },
    ]

    with engine.begin() as conn:
        # Only insert if table has no active browse-style rows
        existing = conn.execute(text("SELECT COUNT(1) FROM policies WHERE is_active=1")).scalar()
        if existing and int(existing) > 0:
            print("Browse policy seed skipped: active rows already exist.")
            return

        insert_sql = text(
            """
            INSERT INTO policies
            (name, insurer_name, category, premium_annual, coverage_amount,
             deductible_amount, average_rating, rating_count, tagline, key_features,
             is_active, created_at)
            VALUES
            (:name, :insurer_name, :category, :premium_annual, :coverage_amount,
             :deductible_amount, :average_rating, :rating_count, :tagline, :key_features,
             :is_active, :created_at)
            """
        )

        for row in demo_rows:
            conn.execute(insert_sql, **row)

        print("Browse seed complete: demo policies inserted.")


if __name__ == "__main__":
    seed_browse_policies()

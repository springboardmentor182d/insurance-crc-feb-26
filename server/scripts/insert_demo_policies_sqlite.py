import sqlite3
from pathlib import Path
from datetime import datetime


DB_PATH = Path(__file__).resolve().parents[1] / "dev_data.sqlite3"


def ensure_table(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS policies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            insurer_name TEXT,
            category TEXT,
            premium_annual REAL,
            coverage_amount REAL,
            deductible_amount REAL,
            average_rating REAL,
            rating_count INTEGER,
            tagline TEXT,
            key_features TEXT,
            is_active INTEGER DEFAULT 1,
            created_at TEXT
        )
        """
    )


def insert_demo(conn: sqlite3.Connection) -> None:
    cur = conn.cursor()
    cur.execute("SELECT COUNT(1) FROM policies WHERE is_active=1")
    count = cur.fetchone()[0]
    if count and count > 0:
        print("Demo insert skipped: active policies already exist (count=", count, ")")
        return

    now = datetime.utcnow().isoformat()
    rows = [
        (
            "Premium Home Protection",
            "SafeGuard Insurance",
            "HOME",
            1200.0,
            500000.0,
            1000.0,
            4.8,
            124,
            "Comprehensive coverage for your home and belongings.",
            "Fire & theft coverage, Natural disaster protection, Liability coverage",
            1,
            now,
        ),
        (
            "Comprehensive Auto Coverage",
            "DriveSecure",
            "AUTO",
            850.0,
            250000.0,
            500.0,
            4.6,
            201,
            "Peace of mind for every drive.",
            "Collision coverage, Comprehensive coverage, Roadside assistance",
            1,
            now,
        ),
    ]

    cur.executemany(
        """
        INSERT INTO policies
        (name, insurer_name, category, premium_annual, coverage_amount,
         deductible_amount, average_rating, rating_count, tagline, key_features,
         is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    conn.commit()
    print("Inserted", len(rows), "demo policies into", DB_PATH)


def main():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    try:
        ensure_table(conn)
        insert_demo(conn)
    finally:
        conn.close()


if __name__ == "__main__":
    main()

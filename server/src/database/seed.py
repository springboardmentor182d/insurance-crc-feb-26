from sqlalchemy.orm import Session
from src.database.core import engine, SessionLocal
from src.entities.dashboard import DashboardData

def seed_db():
    db = SessionLocal()
    try:
        dashboard = db.query(DashboardData).first()
        if not dashboard:
            print("Seeding initial dashboard data...")
            dashboard = DashboardData(
                total_policies=12,
                active_claims=3,
                recommended_policies=4,
                claim_status="Approved",
                recent_policies=[
                    {"provider": "HealthGuard Insurance", "type": "Health Insurance", "coverage": "$100,000", "status": "Active"},
                    {"provider": "AutoSecure Plus", "type": "Auto Insurance", "coverage": "$50,000", "status": "Active"},
                    {"provider": "HomeProtect Premium", "type": "Home Insurance", "coverage": "$300,000", "status": "Active"}
                ],
                recent_claims=[
                    {"id": "CLM-2024-089", "type": "Auto Incident", "date": "Oct 12, 2024", "status": "Processing"},
                    {"id": "CLM-2024-102", "type": "Health Checkup", "date": "Sep 28, 2024", "status": "Approved"}
                ]
            )
            db.add(dashboard)
            db.commit()
            print("Database seeded successfully.")
        else:
            print("Database already contains data, skipping seed.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()

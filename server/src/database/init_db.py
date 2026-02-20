from src.database.core import create_tables

if __name__ == "__main__":
    create_tables()
    print("Database tables created (or already exist).")

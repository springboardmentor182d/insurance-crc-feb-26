"""
Test script to verify PostgreSQL database connection
Run this to ensure your PostgreSQL setup is working correctly
"""

import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def test_database_connection():
    """Pytest entrypoint: keep test style assert-based (no return value)."""
    assert run_database_connection_check()


def run_database_connection_check():
    """Test PostgreSQL database connection"""
    print("=" * 60)
    print("Testing PostgreSQL Database Connection")
    print("=" * 60)
    
    try:
        print("\n1. Loading environment variables...")
        from dotenv import load_dotenv
        load_dotenv()
        
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            # Mask password in output
            masked_url = database_url.split('@')[0].split(':')[0] + ":****@" + database_url.split('@')[1] if '@' in database_url else database_url
            print(f"   ✅ DATABASE_URL loaded: {masked_url}")
        else:
            print("   ❌ DATABASE_URL not found in environment")
            return False
        
        print("\n2. Importing database module...")
        from src import database
        print("   ✅ Database module imported successfully")
        
        print("\n3. Creating database engine...")
        engine = database.engine
        print(f"   ✅ Engine created: {engine.url.drivername}")
        
        print("\n4. Testing connection...")
        from sqlalchemy import text
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("   ✅ Connection successful!")
        
        print("\n5. Checking database tables...")
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if tables:
            print(f"   ✅ Found {len(tables)} tables:")
            for table in tables:
                print(f"      - {table}")
        else:
            print("   ⚠️  No tables found. Run 'python -c \"from src.database import init_db; init_db()\"' to create tables")
        
        print("\n6. Querying sample data...")
        from src import models
        db = database.SessionLocal()
        try:
            user_count = db.query(models.User).count()
            claim_count = db.query(models.Claim).count()
            policy_count = db.query(models.Policy).count()
            
            print(f"   ✅ Users: {user_count}")
            print(f"   ✅ Claims: {claim_count}")
            print(f"   ✅ Policies: {policy_count}")
        finally:
            db.close()
        
        print("\n" + "=" * 60)
        print("✅ All database tests passed!")
        print("=" * 60)
        print("\nYour PostgreSQL connection is working correctly.")
        print("You can now start the server with:")
        print("  uvicorn src.main:app --reload")
        return True
        
    except ValueError as e:
        print(f"\n❌ Configuration Error: {str(e)}")
        print("\nPlease check your .env file and ensure DATABASE_URL is set correctly.")
        return False
        
    except Exception as e:
        print(f"\n❌ Connection Error: {str(e)}")
        print("\nTroubleshooting steps:")
        print("1. Ensure PostgreSQL service is running")
        print("2. Verify database credentials in .env file")
        print("3. Check if database 'insurance_crc_db' exists")
        print("4. Verify user has proper permissions")
        return False


if __name__ == "__main__":
    success = run_database_connection_check()
    sys.exit(0 if success else 1)

# PostgreSQL Setup Commands for Windows 11
# Copy these commands and run them in psql

# Step 1: Connect to PostgreSQL as postgres user
# Open Command Prompt or PowerShell and run:
# cd "C:\Program Files\PostgreSQL\18\bin"
# .\psql -U postgres

# Step 2: Once in psql, run these commands one by one:

-- Check if database exists
\l

-- Check if user exists
\du

-- If insurance_crc_db already exists, drop it (optional)
-- DROP DATABASE IF EXISTS insurance_crc_db;

-- If insurance_user already exists, drop it (optional)
-- DROP USER IF EXISTS insurance_user;

-- Create user with password (use the EXACT password from .env file)
CREATE USER insurance_user WITH PASSWORD 'secure_password';

-- Create database
CREATE DATABASE insurance_crc_db OWNER insurance_user;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE insurance_crc_db TO insurance_user;

-- Connect to the database
\c insurance_crc_db

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO insurance_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO insurance_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO insurance_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO insurance_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO insurance_user;

-- Verify user has access
\du insurance_user

-- Exit psql
\q

# Step 3: After running above commands, test connection:
# In PowerShell (in server directory with venv activated):
# py test_db_connection.py

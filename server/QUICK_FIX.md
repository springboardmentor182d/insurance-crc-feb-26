# Quick Fix Guide - PostgreSQL Password Issue

## Problem Identified
✅ Python installed (version 3.13.12)
✅ Virtual environment exists
✅ All packages installed
✅ PostgreSQL service running
❌ **Password authentication failing**

---

## Solution: Fix PostgreSQL User & Database

### Option 1: Create User in PostgreSQL (Recommended)

1. **Open PowerShell as Administrator**

2. **Navigate to PostgreSQL bin directory:**
   ```powershell
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```

3. **Connect to PostgreSQL:**
   ```powershell
   .\psql -U postgres
   ```
   (Enter your postgres password when prompted)

4. **Run these commands in psql:**
   ```sql
   -- Create user with password from .env
   CREATE USER insurance_user WITH PASSWORD 'secure_password';
   
   -- Create database
   CREATE DATABASE insurance_crc_db OWNER insurance_user;
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE insurance_crc_db TO insurance_user;
   
   -- Connect to database
   \c insurance_crc_db
   
   -- Grant schema permissions
   GRANT ALL ON SCHEMA public TO insurance_user;
   
   -- Exit
   \q
   ```

---

### Option 2: Update .env Password (If user already exists)

If you already created `insurance_user` with a different password:

1. **Open:** `server\.env`
2. **Update DATABASE_URL:**
   ```env
   DATABASE_URL=postgresql://insurance_user:YOUR_ACTUAL_PASSWORD@localhost:5432/insurance_crc_db
   ```
   Replace `YOUR_ACTUAL_PASSWORD` with the password you used in PostgreSQL

---

## After Fixing Password:

1. **Test Database Connection:**
   ```powershell
   cd "C:\Users\Ashish Kushwaha\Desktop\VSCF\insurance-crc-feb-26\server"
   .\venv\Scripts\Activate.ps1
   py test_db_connection.py
   ```

2. **Initialize Database Tables:**
   ```powershell
   py -c "from src.database import init_db; init_db()"
   ```

3. **Start Server:**
   ```powershell
   uvicorn src.main:app --reload
   ```

---

## Important Notes:

### Use `py` instead of `python`:
- ✅ `py test_db_connection.py`
- ❌ `python test_db_connection.py`

### Virtual Environment:
Your venv is already created. Just activate it:
```powershell
.\venv\Scripts\Activate.ps1
```

### Check PostgreSQL Service:
```powershell
Get-Service postgresql-x64-18
```

Should show: **Status: Running**

---

## Quick Test Commands:

```powershell
# 1. Activate venv (if not already activated)
.\venv\Scripts\Activate.ps1

# 2. Test connection
py test_db_connection.py

# 3. If successful, initialize DB
py -c "from src.database import init_db; init_db()"

# 4. Start server
uvicorn src.main:app --reload
```

---

## Still Having Issues?

Check these:
1. PostgreSQL service running: `Get-Service postgresql-x64-18`
2. Correct password in `.env` file
3. User has permissions on database
4. Database `insurance_crc_db` exists

Test direct connection:
```powershell
cd "C:\Program Files\PostgreSQL\18\bin"
.\psql -U insurance_user -d insurance_crc_db -h localhost
```
(Enter password from .env file)

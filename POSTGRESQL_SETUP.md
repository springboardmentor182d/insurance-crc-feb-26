# PostgreSQL Setup Guide for Insurance CRC - Windows 11

## Prerequisites

- Windows 11 (64-bit)
- Administrator access
- PostgreSQL 12+ (recommended: PostgreSQL 18)
- psycopg2-binary installed (included in requirements.txt)
- python-dotenv installed (included in requirements.txt)

## Installation Steps

### 1. Install PostgreSQL on Windows 11

#### Step 1: Download PostgreSQL
- Visit: https://www.postgresql.org/download/windows/
- Choose the **Windows x86-64** installer (for 64-bit Windows 11)
- Download the latest stable version (e.g., PostgreSQL 18)

#### Step 2: Run Installer
1. Double-click the installer (.exe file)
2. Click "Next" to begin setup
3. Select installation directory (default: `C:\Program Files\PostgreSQL\18`)
4. Choose components to install:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4
   - ✅ Stack Builder
   - ✅ Command Line Tools
5. Click "Next"

#### Step 3: Configure Database Server
1. Set **Port**: 5432 (default)
2. Set **Locale**: English, United States
3. Click "Next"

#### Step 4: Set postgres User Password
1. Enter a strong password for the `postgres` user (e.g., `Postgres@2024`)
2. **Note this password** - you'll need it later
3. Click "Next" and complete installation

#### Step 5: Verify Installation
After installation, PostgreSQL runs as a Windows service automatically. To verify:

1. **Open Command Prompt (cmd.exe) or PowerShell as Administrator**
2. Test the connection:
   ```cmd
   psql -U postgres -h localhost
   ```
3. Enter the password you set
4. You should see the PostgreSQL prompt: `postgres=#`
5. Type `\q` to exit

### 2. Create Database and User

#### Step 1: Open PostgreSQL Command Line on Windows 11

**Option A: Using Command Prompt (Recommended)**
1. Press `Win + R` to open Run dialog
2. Type `cmd` and press Enter
3. Navigate to PostgreSQL bin directory:
   ```cmd
   cd "C:\Program Files\PostgreSQL\15\bin"
   ```
4. Connect to PostgreSQL:
   ```cmd
   psql -U postgres -h localhost
   ```
5. Enter the `postgres` password you set during installation

**Option B: Using pgAdmin 4 (GUI)**
1. Open pgAdmin 4 from Windows Start Menu
2. Right-click "Servers" → Create → Server
3. Enter connection details and create database there

#### Step 2: Execute SQL Commands in psql

Once connected, run these SQL commands one by one:

```sql
-- Create database for Insurance CRC
CREATE DATABASE insurance_crc_db;

-- Create user with password
CREATE USER insurance_user WITH PASSWORD 'secure_password_here';

-- Grant privileges
ALTER ROLE insurance_user SET client_encoding TO 'utf8';
ALTER ROLE insurance_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE insurance_user SET default_transaction_deferrable TO on;
ALTER ROLE insurance_user SET timezone TO 'UTC';

-- Grant all privileges on database to user
GRANT ALL PRIVILEGES ON DATABASE insurance_crc_db TO insurance_user;

-- Exit psql
\q
```

#### Step 3: Verify Database Creation
```cmd
psql -U insurance_user -d insurance_crc_db -h localhost
```

If successful, you'll see:
```
insurance_crc_db=>
```

### 3. Update Environment Variables for Windows 11

#### Step 1: Create .env File
1. Navigate to the project's `server` folder
2. Create a new file named `.env` (or edit if it exists)
3. Add the following configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://insurance_user:secure_password_here@localhost:5432/insurance_crc_db

# Application Configuration
DEBUG=True
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
```

**Note:** Replace `secure_password_here` with the actual password you created for `insurance_user`

#### Step 2: Verify .env Location
The `.env` file should be at:
```
C:\Users\<YourUsername>\Desktop\VSCF\insurance-crc-feb-26\server\.env
```

### 4. Install Python Dependencies on Windows 11

#### Step 1: Open PowerShell as Administrator
1. Press `Win + X` and select "Windows PowerShell (Admin)"
2. Navigate to the server folder:
   ```powershell
   cd "C:\Users\<YourUsername>\Desktop\VSCF\insurance-crc-feb-26\server"
   ```
   
#### Step 2: Create Virtual Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows 11 PowerShell)
.\venv\Scripts\Activate.ps1

# If you get an execution policy error, run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

You should see `(venv)` prefix in your PowerShell prompt.

#### Step 3: Install Dependencies
```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install from requirements
pip install -r requirements.txt
```

Wait for installation to complete (takes 2-3 minutes)

### 5. Initialize Database Tables on Windows 11

With the virtual environment still active, run:

```powershell
# Make sure you're in the server directory
cd "C:\Users\<YourUsername>\Desktop\VSCF\insurance-crc-feb-26\server"

# Initialize database
python -c "from src.database import init_db; init_db()"
```

Wait for confirmation message: `"Database initialization complete!"`

### 6. Run the Application on Windows 11

#### Option A: Using PowerShell (Recommended)
```powershell
# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Run uvicorn server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The server should start and show:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### Option B: Using Quick Start Batch File
Navigate to the project root and double-click:
```
quick-start.bat
```

This will automatically set up everything and start the server.

## Verify Database Setup on Windows 11

### Check PostgreSQL Service Status
```powershell
# Check if PostgreSQL service is running
Get-Service | Where-Object {$_.Name -like '*postgres*'}
```

Should show: `postgresql-x64-15  Running`

### Check Database Connection
```cmd
# From Command Prompt
psql -U insurance_user -d insurance_crc_db -h localhost
```

Or:
```powershell
# From PowerShell
psql -U insurance_user -d insurance_crc_db -h localhost
```

### View Tables
```sql
-- List all tables
\dt

-- Describe users table
\d+ users

-- View user data
SELECT * FROM users;

-- Exit
\q
```

### Test API Connection
Open a browser and visit:
- http://localhost:8000/admin/overview
- http://localhost:8000/catalog/policies

## Migration from SQLite to PostgreSQL (If Applicable)

If you had existing SQLite database:

1. **Export SQLite data** (if needed)
   ```powershell
   # Using Python to export SQLite
   python sqlite_export.py
   ```

2. **Database schema is auto-created** by SQLAlchemy when the app starts
3. **Sample data is auto-populated** by the `populate_sample_data()` function on first startup

## PostgreSQL Service Management on Windows 11

### Start PostgreSQL Service
```powershell
# Open PowerShell as Administrator
Start-Service -Name "postgresql-x64-15"
```

### Stop PostgreSQL Service
```powershell
# Open PowerShell as Administrator
Stop-Service -Name "postgresql-x64-15"
```

### Restart PostgreSQL Service
```powershell
# Open PowerShell as Administrator
Restart-Service -Name "postgresql-x64-15"
```

**Note:** Replace `postgresql-x64-15` with your PostgreSQL version if different.

## Database Schema

### Tables Created:
- `users` - Policyholders
- `fraud_rules` - Fraud detection rules
- `claims` - Insurance claims
- `claim_stats` - Analytics data
- `policies` - Insurance policies
- `recommendations` - Policy recommendations

## Troubleshooting on Windows 11

### PostgreSQL Service Not Running
**Error:** `could not connect to server: No such file or directory`

**Solution:**
1. Open Services (Press `Win + R`, type `services.msc`)
2. Find "postgresql-x64-15"
3. Right-click and select "Start"
4. Or use PowerShell:
   ```powershell
   Start-Service -Name "postgresql-x64-15"
   ```

### Connection Refused on Port 5432
**Error:** `connection refused`

**Troubleshoot:**
1. Verify PostgreSQL is running:
   ```powershell
   Get-Service postgresql-x64-15 | Select-Object Status
   ```
2. Check firewall settings:
   - Open Windows Defender Firewall
   - Click "Allow an app through firewall"
   - Ensure PostgreSQL is listed

### Authentication Failed
**Error:** `password authentication failed for user "insurance_user"`

**Solution:**
1. Reset password using psql as postgres user:
   ```cmd
   cd "C:\Program Files\PostgreSQL\15\bin"
   psql -U postgres
   ```
2. In psql, run:
   ```sql
   ALTER USER insurance_user WITH PASSWORD 'new_secure_password';
   ```
3. Update the password in `.env` file

### psql Command Not Found
**Error:** `'psql' is not recognized`

**Solution:**
1. Add PostgreSQL to PATH:
   ```powershell
   $env:Path += ";C:\Program Files\PostgreSQL\15\bin"
   ```
2. Or use full path:
   ```cmd
   "C:\Program Files\PostgreSQL\15\bin\psql" -U postgres
   ```

### Python Virtual Environment Issues
**Error:** `activate command not found`

**Solution (Windows 11 PowerShell):**
```powershell
# Check if ExecutionPolicy is the issue
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate
.\venv\Scripts\Activate.ps1
```

### Database Connection from Python
**Error:** `psycopg2.OperationalError`

**Check:**
1. Verify `.env` file has correct credentials
2. Ensure PostgreSQL service is running
3. Test direct connection:
   ```cmd
   psql -U insurance_user -d insurance_crc_db -h localhost
   ```

### Permission Denied Error
**Error:** `permission denied for database`

**Solution:**
```sql
-- Connect as postgres user
psql -U postgres

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE insurance_crc_db TO insurance_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO insurance_user;
```

## Windows 11 Firewall Configuration

If you get connection errors, configure Windows Firewall:

1. **Open Windows Defender Firewall**
   - Press `Win + R`, type `wf.msc`

2. **Click "Inbound Rules"**

3. **Create New Rule:**
   - In the right panel, click "New Rule"
   - Select "Port" → Next
   - Select "TCP" and enter port `5432`
   - Select "Allow the connection"
   - Apply to Domain, Private, Public
   - Name it: "PostgreSQL 5432"

## Production Configuration for Windows 11 Server

### For Production Deployment:

1. **Change SECRET_KEY** in `.env`
2. **Set DEBUG=False** in `.env`
3. **Use strong passwords** for database user
4. **Configure Windows Firewall** to restrict PostgreSQL access
5. **Set up automated backups** using Windows Task Scheduler:
   ```batch
   REM Create a backup batch file (backup_db.bat)
   "C:\Program Files\PostgreSQL\15\bin\pg_dump" -U insurance_user -d insurance_crc_db > "C:\backups\insurance_crc_db_%date:~10,4%_%date:~4,2%_%date:~7,2%.sql"
   ```
6. **Schedule the backup** using Windows Task Scheduler

Example production `.env` configuration:
```env
DATABASE_URL=postgresql://insurance_user:very_strong_password@db_server:5432/insurance_crc_db
DEBUG=False
ENVIRONMENT=production
```

## Backup and Restore on Windows 11

### Backup Database
```cmd
REM Open Command Prompt and run:
cd "C:\Program Files\PostgreSQL\15\bin"
pg_dump -U insurance_user -d insurance_crc_db > "C:\backups\insurance_crc_backup.sql"
```

Or create a PowerShell script:
```powershell
# Save as backup_database.ps1
$backupPath = "C:\backups\insurance_crc_backup_$(Get-Date -Format 'yyyy-MM-dd_HHmm').sql"
& "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -U insurance_user -d insurance_crc_db > $backupPath
Write-Host "Backup created at: $backupPath"
```

### Restore Database
```cmd
cd "C:\Program Files\PostgreSQL\15\bin"
psql -U insurance_user -d insurance_crc_db < "C:\backups\insurance_crc_backup.sql"
```

## Docker Option on Windows 11

If you want to run PostgreSQL in Docker (requires Docker Desktop for Windows):

1. **Install Docker Desktop for Windows**
   - Download from: https://www.docker.com/products/docker-desktop

2. **Run PostgreSQL Container**
   ```cmd
   docker run --name insurance-db ^
     -e POSTGRES_USER=insurance_user ^
     -e POSTGRES_PASSWORD=secure_password ^
     -e POSTGRES_DB=insurance_crc_db ^
     -p 5432:5432 ^
     -d postgres:15
   ```

3. **Update `.env` file:**
   ```env
   DATABASE_URL=postgresql://insurance_user:secure_password@localhost:5432/insurance_crc_db
   ```

4. **Verify Container is Running**
   ```cmd
   docker ps
   ```

## Windows 11 PATH Configuration (If Needed)

To permanently add PostgreSQL to your PATH:

1. Press `Win + X`, search for "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "User variables" or "System variables", click "New"
5. Variable name: `POSTGRESQL_BIN`
6. Variable value: `C:\Program Files\PostgreSQL\15\bin`
7. Click OK and restart your terminal/IDE

Now `psql` command will work from anywhere:
```cmd
psql -U postgres
```

## API Testing on Windows 11

### Test the API Using PowerShell

After setup is complete, test the API endpoints:

```powershell
# Check health
Invoke-WebRequest -Uri http://localhost:8000/health

# Get policies (should include sample data)
Invoke-WebRequest -Uri http://localhost:8000/catalog/policies

# Get recommendations
Invoke-WebRequest -Uri http://localhost:8000/catalog/recommendations

# Get admin overview
Invoke-WebRequest -Uri http://localhost:8000/admin/overview
```

### Or Using Browser

Simply visit in your web browser:
- Health: http://localhost:8000/health
- Policies: http://localhost:8000/catalog/policies
- Recommendations: http://localhost:8000/catalog/recommendations
- Admin Overview: http://localhost:8000/admin/overview

### Using cURL on Windows 11

If you have Git Bash or cURL installed:
```bash
# Check health
curl http://localhost:8000/health

# Get policies
curl http://localhost:8000/catalog/policies

# Get recommendations
curl http://localhost:8000/catalog/recommendations

# Get admin overview
curl http://localhost:8000/admin/overview
```

# Insurance CRC Backend Server

FastAPI-based backend server for the Insurance Claims Review and Compliance (CRC) system.

## Database Configuration

**This application uses PostgreSQL as the primary database.**

### Prerequisites

1. **PostgreSQL 12+** installed and running
2. **Python 3.8+** installed
3. Database created and user configured

### Setup Instructions

1. **Install PostgreSQL** (if not already installed)
   - See [POSTGRESQL_SETUP.md](../POSTGRESQL_SETUP.md) for detailed Windows 11 installation guide

2. **Configure Database Connection**
   - Copy `.env.example` to `.env` (if exists) or update `.env` directly
   - Set your PostgreSQL connection string:
     ```env
     DATABASE_URL=postgresql://username:password@localhost:5432/insurance_crc_db
     ```

3. **Install Python Dependencies**
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate (Windows PowerShell)
   .\venv\Scripts\Activate.ps1

   # Install dependencies
   pip install -r requirements.txt
   ```

4. **Initialize Database**
   ```bash
   python -c "from src.database import init_db; init_db()"
   ```

5. **Run the Server**
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Key Endpoints

### Admin Dashboard
- `GET /admin/overview` - Dashboard statistics
- `GET /admin/users` - List all users
- `GET /admin/claims` - List all claims
- `GET /admin/fraud-rules` - Fraud detection rules
- `GET /admin/analytics/comprehensive` - Comprehensive analytics
- `GET /admin/recent-activity` - Recent activity logs
- `GET /admin/quick-stats` - Quick statistics
- `GET /admin/system-alerts` - System alerts

### Catalog
- `GET /catalog/policies` - Insurance policies
- `GET /catalog/recommendations` - Policy recommendations

## Database Schema

The application automatically creates the following tables:
- `users` - Policyholders
- `claims` - Insurance claims
- `fraud_rules` - Fraud detection rules
- `policies` - Insurance policies catalog
- `recommendations` - AI-based policy recommendations
- `claim_stats` - Historical analytics data
- `activity_logs` - System activity tracking

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `DEBUG` | Enable debug mode | `True` or `False` |
| `SECRET_KEY` | JWT secret key | `your-secret-key` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |
| `ENVIRONMENT` | Environment name | `development` or `production` |

## Troubleshooting

### Database Connection Error
```
ValueError: DATABASE_URL environment variable is not set
```
**Solution:** Ensure `.env` file exists with valid `DATABASE_URL`

### PostgreSQL Connection Refused
```
psycopg2.OperationalError: connection refused
```
**Solution:** Ensure PostgreSQL service is running:
```powershell
Get-Service postgresql-x64-15
```

### Import Errors
```
ModuleNotFoundError: No module named 'psycopg2'
```
**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

## Development

### Running Tests
```bash
pytest tests/
```

### Checking Code Quality
```bash
# Format code
black src/

# Lint code
pylint src/
```

## Migration from SQLite

**Note:** As of this version, SQLite support has been removed. The application now requires PostgreSQL exclusively.

If you were previously using SQLite:
1. Export existing data (if needed)
2. Set up PostgreSQL using the guide above
3. The application will auto-create tables and populate sample data on first run

---

For more detailed PostgreSQL setup instructions, see [POSTGRESQL_SETUP.md](../POSTGRESQL_SETUP.md)
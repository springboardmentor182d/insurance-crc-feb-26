# insurance-crc-feb-26
# BimaVerse Setup

## Prerequisites
- Docker Desktop running
- Python 3.10+
- Node.js + npm

## Backend Setup (FastAPI)
1. Go to `server`:
```powershell
cd "D:\Infosys Springboard\Policy compare app\insurance-crc-feb-26\server"
```

2. Create/activate venv (if not already created):
```powershell
python -m venv venv
.\venv\Scripts\activate
```

3. Install dependencies:
```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

4. Configure env file:
```powershell
copy .env.example .env
```
Recommended extra keys in `.env`:
- `ADMIN_SECRET=bimaverse-admin-2026`
- `JWT_SECRET_KEY=change-this`
- `JWT_REFRESH_SECRET_KEY=change-this`

5. Start PostgreSQL:
```powershell
docker compose up -d
docker compose ps
```

6. Run migrations:
```powershell
.\venv\Scripts\alembic.exe upgrade head
```

7. Seed sample data:
```powershell
.\venv\Scripts\python.exe -m src.database.seed
```

8. Run API:
```powershell
.\venv\Scripts\uvicorn.exe src.main:app --reload
```

Health check:
- `GET http://localhost:8000/health`

## Frontend Setup (React)
1. Go to `client`:
```powershell
cd "D:\Infosys Springboard\Policy compare app\insurance-crc-feb-26\client"
```

2. Install dependencies:
```powershell
npm install
```

3. Ensure API URL is set (in `client/.env`):
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```

4. Start frontend:
```powershell
npm start
```

## API Prefix Note
Backend currently serves both:
- `/api/v1/...` (primary for frontend)
- legacy root paths `...` (backward compatibility)

## Common Endpoints
Auth:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/admin/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Admin Dashboard:
- `GET /admin/stats`
- `GET /admin/claims-trends`
- `GET /admin/revenue`
- `GET /admin/policy-distribution`
- `GET /admin/top-adjusters`
- `GET /admin/recent-activity`

Manage Policies:
- `GET /admin/policies/stats`
- `GET /admin/policies`
- `GET /admin/policies/{policy_id}`
- `POST /admin/policies`
- `PUT /admin/policies/{policy_id}`
- `DELETE /admin/policies/{policy_id}`

Users:
- `GET /users/profile`
- `PUT /users/profile`
- `GET /users/preferences`
- `PUT /users/preferences`

## Tests
Backend:
```powershell
cd "D:\Infosys Springboard\Policy compare app\insurance-crc-feb-26\server"
.\venv\Scripts\python.exe -m pytest -q
```

Frontend:
```powershell
cd "D:\Infosys Springboard\Policy compare app\insurance-crc-feb-26\client"
$env:CI="true"; npm test
```

## Migration Workflow
When SQLAlchemy models change:
```powershell
.\venv\Scripts\alembic.exe revision --autogenerate -m "describe_change"
.\venv\Scripts\alembic.exe upgrade head
```

# BimaVerse Setup

## Prerequisites
- Docker Desktop running
- Python 3.10+ in `server/venv`

## Backend Quick Start
1. Go to server folder:
```powershell
cd "D:\Infosys Springboard\Policy compare app\insurance-crc-feb-26\server"
```

2. Start PostgreSQL container:
```powershell
docker compose up -d
docker compose ps
```

3. Apply DB migrations:
```powershell
.\venv\Scripts\alembic.exe upgrade head
```

4. Seed sample data:
```powershell
.\venv\Scripts\python.exe -m src.database.seed
```

5. Run FastAPI server:
```powershell
.\venv\Scripts\uvicorn.exe src.main:app --reload
```

## Frontend Quick Start
1. Open a new terminal and go to client folder:
```powershell
cd "D:\Infosys Springboard\Policy compare app\insurance-crc-feb-26\client"
```

2. Install dependencies:
```powershell
npm install
```

3. Start frontend:
```powershell
npm start
```

If your setup uses Vite instead of CRA, use:
```powershell
npm run dev
```

## Migration Workflow
When schema changes are made in SQLAlchemy models:

1. Generate migration:
```powershell
.\venv\Scripts\alembic.exe revision --autogenerate -m "describe_change"
```

2. Apply migration:
```powershell
.\venv\Scripts\alembic.exe upgrade head
```

## Test Command
```powershell
cd "D:\Infosys Springboard\Policy compare app\insurance-crc-feb-26\server"
.\venv\Scripts\pytest.exe -q
```

## Admin Endpoints
- `/admin/stats`
- `/admin/claims-trends`
- `/admin/revenue`
- `/admin/policy-distribution`
- `/admin/top-adjusters`
- `/admin/recent-activity`

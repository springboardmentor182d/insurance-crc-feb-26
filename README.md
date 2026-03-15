# Insurance CRC (Final Run Guide)

This project has two apps:
- `server` (FastAPI + PostgreSQL)
- `client` (React)

The system is configured for real database data only.
No sample/fake data is auto-seeded.

## 1) Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL running on your machine
- A PostgreSQL database, for example: `insurance_crc_db`

## 2) Start Backend (Server)

Open PowerShell and run:

```powershell
Set-Location "server"

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Set real credentials (replace with your actual PostgreSQL password)
$env:DATABASE_URL="postgresql://postgres:YOUR_REAL_PASSWORD@localhost:5432/insurance_crc_db"
$env:AUTH_EMAIL="admin@example.com"
$env:AUTH_PASSWORD="StrongPass123"

uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:
- Health: `http://localhost:8000/health`
- API Docs: `http://localhost:8000/docs`

## 3) Start Frontend (Client)

Open a second PowerShell window and run:

```powershell
Set-Location "client"
npm install
$env:REACT_APP_BASE_URL="http://localhost:8000"
npm start
```

Frontend URL:
- `http://localhost:3000`

## 4) Login

Use:
- Email: `admin@example.com`
- Password: `StrongPass123`

If you changed `AUTH_EMAIL` or `AUTH_PASSWORD` in backend env vars, use those values.

## 5) Troubleshooting

- If backend fails with PostgreSQL auth error:
	- Check `DATABASE_URL` username/password.
	- Ensure database exists and PostgreSQL service is running.

- If frontend cannot call backend:
	- Ensure backend is running at `http://localhost:8000`.
	- Confirm `REACT_APP_BASE_URL` is set before `npm start`.

- Do not run `npm audit fix --force` in `client`.
	- It may break `react-scripts` and `npm start`.

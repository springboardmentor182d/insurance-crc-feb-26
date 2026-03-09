@echo off
REM Quick Start Script for Admin Dashboard (Windows)
REM This script helps you start both backend and frontend quickly

echo ==========================================
echo   Insurance CRC Admin Dashboard
echo   Quick Start Script (Windows)
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo √ Python and Node.js detected
echo.

REM Backend setup
echo Setting up Backend...
cd server

REM Create virtual environment if it doesn't exist
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo Installing backend dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo √ Backend setup complete!
echo.

REM Frontend setup
echo Setting up Frontend...
cd ..\client

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
)

echo.
echo √ Frontend setup complete!
echo.

echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo To start the application:
echo.
echo 1. Backend (Terminal 1):
echo    cd server\src
echo    uvicorn main:app --reload
echo.
echo 2. Frontend (Terminal 2):
echo    cd client
echo    npm start
echo.
echo Then visit: http://localhost:3000/admin
echo.

cd ..
pause

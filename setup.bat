@echo off
title AI DevOps Risk Analyzer — Setup
color 0A

echo.
echo  ============================================
echo   AI DevOps Risk Analyzer — Auto Setup
echo  ============================================
echo.

:: ── BACKEND SETUP ──
echo [1/4] Creating Python virtual environment...
cd /d "%~dp0backend"
python -m venv venv
if errorlevel 1 ( echo ERROR: Python not found. Install Python 3.9+ and retry. & pause & exit /b 1 )

echo [2/4] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
echo  Backend dependencies installed!

cd /d "%~dp0"

:: ── FRONTEND SETUP ──
echo [3/4] Installing Node dependencies...
cd /d "%~dp0frontend"
call npm install --silent
echo  Frontend dependencies installed!

cd /d "%~dp0"

:: ── START SERVERS ──
echo [4/4] Starting servers...
echo.
echo  Backend  → http://localhost:8000
echo  Frontend → http://localhost:3000
echo  API Docs → http://localhost:8000/docs
echo.
echo  Press Ctrl+C in each window to stop.
echo.

:: Start backend
start "Backend — FastAPI" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Wait for backend to spin up
timeout /t 4 /nobreak > nul

:: Start frontend
start "Frontend — React" cmd /k "cd /d %~dp0frontend && npm run dev"

echo  Both servers started! Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul
start http://localhost:3000

pause

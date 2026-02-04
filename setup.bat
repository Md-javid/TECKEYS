@echo off
echo ========================================
echo   BillAgent Pro - Quick Start Script
echo ========================================
echo.

:: Check if .env exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    echo Please copy .env.example to .env and add your Gemini API key.
    echo.
    echo Run: copy .env.example .env
    echo Then edit .env and add your API key.
    pause
    exit /b 1
)

echo [1/4] Checking prerequisites...
echo.

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo Please download and install from: https://www.python.org/
    pause
    exit /b 1
)
echo ✓ Python found
echo.

echo [2/4] Setting up backend...
cd backend

:: Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate venv and install dependencies
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt --quiet

:: Run migrations
echo Running database migrations...
python manage.py migrate --noinput

echo ✓ Backend setup complete
cd ..
echo.

echo [3/4] Setting up frontend...
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
) else (
    echo ✓ Node modules already installed
)
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo   🚀 BillAgent Pro is ready!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Open Terminal 1 and run:
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. Open Terminal 2 and run:
echo    npm run dev
echo.
echo 3. Open browser: http://localhost:3001
echo.
echo ========================================
pause

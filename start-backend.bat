@echo off
echo ========================================
echo   Starting BillAgent Pro Backend
echo ========================================
echo.

cd backend

if not exist "venv" (
    echo [ERROR] Virtual environment not found!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting Django server...
echo Backend will be available at: http://localhost:8000
echo API available at: http://localhost:8000/api
echo Admin panel at: http://localhost:8000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver

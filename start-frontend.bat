@echo off
echo ========================================
echo   Starting BillAgent Pro Frontend
echo ========================================
echo.

if not exist "node_modules" (
    echo [ERROR] Node modules not found!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Please create .env and add your Gemini API key.
    echo.
    pause
)

echo Starting Vite development server...
echo Frontend will be available at: http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

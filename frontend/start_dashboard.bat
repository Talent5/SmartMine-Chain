@echo off
echo ============================================
echo SmartMine Digital Twin Dashboard (Tailwind CSS)
echo ============================================
echo.

cd /d "%~dp0"

echo Checking Node.js environment...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found in PATH
    echo Please install Node.js or add it to PATH
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
npm install
if errorlevel 1 (
    echo WARNING: Some packages may not have installed correctly
)

echo.
echo ============================================
echo Starting SmartMine Dashboard with Tailwind CSS
echo ============================================
echo.
echo Dashboard Features:
echo - Modern Tailwind CSS design
echo - Real-time truck fleet monitoring
echo - Crusher operations dashboard
echo - Stockpile inventory tracking
echo - KPI metrics and alerts
echo - AI-powered insights
echo - 5-second data refresh intervals
echo.
echo The dashboard will be available at:
echo http://localhost:5173
echo.
echo Make sure the backend is running on:
echo ws://localhost:8765 (WebSocket)
echo http://localhost:5000 (API)
echo.
echo Press Ctrl+C to stop the dashboard
echo ============================================
echo.

npm start

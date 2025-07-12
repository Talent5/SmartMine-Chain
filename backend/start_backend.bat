@echo off
echo ============================================
echo SmartMine Digital Twin Backend Startup
echo ============================================
echo.

cd /d "%~dp0"

echo Checking Python environment...
python --version
if errorlevel 1 (
    echo ERROR: Python not found in PATH
    echo Please install Python or add it to PATH
    pause
    exit /b 1
)

echo.
echo Installing required packages...
pip install -r requirements.txt
if errorlevel 1 (
    echo WARNING: Some packages may not have installed correctly
)

echo.
echo ============================================
echo Starting SmartMine Backend Services
echo ============================================
echo.
echo Starting the following services:
echo - SmartMine Digital Twin Simulator (WebSocket Server)
echo - Flask API Server (REST API)
echo - Real-time data streaming (5-second intervals)
echo.
echo The system will be available at:
echo - WebSocket: ws://localhost:8765
echo - API Server: http://localhost:5000
echo.
echo Press Ctrl+C to stop all services
echo ============================================
echo.

python main.py

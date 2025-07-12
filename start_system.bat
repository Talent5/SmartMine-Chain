@echo off
setlocal EnableDelayedExpansion

echo 🚀 Starting Digital Twin Prototype System
echo ========================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python first.
    pause
    exit /b 1
)

echo 📦 Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo 📦 Installing Node.js dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo 🤖 Training ML models...
python ml_models.py
if %errorlevel% neq 0 (
    echo ⚠️ ML model training failed, but continuing...
)

echo.
echo 🏭 Starting Digital Twin Simulator...
start "Digital Twin Simulator" cmd /k "python digital_twin_simulator.py"
timeout /t 3 >nul

echo 🔧 Starting API Server...
start "API Server" cmd /k "python api_server.py"
timeout /t 3 >nul

echo ⚛️ Starting React Frontend...
cd frontend
start "React Frontend" cmd /k "npm start"
cd ..

echo.
echo 🎉 Digital Twin System is now running!
echo ========================================
echo 📊 React Dashboard: http://localhost:3000
echo 🔧 API Server: http://localhost:5000
echo 🏭 WebSocket Simulator: ws://localhost:8765
echo.
echo 💡 Simulator Controls (in simulator terminal):
echo    - Type 'fault' to inject a fault
echo    - Type 'maintenance' to perform maintenance
echo    - Type 'speed X' to change simulation speed
echo    - Type 'quit' to stop
echo.
echo ⚠️ Close the terminal windows to stop the services
echo.
echo Press any key to exit this launcher...
pause >nul

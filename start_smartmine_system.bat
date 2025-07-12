@echo off
echo ============================================
echo SmartMine Digital Twin - Complete System
echo ============================================
echo.

cd /d "%~dp0"

echo Starting SmartMine Digital Twin System...
echo.
echo This will launch:
echo 1. Backend Services (WebSocket + API)
echo 2. Frontend Dashboard
echo.
echo System Architecture:
echo - Backend: http://localhost:5000 (API)
echo - WebSocket: ws://localhost:8765 (5-second streaming)
echo - Frontend: http://localhost:5173 (Dashboard)
echo.

echo ============================================
echo Starting Backend Services...
echo ============================================
cd backend
start /b python main.py

echo Waiting for backend to initialize...
timeout /t 10 /nobreak

echo ============================================
echo Starting Frontend Dashboard...
echo ============================================
cd ..\frontend
start /b npm start

echo ============================================
echo SmartMine Digital Twin System Started!
echo ============================================
echo.
echo Services Status:
echo ✓ Backend API Server: http://localhost:5000
echo ✓ WebSocket Streaming: ws://localhost:8765
echo ✓ Frontend Dashboard: http://localhost:5173
echo.
echo Data Streaming: Every 5 seconds
echo Dashboard Features:
echo - Real-time truck fleet monitoring
echo - Crusher operations tracking  
echo - Stockpile inventory management
echo - Mine map visualization
echo - AI-powered insights and alerts
echo.
echo ============================================
echo Access the dashboard at: http://localhost:5173
echo ============================================
echo.
echo Press any key to exit and stop all services...
pause

echo Stopping services...
taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul
echo Services stopped.
pause

#!/bin/bash

# Digital Twin System Startup Script

echo "🚀 Starting Digital Twin Prototype System"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python first."
    exit 1
fi

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down Digital Twin System..."
    
    # Kill background processes
    if [ ! -z "$SIMULATOR_PID" ]; then
        kill $SIMULATOR_PID 2>/dev/null
        echo "✅ Stopped simulator"
    fi
    
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null
        echo "✅ Stopped API server"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Stopped frontend"
    fi
    
    echo "🎉 Digital Twin System stopped successfully!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "🤖 Training ML models..."
python ml_models.py

echo "🏭 Starting Digital Twin Simulator..."
python digital_twin_simulator.py &
SIMULATOR_PID=$!
sleep 3

echo "🔧 Starting API Server..."
python api_server.py &
API_PID=$!
sleep 3

echo "⚛️ Starting React Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Digital Twin System is now running!"
echo "========================================"
echo "📊 React Dashboard: http://localhost:3000"
echo "🔧 API Server: http://localhost:5000"
echo "🏭 WebSocket Simulator: ws://localhost:8765"
echo ""
echo "💡 Simulator Controls (in simulator terminal):"
echo "   - Type 'fault' to inject a fault"
echo "   - Type 'maintenance' to perform maintenance"
echo "   - Type 'speed X' to change simulation speed"
echo "   - Type 'quit' to stop"
echo ""
echo "⚠️ Press Ctrl+C to stop all services"

# Wait for processes
wait

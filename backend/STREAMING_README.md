# SmartMine Digital Twin Backend

This backend provides real-time data streaming for the SmartMine Digital Twin system with 5-second intervals.

## Features

- 🏭 **SmartMine Digital Twin Simulator**: Realistic mining operations simulation
- 📡 **Real-time Data Streaming**: WebSocket server broadcasting every 5 seconds
- 🚛 **Truck Fleet Monitoring**: GPS tracking, load sensors, fuel levels
- 🏗️ **Crusher Operations**: Throughput, vibration, temperature monitoring
- 📦 **Stockpile Management**: Inventory levels, fill/discharge rates
- 🤖 **AI Optimization**: Predictive maintenance and operation recommendations
- 🌐 **REST API**: HTTP endpoints for data access and system status

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Backend
```bash
python main.py
```

Or use the Windows batch file:
```bash
start_backend.bat
```

### 3. Verify Streaming (Optional)
Test the 5-second streaming intervals:
```bash
python test_intervals.py
```

## System Architecture

```
SmartMine Backend
├── WebSocket Server (port 8765) - Data streaming every 5 seconds
├── Flask API Server (port 5000) - REST endpoints
├── Digital Twin Simulator - Mining operations simulation
└── ML Models - Predictive analytics
```

## API Endpoints

### System Status
- `GET /api/status` - Overall system status
- `GET /api/streaming-status` - Detailed streaming information

### Data Access
- `GET /api/current-data` - Latest mining data
- `POST /api/predictions` - ML predictions for equipment

### Historical Data
- `GET /api/historical-data` - Historical mining data

## WebSocket Data Stream

Connect to `ws://localhost:8765` to receive real-time mining data every 5 seconds.

### Data Structure
```json
{
  "timestamp": "2025-07-12T...",
  "mine_id": "SMARTMINE_001",
  "trucks": { ... },
  "crushers": { ... },
  "stockpiles": { ... },
  "mine_zones": { ... },
  "kpis": {
    "truck_utilization": 85.2,
    "crusher_availability": 92.1,
    "total_throughput": 2847.3
  },
  "alerts": [ ... ],
  "ai_recommendations": [ ... ]
}
```

## Streaming Verification

The system streams data every **5 seconds** exactly. You can verify this with:

```bash
python test_intervals.py
```

This will connect to the WebSocket and measure the actual intervals between messages.

## Configuration

Key settings can be modified in `config.py`:
- Database paths
- WebSocket ports
- Streaming intervals
- ML model parameters

## Troubleshooting

### Connection Issues
1. Ensure ports 8765 and 5000 are available
2. Check firewall settings
3. Verify Python dependencies are installed

### Data Not Streaming
1. Check if the simulator started successfully
2. Verify WebSocket connection in logs
3. Use `test_intervals.py` to diagnose timing issues

### Performance Issues
1. Monitor system resources
2. Check network latency
3. Adjust simulation speed if needed

## Development

### Project Structure
```
backend/
├── main.py              # Main entry point
├── api/
│   └── api_server.py    # Flask REST API
├── services/
│   ├── smartmine_simulator.py  # Main simulator
│   └── digital_twin_simulator.py
├── models/
│   └── ml_models.py     # Machine learning models
├── utils/
│   └── logger.py        # Logging configuration
└── config.py            # Configuration settings
```

### Testing
- `test_intervals.py` - Verify 5-second streaming intervals
- `test_streaming.py` - Comprehensive streaming and API tests

### Logging
Logs are configured in `utils/logger.py` with different levels for:
- System startup/shutdown
- Data streaming status
- WebSocket connections
- API requests
- Error handling

## License

This project is part of the SmartMine Digital Twin system.

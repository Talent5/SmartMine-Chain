# SmartMine Digital Twin Backend

## Overview
The SmartMine Digital Twin Backend provides real-time simulation, machine learning, and API services for mining operations monitoring and optimization.

## Architecture

```
backend/
├── main.py                 # Main application entry point
├── start.py               # Startup script
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
│
├── api/                   # REST API endpoints
│   ├── __init__.py
│   └── api_server.py      # Flask API server
│
├── services/              # Core business logic
│   ├── __init__.py
│   ├── smartmine_simulator.py    # Mining operations simulator
│   └── digital_twin_simulator.py # Industrial digital twin
│
├── models/                # Machine learning models
│   ├── __init__.py
│   └── ml_models.py       # Predictive maintenance models
│
└── utils/                 # Utility functions
    ├── __init__.py
    └── logger.py          # Logging configuration
```

## Features

### 🚛 Fleet Management
- Real-time truck monitoring
- GPS tracking and status updates
- Load capacity and fuel monitoring
- Predictive maintenance alerts

### ⚙️ Processing Plants
- Crusher operations monitoring
- Throughput and efficiency tracking
- Temperature and vibration monitoring
- Health score calculation

### 📦 Stockpile Management
- Inventory level monitoring
- Fill and discharge rate tracking
- Material type classification
- Capacity utilization alerts

### 🤖 AI Optimization
- Machine learning recommendations
- Predictive maintenance models
- Fleet dispatch optimization
- Anomaly detection

### 📡 Real-time Communication
- WebSocket streaming
- Live data updates
- Event-driven architecture
- Multi-client support

## Installation

1. **Prerequisites**
   ```bash
   Python 3.8+ required
   ```

2. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start Backend Services**
   ```bash
   python start.py
   ```
   
   Or directly:
   ```bash
   python main.py
   ```

## Configuration

The backend uses environment variables for configuration. Create a `.env` file:

```bash
# API Configuration
API_HOST=localhost
API_PORT=5000
API_DEBUG=false

# WebSocket Configuration
WEBSOCKET_HOST=localhost
WEBSOCKET_PORT=8766

# Simulation Configuration
SIMULATION_INTERVAL=5.0
MAX_TRUCKS=15
MAX_CRUSHERS=3
MAX_STOCKPILES=4

# Logging
LOG_LEVEL=INFO
LOG_FILE=smartmine.log

# CORS (for frontend)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## API Endpoints

### Equipment Status
- `GET /api/trucks` - Get all truck status
- `GET /api/crushers` - Get crusher operations
- `GET /api/stockpiles` - Get stockpile levels

### Machine Learning
- `GET /api/ml/health-prediction` - Equipment health predictions
- `GET /api/ml/recommendations` - AI optimization recommendations

### Mining Operations
- `GET /api/mining/zones` - Get mining zone information
- `GET /api/mining/kpis` - Get key performance indicators

### System Status
- `GET /api/health` - Backend health check
- `GET /api/version` - API version information

## WebSocket Events

The backend provides real-time data via WebSocket on `ws://localhost:8766`:

```javascript
// Connection
const ws = new WebSocket('ws://localhost:8766');

// Event types
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch(data.type) {
    case 'truck_update':
      // Handle truck status update
      break;
    case 'crusher_update':
      // Handle crusher status update
      break;
    case 'stockpile_update':
      // Handle stockpile level update
      break;
    case 'ai_recommendation':
      // Handle AI recommendation
      break;
  }
};
```

## Development

### Project Structure
- **API Layer**: Flask-based REST API with CORS support
- **Service Layer**: Business logic and simulation engines
- **Model Layer**: Machine learning and data models
- **Utils Layer**: Shared utilities and logging

### Adding New Features

1. **New API Endpoint**:
   ```python
   # In api/api_server.py
   @app.route('/api/new-endpoint')
   def new_endpoint():
       return jsonify({'data': 'value'})
   ```

2. **New Service**:
   ```python
   # In services/new_service.py
   class NewService:
       def process_data(self):
           # Business logic
           pass
   ```

3. **New Model**:
   ```python
   # In models/new_model.py
   class NewModel:
       def train(self, data):
           # ML training logic
           pass
   ```

### Testing

```bash
# Run tests (when available)
pytest

# Check code style
flake8 .

# Format code
black .
```

## Logging

The backend uses structured logging with configurable levels:

```python
from utils.logger import get_logger

logger = get_logger(__name__)
logger.info("Operation completed")
logger.warning("Resource running low")
logger.error("Process failed")
```

## Performance Monitoring

Key metrics tracked:
- API response times
- WebSocket connection count
- Simulation update frequency
- Memory and CPU usage
- ML model accuracy

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -an | findstr :5000
   
   # Kill the process or change port in config
   ```

2. **WebSocket Connection Failed**
   ```bash
   # Check if WebSocket server is running
   netstat -an | findstr :8766
   ```

3. **Missing Dependencies**
   ```bash
   # Reinstall requirements
   pip install -r requirements.txt --force-reinstall
   ```

4. **Data File Not Found**
   ```bash
   # Ensure dataset.csv exists in data/ directory
   ls ../data/dataset.csv
   ```

## Contributing

1. Follow Python PEP 8 style guidelines
2. Add type hints where possible
3. Include docstrings for functions and classes
4. Add tests for new features
5. Update documentation

## License

SmartMine Digital Twin Backend - Industrial IoT and Mining Operations Platform

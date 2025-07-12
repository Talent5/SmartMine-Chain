from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
import threading
import time
from datetime import datetime
import asyncio
import websockets
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from models.ml_models import PredictiveMaintenanceModel
from config import Config

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Configure CORS
    cors_config = Config.get_cors_config()
    CORS(app, origins=cors_config['origins'])
    
    return app

app = create_app()

# Global variables for storing current state
current_data = {}
ml_model = None
websocket_data_queue = []

# Initialize ML model
def initialize_ml_model():
    global ml_model
    try:
        # Create models directory if it doesn't exist
        models_dir = Path(__file__).parent.parent / 'models'
        models_dir.mkdir(exist_ok=True)
        
        ml_model = PredictiveMaintenanceModel()
        
        # Try to load models, or train new ones if missing
        try:
            ml_model.load_models(str(models_dir / 'digital_twin'))
            print("ML models loaded successfully!")
        except FileNotFoundError:
            print("ML model files not found, creating mock models for development")
            
            # Create mock models for development
            import pandas as pd
            import numpy as np
            from sklearn.ensemble import RandomForestClassifier, IsolationForest
            from sklearn.preprocessing import StandardScaler
            import joblib
            
            # Create simple random forest classifier
            ml_model.fault_classifier = RandomForestClassifier(n_estimators=10)
            ml_model.anomaly_detector = IsolationForest(n_estimators=10)
            ml_model.scaler = StandardScaler()
            ml_model.feature_columns = ['Vibration_Level', 'Temperature_Readings', 'Pressure_Data']
            
            # Save the mock models
            ml_model.save_models(str(models_dir / 'digital_twin'))
            print("Mock ML models created and saved successfully!")
    except Exception as e:
        print(f"Failed to initialize ML models: {e}")

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get system status"""
    return jsonify({
        'status': 'running',
        'ml_model_loaded': ml_model is not None,
        'current_time': datetime.now().isoformat(),
        'data_available': len(current_data) > 0,
        'websocket_connected': len(current_data) > 0,
        'data_queue_size': len(websocket_data_queue),
        'streaming_interval': '5 seconds',
        'last_data_timestamp': current_data.get('timestamp') if current_data else None
    })

@app.route('/api/streaming-status', methods=['GET'])
def get_streaming_status():
    """Get detailed streaming status"""
    return jsonify({
        'streaming_active': len(current_data) > 0,
        'total_messages_received': len(websocket_data_queue),
        'last_message_time': current_data.get('timestamp') if current_data else None,
        'data_categories': {
            'trucks': len(current_data.get('trucks', {})),
            'crushers': len(current_data.get('crushers', {})),
            'stockpiles': len(current_data.get('stockpiles', {})),
            'alerts': len(current_data.get('alerts', []))
        } if current_data else {},
        'connection_uri': 'ws://localhost:8765',
        'update_interval': '5 seconds'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    import time
    from datetime import datetime, timedelta
    
    # Check if we've received data recently (within last 10 seconds)
    is_healthy = False
    last_data_age = None
    
    if current_data and 'timestamp' in current_data:
        try:
            last_timestamp = datetime.fromisoformat(current_data['timestamp'].replace('Z', '+00:00'))
            current_time = datetime.now()
            last_data_age = (current_time - last_timestamp).total_seconds()
            is_healthy = last_data_age < 10  # Data is fresh if less than 10 seconds old
        except:
            is_healthy = False
    
    return jsonify({
        'status': 'healthy' if is_healthy else 'unhealthy',
        'timestamp': datetime.now().isoformat(),
        'data_streaming': is_healthy,
        'last_data_age_seconds': last_data_age,
        'websocket_queue_size': len(websocket_data_queue)
    }), 200 if is_healthy else 503

@app.route('/api/current-data', methods=['GET'])
def get_current_data():
    """Get current machine data"""
    if not current_data:
        return jsonify({'error': 'No current data available'}), 404
    
    return jsonify(current_data)

@app.route('/api/predictions', methods=['POST'])
def get_predictions():
    """Get ML predictions for given data"""
    if not ml_model:
        return jsonify({'error': 'ML model not loaded'}), 500
    
    try:
        data = request.json
        if not data:
            data = current_data
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Get fault prediction
        fault_prob, fault_pred = ml_model.predict_fault(data)
        
        # Get anomaly detection
        anomaly_score, is_anomaly = ml_model.detect_anomaly(data)
        
        return jsonify({
            'fault_probability': float(fault_prob[0]),
            'fault_prediction': int(fault_pred[0]),
            'anomaly_score': float(anomaly_score[0]),
            'is_anomaly': bool(is_anomaly[0]),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/historical-data', methods=['GET'])
def get_historical_data():
    """Get historical data from the original dataset"""
    try:
        # Load historical data
        df = pd.read_csv('data/dataset.csv')
        
        # Get parameters
        limit = request.args.get('limit', 1000, type=int)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Filter by date if provided
        if start_date or end_date:
            df['Datetime'] = pd.to_datetime(df['Datetime'])
            if start_date:
                df = df[df['Datetime'] >= start_date]
            if end_date:
                df = df[df['Datetime'] <= end_date]
        
        # Limit results
        df = df.tail(limit)
        
        # Convert to JSON
        data = df.to_dict('records')
        
        return jsonify({
            'data': data,
            'count': len(data),
            'total_records': len(pd.read_csv('data/dataset.csv'))
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/maintenance/recommendations', methods=['GET'])
def get_maintenance_recommendations():
    """Get maintenance recommendations based on current data"""
    if not current_data:
        return jsonify({'recommendations': []})
    
    recommendations = []
    
    # Check various conditions
    if current_data.get('Vibration_Level', 0) > 1.5:
        recommendations.append({
            'id': 1,
            'priority': 'urgent',
            'type': 'Mechanical',
            'title': 'High Vibration Alert',
            'description': 'Excessive vibration detected. Check bearing alignment and machine mounting.',
            'estimated_time': '2-4 hours',
            'estimated_cost': '$200-500',
            'due_date': datetime.now().isoformat()
        })
    
    if current_data.get('Temperature_Readings', 0) > 40:
        recommendations.append({
            'id': 2,
            'priority': 'warning',
            'type': 'Thermal',
            'title': 'Elevated Temperature',
            'description': 'Operating temperature above normal range. Verify cooling system operation.',
            'estimated_time': '1-2 hours',
            'estimated_cost': '$50-150',
            'due_date': datetime.now().isoformat()
        })
    
    if current_data.get('Tool_Wear_Rate', 0) > 30:
        recommendations.append({
            'id': 3,
            'priority': 'warning',
            'type': 'Tool Replacement',
            'title': 'Tool Wear Alert',
            'description': 'Tool wear rate indicates replacement needed within 48 hours.',
            'estimated_time': '30 minutes',
            'estimated_cost': '$100-300',
            'due_date': datetime.now().isoformat()
        })
    
    if current_data.get('Machine_Health_Index', 100) < 70:
        recommendations.append({
            'id': 4,
            'priority': 'urgent',
            'type': 'Comprehensive',
            'title': 'Machine Health Declining',
            'description': 'Overall machine health below acceptable threshold. Comprehensive inspection required.',
            'estimated_time': '4-8 hours',
            'estimated_cost': '$500-1500',
            'due_date': datetime.now().isoformat()
        })
    
    return jsonify({'recommendations': recommendations})

@app.route('/api/simulator/control', methods=['POST'])
def control_simulator():
    """Send control commands to the simulator"""
    try:
        command = request.json.get('command')
        
        # Here you would normally send commands to the simulator
        # For now, we'll just return a success response
        
        return jsonify({
            'success': True,
            'message': f'Command "{command}" sent to simulator',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/summary', methods=['GET'])
def get_analytics_summary():
    """Get analytics summary"""
    if not current_data:
        return jsonify({'error': 'No data available'}), 404
    
    try:
        # Calculate some basic analytics
        summary = {
            'machine_health': current_data.get('Machine_Health_Index', 0),
            'production_efficiency': current_data.get('Production_Rate', 0) / (current_data.get('Energy_Consumption', 1) + 1),
            'uptime_percentage': current_data.get('Machine_Utilization_Rate', 0),
            'fault_risk': current_data.get('fault_probability', 0) * 100,
            'last_updated': datetime.now().isoformat()
        }
        
        # Add predictions if ML model is available
        if ml_model:
            fault_prob, _ = ml_model.predict_fault(current_data)
            anomaly_score, is_anomaly = ml_model.detect_anomaly(current_data)
            
            summary.update({
                'predicted_fault_probability': float(fault_prob[0]),
                'anomaly_detected': bool(is_anomaly[0]),
                'anomaly_score': float(anomaly_score[0])
            })
        
        return jsonify(summary)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# WebSocket client to receive data from simulator
async def websocket_client():
    global current_data
    uri = "ws://localhost:8765"  # Updated to match simulator port
    
    print(f"Attempting to connect to SmartMine Simulator at {uri}...")
    
    while True:
        try:
            async with websockets.connect(uri, open_timeout=10) as websocket:
                print("✓ Connected to SmartMine Digital Twin Simulator")
                print("✓ Real-time data streaming started (5-second intervals)")
                
                async for message in websocket:
                    try:
                        data = json.loads(message)
                        current_data = data
                        
                        # Store in queue for potential batch processing
                        websocket_data_queue.append(data)
                        if len(websocket_data_queue) > 1000:
                            websocket_data_queue.pop(0)
                        
                        # Print confirmation every 10th message to avoid spam
                        if len(websocket_data_queue) % 10 == 0:
                            print(f"✓ Received mining data update (Total: {len(websocket_data_queue)} messages)")
                            
                    except json.JSONDecodeError:
                        print("⚠ Failed to decode JSON message from simulator")
                        continue
                        
        except Exception as e:
            print(f"✗ WebSocket connection error: {e}")
            print("⏳ Retrying connection in 5 seconds...")
            await asyncio.sleep(5)

def start_websocket_client():
    """Start WebSocket client in background thread"""
    def run_client():
        try:
            asyncio.run(websocket_client())
        except Exception as e:
            print(f"WebSocket client error: {e}")
    
    thread = threading.Thread(target=run_client, daemon=True)
    thread.start()
    print("✓ WebSocket client thread started")

def start_api_with_websocket():
    """Start both WebSocket client and Flask API server"""
    # Initialize ML model
    print("🔧 Initializing ML models...")
    initialize_ml_model()
    
    # Start WebSocket client
    print("🌐 Starting WebSocket client for real-time data...")
    start_websocket_client()
    
    # The WebSocket client will attempt to connect in the background
    return app

if __name__ == '__main__':
    # Initialize ML model
    initialize_ml_model()
    
    # Start WebSocket client
    start_websocket_client()
    
    # Start Flask app
    print("Starting Digital Twin API Server...")
    print("API will be available at http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)

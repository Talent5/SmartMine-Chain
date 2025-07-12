"""
Configuration settings for SmartMine Digital Twin Backend
"""
import os
from pathlib import Path

# --- Base Directory ---
BASE_DIR = Path(__file__).parent.parent

# --- API Configuration ---
API_HOST = os.getenv('API_HOST', 'localhost')
API_PORT = int(os.getenv('API_PORT', 5000))
API_DEBUG = os.getenv('API_DEBUG', 'False').lower() == 'true'

# --- WebSocket Configuration ---
WEBSOCKET_HOST = os.getenv('WEBSOCKET_HOST', 'localhost')
WEBSOCKET_PORT = int(os.getenv('WEBSOCKET_PORT', 8765))

# --- Database Configuration (for future use) ---
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///smartmine.db')

# --- Simulation Configuration ---
SIMULATION_INTERVAL = float(os.getenv('SIMULATION_INTERVAL', 5.0))  # seconds
MAX_TRUCKS = int(os.getenv('MAX_TRUCKS', 15))
MAX_CRUSHERS = int(os.getenv('MAX_CRUSHERS', 3))
MAX_STOCKPILES = int(os.getenv('MAX_STOCKPILES', 4))

# --- Data Configuration ---
DATA_DIR = BASE_DIR / 'data'
DATASET_FILE = DATA_DIR / 'dataset.csv'

# --- Machine Learning Configuration ---
ML_MODEL_PATH = BASE_DIR / 'models' / 'trained_models'
ML_RETRAIN_INTERVAL = int(os.getenv('ML_RETRAIN_INTERVAL', 3600))  # seconds

# --- Logging Configuration ---
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FILE = os.getenv('LOG_FILE', None)

# --- CORS Configuration ---
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')

# --- Mining Zones Configuration ---
MINING_ZONES = {
    'Zone_A': {'lat': -26.123456, 'lng': 28.123456, 'type': 'iron_ore'},
    'Zone_B': {'lat': -26.123556, 'lng': 28.123556, 'type': 'coal'},
    'Zone_C': {'lat': -26.123656, 'lng': 28.123656, 'type': 'copper_ore'},
    'Zone_D': {'lat': -26.123756, 'lng': 28.123756, 'type': 'limestone'},
    'Zone_E': {'lat': -26.123856, 'lng': 28.123856, 'type': 'gold_ore'}
}

# --- Equipment Configuration ---
TRUCK_CAPACITY_RANGE = (50, 100)  # tons
CRUSHER_CAPACITY_RANGE = (200, 400)  # tons/hour
STOCKPILE_CAPACITY_RANGE = (5000, 15000)  # cubic meters

# --- Performance Thresholds ---
HEALTH_THRESHOLD_WARNING = 70.0
HEALTH_THRESHOLD_CRITICAL = 50.0
FUEL_THRESHOLD_WARNING = 30.0
FUEL_THRESHOLD_CRITICAL = 15.0
TEMPERATURE_THRESHOLD_WARNING = 80.0
TEMPERATURE_THRESHOLD_CRITICAL = 95.0


class Config:
    """
    Configuration class providing methods to access settings.
    This class centralizes access to configuration variables defined at the module level.
    """
    
    @staticmethod
    def get_api_config():
        """Returns API server configuration as a dictionary."""
        return {
            'host': API_HOST,
            'port': API_PORT,
            'debug': API_DEBUG
        }
    
    @staticmethod
    def get_websocket_config():
        """Returns WebSocket server configuration as a dictionary."""
        return {
            'host': WEBSOCKET_HOST,
            'port': WEBSOCKET_PORT
        }
    
    @staticmethod
    def get_simulation_config():
        """Returns simulation parameters as a dictionary."""
        return {
            'interval': SIMULATION_INTERVAL,
            'max_trucks': MAX_TRUCKS,
            'max_crushers': MAX_CRUSHERS,
            'max_stockpiles': MAX_STOCKPILES
        }
    
    @staticmethod
    def get_ml_config():
        """Returns machine learning model configuration as a dictionary."""
        return {
            'model_path': ML_MODEL_PATH,
            'retrain_interval': ML_RETRAIN_INTERVAL
        }
    
    @staticmethod
    def get_logging_config():
        """Returns logging configuration as a dictionary."""
        return {
            'level': LOG_LEVEL,
            'file': LOG_FILE
        }
    
    @staticmethod
    def get_cors_config():
        """Returns CORS configuration as a dictionary."""
        return {
            'origins': CORS_ORIGINS
        }

    @staticmethod
    def get_data_config():
        """Returns data-related configuration."""
        return {
            'data_dir': DATA_DIR,
            'dataset_file': DATASET_FILE
        }

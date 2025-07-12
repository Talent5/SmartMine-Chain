"""
SmartMine Digital Twin Backend - Main Application Entry Point
"""
import asyncio
import logging
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

from api.api_server import create_app
from services.smartmine_simulator import SmartMineDigitalTwin
from utils.logger import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

class SmartMineBackend:
    def __init__(self):
        self.app = None
        self.simulator = None
        
    async def start_simulator(self):
        """Start the SmartMine digital twin simulator"""
        try:
            logger.info("Starting SmartMine Digital Twin Simulator...")
            self.simulator = SmartMineDigitalTwin()
            # Start the simulator with proper async handling
            await self.simulator.start_smartmine_simulation_async()
            logger.info("SmartMine Simulator started successfully")
        except Exception as e:
            logger.error(f"Failed to start simulator: {e}")
            raise
    
    async def start_api_server(self, host='localhost', port=5000):
        """Start the Flask API server asynchronously."""
        try:
            logger.info(f"Starting API server on {host}:{port}")
            from api.api_server import start_api_with_websocket
            self.app = start_api_with_websocket()
            
            # Wrap the blocking app.run() in an executor
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.app.run(host=host, port=port, debug=False, threaded=True)
            )
        except Exception as e:
            logger.error(f"Failed to start API server: {e}")
            raise

    async def start_all_services(self):
        """Start all backend services concurrently."""
        try:
            logger.info("🚀 Starting SmartMine Backend Services...")
            
            # Define tasks for simulator and API server
            simulator_task = self.start_simulator()
            api_server_task = self.start_api_server()
            
            # Run both services concurrently
            await asyncio.gather(simulator_task, api_server_task)
            
        except KeyboardInterrupt:
            logger.info("🛑 Shutting down SmartMine Backend...")
        except Exception as e:
            logger.error(f"❌ Error running backend services: {e}")
            raise

def main():
    """Main entry point"""
    logger.info("=" * 60)
    logger.info("SMARTMINE DIGITAL TWIN BACKEND")
    logger.info("=" * 60)
    logger.info("🏭 SmartMine Features:")
    logger.info("   📡 Real-time IoT sensor data")
    logger.info("   🚛 Truck fleet monitoring")
    logger.info("   🏗️  Crusher operations tracking")
    logger.info("   📦 Stockpile management")
    logger.info("   🤖 AI-powered optimization")
    logger.info("   📊 5-second data streaming intervals")
    logger.info("=" * 60)
    
    backend = SmartMineBackend()
    
    try:
        # Run the async event loop
        asyncio.run(backend.start_all_services())
    except KeyboardInterrupt:
        logger.info("🛑 Graceful shutdown completed")
        print("\n💡 To test the streaming functionality:")
        print("   python test_intervals.py")
    except Exception as e:
        logger.error(f"❌ Backend startup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

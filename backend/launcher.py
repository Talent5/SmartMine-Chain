import subprocess
import sys
import os
import time
import webbrowser
from threading import Thread

class DigitalTwinLauncher:
    def __init__(self):
        self.processes = []
        
    def check_dependencies(self):
        """Check if required packages are installed"""
        print("🔍 Checking dependencies...")
        
        required_packages = [
            'pandas', 'numpy', 'scikit-learn', 'plotly', 'streamlit',
            'dash', 'websockets', 'joblib'
        ]
        
        missing_packages = []
        
        for package in required_packages:
            try:
                __import__(package)
                print(f"✅ {package}")
            except ImportError:
                print(f"❌ {package}")
                missing_packages.append(package)
        
        if missing_packages:
            print(f"\n⚠️ Missing packages: {', '.join(missing_packages)}")
            print("Installing missing packages...")
            subprocess.run([sys.executable, '-m', 'pip', 'install'] + missing_packages)
        
        print("✅ All dependencies satisfied!\n")
    
    def train_models(self):
        """Train ML models if not already trained"""
        if not os.path.exists('models'):
            print("🤖 Training machine learning models...")
            process = subprocess.run([sys.executable, 'ml_models.py'], 
                                   capture_output=True, text=True)
            
            if process.returncode == 0:
                print("✅ Models trained successfully!")
            else:
                print(f"❌ Model training failed: {process.stderr}")
                return False
        else:
            print("✅ Models already exist!")
        
        return True
    
    def start_simulator(self):
        """Start the digital twin simulator"""
        print("🏭 Starting Digital Twin Simulator...")
        process = subprocess.Popen([sys.executable, 'digital_twin_simulator.py'])
        self.processes.append(process)
        
        # Give simulator time to start
        time.sleep(3)
        print("✅ Simulator started on ws://localhost:8765")
        return process
    
    def start_dashboard(self):
        """Start the Streamlit dashboard"""
        print("📊 Starting Dashboard...")
        process = subprocess.Popen([sys.executable, '-m', 'streamlit', 'run', 'dashboard.py'])
        self.processes.append(process)
        
        # Give dashboard time to start
        time.sleep(5)
        print("✅ Dashboard started on http://localhost:8501")
        
        # Open dashboard in browser
        try:
            webbrowser.open('http://localhost:8501')
        except:
            pass
        
        return process
    
    def cleanup(self):
        """Clean up processes"""
        print("\n🛑 Shutting down...")
        for process in self.processes:
            try:
                process.terminate()
                process.wait(timeout=5)
            except:
                try:
                    process.kill()
                except:
                    pass
        print("✅ Cleanup completed!")
    
    def run(self):
        """Main launcher function"""
        print("🚀 Digital Twin Prototype Launcher")
        print("=" * 50)
        
        try:
            # Step 1: Check dependencies
            self.check_dependencies()
            
            # Step 2: Train models
            if not self.train_models():
                return
            
            # Step 3: Start simulator
            self.start_simulator()
            
            # Step 4: Start dashboard
            self.start_dashboard()
            
            print("\n🎉 Digital Twin System is running!")
            print("📊 Dashboard: http://localhost:8501")
            print("🏭 Simulator: ws://localhost:8765")
            print("\n💡 Simulator Controls:")
            print("   - Type 'fault' to inject a fault")
            print("   - Type 'maintenance' to perform maintenance")
            print("   - Type 'speed X' to change simulation speed")
            print("   - Type 'quit' to stop")
            print("\n⚠️ Press Ctrl+C to stop all services")
            
            # Keep running until interrupted
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                pass
                
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            self.cleanup()

if __name__ == "__main__":
    launcher = DigitalTwinLauncher()
    launcher.run()

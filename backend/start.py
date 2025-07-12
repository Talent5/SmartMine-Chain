#!/usr/bin/env python3
"""
SmartMine Digital Twin Backend Startup Script
"""
import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")

def check_requirements():
    """Check if requirements are installed"""
    requirements_file = Path(__file__).parent / "requirements.txt"
    
    try:
        import flask
        import pandas
        import numpy
        import sklearn
        import websockets
        print("✅ Core requirements are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing requirement: {e}")
        print(f"Please install requirements: pip install -r {requirements_file}")
        return False

def start_backend():
    """Start the SmartMine backend services"""
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("🚀 Starting SmartMine Digital Twin Backend...")
    print("=" * 60)
    
    # Start the main application
    try:
        subprocess.run([sys.executable, "main.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend failed to start: {e}")
        sys.exit(1)

def main():
    print("SmartMine Digital Twin Backend")
    print("=" * 40)
    
    # Check system requirements
    check_python_version()
    
    if not check_requirements():
        sys.exit(1)
    
    # Start backend services
    start_backend()

if __name__ == "__main__":
    main()

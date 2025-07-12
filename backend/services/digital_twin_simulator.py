import pandas as pd
import numpy as np
import time
import random
from datetime import datetime, timedelta
import json
import asyncio
import websockets
from threading import Thread

class DigitalTwinSimulator:
    def __init__(self, base_data_path='data/dataset.csv'):
        """Initialize the digital twin simulator with historical data"""
        self.df = pd.read_csv(base_data_path)
        self.df['Datetime'] = pd.to_datetime(self.df['Datetime'])
        
        # Calculate statistical parameters for each sensor
        self.sensor_stats = {}
        self.sensor_columns = [
            'Vibration_Level', 'Temperature_Readings', 'Pressure_Data',
            'Acoustic_Signals', 'Humidity_Levels', 'Motor_Speed',
            'Torque_Data', 'Energy_Consumption', 'Production_Rate',
            'Tool_Wear_Rate', 'Machine_Utilization_Rate', 'Cycle_Time_Per_Operation',
            'Idle_Time', 'Machine_Load_Percentage', 'Ambient_Temperature',
            'Humidity', 'Air_Quality_Index', 'Machine_Health_Index',
            'Predictive_Maintenance_Scores', 'Component_Degradation_Index',
            'Real_Time_Performance_Index', 'Anomaly_Scores', 'Fault_Probability'
        ]
        
        for col in self.sensor_columns:
            self.sensor_stats[col] = {
                'mean': self.df[col].mean(),
                'std': self.df[col].std(),
                'min': self.df[col].min(),
                'max': self.df[col].max()
            }
        
        # Machine state variables
        self.current_state = 'normal'
        self.degradation_factor = 1.0
        self.fault_probability = 0.0
        self.last_maintenance = datetime.now()
        
        # Simulation parameters
        self.simulation_speed = 1.0  # 1.0 = real-time, 10.0 = 10x faster
        self.connected_clients = set()
        
    def simulate_sensor_drift(self, base_value, sensor_name, time_factor=1.0):
        """Simulate realistic sensor drift and noise"""
        stats = self.sensor_stats[sensor_name]
        
        # Add temporal drift
        drift = np.sin(time_factor * 0.01) * 0.1 * stats['std']
        
        # Add random noise
        noise = np.random.normal(0, 0.05 * stats['std'])
        
        # Apply degradation factor for certain sensors
        if sensor_name in ['Vibration_Level', 'Tool_Wear_Rate', 'Component_Degradation_Index']:
            degradation_effect = (self.degradation_factor - 1.0) * 0.3 * stats['std']
        else:
            degradation_effect = 0
        
        new_value = base_value + drift + noise + degradation_effect
        
        # Ensure value stays within realistic bounds
        return np.clip(new_value, stats['min'], stats['max'])
    
    def update_machine_state(self):
        """Update machine degradation and fault probability over time"""
        # Gradual degradation over time
        time_since_maintenance = (datetime.now() - self.last_maintenance).total_seconds() / 3600  # hours
        
        # Increase degradation factor over time
        self.degradation_factor = min(2.0, 1.0 + time_since_maintenance * 0.001)
        
        # Calculate fault probability based on degradation
        self.fault_probability = min(0.95, (self.degradation_factor - 1.0) * 0.5)
        
        # Random fault injection (low probability)
        if random.random() < 0.001:  # 0.1% chance per update
            self.inject_fault()
    
    def inject_fault(self):
        """Inject a simulated fault into the system"""
        fault_types = ['vibration', 'temperature', 'pressure', 'wear']
        fault_type = random.choice(fault_types)
        
        print(f"FAULT INJECTED: {fault_type} fault detected!")
        self.current_state = f'fault_{fault_type}'
        
        # Reset after some time
        def reset_fault():
            time.sleep(30)  # Fault lasts 30 seconds
            self.current_state = 'normal'
            print("Fault cleared - system back to normal")
        
        Thread(target=reset_fault, daemon=True).start()
    
    def perform_maintenance(self):
        """Simulate maintenance operation"""
        self.degradation_factor = 1.0
        self.fault_probability = 0.0
        self.last_maintenance = datetime.now()
        self.current_state = 'maintenance'
        print("Maintenance performed - system reset to optimal state")
        
        # Return to normal after maintenance
        def end_maintenance():
            time.sleep(10)
            self.current_state = 'normal'
        
        Thread(target=end_maintenance, daemon=True).start()
    
    def generate_real_time_data(self):
        """Generate real-time sensor data point"""
        # Get a random historical sample as base
        base_sample = self.df.sample(1).iloc[0]
        
        current_time = datetime.now()
        time_factor = time.time()
        
        # Update machine state
        self.update_machine_state()
        
        # Generate new sensor readings
        sensor_data = {
            'timestamp': current_time.isoformat(),
            'machine_id': 'MACHINE_001',
            'state': self.current_state,
            'degradation_factor': self.degradation_factor,
            'fault_probability': self.fault_probability
        }
        
        for sensor in self.sensor_columns:
            base_value = base_sample[sensor]
            
            # Apply fault-specific modifications
            if self.current_state.startswith('fault_'):
                fault_type = self.current_state.split('_')[1]
                if fault_type == 'vibration' and sensor == 'Vibration_Level':
                    base_value *= 3.0
                elif fault_type == 'temperature' and sensor == 'Temperature_Readings':
                    base_value *= 1.5
                elif fault_type == 'pressure' and sensor == 'Pressure_Data':
                    base_value *= 0.5
                elif fault_type == 'wear' and sensor == 'Tool_Wear_Rate':
                    base_value *= 2.0
            
            # Simulate sensor with drift and noise
            sensor_data[sensor] = self.simulate_sensor_drift(base_value, sensor, time_factor)
        
        return sensor_data
    
    async def websocket_handler(self, websocket, path):
        """Handle WebSocket connections for real-time data streaming"""
        self.connected_clients.add(websocket)
        print(f"Client connected. Total clients: {len(self.connected_clients)}")
        
        try:
            await websocket.wait_closed()
        finally:
            self.connected_clients.remove(websocket)
            print(f"Client disconnected. Total clients: {len(self.connected_clients)}")
    
    async def broadcast_data(self):
        """Broadcast real-time data to all connected clients"""
        while True:
            if self.connected_clients:
                data = self.generate_real_time_data()
                message = json.dumps(data, default=str)
                
                # Send to all connected clients
                disconnected = set()
                for client in self.connected_clients:
                    try:
                        await client.send(message)
                    except websockets.exceptions.ConnectionClosed:
                        disconnected.add(client)
                
                # Remove disconnected clients
                self.connected_clients -= disconnected
            
            # Wait based on simulation speed
            await asyncio.sleep(1.0 / self.simulation_speed)
    
    def start_simulation(self, host='localhost', port=8765):
        """Start the real-time simulation server"""
        print(f"Starting Digital Twin Simulator on ws://{host}:{port}")
        print("Available controls:")
        print("- Type 'fault' to inject a random fault")
        print("- Type 'maintenance' to perform maintenance")
        print("- Type 'speed X' to change simulation speed (e.g., 'speed 5')")
        print("- Type 'quit' to stop simulation")
        
        # Start WebSocket server
        start_server = websockets.serve(self.websocket_handler, host, port)
        
        # Start data broadcasting
        async def run_simulation():
            await asyncio.gather(
                start_server,
                self.broadcast_data()
            )
        
        # Start interactive console in separate thread
        def console_handler():
            while True:
                try:
                    command = input().strip().lower()
                    if command == 'quit':
                        print("Stopping simulation...")
                        break
                    elif command == 'fault':
                        self.inject_fault()
                    elif command == 'maintenance':
                        self.perform_maintenance()
                    elif command.startswith('speed '):
                        try:
                            speed = float(command.split()[1])
                            self.simulation_speed = max(0.1, min(100.0, speed))
                            print(f"Simulation speed set to {self.simulation_speed}x")
                        except (IndexError, ValueError):
                            print("Invalid speed. Use 'speed X' where X is a number.")
                    else:
                        print("Unknown command. Available: fault, maintenance, speed X, quit")
                except KeyboardInterrupt:
                    break
        
        Thread(target=console_handler, daemon=True).start()
        
        # Run the simulation
        try:
            asyncio.run(run_simulation())
        except KeyboardInterrupt:
            print("\nSimulation stopped.")

if __name__ == "__main__":
    simulator = DigitalTwinSimulator()
    simulator.start_simulation()

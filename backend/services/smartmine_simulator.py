import pandas as pd
import numpy as np
import time
import random
from datetime import datetime, timedelta
import json
import asyncio
import websockets
from threading import Thread
import uuid
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

import config

class SmartMineDigitalTwin:
    def __init__(self, base_data_path=None):
        """Initialize the SmartMine digital twin simulator"""
        if base_data_path is None:
            base_data_path = config.DATASET_FILE
        self.df = pd.read_csv(base_data_path)
        self.df['Datetime'] = pd.to_datetime(self.df['Datetime'])
        
        # Mining-specific state variables
        self.trucks = self.initialize_truck_fleet()
        self.crushers = self.initialize_crushers()
        self.stockpiles = self.initialize_stockpiles()
        self.mine_zones = self.initialize_mine_zones()
        
        # Simulation parameters
        self.simulation_speed = 1.0
        self.connected_clients = set()
        
        # Mining operations metrics
        self.daily_throughput = 0
        self.truck_utilization = {}
        self.crusher_efficiency = {}
        self.stockpile_levels = {}
        
    def initialize_truck_fleet(self):
        """Initialize truck fleet with GPS and load sensors"""
        trucks = {}
        for i in range(1, 16):  # 15 trucks
            trucks[f"TRUCK_{i:03d}"] = {
                'id': f"TRUCK_{i:03d}",
                'status': random.choice(['loading', 'hauling', 'dumping', 'idle', 'maintenance']),
                'load_capacity': random.uniform(200, 300),  # tons
                'current_load': 0,
                'gps_location': {
                    'lat': -26.2041 + random.uniform(-0.01, 0.01),  # Mining area coordinates
                    'lng': 28.0473 + random.uniform(-0.01, 0.01),
                    'elevation': random.uniform(1500, 1600)
                },
                'destination': None,
                'fuel_level': random.uniform(30, 100),
                'engine_hours': random.uniform(1000, 8000),
                'last_maintenance': datetime.now() - timedelta(days=random.randint(1, 30)),
                'health_score': random.uniform(75, 95),
                'speed': 0,
                'heading': random.uniform(0, 360)
            }
        return trucks
    
    def initialize_crushers(self):
        """Initialize crusher equipment with monitoring sensors"""
        crushers = {}
        for i in range(1, 4):  # 3 crushers
            crushers[f"CRUSHER_{i}"] = {
                'id': f"CRUSHER_{i}",
                'type': random.choice(['Primary', 'Secondary', 'Tertiary']),
                'status': random.choice(['running', 'idle', 'maintenance']),
                'throughput_capacity': random.uniform(800, 1200),  # tons/hour
                'current_throughput': 0,
                'power_consumption': random.uniform(2000, 5000),  # kW
                'vibration_level': random.uniform(0.1, 2.0),
                'temperature': random.uniform(40, 80),
                'liner_wear': random.uniform(10, 80),
                'oil_pressure': random.uniform(15, 25),
                'feed_size': random.uniform(800, 1200),  # mm
                'product_size': random.uniform(0, 150),  # mm
                'health_score': random.uniform(70, 95),
                'availability': random.uniform(85, 98)
            }
        return crushers
    
    def initialize_stockpiles(self):
        """Initialize stockpiles with inventory monitoring"""
        stockpiles = {}
        materials = ['ROM', 'Crushed_Ore', 'Fine_Ore', 'Waste_Rock']
        
        for i, material in enumerate(materials, 1):
            stockpiles[f"STOCKPILE_{material}"] = {
                'id': f"STOCKPILE_{material}",
                'material_type': material,
                'current_volume': random.uniform(5000, 50000),  # tons
                'max_capacity': random.uniform(60000, 100000),
                'min_threshold': random.uniform(2000, 5000),
                'max_threshold': random.uniform(80000, 95000),
                'fill_rate': 0,  # tons/hour
                'discharge_rate': 0,  # tons/hour
                'location': {
                    'lat': -26.2041 + random.uniform(-0.005, 0.005),
                    'lng': 28.0473 + random.uniform(-0.005, 0.005)
                },
                'grade': random.uniform(0.5, 3.5) if 'Ore' in material else 0,
                'moisture_content': random.uniform(2, 8)
            }
        return stockpiles
    
    def initialize_mine_zones(self):
        """Initialize mining zones with production targets"""
        zones = {}
        for i in range(1, 6):  # 5 mining zones
            zones[f"ZONE_{i}"] = {
                'id': f"ZONE_{i}",
                'zone_type': random.choice(['Open_Pit', 'Underground']),
                'status': random.choice(['active', 'planned', 'depleted']),
                'ore_reserve': random.uniform(10000, 100000),  # tons
                'grade': random.uniform(0.8, 4.2),  # g/t
                'strip_ratio': random.uniform(2.5, 8.0),
                'production_target': random.uniform(500, 2000),  # tons/day
                'current_production': 0,
                'active_benches': random.randint(1, 5),
                'blast_schedule': None,
                'equipment_assigned': []
            }
        return zones
    
    def update_truck_operations(self):
        """Update truck positions and operations"""
        for truck_id, truck in self.trucks.items():
            # Update truck position and status
            if truck['status'] == 'hauling':
                # Simulate truck movement
                speed = random.uniform(20, 45)  # km/h
                truck['speed'] = speed
                
                # Update GPS coordinates (simplified movement)
                truck['gps_location']['lat'] += random.uniform(-0.0001, 0.0001)
                truck['gps_location']['lng'] += random.uniform(-0.0001, 0.0001)
                
                # Chance to complete haul
                if random.random() < 0.1:
                    truck['status'] = 'dumping'
                    
            elif truck['status'] == 'loading':
                # Loading operation
                if truck['current_load'] < truck['load_capacity']:
                    truck['current_load'] += random.uniform(5, 15)
                else:
                    truck['status'] = 'hauling'
                    truck['destination'] = random.choice(list(self.stockpiles.keys()))
                    
            elif truck['status'] == 'dumping':
                # Dumping operation
                if truck['current_load'] > 0:
                    dump_amount = min(truck['current_load'], random.uniform(10, 20))
                    truck['current_load'] -= dump_amount
                    
                    # Update stockpile
                    if truck['destination'] and truck['destination'] in self.stockpiles:
                        self.stockpiles[truck['destination']]['current_volume'] += dump_amount
                else:
                    truck['status'] = 'idle'
                    truck['destination'] = None
                    
            elif truck['status'] == 'idle':
                # Chance to start new cycle
                if random.random() < 0.2:
                    truck['status'] = 'loading'
                    
            # Update fuel consumption
            if truck['status'] in ['hauling', 'loading']:
                truck['fuel_level'] -= random.uniform(0.1, 0.5)
                
            # Update health score
            truck['health_score'] -= random.uniform(0, 0.1)
            truck['health_score'] = max(50, truck['health_score'])
    
    def update_crusher_operations(self):
        """Update crusher operations and performance"""
        for crusher_id, crusher in self.crushers.items():
            if crusher['status'] == 'running':
                # Update throughput
                crusher['current_throughput'] = random.uniform(
                    crusher['throughput_capacity'] * 0.7,
                    crusher['throughput_capacity']
                )
                
                # Update operating parameters
                crusher['power_consumption'] = random.uniform(2500, 4800)
                crusher['vibration_level'] += random.uniform(-0.1, 0.1)
                crusher['temperature'] += random.uniform(-2, 2)
                crusher['liner_wear'] += random.uniform(0, 0.1)
                
                # Update health score
                crusher['health_score'] -= random.uniform(0, 0.05)
                
            elif crusher['status'] == 'idle':
                crusher['current_throughput'] = 0
                crusher['power_consumption'] = random.uniform(200, 500)
                
                # Chance to start running
                if random.random() < 0.1:
                    crusher['status'] = 'running'
                    
            # Maintenance check
            if crusher['health_score'] < 70 or crusher['liner_wear'] > 75:
                if random.random() < 0.05:
                    crusher['status'] = 'maintenance'
                    crusher['health_score'] = 95
                    crusher['liner_wear'] = 5
    
    def update_stockpile_levels(self):
        """Update stockpile inventory levels"""
        for stockpile_id, stockpile in self.stockpiles.items():
            # Calculate fill/discharge rates based on operations
            fill_rate = 0
            discharge_rate = 0
            
            # Add material from trucks
            for truck in self.trucks.values():
                if truck['destination'] == stockpile_id and truck['status'] == 'dumping':
                    fill_rate += random.uniform(50, 100)
            
            # Remove material to crushers
            if 'ROM' in stockpile_id or 'Crushed' in stockpile_id:
                for crusher in self.crushers.values():
                    if crusher['status'] == 'running':
                        discharge_rate += random.uniform(30, 80)
            
            stockpile['fill_rate'] = fill_rate
            stockpile['discharge_rate'] = discharge_rate
            
            # Update inventory
            net_change = (fill_rate - discharge_rate) / 60  # per minute
            stockpile['current_volume'] += net_change
            stockpile['current_volume'] = max(0, stockpile['current_volume'])
            stockpile['current_volume'] = min(stockpile['max_capacity'], stockpile['current_volume'])
    
    def calculate_kpis(self):
        """Calculate key performance indicators"""
        # Truck utilization
        active_trucks = sum(1 for truck in self.trucks.values() 
                          if truck['status'] in ['loading', 'hauling', 'dumping'])
        truck_utilization = (active_trucks / len(self.trucks)) * 100
        
        # Crusher availability
        running_crushers = sum(1 for crusher in self.crushers.values() 
                             if crusher['status'] == 'running')
        crusher_availability = (running_crushers / len(self.crushers)) * 100
        
        # Total throughput
        total_throughput = sum(crusher['current_throughput'] for crusher in self.crushers.values())
        
        # Stockpile utilization
        stockpile_utilization = {}
        for stockpile_id, stockpile in self.stockpiles.items():
            utilization = (stockpile['current_volume'] / stockpile['max_capacity']) * 100
            stockpile_utilization[stockpile_id] = utilization
        
        return {
            'truck_utilization': truck_utilization,
            'crusher_availability': crusher_availability,
            'total_throughput': total_throughput,
            'stockpile_utilization': stockpile_utilization,
            'active_equipment': {
                'trucks': active_trucks,
                'crushers': running_crushers
            }
        }
    
    def generate_mining_data(self):
        """Generate comprehensive mining operation data"""
        # Update all systems
        self.update_truck_operations()
        self.update_crusher_operations()
        self.update_stockpile_levels()
        
        # Calculate KPIs
        kpis = self.calculate_kpis()
        
        # Generate comprehensive data packet
        mining_data = {
            'timestamp': datetime.now().isoformat(),
            'mine_id': 'SMARTMINE_001',
            'trucks': self.trucks,
            'crushers': self.crushers,
            'stockpiles': self.stockpiles,
            'mine_zones': self.mine_zones,
            'kpis': kpis,
            'weather': {
                'temperature': random.uniform(15, 35),
                'humidity': random.uniform(20, 80),
                'wind_speed': random.uniform(0, 25),
                'visibility': random.uniform(5, 15)
            },
            'shift_info': {
                'current_shift': 'Day' if 6 <= datetime.now().hour < 18 else 'Night',
                'shift_start': datetime.now().replace(hour=6, minute=0).isoformat(),
                'crew_count': random.randint(25, 45)
            },
            'alerts': self.generate_alerts(),
            'ai_recommendations': self.generate_ai_recommendations()
        }
        
        return mining_data
    
    def generate_alerts(self):
        """Generate operational alerts"""
        alerts = []
        
        # Truck alerts
        for truck_id, truck in self.trucks.items():
            if truck['fuel_level'] < 20:
                alerts.append({
                    'id': str(uuid.uuid4()),
                    'type': 'fuel_low',
                    'severity': 'warning',
                    'equipment': truck_id,
                    'message': f"{truck_id} fuel level low: {truck['fuel_level']:.1f}%",
                    'timestamp': datetime.now().isoformat()
                })
            
            if truck['health_score'] < 70:
                alerts.append({
                    'id': str(uuid.uuid4()),
                    'type': 'maintenance_required',
                    'severity': 'urgent',
                    'equipment': truck_id,
                    'message': f"{truck_id} requires maintenance - health score: {truck['health_score']:.1f}%",
                    'timestamp': datetime.now().isoformat()
                })
        
        # Stockpile alerts
        for stockpile_id, stockpile in self.stockpiles.items():
            utilization = (stockpile['current_volume'] / stockpile['max_capacity']) * 100
            
            if utilization > 90:
                alerts.append({
                    'id': str(uuid.uuid4()),
                    'type': 'stockpile_full',
                    'severity': 'warning',
                    'equipment': stockpile_id,
                    'message': f"{stockpile_id} near capacity: {utilization:.1f}%",
                    'timestamp': datetime.now().isoformat()
                })
            elif utilization < 10:
                alerts.append({
                    'id': str(uuid.uuid4()),
                    'type': 'stockpile_low',
                    'severity': 'urgent',
                    'equipment': stockpile_id,
                    'message': f"{stockpile_id} critically low: {utilization:.1f}%",
                    'timestamp': datetime.now().isoformat()
                })
        
        return alerts
    
    def generate_ai_recommendations(self):
        """Generate AI-powered optimization recommendations"""
        recommendations = []
        
        # Truck dispatch optimization
        idle_trucks = [t for t in self.trucks.values() if t['status'] == 'idle']
        if len(idle_trucks) > 3:
            recommendations.append({
                'type': 'truck_dispatch',
                'priority': 'medium',
                'title': 'Optimize Truck Allocation',
                'description': f'{len(idle_trucks)} trucks are idle. Consider redistributing to active zones.',
                'estimated_impact': 'Increase throughput by 12-18%'
            })
        
        # Stockpile management
        low_stockpiles = [s for s in self.stockpiles.values() 
                         if (s['current_volume'] / s['max_capacity']) < 0.2]
        if low_stockpiles:
            recommendations.append({
                'type': 'stockpile_management',
                'priority': 'high',
                'title': 'Replenish Low Stockpiles',
                'description': f'{len(low_stockpiles)} stockpiles below 20% capacity',
                'estimated_impact': 'Prevent production disruptions'
            })
        
        # Crusher optimization
        underperforming_crushers = [c for c in self.crushers.values() 
                                  if c['status'] == 'running' and c['current_throughput'] < c['throughput_capacity'] * 0.8]
        if underperforming_crushers:
            recommendations.append({
                'type': 'crusher_optimization',
                'priority': 'medium',
                'title': 'Optimize Crusher Performance',
                'description': f'{len(underperforming_crushers)} crushers operating below 80% capacity',
                'estimated_impact': 'Increase processing efficiency by 15%'
            })
        
        return recommendations
    
    async def websocket_handler(self, websocket):
        """Handle WebSocket connections for SmartMine data streaming"""
        self.connected_clients.add(websocket)
        print(f"SmartMine client connected. Total clients: {len(self.connected_clients)}")
        
        try:
            await websocket.wait_closed()
        finally:
            self.connected_clients.remove(websocket)
            print(f"SmartMine client disconnected. Total clients: {len(self.connected_clients)}")
    
    async def broadcast_mining_data(self):
        """Broadcast real-time mining data to all connected clients"""
        while True:
            if self.connected_clients:
                data = self.generate_mining_data()
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
            await asyncio.sleep(5.0 / self.simulation_speed)  # Update every 5 seconds
    
    def start_smartmine_simulation(self, host='localhost', port=8766):
        """Start the SmartMine digital twin simulation"""
        print(f"Starting SmartMine Digital Twin on ws://{host}:{port}")
        print("SmartMine Chain Features:")
        print("- IoT Sensor Network (GPS, Load sensors)")
        print("- Digital Twin Engine (Logistics simulation)")
        print("- AI Optimization Module (Truck dispatch, Stockpile alerts)")
        print("- Unified Operations Dashboard data")
        
        # Start WebSocket server
        start_server = websockets.serve(self.websocket_handler, host, port)
        
        # Start data broadcasting
        async def run_simulation():
            await asyncio.gather(
                start_server,
                self.broadcast_mining_data()
            )
        
        # Run the simulation
        try:
            asyncio.run(run_simulation())
        except KeyboardInterrupt:
            print("\nSmartMine simulation stopped.")
    
    async def start_smartmine_simulation_async(self, host='localhost', port=8765):
        """Start the SmartMine digital twin simulation asynchronously"""
        print(f"Starting SmartMine Digital Twin on ws://{host}:{port}")
        print("SmartMine Chain Features:")
        print("- IoT Sensor Network (GPS, Load sensors)")
        print("- Digital Twin Engine (Logistics simulation)")
        print("- AI Optimization Module (Truck dispatch, Stockpile alerts)")
        print("- Unified Operations Dashboard data")
        print("- Data streaming interval: 5 seconds")
        
        # Start WebSocket server
        start_server = websockets.serve(self.websocket_handler, host, port)
        
        # Start both server and data broadcasting
        await asyncio.gather(
            start_server,
            self.broadcast_mining_data()
        )

if __name__ == "__main__":
    smartmine = SmartMineDigitalTwin()
    smartmine.start_smartmine_simulation()

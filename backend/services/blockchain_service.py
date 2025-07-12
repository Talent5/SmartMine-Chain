"""
🔗 SMARTMINE BLOCKCHAIN INTEGRATION
Revolutionary blockchain technology for mining operations
- Equipment provenance tracking
- Supply chain transparency
- Smart contracts for maintenance
- Carbon credit tokenization
- Immutable audit trails
"""

import hashlib
import json
import time
from datetime import datetime
from typing import Dict, List, Optional
import uuid

class MiningBlock:
    """Individual block in the SmartMine blockchain"""
    
    def __init__(self, index: int, transactions: List[Dict], previous_hash: str):
        self.index = index
        self.timestamp = time.time()
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """Calculate the hash of the block"""
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def mine_block(self, difficulty: int):
        """Mine the block with proof of work"""
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()

class SmartMineBlockchain:
    """Revolutionary blockchain for mining operations"""
    
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.difficulty = 2
        self.pending_transactions = []
        self.mining_reward = 100
        
        # SmartMine specific features
        self.equipment_registry = {}
        self.supply_chain_records = {}
        self.maintenance_contracts = {}
        self.carbon_credits = {}
        self.safety_incidents = {}
        
    def create_genesis_block(self) -> MiningBlock:
        """Create the first block in the chain"""
        return MiningBlock(0, [{"type": "genesis", "message": "SmartMine Blockchain Genesis"}], "0")
    
    def get_latest_block(self) -> MiningBlock:
        """Get the most recent block"""
        return self.chain[-1]
    
    def add_transaction(self, transaction: Dict):
        """Add a transaction to pending transactions"""
        transaction['id'] = str(uuid.uuid4())
        transaction['timestamp'] = datetime.now().isoformat()
        self.pending_transactions.append(transaction)
    
    def mine_pending_transactions(self) -> bool:
        """Mine all pending transactions"""
        if not self.pending_transactions:
            return False
        
        block = MiningBlock(
            len(self.chain),
            self.pending_transactions,
            self.get_latest_block().hash
        )
        
        block.mine_block(self.difficulty)
        self.chain.append(block)
        self.pending_transactions = []
        
        # Process specialized mining transactions
        self._process_mining_transactions(block.transactions)
        
        return True
    
    def _process_mining_transactions(self, transactions: List[Dict]):
        """Process SmartMine specific transactions"""
        for tx in transactions:
            tx_type = tx.get('type')
            
            if tx_type == 'equipment_registration':
                self._register_equipment(tx)
            elif tx_type == 'maintenance_record':
                self._record_maintenance(tx)
            elif tx_type == 'supply_chain':
                self._track_supply_chain(tx)
            elif tx_type == 'carbon_credit':
                self._issue_carbon_credit(tx)
            elif tx_type == 'safety_incident':
                self._record_safety_incident(tx)
    
    def register_equipment(self, equipment_id: str, equipment_data: Dict):
        """🚛 Register new mining equipment on blockchain"""
        transaction = {
            'type': 'equipment_registration',
            'equipment_id': equipment_id,
            'manufacturer': equipment_data.get('manufacturer', 'Unknown'),
            'model': equipment_data.get('model', 'Unknown'),
            'serial_number': equipment_data.get('serial_number', 'Unknown'),
            'purchase_date': equipment_data.get('purchase_date', datetime.now().isoformat()),
            'specifications': equipment_data.get('specifications', {}),
            'warranty_info': equipment_data.get('warranty_info', {}),
            'operator': 'SmartMine_System'
        }
        self.add_transaction(transaction)
        
    def _register_equipment(self, tx: Dict):
        """Process equipment registration"""
        equipment_id = tx['equipment_id']
        self.equipment_registry[equipment_id] = {
            'registration_block': len(self.chain) - 1,
            'registration_time': tx['timestamp'],
            'manufacturer': tx['manufacturer'],
            'model': tx['model'],
            'serial_number': tx['serial_number'],
            'maintenance_history': [],
            'current_status': 'active'
        }
    
    def record_maintenance(self, equipment_id: str, maintenance_data: Dict):
        """🔧 Record maintenance on blockchain"""
        transaction = {
            'type': 'maintenance_record',
            'equipment_id': equipment_id,
            'maintenance_type': maintenance_data.get('type', 'routine'),
            'description': maintenance_data.get('description', ''),
            'technician': maintenance_data.get('technician', 'Unknown'),
            'parts_used': maintenance_data.get('parts_used', []),
            'cost': maintenance_data.get('cost', 0),
            'duration_hours': maintenance_data.get('duration_hours', 0),
            'next_maintenance_due': maintenance_data.get('next_due', ''),
            'operator': 'SmartMine_System'
        }
        self.add_transaction(transaction)
    
    def _record_maintenance(self, tx: Dict):
        """Process maintenance record"""
        equipment_id = tx['equipment_id']
        if equipment_id in self.equipment_registry:
            self.equipment_registry[equipment_id]['maintenance_history'].append({
                'block_index': len(self.chain) - 1,
                'timestamp': tx['timestamp'],
                'type': tx['maintenance_type'],
                'description': tx['description'],
                'technician': tx['technician'],
                'cost': tx['cost']
            })
    
    def track_material_shipment(self, shipment_data: Dict):
        """📦 Track material shipments on blockchain"""
        transaction = {
            'type': 'supply_chain',
            'shipment_id': str(uuid.uuid4()),
            'material_type': shipment_data.get('material_type', 'ore'),
            'quantity': shipment_data.get('quantity', 0),
            'source_location': shipment_data.get('source', 'mine_site'),
            'destination': shipment_data.get('destination', 'processing_plant'),
            'truck_id': shipment_data.get('truck_id', ''),
            'quality_metrics': shipment_data.get('quality', {}),
            'environmental_impact': shipment_data.get('environmental_impact', {}),
            'operator': 'SmartMine_System'
        }
        self.add_transaction(transaction)
    
    def _track_supply_chain(self, tx: Dict):
        """Process supply chain transaction"""
        shipment_id = tx['shipment_id']
        self.supply_chain_records[shipment_id] = {
            'block_index': len(self.chain) - 1,
            'timestamp': tx['timestamp'],
            'material_type': tx['material_type'],
            'quantity': tx['quantity'],
            'route': f"{tx['source_location']} → {tx['destination']}",
            'truck_id': tx['truck_id'],
            'status': 'recorded'
        }
    
    def issue_carbon_credit(self, credit_data: Dict):
        """🌱 Issue carbon credits for green mining practices"""
        transaction = {
            'type': 'carbon_credit',
            'credit_id': str(uuid.uuid4()),
            'co2_reduction_tons': credit_data.get('co2_reduction', 0),
            'green_practice': credit_data.get('practice', 'energy_efficiency'),
            'verification_agency': credit_data.get('verifier', 'SmartMine_AI'),
            'credit_value_usd': credit_data.get('value', 0),
            'valid_until': credit_data.get('expiry', ''),
            'equipment_id': credit_data.get('equipment_id', ''),
            'operator': 'SmartMine_System'
        }
        self.add_transaction(transaction)
    
    def _issue_carbon_credit(self, tx: Dict):
        """Process carbon credit issuance"""
        credit_id = tx['credit_id']
        self.carbon_credits[credit_id] = {
            'block_index': len(self.chain) - 1,
            'timestamp': tx['timestamp'],
            'co2_reduction_tons': tx['co2_reduction_tons'],
            'practice': tx['green_practice'],
            'value_usd': tx['credit_value_usd'],
            'status': 'active'
        }
    
    def record_safety_incident(self, incident_data: Dict):
        """🛡️ Record safety incidents immutably"""
        transaction = {
            'type': 'safety_incident',
            'incident_id': str(uuid.uuid4()),
            'severity': incident_data.get('severity', 'low'),
            'description': incident_data.get('description', ''),
            'location': incident_data.get('location', ''),
            'equipment_involved': incident_data.get('equipment_id', ''),
            'personnel_involved': incident_data.get('personnel', []),
            'corrective_actions': incident_data.get('actions', []),
            'investigation_status': incident_data.get('status', 'open'),
            'operator': 'SmartMine_System'
        }
        self.add_transaction(transaction)
    
    def _record_safety_incident(self, tx: Dict):
        """Process safety incident record"""
        incident_id = tx['incident_id']
        self.safety_incidents[incident_id] = {
            'block_index': len(self.chain) - 1,
            'timestamp': tx['timestamp'],
            'severity': tx['severity'],
            'description': tx['description'],
            'equipment_id': tx['equipment_involved'],
            'status': tx['investigation_status']
        }
    
    def get_equipment_history(self, equipment_id: str) -> Dict:
        """Get complete equipment history from blockchain"""
        if equipment_id not in self.equipment_registry:
            return {"error": "Equipment not found"}
        
        equipment = self.equipment_registry[equipment_id]
        
        # Get all maintenance records
        maintenance_history = []
        for block in self.chain:
            for tx in block.transactions:
                if (tx.get('type') == 'maintenance_record' and 
                    tx.get('equipment_id') == equipment_id):
                    maintenance_history.append({
                        'block_index': block.index,
                        'timestamp': tx['timestamp'],
                        'type': tx['maintenance_type'],
                        'description': tx['description'],
                        'cost': tx.get('cost', 0),
                        'technician': tx.get('technician', 'Unknown')
                    })
        
        return {
            'equipment_id': equipment_id,
            'registration': equipment,
            'maintenance_history': maintenance_history,
            'total_maintenance_cost': sum(m['cost'] for m in maintenance_history),
            'maintenance_count': len(maintenance_history),
            'blockchain_verified': True
        }
    
    def get_supply_chain_trace(self, material_type: str = None) -> List[Dict]:
        """Get supply chain traceability"""
        shipments = []
        
        for block in self.chain:
            for tx in block.transactions:
                if tx.get('type') == 'supply_chain':
                    if material_type is None or tx.get('material_type') == material_type:
                        shipments.append({
                            'block_index': block.index,
                            'shipment_id': tx['shipment_id'],
                            'timestamp': tx['timestamp'],
                            'material_type': tx['material_type'],
                            'quantity': tx['quantity'],
                            'route': f"{tx['source_location']} → {tx['destination']}",
                            'truck_id': tx.get('truck_id', ''),
                            'hash': block.hash
                        })
        
        return shipments
    
    def get_carbon_credits_summary(self) -> Dict:
        """Get carbon credits summary"""
        total_credits = len(self.carbon_credits)
        total_co2_reduction = sum(
            credit['co2_reduction_tons'] for credit in self.carbon_credits.values()
        )
        total_value = sum(
            credit['value_usd'] for credit in self.carbon_credits.values()
        )
        
        return {
            'total_credits_issued': total_credits,
            'total_co2_reduction_tons': total_co2_reduction,
            'total_value_usd': total_value,
            'average_credit_value': total_value / total_credits if total_credits > 0 else 0,
            'blockchain_verified': True
        }
    
    def validate_chain(self) -> bool:
        """Validate the entire blockchain"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Check if current block's hash is valid
            if current_block.hash != current_block.calculate_hash():
                return False
            
            # Check if current block points to previous block
            if current_block.previous_hash != previous_block.hash:
                return False
        
        return True
    
    def get_blockchain_stats(self) -> Dict:
        """Get comprehensive blockchain statistics"""
        total_blocks = len(self.chain)
        total_transactions = sum(len(block.transactions) for block in self.chain)
        
        # Count transaction types
        transaction_types = {}
        for block in self.chain:
            for tx in block.transactions:
                tx_type = tx.get('type', 'unknown')
                transaction_types[tx_type] = transaction_types.get(tx_type, 0) + 1
        
        return {
            'total_blocks': total_blocks,
            'total_transactions': total_transactions,
            'chain_valid': self.validate_chain(),
            'registered_equipment': len(self.equipment_registry),
            'supply_chain_records': len(self.supply_chain_records),
            'carbon_credits_issued': len(self.carbon_credits),
            'safety_incidents': len(self.safety_incidents),
            'transaction_types': transaction_types,
            'latest_block_hash': self.get_latest_block().hash,
            'blockchain_size_mb': len(json.dumps([block.__dict__ for block in self.chain])) / 1024 / 1024
        }

# Global blockchain instance
smartmine_blockchain = SmartMineBlockchain()

# Demo data initialization
def initialize_demo_blockchain():
    """Initialize blockchain with demo data"""
    
    # Register demo equipment
    smartmine_blockchain.register_equipment('TRUCK_001', {
        'manufacturer': 'Caterpillar',
        'model': 'CAT 797F',
        'serial_number': 'CAT797F001',
        'specifications': {
            'payload_capacity': '400 tons',
            'engine_power': '4000 HP',
            'fuel_capacity': '4540 liters'
        }
    })
    
    smartmine_blockchain.register_equipment('CRUSHER_001', {
        'manufacturer': 'Metso',
        'model': 'C200',
        'serial_number': 'MET_C200_001',
        'specifications': {
            'capacity': '2000 TPH',
            'motor_power': '800 kW',
            'crushing_force': '5000 kN'
        }
    })
    
    # Mine pending transactions
    smartmine_blockchain.mine_pending_transactions()
    
    # Add maintenance records
    smartmine_blockchain.record_maintenance('TRUCK_001', {
        'type': 'routine',
        'description': 'Engine oil change and filter replacement',
        'technician': 'John Smith',
        'cost': 2500,
        'duration_hours': 4
    })
    
    # Track material shipments
    smartmine_blockchain.track_material_shipment({
        'material_type': 'iron_ore',
        'quantity': 350,
        'source': 'pit_A',
        'destination': 'crusher_plant',
        'truck_id': 'TRUCK_001',
        'quality': {'grade': 'high', 'moisture': '8%'}
    })
    
    # Issue carbon credits
    smartmine_blockchain.issue_carbon_credit({
        'co2_reduction': 50,
        'practice': 'electric_equipment_usage',
        'value': 2500,
        'equipment_id': 'TRUCK_001'
    })
    
    # Mine all transactions
    smartmine_blockchain.mine_pending_transactions()
    
    print("✅ SmartMine Blockchain initialized with demo data!")

if __name__ == "__main__":
    print("🔗 INITIALIZING SMARTMINE BLOCKCHAIN...")
    initialize_demo_blockchain()
    
    # Display blockchain stats
    stats = smartmine_blockchain.get_blockchain_stats()
    print(f"\n📊 Blockchain Statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    print("\n🎉 SMARTMINE BLOCKCHAIN READY FOR REVOLUTIONARY MINING!")

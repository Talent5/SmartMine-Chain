#!/usr/bin/env python3
"""
Test script to verify SmartMine data streaming functionality
"""
import asyncio
import websockets
import json
import time
from datetime import datetime

class SmartMineStreamingTest:
    def __init__(self):
        self.messages_received = 0
        self.start_time = time.time()
        
    async def test_websocket_connection(self, uri="ws://localhost:8765"):
        """Test WebSocket connection and data streaming"""
        print(f"🔍 Testing WebSocket connection to {uri}")
        print("=" * 60)
        
        try:
            async with websockets.connect(uri) as websocket:
                print("✅ Successfully connected to SmartMine Simulator")
                print("📊 Monitoring data stream (Press Ctrl+C to stop)...")
                print("-" * 60)
                
                async for message in websocket:
                    try:
                        data = json.loads(message)
                        self.messages_received += 1
                        
                        # Display key information
                        timestamp = data.get('timestamp', 'N/A')
                        mine_id = data.get('mine_id', 'N/A')
                        
                        # Count equipment
                        trucks = len(data.get('trucks', {}))
                        crushers = len(data.get('crushers', {}))
                        stockpiles = len(data.get('stockpiles', {}))
                        alerts = len(data.get('alerts', []))
                        
                        # Calculate runtime
                        runtime = time.time() - self.start_time
                        
                        print(f"Message #{self.messages_received:03d} | {timestamp}")
                        print(f"  Mine: {mine_id}")
                        print(f"  Equipment: {trucks} trucks, {crushers} crushers, {stockpiles} stockpiles")
                        print(f"  Alerts: {alerts} active")
                        print(f"  Runtime: {runtime:.1f}s")
                        
                        # Show KPIs if available
                        if 'kpis' in data:
                            kpis = data['kpis']
                            truck_util = kpis.get('truck_utilization', 0)
                            crusher_avail = kpis.get('crusher_availability', 0)
                            throughput = kpis.get('total_throughput', 0)
                            print(f"  KPIs: Truck Util: {truck_util:.1f}%, Crusher Avail: {crusher_avail:.1f}%, Throughput: {throughput:.1f} t/h")
                        
                        print("-" * 60)
                        
                        # Verify 5-second interval
                        if self.messages_received > 1:
                            expected_time = self.messages_received * 5
                            actual_time = runtime
                            interval_accuracy = abs(expected_time - actual_time) / expected_time * 100
                            if interval_accuracy < 10:  # Within 10% tolerance
                                print(f"✅ Streaming interval: ~5 seconds (accuracy: {100-interval_accuracy:.1f}%)")
                            else:
                                print(f"⚠️ Streaming interval deviation: {interval_accuracy:.1f}%")
                        
                    except json.JSONDecodeError:
                        print("❌ Failed to decode JSON message")
                    except Exception as e:
                        print(f"❌ Error processing message: {e}")
                        
        except websockets.exceptions.ConnectionRefused:
            print("❌ Connection refused. Is the SmartMine simulator running?")
            print("💡 Start the backend with: python main.py")
        except Exception as e:
            print(f"❌ Connection error: {e}")
    
    async def test_api_endpoints(self, base_url="http://localhost:5000"):
        """Test API endpoints"""
        import aiohttp
        
        print(f"\n🔍 Testing API endpoints at {base_url}")
        print("=" * 60)
        
        endpoints = [
            "/api/status",
            "/api/streaming-status",
            "/api/current-data"
        ]
        
        try:
            async with aiohttp.ClientSession() as session:
                for endpoint in endpoints:
                    url = f"{base_url}{endpoint}"
                    try:
                        async with session.get(url) as response:
                            if response.status == 200:
                                data = await response.json()
                                print(f"✅ {endpoint}: OK")
                                if endpoint == "/api/status":
                                    print(f"   Status: {data.get('status')}")
                                    print(f"   Data Available: {data.get('data_available')}")
                                    print(f"   ML Model: {data.get('ml_model_loaded')}")
                                elif endpoint == "/api/streaming-status":
                                    print(f"   Streaming Active: {data.get('streaming_active')}")
                                    print(f"   Messages Received: {data.get('total_messages_received')}")
                                    print(f"   Update Interval: {data.get('update_interval')}")
                            else:
                                print(f"❌ {endpoint}: HTTP {response.status}")
                    except Exception as e:
                        print(f"❌ {endpoint}: {e}")
        except Exception as e:
            print(f"❌ Failed to test API endpoints: {e}")
            print("💡 Make sure the backend API server is running")

async def main():
    """Main test function"""
    print("🚀 SmartMine Data Streaming Test")
    print("=" * 60)
    print("This test will verify:")
    print("1. WebSocket connection to simulator")
    print("2. Data streaming at 5-second intervals")
    print("3. API endpoint functionality")
    print("=" * 60)
    
    tester = SmartMineStreamingTest()
    
    try:
        # Test WebSocket connection for 30 seconds
        await asyncio.wait_for(
            tester.test_websocket_connection(),
            timeout=30.0
        )
    except asyncio.TimeoutError:
        print(f"\n⏰ Test completed after 30 seconds")
        print(f"📈 Total messages received: {tester.messages_received}")
        print(f"📊 Average interval: {30/max(tester.messages_received, 1):.1f} seconds")
    except KeyboardInterrupt:
        print(f"\n🛑 Test stopped by user")
        print(f"📈 Total messages received: {tester.messages_received}")
        runtime = time.time() - tester.start_time
        print(f"📊 Average interval: {runtime/max(tester.messages_received, 1):.1f} seconds")
    
    # Test API endpoints
    await tester.test_api_endpoints()

if __name__ == "__main__":
    asyncio.run(main())

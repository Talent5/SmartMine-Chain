#!/usr/bin/env python3
"""
Complete SmartMine System Integration Test
Tests both backend and frontend integration
"""
import asyncio
import websockets
import json
import time
import requests
from datetime import datetime

class SmartMineIntegrationTest:
    def __init__(self):
        self.backend_url = "http://localhost:5000"
        self.websocket_url = "ws://localhost:8765"
        self.frontend_url = "http://localhost:3000"
        
    def test_backend_api(self):
        """Test backend REST API endpoints"""
        print("🔍 Testing Backend API Integration...")
        print("-" * 50)
        
        endpoints = [
            "/api/status",
            "/api/streaming-status", 
            "/api/current-data"
        ]
        
        api_results = {}
        
        for endpoint in endpoints:
            try:
                response = requests.get(f"{self.backend_url}{endpoint}", timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    api_results[endpoint] = True
                    print(f"✅ {endpoint}: OK")
                    
                    # Show key information
                    if endpoint == "/api/status":
                        print(f"   System Status: {data.get('status')}")
                        print(f"   Data Available: {data.get('data_available')}")
                        print(f"   WebSocket Connected: {data.get('websocket_connected')}")
                    elif endpoint == "/api/streaming-status":
                        print(f"   Streaming Active: {data.get('streaming_active')}")
                        print(f"   Total Messages: {data.get('total_messages_received')}")
                        print(f"   Update Interval: {data.get('update_interval')}")
                else:
                    api_results[endpoint] = False
                    print(f"❌ {endpoint}: HTTP {response.status_code}")
                    
            except Exception as e:
                api_results[endpoint] = False
                print(f"❌ {endpoint}: {e}")
        
        return api_results
    
    async def test_websocket_streaming(self, duration=20):
        """Test WebSocket data streaming"""
        print(f"\n🔍 Testing WebSocket Streaming ({duration}s)...")
        print("-" * 50)
        
        messages_received = 0
        intervals = []
        last_time = None
        data_categories = set()
        
        try:
            async with websockets.connect(self.websocket_url) as websocket:
                print("✅ WebSocket connection established")
                
                start_time = time.time()
                
                while time.time() - start_time < duration:
                    try:
                        message = await asyncio.wait_for(websocket.recv(), timeout=10)
                        current_time = time.time()
                        
                        data = json.loads(message)
                        messages_received += 1
                        
                        # Calculate interval
                        if last_time:
                            interval = current_time - last_time
                            intervals.append(interval)
                        last_time = current_time
                        
                        # Track data categories
                        for key in data.keys():
                            data_categories.add(key)
                        
                        # Show progress every 5 messages
                        if messages_received % 5 == 0:
                            avg_interval = sum(intervals) / len(intervals) if intervals else 0
                            print(f"📊 Message #{messages_received} | Avg Interval: {avg_interval:.2f}s")
                            
                    except asyncio.TimeoutError:
                        print("❌ Timeout waiting for WebSocket message")
                        break
                    except json.JSONDecodeError:
                        print("❌ Invalid JSON received")
                        continue
                
                # Calculate statistics
                if intervals:
                    avg_interval = sum(intervals) / len(intervals)
                    accuracy = (1 - abs(avg_interval - 5.0) / 5.0) * 100
                    
                    print("\n📈 WebSocket Streaming Results:")
                    print(f"   Messages Received: {messages_received}")
                    print(f"   Average Interval: {avg_interval:.2f}s")
                    print(f"   Target Interval: 5.00s")
                    print(f"   Accuracy: {accuracy:.1f}%")
                    print(f"   Data Categories: {', '.join(sorted(data_categories))}")
                    
                    return {
                        'success': True,
                        'messages': messages_received,
                        'avg_interval': avg_interval,
                        'accuracy': accuracy,
                        'categories': list(data_categories)
                    }
                else:
                    return {'success': False, 'error': 'No data received'}
                    
        except Exception as e:
            print(f"❌ WebSocket test failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def test_frontend_accessibility(self):
        """Test if frontend is accessible"""
        print("\n🔍 Testing Frontend Accessibility...")
        print("-" * 50)
        
        try:
            response = requests.get(self.frontend_url, timeout=5)
            if response.status_code == 200:
                print("✅ Frontend dashboard accessible")
                return True
            else:
                print(f"❌ Frontend returned HTTP {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Frontend not accessible: {e}")
            print("💡 Make sure 'npm start' is running in the frontend directory")
            return False
    
    async def run_complete_test(self):
        """Run complete integration test"""
        print("🚀 SmartMine Complete System Integration Test")
        print("=" * 60)
        print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        results = {
            'backend_api': False,
            'websocket_streaming': False,
            'frontend_accessible': False,
            'overall_success': False
        }
        
        # Test 1: Backend API
        api_results = self.test_backend_api()
        results['backend_api'] = all(api_results.values())
        
        # Test 2: WebSocket Streaming
        streaming_results = await self.test_websocket_streaming()
        results['websocket_streaming'] = streaming_results.get('success', False)
        
        # Test 3: Frontend Accessibility
        results['frontend_accessible'] = self.test_frontend_accessibility()
        
        # Overall assessment
        results['overall_success'] = (
            results['backend_api'] and 
            results['websocket_streaming'] and 
            results['frontend_accessible']
        )
        
        # Final report
        print("\n" + "=" * 60)
        print("🏁 INTEGRATION TEST SUMMARY")
        print("=" * 60)
        
        status_icon = "✅" if results['backend_api'] else "❌"
        print(f"{status_icon} Backend API: {'PASS' if results['backend_api'] else 'FAIL'}")
        
        status_icon = "✅" if results['websocket_streaming'] else "❌"
        print(f"{status_icon} WebSocket Streaming: {'PASS' if results['websocket_streaming'] else 'FAIL'}")
        
        status_icon = "✅" if results['frontend_accessible'] else "❌"
        print(f"{status_icon} Frontend Dashboard: {'PASS' if results['frontend_accessible'] else 'FAIL'}")
        
        print("-" * 60)
        
        if results['overall_success']:
            print("🎉 SYSTEM INTEGRATION: SUCCESSFUL")
            print("\n✨ SmartMine Digital Twin is fully operational!")
            print("📊 Dashboard: http://localhost:3000")
            print("🔌 WebSocket: ws://localhost:8765 (5-second streaming)")
            print("🌐 API: http://localhost:5000")
        else:
            print("❌ SYSTEM INTEGRATION: ISSUES DETECTED")
            print("\n🔧 Troubleshooting:")
            if not results['backend_api']:
                print("   - Start backend: python backend/main.py")
            if not results['frontend_accessible']:
                print("   - Start frontend: npm start (in frontend directory)")
            if not results['websocket_streaming']:
                print("   - Check WebSocket connection and data flow")
        
        print("=" * 60)
        return results

async def main():
    tester = SmartMineIntegrationTest()
    results = await tester.run_complete_test()
    
    # Exit with proper code
    exit_code = 0 if results['overall_success'] else 1
    exit(exit_code)

if __name__ == "__main__":
    asyncio.run(main())

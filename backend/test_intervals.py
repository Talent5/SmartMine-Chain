#!/usr/bin/env python3
"""
Quick verification script for SmartMine streaming intervals
"""
import asyncio
import websockets
import json
import time
from datetime import datetime

async def test_streaming_intervals():
    """Test that data streams every 5 seconds"""
    uri = "ws://localhost:8765"
    print(f"🔗 Connecting to {uri}...")
    
    message_times = []
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected! Monitoring streaming intervals...")
            print("⏱️  Target interval: 5 seconds")
            print("-" * 50)
            
            message_count = 0
            start_time = time.time()
            
            async for message in websocket:
                current_time = time.time()
                message_times.append(current_time)
                message_count += 1
                
                # Calculate interval from previous message
                if len(message_times) > 1:
                    interval = message_times[-1] - message_times[-2]
                    print(f"Message #{message_count:02d} | Interval: {interval:.2f}s | {datetime.now().strftime('%H:%M:%S')}")
                else:
                    print(f"Message #{message_count:02d} | First message | {datetime.now().strftime('%H:%M:%S')}")
                
                # Stop after 10 messages
                if message_count >= 10:
                    break
                    
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Calculate statistics
    if len(message_times) > 1:
        intervals = [message_times[i] - message_times[i-1] for i in range(1, len(message_times))]
        avg_interval = sum(intervals) / len(intervals)
        min_interval = min(intervals)
        max_interval = max(intervals)
        
        print("-" * 50)
        print("📊 STREAMING STATISTICS:")
        print(f"   Messages received: {len(message_times)}")
        print(f"   Average interval: {avg_interval:.2f}s")
        print(f"   Min interval: {min_interval:.2f}s")
        print(f"   Max interval: {max_interval:.2f}s")
        print(f"   Target interval: 5.00s")
        
        accuracy = (1 - abs(avg_interval - 5.0) / 5.0) * 100
        print(f"   Accuracy: {accuracy:.1f}%")
        
        if accuracy > 90:
            print("✅ STREAMING INTERVAL: EXCELLENT")
        elif accuracy > 80:
            print("⚠️  STREAMING INTERVAL: GOOD")
        else:
            print("❌ STREAMING INTERVAL: NEEDS ADJUSTMENT")

if __name__ == "__main__":
    print("🚀 SmartMine Streaming Interval Test")
    print("=" * 50)
    asyncio.run(test_streaming_intervals())

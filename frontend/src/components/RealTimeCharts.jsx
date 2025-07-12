import React, { useState, useEffect, useRef } from 'react';

const RealTimeCharts = ({ trucks, crushers, stockpiles }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('throughput');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animated chart canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Generate sample data
    const dataPoints = 50;
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
      const baseValue = selectedMetric === 'throughput' ? 800 : 
                       selectedMetric === 'efficiency' ? 85 : 
                       selectedMetric === 'fuel' ? 70 : 90;
      const variation = Math.sin(i * 0.2 + Date.now() * 0.001) * 20;
      data.push(Math.max(0, baseValue + variation));
    }

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw chart line
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = (width / (dataPoints - 1)) * index;
      const y = height - (value / 100) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 245, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 245, 255, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    data.forEach((value, index) => {
      const x = (width / (dataPoints - 1)) * index;
      const y = height - (value / 100) * height;
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Draw data points
    ctx.fillStyle = '#00f5ff';
    data.forEach((value, index) => {
      const x = (width / (dataPoints - 1)) * index;
      const y = height - (value / 100) * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Animate
    animationRef.current = requestAnimationFrame(() => {
      // Re-render on next frame
    });
  }, [selectedMetric, currentTime]);

  const metrics = [
    { key: 'throughput', label: 'Throughput', unit: 'T/H', icon: '📊', color: 'cyan' },
    { key: 'efficiency', label: 'Efficiency', unit: '%', icon: '⚡', color: 'green' },
    { key: 'fuel', label: 'Fuel Level', unit: '%', icon: '⛽', color: 'orange' },
    { key: 'health', label: 'Health', unit: '%', icon: '❤️', color: 'red' }
  ];

  const getMetricValue = (metric) => {
    const baseValues = {
      throughput: 850,
      efficiency: 87,
      fuel: 72,
      health: 94
    };
    
    const variation = Math.sin(Date.now() * 0.001) * 5;
    return Math.max(0, Math.min(100, baseValues[metric] + variation));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider">
            REAL-TIME DATA STREAMS
          </h2>
          <p className="text-cyan-400/60 font-mono text-sm mt-1">
            Live monitoring and analytics dashboard
          </p>
        </div>
        <div className="text-right">
          <div className="text-cyan-300 font-mono text-sm">SYNC TIME</div>
          <div className="text-cyan-400 font-mono text-lg">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={`relative group p-4 rounded-xl transition-all duration-500 ${
              selectedMetric === metric.key
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 shadow-glow'
                : 'bg-black/30 border border-cyan-500/20 hover:border-cyan-400/40'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{metric.icon}</div>
              <div className="text-left">
                <div className="text-cyan-300 font-mono text-sm font-semibold">
                  {metric.label}
                </div>
                <div className="text-cyan-400/60 font-mono text-xs">
                  {getMetricValue(metric.key).toFixed(1)} {metric.unit}
                </div>
              </div>
            </div>
            
            {/* Animated progress ring */}
            <div className="absolute top-2 right-2 w-8 h-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="rgba(0, 245, 255, 0.2)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="#00f5ff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${(getMetricValue(metric.key) / 100) * 88} 88`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-cyan-300 font-mono">
              {metrics.find(m => m.key === selectedMetric)?.label} TREND
            </h3>
            <p className="text-cyan-400/60 font-mono text-sm">
              Live data stream - updating every second
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {getMetricValue(selectedMetric).toFixed(1)}
            </div>
            <div className="text-cyan-400/60 font-mono text-sm">
              {metrics.find(m => m.key === selectedMetric)?.unit}
            </div>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full h-64 rounded-xl"
          />
          
          {/* Animated scan line */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
          </div>
        </div>
      </div>

      {/* Equipment Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trucks Status */}
        <div className="bg-black/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">🚛</div>
            <div>
              <h3 className="text-lg font-bold text-cyan-300 font-mono">FLEET STATUS</h3>
              <p className="text-cyan-400/60 font-mono text-sm">
                {Object.keys(trucks).length} Active Trucks
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {Object.values(trucks).slice(0, 3).map((truck) => (
              <div key={truck.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    truck.status === 'running' ? 'bg-green-400 shadow-glow-green' :
                    truck.status === 'idle' ? 'bg-yellow-400 shadow-glow-yellow' :
                    'bg-red-400 shadow-glow-red'
                  }`}></div>
                  <div>
                    <div className="text-cyan-300 font-mono text-sm">{truck.name || truck.id}</div>
                    <div className="text-cyan-400/60 font-mono text-xs">{truck.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-300 font-mono text-sm">{truck.health || 85}%</div>
                  <div className="text-cyan-400/60 font-mono text-xs">Health</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crushers Status */}
        <div className="bg-black/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">⚙️</div>
            <div>
              <h3 className="text-lg font-bold text-purple-300 font-mono">CRUSHER MATRIX</h3>
              <p className="text-purple-400/60 font-mono text-sm">
                {Object.values(crushers).filter(c => c.status === 'running').length} Online
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {Object.values(crushers).slice(0, 3).map((crusher) => (
              <div key={crusher.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    crusher.status === 'running' ? 'bg-green-400 shadow-glow-green' :
                    crusher.status === 'maintenance' ? 'bg-red-400 shadow-glow-red' :
                    'bg-yellow-400 shadow-glow-yellow'
                  }`}></div>
                  <div>
                    <div className="text-purple-300 font-mono text-sm">{crusher.name || crusher.id}</div>
                    <div className="text-purple-400/60 font-mono text-xs">{crusher.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-300 font-mono text-sm">{crusher.efficiency || 92}%</div>
                  <div className="text-purple-400/60 font-mono text-xs">Efficiency</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stockpiles Status */}
        <div className="bg-black/30 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">📦</div>
            <div>
              <h3 className="text-lg font-bold text-orange-300 font-mono">STORAGE NODES</h3>
              <p className="text-orange-400/60 font-mono text-sm">
                {Object.keys(stockpiles).length} Active Nodes
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {Object.values(stockpiles).slice(0, 3).map((stockpile) => (
              <div key={stockpile.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    stockpile.capacity > 80 ? 'bg-green-400 shadow-glow-green' :
                    stockpile.capacity > 50 ? 'bg-yellow-400 shadow-glow-yellow' :
                    'bg-red-400 shadow-glow-red'
                  }`}></div>
                  <div>
                    <div className="text-orange-300 font-mono text-sm">{stockpile.name || stockpile.id}</div>
                    <div className="text-orange-400/60 font-mono text-xs">{stockpile.material}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-orange-300 font-mono text-sm">{stockpile.capacity || 75}%</div>
                  <div className="text-orange-400/60 font-mono text-xs">Capacity</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Alerts */}
      <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-2xl">🚨</div>
          <div>
            <h3 className="text-lg font-bold text-red-300 font-mono">LIVE ALERTS</h3>
            <p className="text-red-400/60 font-mono text-sm">System notifications and warnings</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-glow-red"></div>
            <div className="flex-1">
              <div className="text-red-300 font-mono text-sm">Crusher #3 efficiency dropped below threshold</div>
              <div className="text-red-400/60 font-mono text-xs">2 minutes ago</div>
            </div>
            <div className="text-red-400/60 font-mono text-xs">HIGH</div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-glow-yellow"></div>
            <div className="flex-1">
              <div className="text-yellow-300 font-mono text-sm">Truck #7 fuel level below 20%</div>
              <div className="text-yellow-400/60 font-mono text-xs">5 minutes ago</div>
            </div>
            <div className="text-yellow-400/60 font-mono text-xs">MEDIUM</div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-glow-blue"></div>
            <div className="flex-1">
              <div className="text-blue-300 font-mono text-sm">Stockpile A reaching capacity limit</div>
              <div className="text-blue-400/60 font-mono text-xs">8 minutes ago</div>
            </div>
            <div className="text-blue-400/60 font-mono text-xs">LOW</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCharts;

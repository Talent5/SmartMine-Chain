import React, { useState, useEffect, useRef } from 'react';

const SensorGrid = ({ equipmentData }) => {
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [timeRange, setTimeRange] = useState('1h');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // Generate sensor data
  useEffect(() => {
    const generateSensors = () => {
      try {
        setError(null);
        
        // Safety check for equipmentData
        if (!equipmentData) {
          console.log('⚠️ SensorGrid: equipmentData not available yet');
          setLoading(true);
          return;
        }

        const sensorTypes = [
          { type: 'temperature', unit: '°C', min: 20, max: 80, icon: '🌡️', color: 'red' },
          { type: 'pressure', unit: 'PSI', min: 100, max: 500, icon: '📊', color: 'blue' },
          { type: 'vibration', unit: 'Hz', min: 0, max: 100, icon: '📳', color: 'yellow' },
          { type: 'flow', unit: 'L/min', min: 0, max: 1000, icon: '🌊', color: 'cyan' },
          { type: 'level', unit: '%', min: 0, max: 100, icon: '📈', color: 'green' },
          { type: 'speed', unit: 'RPM', min: 0, max: 3000, icon: '⚡', color: 'purple' }
        ];

        // Safely extract equipment data with fallbacks
        const trucks = equipmentData.trucks || {};
        const crushers = equipmentData.crushers || {};
        const stockpiles = equipmentData.stockpiles || {};

        const equipment = [
          ...Object.values(trucks),
          ...Object.values(crushers),
          ...Object.values(stockpiles)
        ];

        // Safety check for empty equipment array
        if (equipment.length === 0) {
          console.log('⚠️ SensorGrid: No equipment data available');
          setSensors([]); // Set empty sensors array
          setLoading(false);
          return;
        }

      const newSensors = [];
      equipment.forEach((equipment, equipIndex) => {
        sensorTypes.forEach((sensorType, sensorIndex) => {
          const baseValue = (sensorType.min + sensorType.max) / 2;
          const variation = Math.sin(Date.now() * 0.001 + equipIndex + sensorIndex) * (sensorType.max - sensorType.min) * 0.1;
          const currentValue = Math.max(sensorType.min, Math.min(sensorType.max, baseValue + variation));
          
          newSensors.push({
            id: `${equipment.id}-${sensorType.type}`,
            equipmentId: equipment.id,
            equipmentName: equipment.name || equipment.id,
            type: sensorType.type,
            unit: sensorType.unit,
            icon: sensorType.icon,
            color: sensorType.color,
            currentValue: currentValue,
            minValue: sensorType.min,
            maxValue: sensorType.max,
            status: currentValue > sensorType.max * 0.9 ? 'warning' : 
                   currentValue < sensorType.min * 1.1 ? 'warning' : 'normal',
            timestamp: new Date(),
            history: Array.from({ length: 50 }, (_, i) => ({
              value: baseValue + Math.sin(i * 0.2 + Date.now() * 0.001) * (sensorType.max - sensorType.min) * 0.1,
              timestamp: new Date(Date.now() - (50 - i) * 60000)
            }))
          });
        });
      });

      setSensors(newSensors);
      setLoading(false);
      } catch (error) {
        console.error('Error generating sensor data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    generateSensors();
    const interval = setInterval(generateSensors, 5000);

    return () => clearInterval(interval);
  }, [equipmentData]);

  // Animated chart for selected sensor
  useEffect(() => {
    if (!selectedSensor) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

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

    // Draw sensor data
    const data = selectedSensor.history;
    if (data.length > 0) {
      const colorMap = {
        red: '#ff0040',
        blue: '#0066ff',
        yellow: '#ffff00',
        cyan: '#00f5ff',
        green: '#00ff41',
        purple: '#b300ff'
      };

      ctx.strokeStyle = colorMap[selectedSensor.color] || '#00f5ff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = (width / (data.length - 1)) * index;
        const normalizedValue = (point.value - selectedSensor.minValue) / (selectedSensor.maxValue - selectedSensor.minValue);
        const y = height - normalizedValue * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `${colorMap[selectedSensor.color]}40`);
      gradient.addColorStop(1, `${colorMap[selectedSensor.color]}05`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      data.forEach((point, index) => {
        const x = (width / (data.length - 1)) * index;
        const normalizedValue = (point.value - selectedSensor.minValue) / (selectedSensor.maxValue - selectedSensor.minValue);
        const y = height - normalizedValue * height;
        ctx.lineTo(x, y);
      });
      
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Draw data points
      ctx.fillStyle = colorMap[selectedSensor.color] || '#00f5ff';
      data.forEach((point, index) => {
        const x = (width / (data.length - 1)) * index;
        const normalizedValue = (point.value - selectedSensor.minValue) / (selectedSensor.maxValue - selectedSensor.minValue);
        const y = height - normalizedValue * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

  }, [selectedSensor]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusGlow = (status) => {
    switch (status) {
      case 'normal': return 'shadow-glow-green';
      case 'warning': return 'shadow-glow-yellow';
      case 'critical': return 'shadow-glow-red';
      default: return '';
    }
  };

  const getColorGlow = (color) => {
    const colorMap = {
      red: 'shadow-glow-red',
      blue: 'shadow-glow-blue',
      yellow: 'shadow-glow-yellow',
      cyan: 'shadow-glow',
      green: 'shadow-glow-green',
      purple: 'shadow-glow-purple'
    };
    return colorMap[color] || '';
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-cyan-400 font-mono">
            <div className="animate-spin text-2xl mb-2">⚡</div>
            Loading sensor network...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <div className="text-red-400 font-mono">
            <div className="text-lg mb-1">🚨 Sensor Network Error</div>
            <div className="text-sm opacity-75">{error}</div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Empty State */}
          {sensors.length === 0 && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center text-cyan-400/60 font-mono">
                <div className="text-4xl mb-4">📡</div>
                <div className="text-lg mb-2">No sensor data available</div>
                <div className="text-sm">Waiting for equipment data...</div>
              </div>
            </div>
          )}

          {/* Content when sensors available */}
          {sensors.length > 0 && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider">
                SENSOR NETWORK
              </h2>
              <p className="text-cyan-400/60 font-mono text-sm mt-1">
                Real-time monitoring and diagnostics
              </p>
            </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-black/30 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-300 font-mono text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-black/30 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-300 font-mono text-sm hover:border-cyan-400/50 transition-colors"
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            onClick={() => setSelectedSensor(sensor)}
            className={`relative group cursor-pointer transition-all duration-500 hover:scale-105 ${
              selectedSensor?.id === sensor.id ? 'ring-2 ring-cyan-400' : ''
            }`}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400/50 transition-all duration-300">
              {/* Sensor header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">{sensor.icon}</div>
                  <div>
                    <div className="text-cyan-300 font-mono text-sm font-semibold">
                      {sensor.type.toUpperCase()}
                    </div>
                    <div className="text-cyan-400/60 font-mono text-xs">
                      {sensor.equipmentName}
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-mono ${getStatusColor(sensor.status)} ${getStatusGlow(sensor.status)}`}>
                  {sensor.status.toUpperCase()}
                </div>
              </div>

              {/* Current value */}
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {sensor.currentValue.toFixed(1)}
                </div>
                <div className="text-cyan-400/60 font-mono text-sm">
                  {sensor.unit}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-cyan-400/60 font-mono mb-1">
                  <span>{sensor.minValue}</span>
                  <span>{sensor.maxValue}</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${getColorGlow(sensor.color)}`}
                    style={{ 
                      width: `${((sensor.currentValue - sensor.minValue) / (sensor.maxValue - sensor.minValue)) * 100}%`,
                      backgroundColor: sensor.color === 'red' ? '#ff0040' :
                                     sensor.color === 'blue' ? '#0066ff' :
                                     sensor.color === 'yellow' ? '#ffff00' :
                                     sensor.color === 'cyan' ? '#00f5ff' :
                                     sensor.color === 'green' ? '#00ff41' :
                                     sensor.color === 'purple' ? '#b300ff' : '#00f5ff'
                    }}
                  ></div>
                </div>
              </div>

              {/* Last update */}
              <div className="text-cyan-400/40 font-mono text-xs text-center">
                {sensor.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          </div>
        ))}
      </div>

      {/* Detailed Chart */}
      {selectedSensor && (
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-cyan-300 font-mono">
                {selectedSensor.type.toUpperCase()} - {selectedSensor.equipmentName}
              </h3>
              <p className="text-cyan-400/60 font-mono text-sm">
                Historical data for the last {timeRange}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {selectedSensor.currentValue.toFixed(1)} {selectedSensor.unit}
              </div>
              <div className="text-cyan-400/60 font-mono text-sm">
                Current Reading
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

          {/* Sensor details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-cyan-400/60 font-mono text-sm mb-1">MIN VALUE</div>
              <div className="text-cyan-300 font-mono text-lg">{selectedSensor.minValue} {selectedSensor.unit}</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-cyan-400/60 font-mono text-sm mb-1">MAX VALUE</div>
              <div className="text-cyan-300 font-mono text-lg">{selectedSensor.maxValue} {selectedSensor.unit}</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-cyan-400/60 font-mono text-sm mb-1">STATUS</div>
              <div className={`font-mono text-lg ${getStatusColor(selectedSensor.status)}`}>
                {selectedSensor.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sensor Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/30 backdrop-blur-xl border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">✅</div>
            <div>
              <div className="text-green-300 font-mono text-sm font-semibold">NORMAL</div>
              <div className="text-green-400/60 font-mono text-xs">
                {sensors.filter(s => s.status === 'normal').length} sensors
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="text-yellow-300 font-mono text-sm font-semibold">WARNING</div>
              <div className="text-yellow-400/60 font-mono text-xs">
                {sensors.filter(s => s.status === 'warning').length} sensors
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-xl border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🚨</div>
            <div>
              <div className="text-red-300 font-mono text-sm font-semibold">CRITICAL</div>
              <div className="text-red-400/60 font-mono text-xs">
                {sensors.filter(s => s.status === 'critical').length} sensors
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📡</div>
            <div>
              <div className="text-cyan-300 font-mono text-sm font-semibold">TOTAL</div>
              <div className="text-cyan-400/60 font-mono text-xs">
                {sensors.length} sensors
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
      </>
      )}
    </div>
  );
};

export default SensorGrid;

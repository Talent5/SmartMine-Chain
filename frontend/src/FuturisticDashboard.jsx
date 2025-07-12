import React, { useState, useEffect, useRef } from 'react';
import SmartMineWebSocketService from './services/SmartMineWebSocketService';
import SmartMineAPIService from './services/SmartMineAPIService';
import RealTimeCharts from './components/RealTimeCharts';
import MineMapView from './components/MineMapView';
import PredictiveAnalysis from './components/PredictiveAnalysis';
import MaintenancePanel from './components/MaintenancePanel';
import AIInsights from './components/AIInsights';
import SensorGrid from './components/SensorGrid';

function FuturisticDashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [miningData, setMiningData] = useState({});
  const [trucks, setTrucks] = useState({});
  const [crushers, setCrushers] = useState({});
  const [stockpiles, setStockpiles] = useState({});
  const [kpis, setKpis] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [currentView, setCurrentView] = useState('neural-center');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Enhanced particle animation with multiple layers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 150;
    const connectionDistance = 120;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles with different types
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 0.5,
        type: Math.random() > 0.7 ? 'data' : 'energy',
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.02;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle with pulse effect
        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        
        if (particle.type === 'data') {
          ctx.fillStyle = `rgba(0, 245, 255, ${particle.opacity + Math.sin(particle.pulse) * 0.2})`;
        } else {
          ctx.fillStyle = `rgba(179, 0, 255, ${particle.opacity + Math.sin(particle.pulse) * 0.2})`;
        }
        ctx.fill();

        // Draw connections with improved algorithm
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              const opacity = (connectionDistance - distance) / connectionDistance * 0.3;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              
              if (particle.type === otherParticle.type) {
                ctx.strokeStyle = particle.type === 'data' 
                  ? `rgba(0, 245, 255, ${opacity})`
                  : `rgba(179, 0, 255, ${opacity})`;
              } else {
                ctx.strokeStyle = `rgba(255, 0, 110, ${opacity * 0.5})`;
              }
              
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initialize connections
    const initializeSystem = async () => {
      setIsLoading(true);
      
      // Test API connection
      const apiResult = await SmartMineAPIService.testConnection();
      console.log(apiResult.connected ? '🔗 Quantum API Link Established' : '❌ API Connection Failed');

      // Initialize WebSocket
      const wsService = new SmartMineWebSocketService('ws://localhost:8765');
      
      wsService.onConnect(() => {
        setIsConnected(true);
        setIsLoading(false);
        console.log('🚀 Neural Network Connected - Streaming Consciousness Every 5 Seconds');
      });

      wsService.onDisconnect(() => {
        setIsConnected(false);
        console.log('🔌 Neural Network Disconnected');
      });

      wsService.onMessage((data) => {
        console.log('🧠 Neural Data Stream Received:', new Date().toLocaleTimeString());
        setLastUpdate(new Date());
        setMiningData(data);
        setTrucks(data.trucks || {});
        setCrushers(data.crushers || {});
        setStockpiles(data.stockpiles || {});
        setKpis(data.kpis || {});
        setAlerts(data.alerts || []);
        setAiRecommendations(data.ai_recommendations || []);
      });

      wsService.connect();

      return () => wsService.disconnect();
    };

    initializeSystem();
  }, []);

  // Enhanced System Status Component
  const SystemStatus = () => (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-black/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-4 shadow-2xl shadow-cyan-500/20">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 shadow-glow-green animate-pulse' : 'bg-red-400 shadow-glow-red'}`}></div>
          <div className="text-cyan-300 text-sm font-mono tracking-wider">
            {isConnected ? 'NEURAL LINK ACTIVE' : 'SYSTEM OFFLINE'}
          </div>
        </div>
        {lastUpdate && (
          <div className="text-cyan-400/60 text-xs font-mono mt-2 tracking-wider">
            SYNC: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
        <div className="mt-2 text-xs text-cyan-400/40 font-mono">
          QUANTUM CORE v3.0
        </div>
      </div>
    </div>
  );

  // Enhanced Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="text-center z-10 relative">
          <div className="text-8xl mb-8 animate-float">⛏️</div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 tracking-wider">
            INITIALIZING NEURAL MINING CORE
          </h1>
          
          {/* Enhanced loading animation */}
          <div className="flex justify-center space-x-3 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce shadow-glow"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
          
          <p className="text-cyan-300 font-mono text-lg tracking-wider mb-4">Establishing quantum tunnels...</p>
          
          {/* Progress bar */}
          <div className="w-64 h-2 bg-black/30 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse-glow"></div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Holographic KPI Card
  const HoloKPI = ({ title, value, unit, icon, trend, color = "cyan", subtitle }) => {
    const colorMap = {
      cyan: { from: 'from-cyan-400', to: 'to-blue-500', glow: 'shadow-glow-blue' },
      green: { from: 'from-green-400', to: 'to-emerald-500', glow: 'shadow-glow-green' },
      red: { from: 'from-red-400', to: 'to-pink-500', glow: 'shadow-glow-red' },
      purple: { from: 'from-purple-400', to: 'to-violet-500', glow: 'shadow-glow-purple' },
      orange: { from: 'from-orange-400', to: 'to-red-500', glow: 'shadow-glow-yellow' }
    };

    const colors = colorMap[color];

    return (
      <div 
        className="relative group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:rotate-1"
        onMouseEnter={() => setHoveredCard(title)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Enhanced glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${colors.from} ${colors.to} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition duration-700`}></div>
        
        <div className="relative bg-black/70 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/20">
          {/* Animated background pattern */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-pulse"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{icon}</div>
              <div className={`text-xs font-mono px-2 py-1 rounded-full ${
                trend > 0 ? 'bg-green-500/20 text-green-400' : 
                trend < 0 ? 'bg-red-500/20 text-red-400' : 
                'bg-blue-500/20 text-blue-400'
              }`}>
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-cyan-300 font-mono text-sm tracking-wider mb-1">{title}</h3>
              {subtitle && (
                <p className="text-cyan-400/60 text-xs font-mono">{subtitle}</p>
              )}
            </div>

            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colors.from} ${colors.to}`}>
                {value || '0'}
              </span>
              <span className="text-cyan-400/60 font-mono text-sm">{unit}</span>
            </div>

            {/* Animated progress indicator */}
            <div className="mt-4 h-1 bg-black/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${colors.from} ${colors.to} rounded-full transition-all duration-1000 ${colors.glow}`}
                style={{ width: `${Math.min(100, (value || 0))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Cyber Equipment Component
  const CyberEquipment = ({ equipment, type }) => {
    const getTypeIcon = () => {
      switch (type) {
        case 'truck': return '🚛';
        case 'crusher': return '⚙️';
        case 'stockpile': return '📦';
        default: return '🔧';
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'running': return 'text-green-400 bg-green-500/20';
        case 'idle': return 'text-yellow-400 bg-yellow-500/20';
        case 'maintenance': return 'text-red-400 bg-red-500/20';
        case 'loading': return 'text-orange-400 bg-orange-500/20';
        case 'hauling': return 'text-blue-400 bg-blue-500/20';
        case 'dumping': return 'text-purple-400 bg-purple-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
      }
    };

    const getStatusGlow = (status) => {
      switch (status) {
        case 'running': return 'shadow-glow-green';
        case 'idle': return 'shadow-glow-yellow';
        case 'maintenance': return 'shadow-glow-red';
        case 'loading': return 'shadow-glow-orange';
        case 'hauling': return 'shadow-glow-blue';
        case 'dumping': return 'shadow-glow-purple';
        default: return '';
      }
    };

    return (
      <div className="group relative bg-black/50 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/20">
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getTypeIcon()}</div>
              <div>
                <h4 className="text-cyan-300 font-mono font-semibold text-sm">{equipment.name || equipment.id}</h4>
                <p className="text-cyan-400/60 text-xs font-mono">ID: {equipment.id}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-mono ${getStatusColor(equipment.status)} ${getStatusGlow(equipment.status)}`}>
              {equipment.status?.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {equipment.health && (
              <div>
                <div className="text-cyan-400/60 font-mono mb-1">HEALTH</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        equipment.health > 70 ? 'bg-green-400' : 
                        equipment.health > 40 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${equipment.health}%` }}
                    ></div>
                  </div>
                  <span className="text-cyan-300 font-mono">{equipment.health}%</span>
                </div>
              </div>
            )}

            {equipment.efficiency && (
              <div>
                <div className="text-cyan-400/60 font-mono mb-1">EFFICIENCY</div>
                <div className="text-cyan-300 font-mono">{equipment.efficiency}%</div>
              </div>
            )}

            {equipment.fuel_level && (
              <div>
                <div className="text-cyan-400/60 font-mono mb-1">FUEL</div>
                <div className="text-cyan-300 font-mono">{equipment.fuel_level}%</div>
              </div>
            )}

            {equipment.capacity && (
              <div>
                <div className="text-cyan-400/60 font-mono mb-1">CAPACITY</div>
                <div className="text-cyan-300 font-mono">{equipment.capacity}%</div>
              </div>
            )}
          </div>

          {/* Real-time activity indicator */}
          {equipment.status === 'running' && (
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-mono">ACTIVE</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Navigation items
  const navItems = [
    { key: 'neural-center', label: 'NEURAL CENTER', icon: '🧠' },
    { key: 'quantum-map', label: 'QUANTUM MAP', icon: '🗺️' },
    { key: 'data-streams', label: 'DATA STREAMS', icon: '📊' },
    { key: 'sensor-grid', label: 'SENSOR GRID', icon: '📡' },
    { key: 'ai-matrix', label: 'AI MATRIX', icon: '🤖' },
    { key: 'maintenance-core', label: 'MAINTENANCE', icon: '🔧' },
    { key: 'ai-insights', label: 'AI INSIGHTS', icon: '💡' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <SystemStatus />

      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-cyan-500/30 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-4xl animate-float">⛏️</div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-wider">
                  NEURAL MINING CORE
                </h1>
                <p className="text-cyan-300 text-lg font-mono tracking-wider">Quantum Digital Twin Interface v3.0</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-mono text-sm tracking-wider mb-1">ACTIVE NODES</div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                {Object.keys(trucks).length + Object.keys(crushers).length}
              </div>
              <div className="text-cyan-400/60 text-xs font-mono mt-1">QUANTUM SYNC</div>
            </div>
          </div>
        </header>

        {/* Enhanced Navigation */}
        <nav className="bg-black/10 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4 sticky top-0 z-20">
          <div className="flex space-x-2 overflow-x-auto custom-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-mono transition-all duration-500 whitespace-nowrap ${
                  currentView === item.key
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow'
                    : 'text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Enhanced Main Content */}
        <main className="p-6 relative">
          {currentView === 'neural-center' && (
            <div className="space-y-8">
              {/* Enhanced KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <HoloKPI 
                  title="Fleet Efficiency" 
                  value={kpis.truck_utilization} 
                  unit="%" 
                  icon="🚛"
                  trend={1}
                  color="green"
                  subtitle="Autonomous Fleet Performance"
                />
                <HoloKPI 
                  title="Crusher Matrix" 
                  value={kpis.crusher_availability} 
                  unit="%" 
                  icon="⚙️"
                  trend={kpis.crusher_availability > 80 ? 1 : -1}
                  color="cyan"
                  subtitle="Processing Capacity"
                />
                <HoloKPI 
                  title="Quantum Flow" 
                  value={kpis.total_throughput} 
                  unit="T/H" 
                  icon="📊"
                  trend={0}
                  color="purple"
                  subtitle="Material Throughput"
                />
                <HoloKPI 
                  title="Neural Nodes" 
                  value={Object.keys(trucks).length + Object.keys(crushers).length} 
                  unit="ACTIVE" 
                  icon="🧠"
                  trend={1}
                  color="orange"
                  subtitle="Connected Equipment"
                />
              </div>

              {/* Enhanced Equipment Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Truck Fleet */}
                <div className="bg-black/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-wider">
                      AUTONOMOUS FLEET
                    </h2>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-mono">
                      {Object.keys(trucks).length} ACTIVE
                    </div>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {Object.values(trucks).slice(0, 6).map((truck) => (
                      <CyberEquipment key={truck.id} equipment={truck} type="truck" />
                    ))}
                  </div>
                </div>

                {/* Crushers */}
                <div className="bg-black/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-wider">
                      CRUSHER MATRIX
                    </h2>
                    <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-mono">
                      {Object.values(crushers).filter(c => c.status === 'running').length} ONLINE
                    </div>
                  </div>
                  <div className="space-y-4">
                    {Object.values(crushers).map((crusher) => (
                      <CyberEquipment key={crusher.id} equipment={crusher} type="crusher" />
                    ))}
                  </div>
                </div>

                {/* Stockpiles */}
                <div className="bg-black/30 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 tracking-wider">
                      STORAGE NODES
                    </h2>
                    <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-mono">
                      {Object.keys(stockpiles).length} NODES
                    </div>
                  </div>
                  <div className="space-y-4">
                    {Object.values(stockpiles).map((stockpile) => (
                      <CyberEquipment key={stockpile.id} equipment={stockpile} type="stockpile" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced AI Recommendations */}
              {aiRecommendations.length > 0 && (
                <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 tracking-wider">
                      AI NEURAL INSIGHTS
                    </h2>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-mono animate-pulse">
                      {aiRecommendations.length} ACTIVE
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aiRecommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="bg-black/60 border border-green-500/20 rounded-xl p-4 hover:border-green-400/40 transition-all duration-300 group">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            rec.priority === 'high' ? 'bg-red-500 animate-pulse shadow-glow-red' : 
                            rec.priority === 'medium' ? 'bg-yellow-500 shadow-glow-yellow' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <h3 className="text-cyan-300 font-mono font-bold mb-2 group-hover:text-cyan-200 transition-colors">{rec.title}</h3>
                            <p className="text-cyan-400/70 text-sm mb-3">{rec.description}</p>
                            <p className="text-green-400 text-sm font-mono">{rec.estimated_impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'quantum-map' && (
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <MineMapView trucks={trucks} crushers={crushers} stockpiles={stockpiles} />
            </div>
          )}

          {currentView === 'data-streams' && (
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <RealTimeCharts trucks={trucks} crushers={crushers} stockpiles={stockpiles} />
            </div>
          )}

          {currentView === 'ai-matrix' && (
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <PredictiveAnalysis equipmentData={{ trucks, crushers, stockpiles }} />
            </div>
          )}

          {currentView === 'maintenance-core' && (
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <MaintenancePanel equipmentData={{ trucks, crushers, stockpiles }} />
            </div>
          )}

          {currentView === 'ai-insights' && (
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <AIInsights aiRecommendations={aiRecommendations} kpis={kpis} />
            </div>
          )}

          {currentView === 'sensor-grid' && (
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <SensorGrid equipmentData={{ trucks, crushers, stockpiles }} />
            </div>
          )}
        </main>

        {/* Enhanced Footer */}
        <footer className="bg-black/20 backdrop-blur-xl border-t border-cyan-500/30 px-6 py-4 text-center">
          <p className="text-cyan-400/60 font-mono text-sm tracking-wider">
            NEURAL MINING CORE v3.0 | QUANTUM DIGITAL TWIN INTERFACE | AI-POWERED MINING OPERATIONS
          </p>
          <p className="text-cyan-400/40 font-mono text-xs mt-1 tracking-wider">
            Advanced Analytics • Predictive Maintenance • Autonomous Operations
          </p>
        </footer>
      </div>
    </div>
  );
}

export default FuturisticDashboard;

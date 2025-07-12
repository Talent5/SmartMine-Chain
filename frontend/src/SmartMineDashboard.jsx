import React, { useState, useEffect } from 'react';
import SmartMineWebSocketService from './services/SmartMineWebSocketService';
import SmartMineAPIService from './services/SmartMineAPIService';
import RealTimeCharts from './components/RealTimeCharts';
import MineMapView from './components/MineMapView';
import PredictiveAnalysis from './components/PredictiveAnalysis';
import MaintenancePanel from './components/MaintenancePanel';
import AIInsights from './components/AIInsights';
import TruckFleetMonitor from './components/TruckFleetMonitor';
import CrusherMonitor from './components/CrusherMonitor';
import StockpileMonitor from './components/StockpileMonitor';
import SensorGrid from './components/SensorGrid';
import Machine3D from './components/Machine3D';
import QuantumAIInsights from './components/QuantumAIInsights';
import './components/QuantumMineStyles.css';

function SmartMineDashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [_miningData, setMiningData] = useState({});
  const [trucks, setTrucks] = useState({});
  const [crushers, setCrushers] = useState({});
  const [stockpiles, setStockpiles] = useState({});
  const [kpis, setKpis] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [_apiStatus, setApiStatus] = useState({ connected: false });
  const [currentView, setCurrentView] = useState('quantum-overview');
  
  // 🚀 REVOLUTIONARY NEW STATE
  const [quantumMode, setQuantumMode] = useState(true);
  const [neuralActivity, setNeuralActivity] = useState(85.4);
  const [blockchainTransactions, setBlockchainTransactions] = useState(142);
  const [carbonCredits, setCarbonCredits] = useState(1247);
  const [systemPerformance, setSystemPerformance] = useState(96.7);

  useEffect(() => {
    // Test API connection first
    SmartMineAPIService.testConnection().then((result) => {
      setApiStatus(result);
      if (result.connected) {
        console.log('✅ API connection established');
      } else {
        console.log('❌ API connection failed:', result.error);
      }
    });

    // Initialize WebSocket connection
    const wsService = new SmartMineWebSocketService('ws://localhost:8765');
    
    wsService.onConnect(() => {
      setIsConnected(true);
      console.log('🚀 SmartMine Dashboard connected - receiving data every 5 seconds');
    });

    wsService.onDisconnect(() => {
      setIsConnected(false);
      console.log('❌ SmartMine Dashboard disconnected');
    });

    wsService.onMessage((data) => {
      console.log('📊 Received mining data update:', new Date().toLocaleTimeString());
      setLastUpdate(new Date());
      setMiningData(data);
      setTrucks(data.trucks || {});
      setCrushers(data.crushers || {});
      setStockpiles(data.stockpiles || {});
      setKpis(data.kpis || {});
      setAlerts(data.alerts || []);
      setAiRecommendations(data.ai_recommendations || []);
    });

    wsService.onError((error) => {
      console.error('SmartMine WebSocket error:', error);
    });

    wsService.connect();

    return () => {
      wsService.disconnect();
    };
  }, []);

  // 🚀 REVOLUTIONARY QUANTUM EFFECTS
  useEffect(() => {
    const quantumInterval = setInterval(() => {
      // Simulate neural activity fluctuations
      setNeuralActivity(prev => {
        const variation = (Math.random() - 0.5) * 5;
        return Math.max(70, Math.min(99, prev + variation));
      });

      // Simulate blockchain transactions
      setBlockchainTransactions(prev => prev + Math.floor(Math.random() * 3));

      // Simulate carbon credit accumulation
      setCarbonCredits(prev => prev + Math.floor(Math.random() * 2));

      // Simulate system performance optimization
      setSystemPerformance(prev => {
        const variation = (Math.random() - 0.5) * 2;
        return Math.max(85, Math.min(99.9, prev + variation));
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(quantumInterval);
  }, []);

  // 🎮 QUANTUM MODE TOGGLE
  const toggleQuantumMode = () => {
    setQuantumMode(!quantumMode);
    // Add quantum effects
    if (!quantumMode) {
      document.body.classList.add('quantum-mode');
    } else {
      document.body.classList.remove('quantum-mode');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'running': 'bg-status-running',
      'idle': 'bg-status-idle',
      'maintenance': 'bg-status-maintenance',
      'loading': 'bg-status-loading',
      'hauling': 'bg-status-hauling',
      'dumping': 'bg-status-dumping'
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toFixed(1) || '0';
  };

  const ConnectionStatus = () => (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 bg-black/20 rounded-full px-3 py-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className="text-white text-sm font-medium">
          {isConnected ? 'Live Data (5s refresh)' : 'Disconnected'}
        </span>
      </div>
      {lastUpdate && (
        <div className="hidden md:block bg-white/10 rounded-full px-3 py-1">
          <span className="text-gray-200 text-xs">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );

  const KPICard = ({ title, value, unit, icon, color = "blue" }) => {
    const colorClasses = {
      blue: 'border-l-blue-500 text-blue-600',
      green: 'border-l-green-500 text-green-600',
      red: 'border-l-red-500 text-red-600',
      purple: 'border-l-purple-500 text-purple-600',
      orange: 'border-l-orange-500 text-orange-600'
    };

    return (
      <div className={`metric-card ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className={`text-3xl font-bold leading-none ${colorClasses[color].split(' ')[1]}`}>
              {typeof value === 'number' ? value.toFixed(1) : value || '0'}
              <span className="text-lg ml-1 text-gray-500">{unit}</span>
            </p>
          </div>
          <div className="text-4xl opacity-80 hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const TruckCard = ({ truck }) => (
    <div className="mining-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-lg">{truck.id}</h3>
        <div className="flex items-center space-x-2">
          <div className={`status-indicator ${getStatusColor(truck.status)}`}></div>
          <span className="text-sm capitalize font-medium text-gray-600">{truck.status}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Load:</span>
          <span className="text-sm font-semibold text-gray-800">{truck.current_load?.toFixed(0) || 0}t</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Fuel:</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  truck.fuel_level < 20 ? 'bg-red-500' : 
                  truck.fuel_level < 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${truck.fuel_level || 0}%` }}
              ></div>
            </div>
            <span className={`text-sm font-semibold ${
              truck.fuel_level < 20 ? 'text-red-600' : 'text-gray-800'
            }`}>
              {truck.fuel_level?.toFixed(0) || 0}%
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Health:</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  truck.health_score < 40 ? 'bg-red-500' : 
                  truck.health_score < 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${truck.health_score || 0}%` }}
              ></div>
            </div>
            <span className={`text-sm font-semibold ${
              truck.health_score < 40 ? 'text-red-600' : 'text-gray-800'
            }`}>
              {truck.health_score?.toFixed(0) || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const CrusherCard = ({ crusher }) => (
    <div className="mining-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-lg">{crusher.id}</h3>
        <div className="flex items-center space-x-2">
          <div className={`status-indicator ${getStatusColor(crusher.status)}`}></div>
          <span className="text-sm capitalize font-medium text-gray-600">{crusher.status}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Throughput:</span>
          <span className="text-sm font-semibold text-gray-800">{crusher.current_throughput?.toFixed(0) || 0} t/h</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Temperature:</span>
          <span className={`text-sm font-semibold ${
            crusher.temperature > 80 ? 'text-red-600' : 'text-gray-800'
          }`}>
            {crusher.temperature?.toFixed(0) || 0}°C
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Health:</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  crusher.health_score < 40 ? 'bg-red-500' : 
                  crusher.health_score < 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${crusher.health_score || 0}%` }}
              ></div>
            </div>
            <span className={`text-sm font-semibold ${
              crusher.health_score < 40 ? 'text-red-600' : 'text-gray-800'
            }`}>
              {crusher.health_score?.toFixed(0) || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const StockpileCard = ({ stockpile }) => {
    const utilization = (stockpile.current_volume / stockpile.max_capacity) * 100;
    
    return (
      <div className="mining-card">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">{stockpile.id}</h3>
          <p className="text-sm text-gray-600">{stockpile.material_type}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Capacity</span>
              <span className="text-sm font-semibold text-gray-800">{utilization.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${
                  utilization < 20 ? 'bg-red-500' : 
                  utilization < 50 ? 'bg-yellow-500' : 
                  utilization < 90 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(utilization, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Volume:</span>
            <span className="text-sm font-semibold text-gray-800">{formatNumber(stockpile.current_volume)}t</span>
          </div>
        </div>
      </div>
    );
  };

  const AlertBanner = () => {
    if (alerts.length === 0) return null;
    
    const urgentAlerts = alerts.filter(a => a.severity === 'urgent').length;
    const warningAlerts = alerts.filter(a => a.severity === 'warning').length;
    
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-600 mr-4 text-2xl animate-bounce">
              ⚠️
            </div>
            <div>
              <h3 className="text-red-800 font-bold text-lg">
                {alerts.length} Active Alert{alerts.length > 1 ? 's' : ''}
              </h3>
              <p className="text-red-700 text-sm">
                {urgentAlerts > 0 && <span className="font-semibold">{urgentAlerts} urgent</span>}
                {urgentAlerts > 0 && warningAlerts > 0 && <span>, </span>}
                {warningAlerts > 0 && <span>{warningAlerts} warning</span>}
              </p>
            </div>
          </div>
          <button className="btn-danger text-sm">
            View All Alerts
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="bg-gradient-to-r from-mining-dark to-gray-900 text-white px-6 py-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl animate-float">⛏️</div>
            <div>
              <h1 className="text-3xl font-bold text-shadow">SmartMine Digital Twin</h1>
              <p className="text-mining-200 text-lg">Real-time Mining Operations Dashboard</p>
            </div>
          </div>
          <ConnectionStatus />
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Alert Banner */}
        <AlertBanner />

        {/* KPI Cards */}
        <div className="kpi-grid mb-8">
          <KPICard 
            title="Truck Utilization" 
            value={kpis.truck_utilization} 
            unit="%" 
            icon="🚛"
            color={kpis.truck_utilization > 80 ? "green" : "red"}
          />
          <KPICard 
            title="Crusher Availability" 
            value={kpis.crusher_availability} 
            unit="%" 
            icon="⚙️"
            color={kpis.crusher_availability > 80 ? "green" : "red"}
          />
          <KPICard 
            title="Total Throughput" 
            value={kpis.total_throughput} 
            unit="t/h" 
            icon="📊"
            color="blue"
          />
          <KPICard 
            title="Active Equipment" 
            value={kpis.active_equipment?.trucks || 0} 
            unit="trucks" 
            icon="🏭"
            color="purple"
          />
        </div>

        {/* 🚀 REVOLUTIONARY QUANTUM NAVIGATION */}
        <div className="mb-8">
          {/* Quantum Navigation Tabs */}
          <div className="flex space-x-2 mb-6 bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 p-2 rounded-lg border border-cyan-500/30 backdrop-blur-md">
            {[
              { key: 'quantum-overview', label: 'Quantum Overview', icon: '🧠', color: 'cyan' },
              { key: 'neural-map', label: 'Neural Map', icon: '🗺️', color: 'purple' },
              { key: 'ai-analytics', label: 'AI Analytics', icon: '📊', color: 'blue' },
              { key: 'quantum-predictions', label: 'Quantum AI', icon: '🔮', color: 'pink' },
              { key: 'blockchain', label: 'Blockchain', icon: '🔗', color: 'green' },
              { key: 'carbon-credits', label: 'Carbon Credits', icon: '🌱', color: 'emerald' },
              { key: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'orange' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentView(tab.key)}
                className={`quantum-tab flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-mono font-medium transition-all duration-300 transform hover:scale-105 ${
                  currentView === tab.key
                    ? `bg-${tab.color}-500/20 text-${tab.color}-300 border border-${tab.color}-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]`
                    : `text-gray-400 hover:text-${tab.color}-400 hover:bg-${tab.color}-500/10 border border-transparent`
                }`}
                style={{
                  textShadow: currentView === tab.key ? `0 0 10px currentColor` : 'none',
                  filter: currentView === tab.key ? 'drop-shadow(0 0 5px currentColor)' : 'none'
                }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="uppercase tracking-wider">{tab.label}</span>
                {currentView === tab.key && (
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* 🧠 QUANTUM OVERVIEW */}
          {currentView === 'quantum-overview' && (
            <>
              {/* Revolutionary KPI Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Quantum Fleet Status */}
                <div className="cyber-card p-6 holo-element">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="cyber-title text-sm">QUANTUM FLEET</h3>
                    <div className="text-2xl animate-pulse">🚛</div>
                  </div>
                  <div className="text-3xl font-bold text-cyan-300 mb-2">
                    {Object.keys(trucks).length}
                  </div>
                  <div className="text-xs font-mono text-cyan-400/70">
                    {Object.values(trucks).filter(t => t.status === 'running').length} ACTIVE
                  </div>
                  <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000"
                      style={{ 
                        width: `${(Object.values(trucks).filter(t => t.status === 'running').length / Math.max(Object.keys(trucks).length, 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Neural Processing */}
                <div className="cyber-card p-6 holo-element">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="cyber-title text-sm">NEURAL PROCESSING</h3>
                    <div className="text-2xl animate-spin">🧠</div>
                  </div>
                  <div className="text-3xl font-bold text-purple-300 mb-2">
                    {neuralActivity.toFixed(1)}%
                  </div>
                  <div className="text-xs font-mono text-purple-400/70">
                    AI EFFICIENCY
                  </div>
                  <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse"
                      style={{ width: `${neuralActivity}%` }}
                    />
                  </div>
                </div>

                {/* Blockchain Ledger */}
                <div className="cyber-card p-6 holo-element">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="cyber-title text-sm">BLOCKCHAIN LEDGER</h3>
                    <div className="text-2xl animate-bounce">🔗</div>
                  </div>
                  <div className="text-3xl font-bold text-green-300 mb-2">
                    {blockchainTransactions}
                  </div>
                  <div className="text-xs font-mono text-green-400/70">
                    TRANSACTIONS
                  </div>
                  <div className="mt-3 flex items-center space-x-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>

                {/* Carbon Credits */}
                <div className="cyber-card p-6 holo-element">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="cyber-title text-sm">CARBON CREDITS</h3>
                    <div className="text-2xl animate-pulse">🌱</div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-300 mb-2">
                    {carbonCredits}
                  </div>
                  <div className="text-xs font-mono text-emerald-400/70">
                    TONS CO2 SAVED
                  </div>
                  <div className="mt-3 text-xs font-mono text-emerald-400">
                    $25,000 VALUE
                  </div>
                </div>
              </div>

              {/* Revolutionary Equipment Grid */}
              <div className="equipment-grid">
                {/* Quantum Truck Fleet */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-cyan-400 font-mono">🚛 QUANTUM FLEET</h2>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-mono border border-cyan-500/50">
                      {Object.keys(trucks).length} UNITS ACTIVE
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-cyan-400">QUANTUM SYNC ACTIVE</span>
                    </div>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {Object.values(trucks).slice(0, 8).map((truck) => (
                      <div key={truck.id} className="cyber-card p-4 holo-element transform transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{truck.status === 'running' ? '🚛' : truck.status === 'maintenance' ? '🔧' : '🚚'}</div>
                            <div>
                              <h3 className="font-bold text-cyan-300 font-mono">{truck.id}</h3>
                              <p className="text-sm text-cyan-400/70 font-mono uppercase">{truck.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-cyan-400">LOAD: {truck.current_load?.toFixed(0) || 0}T</div>
                            <div className="text-sm font-mono text-cyan-400">FUEL: {truck.fuel_level?.toFixed(0) || 0}%</div>
                            <div className="text-sm font-mono text-cyan-400">HEALTH: {truck.health_score?.toFixed(0) || 0}%</div>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${truck.current_load || 0}%` }} />
                          </div>
                          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${truck.fuel_level || 0}%` }} />
                          </div>
                          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 transition-all duration-1000" style={{ width: `${truck.health_score || 0}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {Object.keys(trucks).length === 0 && (
                      <div className="cyber-card text-center py-12">
                        <div className="text-5xl mb-4 opacity-50">🚛</div>
                        <p className="text-lg text-cyan-400 font-mono">QUANTUM FLEET INITIALIZING...</p>
                        <div className="mt-4 quantum-loader w-8 h-8 mx-auto"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantum Crushers */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-purple-400 font-mono">⚙️ QUANTUM CRUSHERS</h2>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-mono border border-purple-500/50">
                      {Object.keys(crushers).length} UNITS
                    </span>
                  </div>
                  <div className="space-y-4">
                    {Object.values(crushers).map((crusher) => (
                      <div key={crusher.id} className="cyber-card p-4 holo-element">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl animate-spin">⚙️</div>
                            <div>
                              <h3 className="font-bold text-purple-300 font-mono">{crusher.id}</h3>
                              <p className="text-sm text-purple-400/70 font-mono uppercase">{crusher.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-purple-400">THROUGHPUT: {crusher.current_throughput?.toFixed(0) || 0} T/H</div>
                            <div className="text-sm font-mono text-purple-400">TEMP: {crusher.temperature?.toFixed(0) || 0}°C</div>
                            <div className="text-sm font-mono text-purple-400">HEALTH: {crusher.health_score?.toFixed(0) || 0}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantum AI Insights */}
                <div>
                  <QuantumAIInsights 
                    trucks={trucks} 
                    crushers={crushers} 
                    stockpiles={stockpiles} 
                    kpis={kpis} 
                  />
                </div>
              </div>
            </>
          )}

          {/* 🗺️ NEURAL MAP VIEW */}
          {currentView === 'neural-map' && (
            <div className="grid grid-cols-1 gap-6">
              <MineMapView trucks={trucks} crushers={crushers} stockpiles={stockpiles} />
            </div>
          )}

          {/* 📊 AI ANALYTICS */}
          {currentView === 'ai-analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealTimeCharts trucks={trucks} crushers={crushers} stockpiles={stockpiles} />
              <SensorGrid equipmentData={{ trucks, crushers, stockpiles }} />
            </div>
          )}

          {/* 🔮 QUANTUM PREDICTIONS */}
          {currentView === 'quantum-predictions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictiveAnalysis />
              <QuantumAIInsights 
                trucks={trucks} 
                crushers={crushers} 
                stockpiles={stockpiles} 
                kpis={kpis} 
              />
            </div>
          )}

          {/* 🔗 BLOCKCHAIN VIEW */}
          {currentView === 'blockchain' && (
            <div className="cyber-card p-8 holo-element text-center">
              <div className="text-6xl mb-6 animate-bounce">🔗</div>
              <h2 className="cyber-title text-2xl mb-4">BLOCKCHAIN INTEGRATION</h2>
              <p className="text-cyan-400 font-mono mb-6">
                Revolutionary blockchain technology for transparent mining operations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="cyber-card p-6">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-xl font-bold text-green-300">{blockchainTransactions}</div>
                  <div className="text-sm font-mono text-green-400">TRANSACTIONS</div>
                </div>
                <div className="cyber-card p-6">
                  <div className="text-3xl mb-2">🔒</div>
                  <div className="text-xl font-bold text-blue-300">100%</div>
                  <div className="text-sm font-mono text-blue-400">IMMUTABLE</div>
                </div>
                <div className="cyber-card p-6">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-xl font-bold text-purple-300">5ms</div>
                  <div className="text-sm font-mono text-purple-400">LATENCY</div>
                </div>
              </div>
            </div>
          )}

          {/* 🌱 CARBON CREDITS */}
          {currentView === 'carbon-credits' && (
            <div className="cyber-card p-8 holo-element text-center">
              <div className="text-6xl mb-6 animate-pulse">🌱</div>
              <h2 className="cyber-title text-2xl mb-4">CARBON CREDIT SYSTEM</h2>
              <p className="text-emerald-400 font-mono mb-6">
                AI-powered carbon footprint reduction and credit generation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="cyber-card p-6">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="text-xl font-bold text-emerald-300">{carbonCredits}</div>
                  <div className="text-sm font-mono text-emerald-400">TONS CO2 SAVED</div>
                </div>
                <div className="cyber-card p-6">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-xl font-bold text-yellow-300">$25,000</div>
                  <div className="text-sm font-mono text-yellow-400">CREDIT VALUE</div>
                </div>
                <div className="cyber-card p-6">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-xl font-bold text-blue-300">-15%</div>
                  <div className="text-sm font-mono text-blue-400">ENERGY REDUCTION</div>
                </div>
                <div className="cyber-card p-6">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="text-xl font-bold text-green-300">A+</div>
                  <div className="text-sm font-mono text-green-400">ECO RATING</div>
                </div>
              </div>
            </div>
          )}

          {/* Legacy views for backwards compatibility */}
          {currentView === 'overview' && (
            <div className="equipment-grid">
              {/* Redirect to quantum overview */}
              {setCurrentView('quantum-overview')}
            </div>
          )}
          
          {currentView === 'map' && (
            <div className="grid grid-cols-1 gap-6">
              <MineMapView trucks={trucks} crushers={crushers} stockpiles={stockpiles} />
            </div>
          )}
          
          {currentView === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealTimeCharts trucks={trucks} crushers={crushers} stockpiles={stockpiles} />
              <SensorGrid />
            </div>
          )}
          
          {currentView === 'predictions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictiveAnalysis />
              <AIInsights />
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        {aiRecommendations.length > 0 && (
          <div className="chart-container">
            <div className="flex items-center space-x-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🤖 AI Recommendations</h2>
              <span className="status-badge bg-indigo-100 text-indigo-800">
                {aiRecommendations.length} Active
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiRecommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="mining-card border-l-4 border-l-indigo-500">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      rec.priority === 'high' ? 'bg-red-500 animate-pulse' : 
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{rec.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                      <p className="text-green-600 text-sm font-medium">{rec.estimated_impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-200 mt-12">
          <p className="text-lg">SmartMine Digital Twin Platform - Complete Mining Operations Management</p>
          <p className="mt-2">Real-time monitoring • Predictive analytics • AI-driven insights • Maintenance optimization</p>
          <p className="mt-1 text-xs">Digital Twin Technology for Smart Mining Operations</p>
        </footer>
      </main>
    </div>
  );
}

export default SmartMineDashboard;

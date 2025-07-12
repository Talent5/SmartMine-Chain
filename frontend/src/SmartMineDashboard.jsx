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
  const [currentView, setCurrentView] = useState('overview');

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

        {/* Main Dashboard Grid */}
        <div className="mb-8">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'overview', label: 'Overview', icon: '🏠' },
              { key: 'map', label: 'Mine Map', icon: '🗺️' },
              { key: 'analytics', label: 'Analytics', icon: '📊' },
              { key: 'predictions', label: 'AI Predictions', icon: '🔮' },
              { key: 'maintenance', label: 'Maintenance', icon: '🔧' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentView(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {currentView === 'overview' && (
            <div className="equipment-grid">
              {/* Truck Fleet */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">🚛 Truck Fleet</h2>
                  <span className="status-badge status-badge-running">
                    {Object.keys(trucks).length} Active
                  </span>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {Object.values(trucks).slice(0, 6).map((truck) => (
                    <TruckCard key={truck.id} truck={truck} />
                  ))}
                  {Object.keys(trucks).length === 0 && (
                    <div className="mining-card text-center py-12 text-gray-500">
                      <div className="text-5xl mb-4 opacity-50">🚛</div>
                      <p className="text-lg">No trucks currently active</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Crushers */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">⚙️ Crushers</h2>
                  <span className="status-badge status-badge-running">
                    {Object.values(crushers).filter(c => c.status === 'running').length} Running
                  </span>
                </div>
                <div className="space-y-4">
                  {Object.values(crushers).map((crusher) => (
                    <CrusherCard key={crusher.id} crusher={crusher} />
                  ))}
                  {Object.keys(crushers).length === 0 && (
                    <div className="mining-card text-center py-12 text-gray-500">
                      <div className="text-5xl mb-4 opacity-50">⚙️</div>
                      <p className="text-lg">No crushers currently active</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stockpiles */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">📦 Stockpiles</h2>
                  <span className="status-badge status-badge-idle">
                    {Object.keys(stockpiles).length} Total
                  </span>
                </div>
                <div className="space-y-4">
                  {Object.values(stockpiles).map((stockpile) => (
                    <StockpileCard key={stockpile.id} stockpile={stockpile} />
                  ))}
                  {Object.keys(stockpiles).length === 0 && (
                    <div className="mining-card text-center py-12 text-gray-500">
                      <div className="text-5xl mb-4 opacity-50">📦</div>
                      <p className="text-lg">No stockpiles configured</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'map' && (
            <MineMapView 
              trucks={trucks} 
              crushers={crushers} 
              stockpiles={stockpiles} 
            />
          )}

          {currentView === 'analytics' && (
            <RealTimeCharts 
              trucks={trucks} 
              crushers={crushers} 
              stockpiles={stockpiles} 
            />
          )}

          {currentView === 'predictions' && (
            <PredictiveAnalysis 
              equipmentData={{trucks, crushers, stockpiles}} 
            />
          )}

          {currentView === 'maintenance' && (
            <MaintenancePanel 
              equipmentData={{trucks, crushers, stockpiles}} 
            />
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

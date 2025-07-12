import React, { useState, useEffect, useRef } from 'react';
import './MineMapView.css';

const MineMapView = ({ trucks, crushers, stockpiles }) => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [scanActive, setScanActive] = useState(false);
  const [hologramRotation, setHologramRotation] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHologramRotation(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getEquipmentIcon = (type, status) => {
    const icons = {
      truck: {
        running: '�',
        idle: '🛸',
        maintenance: '⚠️',
        loading: '🔄',
        hauling: '💨',
        dumping: '💥'
      },
      crusher: {
        running: '⚡',
        idle: '🔧',
        maintenance: '🛠️',
        default: '🌀'
      },
      stockpile: '�'
    };
    
    return icons[type]?.[status] || icons[type]?.default || icons[type] || '🌟';
  };

  const getStatusColor = (status) => {
    const colors = {
      running: 'text-emerald-400 drop-shadow-glow-green animate-pulse-glow',
      idle: 'text-amber-400 drop-shadow-glow-yellow animate-pulse-slow',
      maintenance: 'text-red-500 drop-shadow-glow-red animate-pulse-danger',
      loading: 'text-orange-400 drop-shadow-glow-orange animate-spin-slow',
      hauling: 'text-cyan-400 drop-shadow-glow animate-bounce-subtle',
      dumping: 'text-purple-400 drop-shadow-glow-purple animate-pulse-fast'
    };
    return colors[status] || 'text-gray-400 drop-shadow-glow';
  };

  const triggerScan = () => {
    setScanActive(true);
    setTimeout(() => setScanActive(false), 3000);
  };

  return (
    <>
      <div className="cyber-card h-full holo-element relative overflow-hidden">
        {/* Holographic Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-cyan-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent animate-pulse-slow"></div>
        
        {/* Scanning Effect */}
        {scanActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-scan-sweep z-10"></div>
        )}
        
        <div className="relative z-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="cyber-title bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer">
              ◉ QUANTUM MINE TOPOLOGY ◉
            </h3>
            <button 
              onClick={triggerScan}
              className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300 text-xs font-mono animate-pulse-glow"
            >
              DEEP SCAN
            </button>
          </div>
      
      <div className="map-3d-container relative">
        <div 
          ref={mapRef}
          className="viz-container h-96 relative transform-3d rotate-x-neg-20 perspective-1000"
          style={{ transform: `rotateY(${hologramRotation * 0.1}deg) rotateX(-20deg)` }}
        >
        {/* Enhanced Grid Pattern with Holographic Effect */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 animate-grid-pulse"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent,cyan,transparent,purple,transparent)] opacity-10 animate-spin-ultra-slow"></div>
        
        {/* Energy Field Lines */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-energy-flow"
              style={{ 
                top: `${20 + i * 15}%`, 
                left: '0%', 
                right: '0%',
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative h-full p-4">
          {/* Quantum Trucks with Advanced Effects */}
          {Object.values(trucks).slice(0, 6).map((truck, index) => (
            <div
              key={truck.id}
              className={`truck absolute cursor-pointer transform-3d hover:scale-150 transition-all duration-500 ${getStatusColor(truck.status)} hover:drop-shadow-glow-intense animate-float`}
              style={{ 
                top: `${30 + (index % 3) * 20}%`, 
                left: `${15 + (index * 12)}%`,
                fontSize: '2.5rem',
                animationDelay: `${index * 0.3}s`,
                filter: 'drop-shadow(0 0 10px currentColor)'
              }}
              onClick={() => setSelectedEquipment({...truck, type: 'truck'})}
              title={`${truck.id} - ${truck.status}`}
            >
              <div className="relative">
                {getEquipmentIcon('truck', truck.status)}
                {/* Energy Trail */}
                <div className="absolute -top-1 -left-1 text-3xl opacity-30 animate-ping">
                  ✨
                </div>
                {/* Status Indicator */}
                <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${getStatusColor(truck.status).includes('emerald') ? 'bg-emerald-400' : 
                  getStatusColor(truck.status).includes('amber') ? 'bg-amber-400' :
                  getStatusColor(truck.status).includes('red') ? 'bg-red-400' : 'bg-cyan-400'} animate-pulse shadow-glow`}></div>
              </div>
            </div>
          ))}
          
          {/* Quantum Crushers */}
          {Object.values(crushers).map((crusher, index) => (
            <div
              key={crusher.id}
              className={`absolute cursor-pointer transform hover:scale-150 transition-all duration-500 ${getStatusColor(crusher.status)} animate-pulse-glow hover:animate-spin-slow`}
              style={{ 
                left: `${60 + (index * 15)}%`, 
                top: '20%', 
                fontSize: '3rem',
                filter: 'drop-shadow(0 0 15px currentColor)'
              }}
              onClick={() => setSelectedEquipment({...crusher, type: 'crusher'})}
              title={`${crusher.id} - ${crusher.status}`}
            >
              <div className="relative">
                {getEquipmentIcon('crusher', crusher.status)}
                {/* Energy Core */}
                <div className="absolute inset-0 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full animate-pulse"></div>
                {/* Rotating Ring */}
                <div className="absolute -inset-4 border-2 border-cyan-400/30 rounded-full animate-spin-slow"></div>
              </div>
            </div>
          ))}
          
          {/* Quantum Stockpiles */}
          {Object.values(stockpiles).map((stockpile, index) => (
            <div
              key={stockpile.id}
              className="absolute cursor-pointer transform hover:scale-125 transition-all duration-500 text-cyan-400/90 hover:text-cyan-300 animate-levitate"
              style={{ 
                left: `${10 + (index * 20)}%`, 
                top: '70%', 
                fontSize: '3.5rem',
                animationDelay: `${index * 0.4}s`,
                filter: 'drop-shadow(0 0 20px cyan)'
              }}
              onClick={() => setSelectedEquipment({...stockpile, type: 'stockpile'})}
              title={`${stockpile.id} - ${stockpile.material_type}`}
            >
              <div className="relative">
                {getEquipmentIcon('stockpile')}
                {/* Quantum Field */}
                <div className="absolute -inset-2 bg-gradient-conic from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 rounded-full animate-spin"></div>
                {/* Particle Effects */}
                <div className="absolute -top-3 -left-3 text-xs opacity-60 animate-bounce">✦</div>
                <div className="absolute -bottom-3 -right-3 text-xs opacity-60 animate-bounce" style={{animationDelay: '0.5s'}}>✧</div>
              </div>
            </div>
          ))}
          
          {/* Enhanced Status Legend with Holographic Frame */}
          <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-xl border-2 border-cyan-500/50 rounded-xl p-4 shadow-2xl shadow-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl"></div>
            <div className="relative z-10">
              <h4 className="font-bold text-sm text-cyan-300 mb-3 font-mono flex items-center">
                <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                QUANTUM STATUS MATRIX
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-glow-green animate-pulse"></div>
                  <span className="text-emerald-400">OPERATIONAL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-amber-400 rounded-full shadow-glow-yellow animate-pulse"></div>
                  <span className="text-amber-400">STANDBY</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-400 rounded-full shadow-glow-red animate-pulse"></div>
                  <span className="text-red-400">MAINTENANCE</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-glow animate-pulse"></div>
                  <span className="text-cyan-400">ACTIVE MISSION</span>              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
      </div>
      
      {selectedEquipment && (
        <div className="mt-6 relative">
          {/* Holographic Frame Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm"></div>
          <div className="relative bg-black/95 backdrop-blur-xl border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl shadow-cyan-500/30">
            {/* Scanning Lines Animation */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scan-vertical"></div>
            </div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex-1">
                {/* Header with Quantum Effect */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-glow"></div>
                  <h4 className="font-bold text-xl text-cyan-300 font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    ◉ {selectedEquipment.type.toUpperCase()} UNIT: {selectedEquipment.id}
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                </div>
                
                {/* Status with Enhanced Styling */}
                <div className="mb-4 p-3 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30">
                  <p className="text-sm text-cyan-400/90 uppercase tracking-wider font-mono flex items-center">
                    <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                    STATUS: <span className={`ml-2 font-bold ${getStatusColor(selectedEquipment.status)}`}>
                      {selectedEquipment.status || 'ACTIVE'}
                    </span>
                  </p>
                </div>
                
                {/* Equipment-Specific Data with Futuristic Styling */}
                {selectedEquipment.type === 'truck' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
                    <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 p-4 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-400/80">CARGO LOAD</span>
                        <span className="text-2xl">📦</span>
                      </div>
                      <p className="text-xl font-bold text-emerald-300">{selectedEquipment.current_load?.toFixed(0) || 0}T</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-emerald-400 h-2 rounded-full animate-pulse" style={{width: `${(selectedEquipment.current_load / 100) * 100}%`}}></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 p-4 rounded-lg border border-amber-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-400/80">FUEL LEVEL</span>
                        <span className="text-2xl">⚡</span>
                      </div>
                      <p className="text-xl font-bold text-amber-300">{selectedEquipment.fuel_level?.toFixed(0) || 0}%</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-amber-400 h-2 rounded-full animate-pulse" style={{width: `${selectedEquipment.fuel_level || 0}%`}}></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 p-4 rounded-lg border border-cyan-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400/80">HEALTH SCORE</span>
                        <span className="text-2xl">💚</span>
                      </div>
                      <p className="text-xl font-bold text-cyan-300">{selectedEquipment.health_score?.toFixed(0) || 0}%</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-cyan-400 h-2 rounded-full animate-pulse" style={{width: `${selectedEquipment.health_score || 0}%`}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedEquipment.type === 'crusher' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-4 rounded-lg border border-purple-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-400/80">THROUGHPUT</span>
                        <span className="text-2xl">⚡</span>
                      </div>
                      <p className="text-xl font-bold text-purple-300">{selectedEquipment.current_throughput?.toFixed(0) || 0} T/H</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-4 rounded-lg border border-red-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-400/80">TEMPERATURE</span>
                        <span className="text-2xl">🌡️</span>
                      </div>
                      <p className="text-xl font-bold text-red-300">{selectedEquipment.temperature?.toFixed(0) || 0}°C</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 p-4 rounded-lg border border-cyan-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400/80">HEALTH SCORE</span>
                        <span className="text-2xl">💚</span>
                      </div>
                      <p className="text-xl font-bold text-cyan-300">{selectedEquipment.health_score?.toFixed(0) || 0}%</p>
                    </div>
                  </div>
                )}
                
                {selectedEquipment.type === 'stockpile' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
                    <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/30 p-4 rounded-lg border border-indigo-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-indigo-400/80">MATERIAL TYPE</span>
                        <span className="text-2xl">🔮</span>
                      </div>
                      <p className="text-lg font-bold text-indigo-300">{selectedEquipment.material_type}</p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-900/30 to-teal-800/30 p-4 rounded-lg border border-teal-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-teal-400/80">VOLUME</span>
                        <span className="text-2xl">📊</span>
                      </div>
                      <p className="text-xl font-bold text-teal-300">{selectedEquipment.current_volume?.toFixed(0) || 0}T</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 p-4 rounded-lg border border-pink-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-pink-400/80">CAPACITY</span>
                        <span className="text-2xl">📈</span>
                      </div>
                      <p className="text-xl font-bold text-pink-300">{((selectedEquipment.current_volume / selectedEquipment.max_capacity) * 100).toFixed(1)}%</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-pink-400 h-2 rounded-full animate-pulse" style={{width: `${((selectedEquipment.current_volume / selectedEquipment.max_capacity) * 100)}%`}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Close Button */}
              <button
                onClick={() => setSelectedEquipment(null)}
                className="ml-4 w-10 h-10 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded-full text-red-400 hover:text-red-200 text-xl font-bold transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <span className="relative z-10">×</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MineMapView;

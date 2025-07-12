import React, { useState, useEffect, useRef } from 'react';

const MineMapView = ({ trucks, crushers, stockpiles }) => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [viewMode, setViewMode] = useState('3d'); // '2d', '3d', 'satellite', 'thermal'
  const [showTrails, setShowTrails] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const mapRef = useRef(null);

  // 🚀 REVOLUTIONARY EQUIPMENT ICONS WITH QUANTUM EFFECTS
  const getEquipmentIcon = (type, status) => {
    const icons = {
      truck: {
        running: '🚛',
        idle: '🚚',
        maintenance: '🔧',
        loading: '⬆️',
        hauling: '🚛',
        dumping: '⬇️'
      },
      crusher: {
        running: '⚙️',
        idle: '⚙️',
        maintenance: '🔧'
      },
      stockpile: '📦'
    };
    
    if (type === 'stockpile') return icons.stockpile;
    return icons[type]?.[status] || icons[type]?.running || '📍';
  };

  // 🎨 PROFESSIONAL STATUS COLORS
  const getStatusColor = (status) => {
    const colors = {
      running: 'text-emerald-600 drop-shadow-[0_0_8px_rgba(5,150,105,0.4)]',
      idle: 'text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.4)]',
      maintenance: 'text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]',
      loading: 'text-orange-600 drop-shadow-[0_0_8px_rgba(234,88,12,0.4)]',
      hauling: 'text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]',
      dumping: 'text-indigo-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.4)]'
    };
    return colors[status] || 'text-slate-500';
  };

  // 🎨 PROFESSIONAL BACKGROUND EFFECTS
  const getProfessionalBackground = () => {
    switch (viewMode) {
      case '3d':
        return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900';
      case 'satellite':
        return 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800';
      case 'thermal':
        return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900';
      default:
        return 'bg-gradient-to-br from-slate-800 to-slate-900';
    }
  };

  // 🔮 QUANTUM PARTICLE EFFECTS
  useEffect(() => {
    const createParticles = () => {
      if (!mapRef.current) return;
      
      const particles = [];
      for (let i = 0; i < 20; i++) {
              const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-slate-400 rounded-full opacity-40 animate-ping';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (2 + Math.random() * 3) + 's';
        mapRef.current.appendChild(particle);
        particles.push(particle);
      }
      
      return () => {
        particles.forEach(p => p.remove());
      };
    };

    const cleanup = createParticles();
    return cleanup;
  }, [viewMode]);

  // 🎯 EQUIPMENT MOVEMENT TRAILS
  const renderMovementTrails = () => {
    if (!showTrails) return null;
    
    return Object.values(trucks).map((truck, index) => (
      <div
        key={`trail-${truck.id}`}
        className="absolute opacity-30"
        style={{
          left: `${Math.max(0, (30 + (index % 3) * 20) - 10)}%`,
          top: `${Math.max(0, (30 + (index % 3) * 20) - 5)}%`,
          width: '20%',
          height: '3px'
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-slate-400 to-transparent rounded-full animate-pulse"></div>
      </div>
    ));
  };

  // 🔥 HEAT MAP OVERLAY
  const renderHeatMap = () => {
    if (!showHeatmap) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {Object.values(crushers).map((crusher, index) => (
          <div
            key={`heat-${crusher.id}`}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${55 + (index * 15)}%`,
              top: '15%',
              width: '80px',
              height: '80px',
              background: `radial-gradient(circle, rgba(255,69,0,0.4) 0%, rgba(255,140,0,0.2) 50%, transparent 100%)`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="cyber-card h-full holo-element relative overflow-hidden">
        {/* 🎮 PROFESSIONAL CONTROLS */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-600/50 rounded-lg p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  viewMode === '3d' 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                3D
              </button>
              <button
                onClick={() => setViewMode('satellite')}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  viewMode === 'satellite' 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                SAT
              </button>
              <button
                onClick={() => setViewMode('thermal')}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  viewMode === 'thermal' 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                THERMAL
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-600/50 rounded-lg p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setShowTrails(!showTrails)}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  showTrails 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                TRAILS
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  showHeatmap 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                HEAT
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-600/50 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300">SPEED:</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-16 accent-slate-400"
              />
              <span className="text-xs font-mono text-slate-300">{animationSpeed}x</span>
            </div>
          </div>
        </div>

        <h3 className="cyber-title mb-4">MINE TOPOLOGY</h3>
        
        <div className="map-3d-container">
          <div className={`viz-container h-96 relative transform-3d rotate-x-neg-20 rounded-lg overflow-hidden ${getProfessionalBackground()}`}>
            
            {/* 🌌 PARTICLE FIELD */}
            <div ref={mapRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
            
            {/* 🔥 HEAT MAP OVERLAY */}
            {renderHeatMap()}
            
            {/* ✨ MOVEMENT TRAILS */}
            {renderMovementTrails()}
            
            {/* 🎭 PROFESSIONAL GRID PATTERN */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-slate-500/5 via-slate-400/5 to-slate-500/5">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, slate-400 1px, transparent 1px),
                    radial-gradient(circle at 75% 75%, slate-500 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px, 30px 30px'
                }} />
              </div>
            </div>
            
            <div className="relative h-full p-4 z-10">
              {/* 🚛 TRUCKS */}
              {Object.values(trucks).slice(0, 8).map((truck, index) => (
                <div
                  key={truck.id}
                  className={`truck absolute cursor-pointer transform-3d hover:scale-150 transition-all duration-500 ${getStatusColor(truck.status)}`}
                  style={{ 
                    top: `${25 + (index % 4) * 18}%`, 
                    left: `${15 + (index % 3) * 25}%`,
                    fontSize: '2.5rem',
                    filter: 'drop-shadow(0 0 20px currentColor)',
                    animation: `quantum-float-${index % 3} ${3 + (index % 2)}s ease-in-out infinite`,
                    transform: `rotate(${index * 45}deg) scale(${1 + (index % 2) * 0.2})`
                  }}
                  onClick={() => setSelectedEquipment({...truck, type: 'truck'})}
                  title={`${truck.id} - ${truck.status} - Health: ${truck.health_score?.toFixed(0) || 0}%`}
                >
                  {getEquipmentIcon('truck', truck.status)}
                  
                  {/* 🔋 STATUS INDICATOR */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-slate-400 to-slate-600" />
                  
                  {/* 📊 MINI HEALTH BAR */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 transition-all duration-1000"
                        style={{ width: `${truck.health_score || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* ⚙️ CRUSHERS */}
              {Object.values(crushers).map((crusher, index) => (
                <div
                  key={crusher.id}
                  className={`absolute cursor-pointer transform hover:scale-125 transition-all duration-300 ${getStatusColor(crusher.status)}`}
                  style={{ 
                    left: `${55 + (index * 15)}%`, 
                    top: '15%', 
                    fontSize: '3rem',
                    filter: 'drop-shadow(0 0 25px currentColor)',
                    animation: `quantum-pulse ${2 + index}s ease-in-out infinite`
                  }}
                  onClick={() => setSelectedEquipment({...crusher, type: 'crusher'})}
                  title={`${crusher.id} - ${crusher.status} - Temp: ${crusher.temperature?.toFixed(0) || 0}°C`}
                >
                  {getEquipmentIcon('crusher', crusher.status)}
                  
                  {/* 🌡️ TEMPERATURE INDICATOR */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`w-2 h-8 rounded-full ${
                      (crusher.temperature || 0) > 80 ? 'bg-red-600' :
                      (crusher.temperature || 0) > 60 ? 'bg-amber-600' : 'bg-emerald-600'
                    } opacity-80`} />
                  </div>
                </div>
              ))}
              
              {/* 📦 STOCKPILES */}
              {Object.values(stockpiles).map((stockpile, index) => (
                <div
                  key={stockpile.id}
                  className="absolute cursor-pointer transform hover:scale-125 transition-all duration-300 text-slate-400"
                  style={{ 
                    left: `${10 + (index * 20)}%`, 
                    top: '70%', 
                    fontSize: '3.5rem',
                    filter: 'drop-shadow(0 0 20px rgba(148,163,184,0.5))',
                    animation: `quantum-glow ${1.5 + index * 0.5}s ease-in-out infinite alternate`
                  }}
                  onClick={() => setSelectedEquipment({...stockpile, type: 'stockpile'})}
                  title={`${stockpile.id} - ${stockpile.material_type} - ${((stockpile.current_volume / stockpile.max_capacity) * 100).toFixed(1)}%`}
                >
                  {getEquipmentIcon('stockpile')}
                  
                  {/* 📊 CAPACITY INDICATOR */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-slate-400 to-slate-600 transition-all duration-1000"
                        style={{ width: `${((stockpile.current_volume / stockpile.max_capacity) * 100) || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 🏭 MINE ZONES */}
              <div className="absolute top-2 left-2 w-16 h-16 border-2 border-emerald-600/50 rounded-lg flex items-center justify-center text-emerald-600 font-mono text-xs backdrop-blur-sm bg-emerald-600/10">
                ZONE A
              </div>
              <div className="absolute top-2 right-2 w-16 h-16 border-2 border-blue-600/50 rounded-lg flex items-center justify-center text-blue-600 font-mono text-xs backdrop-blur-sm bg-blue-600/10">
                ZONE B
              </div>
              <div className="absolute bottom-2 left-2 w-16 h-16 border-2 border-indigo-600/50 rounded-lg flex items-center justify-center text-indigo-600 font-mono text-xs backdrop-blur-sm bg-indigo-600/10">
                ZONE C
              </div>
              
              {/* 📡 STATUS LEGEND */}
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-600/50 rounded-lg p-4 max-w-xs">
                <h4 className="font-bold text-sm text-slate-300 mb-3 font-mono flex items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                  STATUS MATRIX
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                      <span className="text-emerald-600">OPERATIONAL</span>
                    </div>
                    <span className="text-emerald-600">{Object.values(trucks).filter(t => t.status === 'running').length + Object.values(crushers).filter(c => c.status === 'running').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                      <span className="text-amber-600">STANDBY</span>
                    </div>
                    <span className="text-amber-600">{Object.values(trucks).filter(t => t.status === 'idle').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="text-red-600">MAINTENANCE</span>
                    </div>
                    <span className="text-red-600">{Object.values(trucks).filter(t => t.status === 'maintenance').length + Object.values(crushers).filter(c => c.status === 'maintenance').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-600">ACTIVE HAUL</span>
                    </div>
                    <span className="text-blue-600">{Object.values(trucks).filter(t => t.status === 'hauling').length}</span>
                  </div>
                </div>
                
                {/* 🎯 EFFICIENCY METER */}
                <div className="mt-4 pt-3 border-t border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-xs font-mono">EFFICIENCY</span>
                    <span className="text-slate-300 text-xs font-mono">
                      {(Object.values(trucks).filter(t => t.status === 'running').length / Math.max(Object.values(trucks).length, 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-slate-400 to-slate-600 transition-all duration-1000"
                      style={{ 
                        width: `${(Object.values(trucks).filter(t => t.status === 'running').length / Math.max(Object.values(trucks).length, 1) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedEquipment && (
        <div className="mt-4 p-4 bg-slate-900/80 backdrop-blur-md border border-slate-600/50 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-slate-200 font-mono">
                {selectedEquipment.type.toUpperCase()}: {selectedEquipment.id}
              </h4>
              <p className="text-sm text-slate-400 capitalize font-mono">
                Status: {selectedEquipment.status || 'Active'}
              </p>
              {selectedEquipment.type === 'truck' && (
                <div className="mt-2 text-sm text-slate-300 font-mono">
                  <p>Load: {selectedEquipment.current_load?.toFixed(0) || 0}T</p>
                  <p>Fuel: {selectedEquipment.fuel_level?.toFixed(0) || 0}%</p>
                  <p>Health: {selectedEquipment.health_score?.toFixed(0) || 0}%</p>
                </div>
              )}
              {selectedEquipment.type === 'crusher' && (
                <div className="mt-2 text-sm text-slate-300 font-mono">
                  <p>Throughput: {selectedEquipment.current_throughput?.toFixed(0) || 0} T/H</p>
                  <p>Temp: {selectedEquipment.temperature?.toFixed(0) || 0}°C</p>
                  <p>Health: {selectedEquipment.health_score?.toFixed(0) || 0}%</p>
                </div>
              )}
              {selectedEquipment.type === 'stockpile' && (
                <div className="mt-2 text-sm text-slate-300 font-mono">
                  <p>Material: {selectedEquipment.material_type}</p>
                  <p>Volume: {selectedEquipment.current_volume?.toFixed(0) || 0}T</p>
                  <p>Capacity: {((selectedEquipment.current_volume / selectedEquipment.max_capacity) * 100).toFixed(1)}%</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedEquipment(null)}
              className="text-slate-400 hover:text-slate-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MineMapView;

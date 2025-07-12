import React, { useState } from 'react';

const MineMapView = ({ trucks, crushers, stockpiles }) => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const getEquipmentIcon = (type) => {
    const icons = {
      truck: '🚛',
      crusher: '⚙️',
      stockpile: '📦'
    };
    
    return icons[type] || '📍';
  };

  const getStatusColor = (status) => {
    const colors = {
      running: 'text-green-500',
      idle: 'text-yellow-500',
      maintenance: 'text-red-500',
      loading: 'text-orange-500',
      hauling: 'text-blue-500',
      dumping: 'text-purple-500'
    };
    return colors[status] || 'text-gray-500';
  };

  return (
    <>
      <div className="cyber-card h-full holo-element">
      <h3 className="cyber-title mb-4">QUANTUM MINE TOPOLOGY</h3>
      
      <div className="map-3d-container">
        <div className="viz-container h-96 relative transform-3d rotate-x-neg-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        <div className="relative h-full p-4">
          {Object.values(trucks).slice(0, 6).map((truck, index) => (
            <div
              key={truck.id}
              className={`truck absolute cursor-pointer transform-3d hover:scale-125 transition-all duration-300 ${getStatusColor(truck.status)} animate-move-truck`}
              style={{ top: `${30 + (index % 3) * 20}%`, fontSize: '2rem' }}
              onClick={() => setSelectedEquipment({...truck, type: 'truck'})}
              title={`${truck.id} - ${truck.status}`}
            >
              {getEquipmentIcon('truck')}
            </div>
          ))}
          
          {Object.values(crushers).map((crusher, index) => (
            <div
              key={crusher.id}
              className={`absolute cursor-pointer transform hover:scale-125 transition-all duration-300 ${getStatusColor(crusher.status)}`}
              style={{ left: `${60 + (index * 15)}%`, top: '20%', fontSize: '2.5rem' }}
              onClick={() => setSelectedEquipment({...crusher, type: 'crusher'})}
              title={`${crusher.id} - ${crusher.status}`}
            >
              {getEquipmentIcon('crusher')}
            </div>
          ))}
          
          {Object.values(stockpiles).map((stockpile, index) => (
            <div
              key={stockpile.id}
              className="absolute cursor-pointer transform hover:scale-125 transition-all duration-300 text-cyan-400/70"
              style={{ left: `${10 + (index * 20)}%`, top: '70%', fontSize: '3rem' }}
              onClick={() => setSelectedEquipment({...stockpile, type: 'stockpile'})}
              title={`${stockpile.id} - ${stockpile.material_type}`}
            >
              {getEquipmentIcon('stockpile')}
            </div>
          ))}
          
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3">
            <h4 className="font-bold text-sm text-cyan-300 mb-2 font-mono">STATUS LEGEND</h4>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-400 rounded-full shadow-glow-green"></div><span className="text-green-400">Running</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-yellow-400 rounded-full shadow-glow-yellow"></div><span className="text-yellow-400">Idle</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-400 rounded-full shadow-glow-red"></div><span className="text-red-400">Maintenance</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-blue-400 rounded-full shadow-glow"></div><span className="text-blue-400">Hauling</span></div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
      
      {selectedEquipment && (
        <div className="mt-4 p-4 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-cyan-300 font-mono">
                {selectedEquipment.type.toUpperCase()}: {selectedEquipment.id}
              </h4>
              <p className="text-sm text-cyan-400/70 capitalize font-mono">
                Status: {selectedEquipment.status || 'Active'}
              </p>
              {selectedEquipment.type === 'truck' && (
                <div className="mt-2 text-sm text-cyan-400 font-mono">
                  <p>Load: {selectedEquipment.current_load?.toFixed(0) || 0}T</p>
                  <p>Fuel: {selectedEquipment.fuel_level?.toFixed(0) || 0}%</p>
                  <p>Health: {selectedEquipment.health_score?.toFixed(0) || 0}%</p>
                </div>
              )}
              {selectedEquipment.type === 'crusher' && (
                <div className="mt-2 text-sm text-cyan-400 font-mono">
                  <p>Throughput: {selectedEquipment.current_throughput?.toFixed(0) || 0} T/H</p>
                  <p>Temp: {selectedEquipment.temperature?.toFixed(0) || 0}°C</p>
                  <p>Health: {selectedEquipment.health_score?.toFixed(0) || 0}%</p>
                </div>
              )}
              {selectedEquipment.type === 'stockpile' && (
                <div className="mt-2 text-sm text-cyan-400 font-mono">
                  <p>Material: {selectedEquipment.material_type}</p>
                  <p>Volume: {selectedEquipment.current_volume?.toFixed(0) || 0}T</p>
                  <p>Capacity: {((selectedEquipment.current_volume / selectedEquipment.max_capacity) * 100).toFixed(1)}%</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedEquipment(null)}
              className="text-cyan-400 hover:text-cyan-200 text-2xl font-bold"
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

import React, { useState, useEffect } from 'react';

const MaintenancePanel = ({ equipmentData }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [maintenanceData, setMaintenanceData] = useState({
    scheduled: [],
    pending: [],
    completed: [],
    inventory: []
  });

  useEffect(() => {
    // Simulate maintenance data
    const generateMaintenanceData = () => {
      const scheduled = [
        {
          id: 'maint_001',
          equipment: 'truck_003',
          type: 'Preventive',
          task: 'Engine Oil Change',
          scheduled_date: '2024-01-15',
          estimated_duration: '4 hours',
          technician: 'John Smith',
          priority: 'medium',
          status: 'scheduled'
        },
        {
          id: 'maint_002',
          equipment: 'crusher_001',
          type: 'Corrective',
          task: 'Bearing Replacement',
          scheduled_date: '2024-01-16',
          estimated_duration: '8 hours',
          technician: 'Sarah Johnson',
          priority: 'high',
          status: 'scheduled'
        },
        {
          id: 'maint_003',
          equipment: 'truck_007',
          type: 'Inspection',
          task: 'Hydraulic System Check',
          scheduled_date: '2024-01-17',
          estimated_duration: '2 hours',
          technician: 'Mike Davis',
          priority: 'low',
          status: 'scheduled'
        }
      ];

      const pending = [
        {
          id: 'pend_001',
          equipment: 'truck_005',
          issue: 'Brake System Warning',
          reported_date: '2024-01-12',
          reporter: 'Operator A',
          priority: 'high',
          estimated_cost: '$2,500'
        },
        {
          id: 'pend_002',
          equipment: 'crusher_002',
          issue: 'Unusual Vibration',
          reported_date: '2024-01-13',
          reporter: 'Operator B',
          priority: 'medium',
          estimated_cost: '$1,200'
        }
      ];

      const completed = [
        {
          id: 'comp_001',
          equipment: 'truck_001',
          task: 'Tire Replacement',
          completed_date: '2024-01-10',
          technician: 'John Smith',
          duration: '3 hours',
          cost: '$800',
          notes: 'All four tires replaced successfully'
        },
        {
          id: 'comp_002',
          equipment: 'conveyor_001',
          task: 'Belt Alignment',
          completed_date: '2024-01-09',
          technician: 'Sarah Johnson',
          duration: '1.5 hours',
          cost: '$150',
          notes: 'Minor adjustment completed'
        }
      ];

      const inventory = [
        { part: 'Engine Oil (20L)', stock: 45, minimum: 20, cost: '$80', supplier: 'AutoParts Inc' },
        { part: 'Brake Pads Set', stock: 8, minimum: 15, cost: '$250', supplier: 'BrakeCorp' },
        { part: 'Hydraulic Fluid (10L)', stock: 12, minimum: 10, cost: '$120', supplier: 'FluidTech' },
        { part: 'Air Filter', stock: 25, minimum: 20, cost: '$45', supplier: 'FilterPro' },
        { part: 'Tire (Heavy Duty)', stock: 6, minimum: 12, cost: '$1200', supplier: 'TireMaster' }
      ];

      setMaintenanceData({
        scheduled,
        pending,
        completed,
        inventory
      });
    };

    generateMaintenanceData();
  }, [equipmentData]);

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStockStatus = (current, minimum) => {
    if (current <= minimum) return 'text-red-600 font-semibold';
    if (current <= minimum * 1.5) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };


  return (
    <div className="cyber-card glass-card h-full holo-element slide-up">
      <h3 className="cyber-title mb-6">MAINTENANCE CORE</h3>
      
      <div className="flex space-x-1 mb-6 bg-black/20 p-1 rounded-lg">
        {[  
          { key: 'schedule', label: 'Scheduled', icon: '📅' },
          { key: 'pending', label: 'Pending', icon: '⚠️' },
          { key: 'inventory', label: 'Inventory', icon: '📦' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`cyber-button flex-1 ${activeTab === tab.key ? 'active' : ''}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            {maintenanceData.scheduled.map((item) => (
              <div key={item.id} className="cyber-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-cyan-300">{item.equipment.toUpperCase()}</h5>
                    <p className="text-cyan-400/70">{item.task}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
                  <div><span className="text-cyan-400/60">Date:</span><p>{item.scheduled_date}</p></div>
                  <div><span className="text-cyan-400/60">Duration:</span><p>{item.estimated_duration}</p></div>
                  <div><span className="text-cyan-400/60">Technician:</span><p>{item.technician}</p></div>
                  <div><span className="text-cyan-400/60">Type:</span><p>{item.type}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'pending' && (
            <div className="space-y-4">
            {maintenanceData.pending.map((item) => (
              <div key={item.id} className="cyber-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-cyan-300">{item.equipment.toUpperCase()}</h5>
                    <p className="text-cyan-400/70">{item.issue}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono">
                  <div><span className="text-cyan-400/60">Reported:</span><p>{item.reported_date}</p></div>
                  <div><span className="text-cyan-400/60">Reporter:</span><p>{item.reporter}</p></div>
                  <div><span className="text-cyan-400/60">Est. Cost:</span><p>{item.estimated_cost}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'inventory' && (
          <div className="cyber-card overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-cyan-500/20">
                  <th className="p-3 text-left text-cyan-300">PART</th>
                  <th className="p-3 text-left text-cyan-300">STOCK</th>
                  <th className="p-3 text-left text-cyan-300">MIN</th>
                  <th className="p-3 text-left text-cyan-300">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceData.inventory.map((item, index) => (
                  <tr key={index} className="border-b border-cyan-500/10">
                    <td className="p-3 text-cyan-400">{item.part}</td>
                    <td className={`p-3 ${getStockStatus(item.stock, item.minimum)}`}>{item.stock}</td>
                    <td className="p-3 text-cyan-400">{item.minimum}</td>
                    <td className="p-3">
                      {item.stock <= item.minimum && <button className="cyber-button text-xs shadow-glow-neon hover:shadow-glow-neon neon-text animate-pulse">Order Now</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePanel;

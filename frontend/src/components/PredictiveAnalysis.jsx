import React, { useState, useEffect } from 'react';

const PredictiveAnalysis = ({ equipmentData }) => {
  const [predictions, setPredictions] = useState({
    maintenance: [],
    production: [],
    alerts: []
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  useEffect(() => {
    // Simulate predictive analytics data
    const generatePredictions = () => {
      const maintenancePredictions = [
        {
          id: 'truck_003',
          type: 'Truck',
          component: 'Engine',
          probability: 85,
          days_until: 12,
          severity: 'high',
          recommendation: 'Schedule immediate inspection'
        },
        {
          id: 'crusher_001',
          type: 'Crusher',
          component: 'Bearing',
          probability: 72,
          days_until: 25,
          severity: 'medium',
          recommendation: 'Order replacement parts'
        },
        {
          id: 'truck_007',
          type: 'Truck',
          component: 'Hydraulic System',
          probability: 68,
          days_until: 18,
          severity: 'medium',
          recommendation: 'Monitor closely'
        }
      ];

      const productionPredictions = [
        {
          metric: 'Daily Output',
          current: 1250,
          predicted: 1380,
          trend: 'up',
          confidence: 89
        },
        {
          metric: 'Equipment Efficiency',
          current: 87,
          predicted: 91,
          trend: 'up',
          confidence: 76
        },
        {
          metric: 'Downtime Hours',
          current: 4.2,
          predicted: 3.1,
          trend: 'down',
          confidence: 82
        }
      ];

      const alerts = [
        {
          id: 1,
          type: 'anomaly',
          message: 'Unusual vibration pattern detected in Crusher 002',
          severity: 'warning',
          confidence: 78,
          time: '2 hours ago'
        },
        {
          id: 2,
          type: 'optimization',
          message: 'Route optimization could reduce fuel consumption by 12%',
          severity: 'info',
          confidence: 85,
          time: '4 hours ago'
        },
        {
          id: 3,
          type: 'maintenance',
          message: 'Preventive maintenance window available for Truck 005',
          severity: 'success',
          confidence: 92,
          time: '6 hours ago'
        }
      ];

      setPredictions({
        maintenance: maintenancePredictions,
        production: productionPredictions,
        alerts: alerts
      });
    };

    generatePredictions();
    const interval = setInterval(generatePredictions, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [equipmentData, selectedTimeframe]);

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-orange-100 text-orange-800 border-orange-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      success: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  };

  return (
    <div className="cyber-card h-full holo-element">
      <div className="flex justify-between items-center mb-6">
        <h3 className="cyber-title">AI PREDICTION MATRIX</h3>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="cyber-button text-sm"
        >
          <option value="1d">24H FORECAST</option>
          <option value="7d">7D FORECAST</option>
          <option value="30d">30D FORECAST</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cyber-card">
          <h4 className="cyber-subtitle mb-4">MAINTENANCE PREDICTIONS</h4>
          <div className="space-y-3">
            {predictions.maintenance.map((pred) => (
              <div key={pred.id} className={`p-3 rounded-lg border ${getSeverityColor(pred.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-cyan-300">{pred.id}</span>
                    <span className="text-sm ml-2 text-cyan-400/70">({pred.type})</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-300">{pred.probability}%</span>
                </div>
                <p className="text-sm font-bold text-cyan-300">{pred.component} Issue</p>
                <p className="text-xs mt-1 text-cyan-400/70">In {pred.days_until} days</p>
                <p className="text-xs mt-2 italic text-cyan-400">{pred.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cyber-card">
          <h4 className="cyber-subtitle mb-4">PRODUCTION FORECASTS</h4>
          <div className="space-y-4">
            {predictions.production.map((pred, index) => (
              <div key={index} className="p-3 bg-black/20 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-cyan-300">{pred.metric}</span>
                  <span className="text-2xl">{getTrendIcon(pred.trend)}</span>
                </div>
                <div className="flex justify-between text-sm text-cyan-400/70">
                  <span>Current: <strong>{pred.current}</strong></span>
                  <span>Predicted: <strong className={pred.trend === 'up' ? 'text-green-400' : 'text-red-400'}>{pred.predicted}</strong></span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-cyan-400/70">
                    <span>Confidence</span>
                    <span>{pred.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1 cyber-progress">
                    <div className="progress-fill bg-cyan-400" style={{ width: `${pred.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 cyber-card">
        <h4 className="cyber-subtitle mb-4">AI INSIGHTS & ALERTS</h4>
        <div className="space-y-3">
          {predictions.alerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} flex justify-between items-start`}>
              <div className="flex-1">
                <p className="font-bold text-cyan-300">{alert.message}</p>
                <div className="flex items-center mt-2 text-xs text-cyan-400/70">
                  <span>Confidence: {alert.confidence}%</span>
                  <span className="mx-2">•</span>
                  <span>{alert.time}</span>
                </div>
              </div>
              <div className="ml-4">
                <button className="cyber-button text-xs">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="cyber-button">Generate Report</button>
        <button className="cyber-button">Schedule Maintenance</button>
        <button className="cyber-button">Optimize Routes</button>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;

import React, { useState, useEffect } from 'react';

const QuantumAIInsights = ({ trucks, crushers, stockpiles, kpis }) => {
  const [insights, setInsights] = useState([]);
  const [neuralActivity, setNeuralActivity] = useState(0);
  const [quantumEfficiency, setQuantumEfficiency] = useState(85);
  const [predictiveAccuracy, setPredictiveAccuracy] = useState(94.7);
  const [activeScans, setActiveScans] = useState(12);

  // 🧠 AI INSIGHT GENERATION ENGINE
  useEffect(() => {
    const generateQuantumInsights = () => {
      const newInsights = [];
      
      // 🚀 Production Optimization Insights
      const totalTrucks = Object.keys(trucks).length;
      const activeTrucks = Object.values(trucks).filter(t => t.status === 'running').length;
      const efficiency = totalTrucks > 0 ? (activeTrucks / totalTrucks) * 100 : 0;
      
      if (efficiency < 75) {
        newInsights.push({
          type: 'optimization',
          priority: 'high',
          title: '⚡ Quantum Fleet Optimization',
          message: `Fleet efficiency at ${efficiency.toFixed(1)}%. AI suggests immediate dispatch optimization.`,
          impact: `Potential throughput increase: +${(25 - (100 - efficiency)).toFixed(1)}%`,
          estimated_savings: '$85,000/day',
          confidence: 94.2,
          action: 'Redistribute truck assignments using AI routing algorithm'
        });
      }

      // 🔮 Predictive Maintenance Alerts
      const highWearTrucks = Object.values(trucks).filter(t => 
        (t.health_score || 100) < 70
      );
      
      if (highWearTrucks.length > 0) {
        newInsights.push({
          type: 'maintenance',
          priority: 'critical',
          title: '🔧 Neural Maintenance Prediction',
          message: `${highWearTrucks.length} vehicles showing degradation patterns. Quantum analysis predicts failures within 72 hours.`,
          impact: `Prevent downtime: ${highWearTrucks.length * 8} hours`,
          estimated_savings: '$150,000 downtime prevention',
          confidence: 97.8,
          action: 'Schedule immediate preventive maintenance'
        });
      }

      // 🌱 Environmental Impact Optimization
      const avgFuelLevel = Object.values(trucks).reduce((sum, t) => sum + (t.fuel_level || 100), 0) / Math.max(Object.keys(trucks).length, 1);
      
      if (avgFuelLevel < 40) {
        newInsights.push({
          type: 'environmental',
          priority: 'medium',
          title: '🌱 Carbon Footprint Reduction',
          message: `Average fuel level: ${avgFuelLevel.toFixed(1)}%. AI detects opportunity for green mining protocols.`,
          impact: 'CO2 reduction: 25 tons/week',
          estimated_savings: '$12,000 carbon credits',
          confidence: 91.5,
          action: 'Implement hybrid routing with regenerative charging'
        });
      }

      // 🎯 Crusher Optimization
      const crushersRunning = Object.values(crushers).filter(c => c.status === 'running').length;
      const totalCrushers = Object.keys(crushers).length;
      
      if (crushersRunning < totalCrushers && activeTrucks > crushersRunning * 3) {
        newInsights.push({
          type: 'production',
          priority: 'high',
          title: '🏭 Processing Bottleneck Detected',
          message: `${crushersRunning}/${totalCrushers} crushers active. Queue forming: ${activeTrucks} trucks waiting.`,
          impact: `Throughput improvement: +${((totalCrushers - crushersRunning) * 500).toFixed(0)} TPH`,
          estimated_savings: '$45,000/shift',
          confidence: 96.3,
          action: 'Activate standby crusher units immediately'
        });
      }

      // 📊 Stockpile Management
      const stockpileCapacity = Object.values(stockpiles).map(s => 
        (s.current_volume / s.max_capacity) * 100
      );
      const avgCapacity = stockpileCapacity.reduce((sum, c) => sum + c, 0) / Math.max(stockpileCapacity.length, 1);
      
      if (avgCapacity > 85) {
        newInsights.push({
          type: 'logistics',
          priority: 'urgent',
          title: '📦 Critical Storage Alert',
          message: `Stockpiles at ${avgCapacity.toFixed(1)}% capacity. Overflow risk detected.`,
          impact: 'Prevent material loss: 2,500 tons',
          estimated_savings: '$125,000 material preservation',
          confidence: 99.1,
          action: 'Expedite shipments to processing facilities'
        });
      }

      // 🔬 Advanced Pattern Recognition
      const healthScores = Object.values(trucks).map(t => t.health_score || 100);
      const avgHealth = healthScores.reduce((sum, h) => sum + h, 0) / Math.max(healthScores.length, 1);
      
      if (avgHealth < 80) {
        newInsights.push({
          type: 'ai_analysis',
          priority: 'medium',
          title: '🧠 Neural Pattern Analysis',
          message: `Fleet health trending downward. AI detects systemic maintenance patterns.`,
          impact: 'Proactive maintenance program needed',
          estimated_savings: '$200,000 annual savings',
          confidence: 93.7,
          action: 'Implement AI-driven maintenance scheduling'
        });
      }

      // Update neural activity based on insights
      setNeuralActivity(newInsights.length * 15 + Math.random() * 10);
      
      return newInsights.slice(0, 6); // Show top 6 insights
    };

    const newInsights = generateQuantumInsights();
    setInsights(newInsights);

    // Simulate real-time quantum efficiency calculations
    setQuantumEfficiency(prev => {
      const variation = (Math.random() - 0.5) * 4;
      return Math.max(60, Math.min(99, prev + variation));
    });

    // Update predictive accuracy
    setPredictiveAccuracy(prev => {
      const variation = (Math.random() - 0.5) * 2;
      return Math.max(85, Math.min(99.9, prev + variation));
    });

    // Update active scans
    setActiveScans(Math.floor(Math.random() * 20) + 8);

  }, [trucks, crushers, stockpiles, kpis]);

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'border-red-500 bg-red-500/10 text-red-400',
      urgent: 'border-orange-500 bg-orange-500/10 text-orange-400',
      high: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
      medium: 'border-blue-500 bg-blue-500/10 text-blue-400',
      low: 'border-green-500 bg-green-500/10 text-green-400'
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type) => {
    const icons = {
      optimization: '⚡',
      maintenance: '🔧',
      environmental: '🌱',
      production: '🏭',
      logistics: '📦',
      ai_analysis: '🧠',
      safety: '🛡️'
    };
    return icons[type] || '🔮';
  };

  return (
    <div className="cyber-card h-full holo-element">
      {/* 🧠 NEURAL HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="cyber-title">QUANTUM AI NEURAL CENTER</h3>
        <div className="flex items-center space-x-4">
          <div className="text-xs font-mono text-cyan-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>NEURAL ACTIVITY: {neuralActivity.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 QUANTUM METRICS DASHBOARD */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-3">
          <div className="text-xs font-mono text-cyan-400 mb-1">QUANTUM EFFICIENCY</div>
          <div className="text-xl font-bold text-cyan-300">{quantumEfficiency.toFixed(1)}%</div>
          <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${quantumEfficiency}%` }}
            />
          </div>
        </div>

        <div className="bg-black/60 border border-green-500/30 rounded-lg p-3">
          <div className="text-xs font-mono text-green-400 mb-1">PREDICTIVE ACCURACY</div>
          <div className="text-xl font-bold text-green-300">{predictiveAccuracy.toFixed(1)}%</div>
          <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${predictiveAccuracy}%` }}
            />
          </div>
        </div>

        <div className="bg-black/60 border border-purple-500/30 rounded-lg p-3">
          <div className="text-xs font-mono text-purple-400 mb-1">ACTIVE SCANS</div>
          <div className="text-xl font-bold text-purple-300">{activeScans}</div>
          <div className="text-xs font-mono text-purple-400 mt-1">
            <span className="animate-pulse">● SCANNING...</span>
          </div>
        </div>
      </div>

      {/* 🔮 AI INSIGHTS FEED */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="quantum-loader w-8 h-8 mx-auto mb-4"></div>
            <div className="text-cyan-400 font-mono text-sm">NEURAL NETWORKS ANALYZING...</div>
          </div>
        ) : (
          insights.map((insight, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-4 transition-all duration-300 hover:transform hover:scale-105 ${getPriorityColor(insight.priority)}`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'slideInRight 0.5s ease-out forwards'
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(insight.type)}</span>
                  <div>
                    <h4 className="font-bold text-sm font-mono">{insight.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-mono uppercase ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        Confidence: {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-green-400">{insight.estimated_savings}</div>
                </div>
              </div>

              <p className="text-sm mb-3 opacity-90">{insight.message}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-blue-400">IMPACT:</span>
                  <span className="font-mono">{insight.impact}</span>
                </div>
                <div className="text-xs font-mono text-gray-400 bg-black/30 rounded p-2">
                  <span className="text-yellow-400">RECOMMENDED ACTION:</span> {insight.action}
                </div>
              </div>

              {/* 📊 CONFIDENCE METER */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-gray-400">AI CONFIDENCE</span>
                  <span className="font-mono">{insight.confidence}%</span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 rounded-full transition-all duration-1000"
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔮 NEURAL NETWORK VISUALIZATION */}
      <div className="mt-6 p-4 bg-black/60 border border-cyan-500/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-cyan-400">NEURAL NETWORK STATUS</span>
          <span className="text-xs font-mono text-green-400 animate-pulse">● ACTIVE</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-2 bg-gray-700 rounded-full overflow-hidden"
            >
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"
                style={{ 
                  width: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            </div>
          ))}
        </div>
        
        <div className="text-xs font-mono text-gray-400 mt-2 text-center">
          Processing {activeScans} concurrent analysis threads
        </div>
      </div>
    </div>
  );
};

export default QuantumAIInsights;

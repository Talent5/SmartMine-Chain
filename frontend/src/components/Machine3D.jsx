import React, { useState, useEffect, useRef } from 'react';

const Machine3D = ({ machine, type = 'truck' }) => {
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // 3D rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up 3D projection
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = hovered ? 1.2 : 1.0;

    // Machine dimensions based on type
    const dimensions = {
      truck: { width: 80, height: 40, depth: 60 },
      crusher: { width: 60, height: 80, depth: 50 },
      stockpile: { width: 100, height: 30, depth: 100 }
    };

    const dims = dimensions[type];

    // 3D points for machine
    const points = [
      // Front face
      [-dims.width/2, -dims.height/2, dims.depth/2],
      [dims.width/2, -dims.height/2, dims.depth/2],
      [dims.width/2, dims.height/2, dims.depth/2],
      [-dims.width/2, dims.height/2, dims.depth/2],
      // Back face
      [-dims.width/2, -dims.height/2, -dims.depth/2],
      [dims.width/2, -dims.height/2, -dims.depth/2],
      [dims.width/2, dims.height/2, -dims.depth/2],
      [-dims.width/2, dims.height/2, -dims.depth/2]
    ];

    // Rotate points
    const rotatedPoints = points.map(point => {
      const [x, y, z] = point;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      
      return [
        x * cos - z * sin,
        y,
        x * sin + z * cos
      ];
    });

    // Project 3D to 2D
    const projectedPoints = rotatedPoints.map(point => {
      const [x, y, z] = point;
      const distance = 200;
      const factor = distance / (distance + z);
      
      return [
        centerX + x * factor * scale,
        centerY + y * factor * scale
      ];
    });

    // Draw machine body
    ctx.fillStyle = machine?.status === 'running' 
      ? 'rgba(0, 255, 65, 0.8)' 
      : machine?.status === 'maintenance' 
      ? 'rgba(255, 0, 64, 0.8)' 
      : 'rgba(0, 245, 255, 0.8)';
    
    ctx.strokeStyle = machine?.status === 'running' 
      ? '#00ff41' 
      : machine?.status === 'maintenance' 
      ? '#ff0040' 
      : '#00f5ff';
    
    ctx.lineWidth = 2;

    // Draw faces
    const faces = [
      [0, 1, 2, 3], // Front
      [4, 5, 6, 7], // Back
      [0, 4, 7, 3], // Left
      [1, 5, 6, 2], // Right
      [3, 2, 6, 7], // Top
      [0, 1, 5, 4]  // Bottom
    ];

    faces.forEach(face => {
      ctx.beginPath();
      face.forEach((pointIndex, i) => {
        const [x, y] = projectedPoints[pointIndex];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Add machine details based on type
    if (type === 'truck') {
      // Draw wheels
      const wheelPositions = [
        [-dims.width/3, dims.height/2, dims.depth/3],
        [dims.width/3, dims.height/2, dims.depth/3],
        [-dims.width/3, dims.height/2, -dims.depth/3],
        [dims.width/3, dims.height/2, -dims.depth/3]
      ];

      wheelPositions.forEach(wheel => {
        const [x, y, z] = wheel;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        const rotatedWheel = [
          x * cos - z * sin,
          y,
          x * sin + z * cos
        ];

        const [wx, wy, wz] = rotatedWheel;
        const factor = 200 / (200 + wz);
        const wheelX = centerX + wx * factor * scale;
        const wheelY = centerY + wy * factor * scale;

        ctx.beginPath();
        ctx.arc(wheelX, wheelY, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#666';
        ctx.stroke();
      });

      // Draw cabin
      const cabinWidth = dims.width * 0.4;
      const cabinHeight = dims.height * 0.6;
      const cabinDepth = dims.depth * 0.3;

      const cabinPoints = [
        [-cabinWidth/2, -cabinHeight/2, dims.depth/2 + cabinDepth/2],
        [cabinWidth/2, -cabinHeight/2, dims.depth/2 + cabinDepth/2],
        [cabinWidth/2, cabinHeight/2, dims.depth/2 + cabinDepth/2],
        [-cabinWidth/2, cabinHeight/2, dims.depth/2 + cabinDepth/2]
      ];

      const rotatedCabin = cabinPoints.map(point => {
        const [x, y, z] = point;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        return [
          x * cos - z * sin,
          y,
          x * sin + z * cos
        ];
      });

      const projectedCabin = rotatedCabin.map(point => {
        const [x, y, z] = point;
        const factor = 200 / (200 + z);
        return [
          centerX + x * factor * scale,
          centerY + y * factor * scale
        ];
      });

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      projectedCabin.forEach((point, i) => {
        const [x, y] = point;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

    } else if (type === 'crusher') {
      // Draw crusher details
      const crusherHeight = dims.height * 0.8;
      const crusherWidth = dims.width * 0.6;

      // Main crusher body
      ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
      ctx.fillRect(
        centerX - crusherWidth/2 * scale,
        centerY - crusherHeight/2 * scale,
        crusherWidth * scale,
        crusherHeight * scale
      );

      // Crusher teeth
      const teethCount = 8;
      for (let i = 0; i < teethCount; i++) {
        const x = centerX - crusherWidth/2 * scale + (crusherWidth * scale / teethCount) * i;
        const y = centerY + crusherHeight/2 * scale;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 5, y + 10);
        ctx.lineTo(x + 10, y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(64, 64, 64, 0.9)';
        ctx.fill();
      }

    } else if (type === 'stockpile') {
      // Draw stockpile as a cone
      const radius = dims.width/2;
      const height = dims.height;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY - height/2 * scale);
      
      for (let i = 0; i <= 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        const x = centerX + Math.cos(angle) * radius * scale;
        const y = centerY + height/2 * scale;
        ctx.lineTo(x, y);
      }
      
      ctx.closePath();
      ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#8B4513';
      ctx.stroke();

      // Add material texture
      for (let i = 0; i < 20; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * scale;
        const y = centerY + (Math.random() - 0.5) * height * scale;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(160, 82, 45, 0.6)';
        ctx.fill();
      }
    }

    // Add status indicator
    const statusColor = machine?.status === 'running' 
      ? '#00ff41' 
      : machine?.status === 'maintenance' 
      ? '#ff0040' 
      : '#ffff00';

    ctx.beginPath();
    ctx.arc(centerX, centerY - dims.height/2 * scale - 15, 5, 0, Math.PI * 2);
    ctx.fillStyle = statusColor;
    ctx.fill();
    ctx.shadowColor = statusColor;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Add glow effect when running
    if (machine?.status === 'running') {
      ctx.beginPath();
      ctx.arc(centerX, centerY, dims.width * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

  }, [rotation, hovered, machine, type]);

  // Auto-rotation
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setRotation(prev => prev + 0.02);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  const getMachineIcon = () => {
    switch (type) {
      case 'truck': return '🚛';
      case 'crusher': return '⚙️';
      case 'stockpile': return '📦';
      default: return '🔧';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'idle': return 'text-yellow-400';
      case 'maintenance': return 'text-red-400';
      case 'loading': return 'text-orange-400';
      case 'hauling': return 'text-blue-400';
      case 'dumping': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => {
        setHovered(true);
        setIsAnimating(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setIsAnimating(false);
      }}
    >
      {/* 3D Canvas */}
      <div className="relative bg-black/20 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 transition-all duration-500 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="w-full h-48 rounded-lg"
        />
        
        {/* Overlay information */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-2">{getMachineIcon()}</div>
            <div className="text-cyan-300 font-mono text-sm font-bold">
              {machine?.name || machine?.id || 'MACHINE'}
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${
            machine?.status === 'running' ? 'bg-green-400 shadow-glow-green animate-pulse' :
            machine?.status === 'maintenance' ? 'bg-red-400 shadow-glow-red animate-pulse' :
            'bg-yellow-400 shadow-glow-yellow'
          }`}></div>
        </div>
      </div>

      {/* Machine details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-cyan-300 font-mono text-sm font-semibold">
            {machine?.name || machine?.id}
          </h4>
          <span className={`text-xs font-mono px-2 py-1 rounded-full ${
            machine?.status === 'running' ? 'bg-green-500/20 text-green-400' :
            machine?.status === 'maintenance' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {machine?.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {machine?.health && (
            <div>
              <div className="text-cyan-400/60 font-mono">HEALTH</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      machine.health > 70 ? 'bg-green-400' : 
                      machine.health > 40 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${machine.health}%` }}
                  ></div>
                </div>
                <span className="text-cyan-300 font-mono">{machine.health}%</span>
              </div>
            </div>
          )}

          {machine?.efficiency && (
            <div>
              <div className="text-cyan-400/60 font-mono">EFFICIENCY</div>
              <div className="text-cyan-300 font-mono">{machine.efficiency}%</div>
            </div>
          )}

          {machine?.fuel_level && (
            <div>
              <div className="text-cyan-400/60 font-mono">FUEL</div>
              <div className="text-cyan-300 font-mono">{machine.fuel_level}%</div>
            </div>
          )}

          {machine?.capacity && (
            <div>
              <div className="text-cyan-400/60 font-mono">CAPACITY</div>
              <div className="text-cyan-300 font-mono">{machine.capacity}%</div>
            </div>
          )}
        </div>

        {/* Type indicator */}
        <div className="text-center">
          <div className="text-cyan-400/40 font-mono text-xs uppercase tracking-wider">
            {type}
          </div>
        </div>
      </div>

      {/* Hover effect */}
      {hovered && (
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}
    </div>
  );
};

export default Machine3D;

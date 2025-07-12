import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', variant = 'cyber' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xl: 'text-lg'
  };

  if (variant === 'cyber') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`relative ${sizeClasses[size]}`}>
          {/* Outer ring */}
          <div className={`absolute inset-0 border-2 border-cyan-500/30 rounded-full ${sizeClasses[size]}`}></div>
          
          {/* Animated ring */}
          <div className={`absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full ${sizeClasses[size]} animate-spin`}></div>
          
          {/* Inner glow */}
          <div className={`absolute inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full ${sizeClasses[size]} animate-pulse`}></div>
          
          {/* Center dot */}
          <div className={`absolute inset-1/4 bg-cyan-400 rounded-full ${size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : size === 'large' ? 'w-3 h-3' : 'w-4 h-4'} animate-pulse`}></div>
        </div>
        
        {text && (
          <div className={`text-cyan-400 font-mono ${textSizes[size]} tracking-wider animate-pulse`}>
            {text}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'matrix') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`relative ${sizeClasses[size]}`}>
          {/* Matrix rain effect */}
          <div className={`absolute inset-0 ${sizeClasses[size]} overflow-hidden rounded-full`}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-full bg-green-400 animate-matrix"
                style={{
                  left: `${(i / 8) * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              ></div>
            ))}
          </div>
          
          {/* Center circle */}
          <div className={`absolute inset-2 bg-black rounded-full ${sizeClasses[size]} flex items-center justify-center`}>
            <div className="text-green-400 font-mono text-xs animate-pulse">01</div>
          </div>
        </div>
        
        {text && (
          <div className={`text-green-400 font-mono ${textSizes[size]} tracking-wider animate-pulse`}>
            {text}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'hologram') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`relative ${sizeClasses[size]}`}>
          {/* Hologram rings */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute border border-cyan-400/50 rounded-full ${sizeClasses[size]} animate-ping`}
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
          
          {/* Core */}
          <div className={`absolute inset-1/3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full ${size === 'small' ? 'w-2 h-2' : size === 'medium' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-8 h-8'} animate-hologram`}></div>
        </div>
        
        {text && (
          <div className={`text-cyan-400 font-mono ${textSizes[size]} tracking-wider animate-hologram`}>
            {text}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`bg-cyan-400 rounded-full animate-bounce ${size === 'small' ? 'w-2 h-2' : size === 'medium' ? 'w-3 h-3' : size === 'large' ? 'w-4 h-4' : 'w-5 h-5'}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
        
        {text && (
          <div className={`text-cyan-400 font-mono ${textSizes[size]} tracking-wider`}>
            {text}
          </div>
        )}
      </div>
    );
  }

  // Default cyber variant
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 border-2 border-cyan-500/30 rounded-full ${sizeClasses[size]}`}></div>
        <div className={`absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full ${sizeClasses[size]} animate-spin`}></div>
        <div className={`absolute inset-1/4 bg-cyan-400 rounded-full ${size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : size === 'large' ? 'w-3 h-3' : 'w-4 h-4'} animate-pulse`}></div>
      </div>
      
      {text && (
        <div className={`text-cyan-400 font-mono ${textSizes[size]} tracking-wider animate-pulse`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;

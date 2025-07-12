import React from 'react';

const LandingPage = ({ onEnter }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-800 to-indigo-600 text-white px-4">
    <h1 className="text-5xl font-bold mb-4 neon-text">⛏️ SmartMine Neural Core</h1>
    <p className="text-lg mb-8 text-center max-w-xl">
      Experience the next generation of digital twin monitoring and AI-driven insights for mining operations.
    </p>
    <button
      onClick={onEnter}
      className="btn-primary text-lg px-8 py-4"
    >
      Enter Dashboard
    </button>
  </div>
);

export default LandingPage;

import React from 'react';

const MapPlaceholder: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 relative overflow-hidden">
      {/* Grid lines for futuristic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
      
      {/* Map border with neon glow */}
      <div className="absolute inset-4 border border-neon-cyan rounded-2xl shadow-neon-glow overflow-hidden">
        {/* Mock coordinate display */}
        <div className="absolute top-4 right-4 bg-slate-900/70 backdrop-blur-xs p-2 rounded text-xs font-mono text-gray-400 border border-slate-800">
          LAT: 50.9503° N • LON: 1.8587° E
        </div>
        
        {/* Mock scale indicator */}
        <div className="absolute bottom-4 left-4 bg-slate-900/70 backdrop-blur-xs px-2 py-1 rounded text-xs font-mono text-gray-400 border border-slate-800">
          SCALE: 1:50,000
        </div>
        
        {/* Map content placeholder */}
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-neon-cyan text-2xl font-orbitron animate-pulse">
            MAP LOADING
          </div>
        </div>
        
        {/* Sample cache marker */}
        <div className="absolute top-1/2 left-1/3 w-6 h-6 rounded-full bg-neon-magenta/30 border-2 border-neon-magenta animate-ping"></div>
        <div className="absolute top-2/3 right-1/4 w-6 h-6 rounded-full bg-electric-lime/30 border-2 border-electric-lime"></div>
      </div>
    </div>
  );
};

export default MapPlaceholder;

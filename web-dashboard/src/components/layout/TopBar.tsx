import React from 'react';

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Beach Cache Detection' }) => {
  return (
    <header className="fixed top-0 left-16 right-0 h-16 bg-slate-900/70 backdrop-blur-xs border-b border-slate-800 z-10">
      <div className="flex items-center justify-between h-full px-6">
        {/* App title */}
        <div className="flex items-center">
          <h1 className="text-xl font-orbitron text-neon-cyan">
            {title}
            <span className="ml-2 text-xs text-gray-400 uppercase tracking-wider">
              Year 2100
            </span>
          </h1>
        </div>
        
        {/* Center area - could be breadcrumbs, context info */}
        <div className="flex-1 mx-4 text-center text-gray-400 text-sm">
          <span className="tracking-wider">
            STATUS: ACTIVE
          </span>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Notification indicator */}
          <div className="relative">
            <div className="text-gray-400 hover:text-neon-cyan cursor-pointer">
              [N]
            </div>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-magenta"></div>
          </div>
          
          {/* Time */}
          <div className="text-sm text-gray-400 font-mono">
            {new Date().toISOString().slice(0, 10)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

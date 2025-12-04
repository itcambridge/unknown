import React from 'react';

// Simple placeholder for icons
// In a real app, we'd use an icon library like react-icons or heroicons
const Icon: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-md">
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

const NavRail: React.FC = () => {
  return (
    <nav className="nav-rail z-10">
      <div className="flex flex-col items-center pt-6">
        {/* Logo or brand icon */}
        <div className="mb-10 text-neon-cyan font-orbitron text-2xl font-bold">
          B
        </div>
        
        {/* Navigation items */}
        <div className="nav-icon">
          <Icon name="Map" />
        </div>
        <div className="nav-icon">
          <Icon name="Incidents" />
        </div>
        <div className="nav-icon">
          <Icon name="Analytics" />
        </div>
        <div className="nav-icon">
          <Icon name="Settings" />
        </div>
        
        {/* Spacer */}
        <div className="flex-1"></div>
        
        {/* User profile */}
        <div className="mb-6 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-neon-magenta">
          U
        </div>
      </div>
    </nav>
  );
};

export default NavRail;

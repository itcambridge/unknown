import React from 'react';
import NavRail from './NavRail';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <NavRail />
      <TopBar />
      
      {/* Main content area */}
      <main className="pt-16 ml-16 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import MapPlaceholder from './components/map/MapPlaceholder';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function Dashboard() {
  const { signOut } = useAuth();

  return (
    <Layout>
      <div className="flex justify-between items-center text-xs font-mono text-gray-400 p-4 border-b border-slate-800 bg-slate-900/50">
        <div>DASHBOARD / OPERATIONS / LIVE MAP</div>
        <button 
          onClick={signOut} 
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-neon-cyan transition-colors"
        >
          LOGOUT
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex">
        {/* Map area */}
        <div className="flex-1">
          <MapPlaceholder />
        </div>
        
        {/* Info panel - can be toggled/expanded as needed */}
        <div className="w-80 p-4">
          <div className="glass-panel h-full">
            <h2 className="text-neon-cyan font-orbitron text-lg mb-4">Cache Reports</h2>
            <div className="text-gray-400 text-sm">
              <p className="mb-4">No active reports in this region.</p>
              
              <div className="border border-slate-800 rounded-md p-3 mb-3">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-neon-magenta">CACHE #A-2431</div>
                  <div className="text-xs">2d ago</div>
                </div>
                <div className="mt-2 text-xs">
                  Type: Boat hull<br/>
                  Status: Validated<br/>
                  Coordinates: 50.9213°N, 1.8702°E
                </div>
              </div>
              
              <button className="neon-button w-full mt-4 text-sm">VIEW ALL REPORTS</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function App() {
  const { user, loading } = useAuth();

  // Handle login success
  const handleLoginSuccess = () => {
    // No need to do anything special here, the AuthContext will update
    // and the protected route will automatically render the dashboard
    console.log('Login successful');
  };

  return (
    <Routes>
      {/* Public route for login */}
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
        } 
      />
      
      {/* Protected dashboard route */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all other routes and redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

import Layout from './components/layout/Layout'
import MapPlaceholder from './components/map/MapPlaceholder'
import './App.css'

function App() {
  return (
    <Layout>
      <div className="text-xs font-mono text-gray-400 p-4 border-b border-slate-800 bg-slate-900/50">
        DASHBOARD / OPERATIONS / LIVE MAP
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
  )
}

export default App

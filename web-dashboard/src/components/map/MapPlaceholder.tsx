import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// Define center coordinates
const center = {
  lat: 50.9503, // English Channel coordinates
  lng: 1.8587,
};

// Custom map styles for futuristic look
const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [
      { "color": "#0f172a" } // Dark blue background (matches slate-900)
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "color": "#020617" }, // Very dark blue (matches slate-950)
      { "weight": 1 }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#9ca3af" } // Gray text (matches gray-400)
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#1e293b" } // Border color (matches slate-800)
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#020617" } // Very dark blue for water
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      { "color": "#1e293b" }, // Dark blue for roads
      { "weight": 0.5 }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" } // Hide points of interest
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      { "visibility": "off" } // Hide transit
    ]
  }
];

// Sample cache data
const sampleCaches = [
  { id: 1, position: { lat: 50.9603, lng: 1.8487 }, type: 'high' }, 
  { id: 2, position: { lat: 50.9403, lng: 1.8687 }, type: 'medium' }
];

const MapPlaceholder: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load the Google Maps script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-950 relative overflow-hidden">
      {/* Grid lines for futuristic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
      
      {/* Map border with neon glow */}
      <div className="absolute inset-4 border border-neon-cyan rounded-2xl shadow-neon-glow overflow-hidden">
        {/* Live coordinate display */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/70 backdrop-blur-xs p-2 rounded text-xs font-mono text-gray-400 border border-slate-800">
          LAT: 50.9503° N • LON: 1.8587° E
        </div>
        
        {/* Scale indicator */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/70 backdrop-blur-xs px-2 py-1 rounded text-xs font-mono text-gray-400 border border-slate-800">
          SCALE: 1:50,000
        </div>
        
        {/* Google Map */}
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={10}
            options={{
              styles: mapStyles,
              disableDefaultUI: true,  // Hide default UI
              backgroundColor: '#020617', // Matches slate-950
              zoomControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false
            }}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Sample cache markers */}
            {sampleCaches.map(cache => (
              <Marker
                key={cache.id}
                position={cache.position}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: cache.type === 'high' ? '#e879f9' : '#a3e635', // neon-magenta or electric-lime
                  fillOpacity: 0.6,
                  strokeColor: cache.type === 'high' ? '#e879f9' : '#a3e635',
                  strokeWeight: 2,
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-neon-cyan text-2xl font-orbitron animate-pulse">
              MAP LOADING
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPlaceholder;

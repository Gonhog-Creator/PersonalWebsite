'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type CountryCode = 'US' | 'AR' | 'CH' | 'DE' | 'FR' | 'GB' | 'CR' | 'SI' | 'AT' | 'AU' | 'BE' | 'GR';

// Country coordinates for markers
const countryCoordinates: Record<CountryCode, [number, number]> = {
  'US': [37.0902, -95.7129], // United States
  'AR': [-38.4161, -63.6167], // Argentina
  'CH': [46.8182, 8.2275], // Switzerland
  'DE': [51.1657, 10.4515], // Germany
  'FR': [46.2276, 2.2137], // France
  'GB': [55.3781, -3.4360], // United Kingdom
  'CR': [9.7489, -83.7534], // Costa Rica
  'SI': [46.1512, 14.9955], // Slovenia
  'AT': [47.5162, 14.5501], // Austria
  'AU': [-25.2744, 133.7751], // Australia
  'BE': [50.5039, 4.4699], // Belgium
  'GR': [39.0742, 21.8243], // Greece
};

const countryNames: Record<CountryCode, string> = {
  'US': 'United States',
  'AR': 'Argentina',
  'CH': 'Switzerland',
  'DE': 'Germany',
  'FR': 'France',
  'GB': 'United Kingdom',
  'CR': 'Costa Rica',
  'SI': 'Slovenia',
  'AT': 'Austria',
  'AU': 'Australia',
  'BE': 'Belgium',
  'GR': 'Greece',
};

export default function WorldMap() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<string>('');

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set view to show all markers when map is ready
  useEffect(() => {
    if (map && Object.keys(countryCoordinates).length > 0) {
      const markers = Object.values(countryCoordinates);
      if (markers.length === 0) return;
      
      // Create a bounds object to fit all markers
      const bounds = L.latLngBounds(markers);
      map.fitBounds(bounds.pad(0.5)); // Add some padding around the markers
    }
  }, [map]);

  const handleMarkerClick = (code: CountryCode) => {
    router.push(`/galleries/${code.toLowerCase()}`);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">World Map</h1>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-8 h-[600px] w-full">
          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            whenCreated={setMap}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {Object.entries(countryCoordinates).map(([code, coords]) => (
              <Marker 
                key={code} 
                position={coords} 
                icon={defaultIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(code as CountryCode)
                }}
              >
                <Popup>
                  <div className="text-gray-800">
                    <h3 className="font-bold">{countryNames[code as CountryCode]}</h3>
                    <button 
                      className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      onClick={() => handleMarkerClick(code as CountryCode)}
                    >
                      View Gallery
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Modal for countries without galleries */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="mb-6">
              {currentCountry ? 
                `The gallery for ${currentCountry} is not available yet.` : 
                'This gallery is not available yet.'
              }
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

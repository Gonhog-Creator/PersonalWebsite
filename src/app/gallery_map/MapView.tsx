'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dynamically import components with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

// Countries with galleries
const countriesWithGalleries = [
  'US', 'AR', 'CH', 'DE', 'FR', 'GB', 'CR', 'SI', 'AT', 'AU', 'BE', 'GR'
];

// Type for country data
interface CountryData {
  type: string;
  features: Array<{
    type: string;
    properties: {
      name: string;
      iso_a2: string;
      [key: string]: any;
    };
    geometry: GeoJSON.Geometry;
  }>;
}

// Helper component to handle dynamic map loading
const MapWithNoSSR = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { MapContainer, TileLayer, GeoJSON } = mod;
    
    return function MapComponent({ 
      center, 
      zoom, 
      minZoom, 
      maxZoom, 
      onMapCreated,
      countriesData,
      countryStyle,
      onEachFeature,
      onZoomToEU,
      zoomedIn,
      router
    }: {
      center: [number, number];
      zoom: number;
      minZoom: number;
      maxZoom: number;
      onMapCreated: (map: any) => void;
      countriesData: CountryData | null;
      countryStyle: any;
      onEachFeature: (feature: any, layer: any) => void;
      onZoomToEU: () => void;
      zoomedIn: boolean;
      router: ReturnType<typeof useRouter>;
    }) {
      return (
        <MapContainer 
          center={center}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomControl={false}
          style={{
            width: '100%',
            height: '100vh',
            position: 'relative',
            backgroundColor: '#1a1a1a'
          }}
          zoomSnap={0.1}
          zoomDelta={0.5}
          wheelPxPerZoomLevel={60}
          whenCreated={onMapCreated}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            opacity={0.3}
          />
          
          {countriesData && (
            <GeoJSON
              data={countriesData}
              style={countryStyle}
              onEachFeature={onEachFeature}
              interactive={true}
            />
          )}
          
          {/* Map Controls */}
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: '#1e40af',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              Back to Home
            </button>
          </div>
        </MapContainer>
      );
    };
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl">Loading map...</div>
        </div>
      </div>
    )
  }
);

function NoGalleryModal({ 
  isOpen, 
  country, 
  onClose 
}: { 
  isOpen: boolean; 
  country: string; 
  onClose: () => void 
}) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#1f2937',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '90%',
          width: '400px',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#f3f4f6'
        }}>
          No Gallery Available
        </h3>
        <p style={{ 
          marginBottom: '24px',
          color: '#e5e7eb'
        }}>
          Sorry, there are no photo galleries available for 
          <span style={{ 
            fontWeight: '600',
            color: '#ffffff'
          }}> {country}</span> yet.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#1f2937',
              color: '#60a5fa',
              fontWeight: '500',
              padding: '8px 20px',
              borderRadius: '4px',
              border: '1px solid #374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// Move the country style function outside the component to avoid recreation
const getCountryStyle = (feature: any, countriesWithGalleries: string[]) => {
  const countryCode = feature.properties.iso_a2;
  const hasGallery = countriesWithGalleries.includes(countryCode);
  
  return {
    weight: hasGallery ? 1.2 : 0.3, // Thicker border for gallery countries, very thin for others
    color: hasGallery ? '#1e40af' : 'rgba(30, 64, 175, 0.5)', // Darker blue for gallery countries, semi-transparent for others
    fillColor: hasGallery ? '#3b82f6' : 'rgba(30, 64, 175, 0.1)', // Solid blue for gallery countries, very subtle for others
    fillOpacity: hasGallery ? 0.7 : 0.2, // More opaque for gallery countries
    opacity: 1,
    dashArray: '',
    fillRule: 'evenodd',
  };
};

export default function MapView() {
  // All hooks must be called unconditionally at the top level
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [countriesData, setCountriesData] = useState<CountryData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentCountry, setCurrentCountry] = useState('');
  const [tooltip, setTooltip] = useState({ show: false, name: '', x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
    return () => setIsClient(false);
  }, []);

  // Load countries data
  useEffect(() => {
    if (!isClient) return;

    const loadCountriesData = async () => {
      try {
        const response = await fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson');
        const data = await response.json();
        setCountriesData(data);
      } catch (error) {
        console.error('Error loading countries data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCountriesData();
  }, [isClient]);

  // Memoize the country style function with dependency on countriesWithGalleries
  const countryStyle = useCallback((feature: any) => 
    getCountryStyle(feature, countriesWithGalleries),
    [countriesWithGalleries]
  );

  // Handle feature events
  // Handle mouse move for tooltip positioning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const onEachFeature = useCallback((feature: any, layer: any) => {
    const countryCode = feature.properties.iso_a2;
    const countryName = feature.properties.name;
    const hasGallery = countriesWithGalleries.includes(countryCode);
    
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1.5,
          color: '#1e40af',
          fillColor: '#3b82f6',
          fillOpacity: 0.9,
          dashArray: ''
        });
        setHoveredCountry(countryName);
        setTooltip(prev => ({ ...prev, show: true, name: countryName }));
      },
      
      mousemove: (e: any) => {
        // Update tooltip position to follow cursor
        setCursorPos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
      },
      
      mouseout: (e: any) => {
        const layer = e.target;
        const countryCode = feature.properties.iso_a2;
        const hasGallery = countriesWithGalleries.includes(countryCode);
        
        if (layer && typeof layer.setStyle === 'function') {
          layer.setStyle({
            weight: hasGallery ? 1.2 : 0.3,
            color: hasGallery ? '#1e40af' : 'rgba(30, 64, 175, 0.5)',
            fillColor: hasGallery ? '#3b82f6' : 'rgba(30, 64, 175, 0.1)',
            fillOpacity: hasGallery ? 0.7 : 0.2,
            dashArray: ''
          });
        }
        
        setHoveredCountry('');
        setTooltip(prev => ({ ...prev, show: false }));
      },
      
      click: (e: any) => {
        const layer = e.target;
        const countryCode = feature.properties.iso_a2;
        const hasGallery = countriesWithGalleries.includes(countryCode);
        
        if (hasGallery) {
          router.push(`/gallery_map/${countryCode.toLowerCase()}`);
        } else {
          setCurrentCountry(countryName);
          setShowModal(true);
        }
      }
    });
  }, [countriesWithGalleries, router]);

  // Handle map instance when it's created
  const handleMapCreated = useCallback((mapInstance: L.Map) => {
    // Store the map instance in state
    setMap(mapInstance);
    
    // Set initial view and settings
    mapInstance.setView([20, 0], 3);
    mapInstance.scrollWheelZoom.disable();
    mapInstance.setMinZoom(3);
    
    // Add zoom control
    const zoomControl = L.control.zoom({ 
      position: 'topright',
      zoomInTitle: 'Zoom in',
      zoomOutTitle: 'Zoom out (min zoom)'
    });
    zoomControl.addTo(mapInstance);
    
    // Handle window resize
    const handleResize = () => {
      mapInstance.invalidateSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      mapInstance.remove();
    };
  }, []);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [map]);

  // Show loading state while data is being loaded
  if (isLoading || !isClient || !countriesData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen bg-gray-900 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Custom cursor-following tooltip */}
      {hoveredCountry && (
        <div 
          className="fixed z-[1000] pointer-events-none bg-black/80 text-white text-sm px-2 py-1 rounded whitespace-nowrap"
          style={{
            left: `${cursorPos.x + 10}px`,
            top: `${cursorPos.y + 10}px`,
            transform: 'translateY(-50%)',
            transition: 'opacity 0.2s',
            opacity: hoveredCountry ? 1 : 0
          }}
        >
          {hoveredCountry}
        </div>
      )}
      

      
      <div ref={mapContainerRef} className="w-full h-full">
        <style jsx global>{`
          html, body, #__next {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          
          .leaflet-container {
            width: 100% !important;
            height: 100% !important;
            background: #3b82f6;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          
          .leaflet-pane {
            z-index: 0 !important;
          }
          
          .leaflet-control-container {
            z-index: 1;
          }
          
          .leaflet-top, .leaflet-bottom {
            z-index: 2;
          }
          
          /* Remove default Leaflet tooltip styles since we're using a custom one */
          .leaflet-tooltip {
            display: none !important;
          }
        `}</style>
        
        {/* Main Map */}
        {isClient && countriesData && (
          <MapWithNoSSR
            center={[20, 0]}
            zoom={3}
            minZoom={3}
            maxZoom={18}
            onMapCreated={setMap}
            countriesData={countriesData}
            countryStyle={countryStyle}
            onEachFeature={onEachFeature}
            router={router}
          />
        )}
        
        {/* Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
            onClick={() => setShowModal(false)}
          >
            <div 
              style={{
                backgroundColor: '#1f2937',
                padding: '24px',
                borderRadius: '8px',
                maxWidth: '90%',
                width: '400px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#f3f4f6'
              }}>
                No Gallery Available
              </h3>
              <p style={{ 
                marginBottom: '24px',
                color: '#e5e7eb'
              }}>
                Sorry, there are no photo galleries available for 
                <span style={{ 
                  fontWeight: '600',
                  color: '#ffffff'
                }}> {currentCountry}</span> yet.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: '#1f2937',
                    color: '#60a5fa',
                    fontWeight: '500',
                    padding: '8px 20px',
                    borderRadius: '4px',
                    border: '1px solid #374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

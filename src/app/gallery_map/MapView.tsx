'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L, { Map as LeafletMap, Layer, FeatureGroup } from 'leaflet';
import type { GeoJSON as GeoJSONType, GeoJSONOptions } from 'leaflet';

// Type for country feature properties
interface CountryProperties {
  name: string;
  iso_a2: string;
  [key: string]: unknown;
}

type Geometry = GeoJSONType.Geometry;

// Type for country feature
interface CountryFeature extends GeoJSONType.Feature<Geometry, CountryProperties> {
  type: 'Feature';
  id?: string | number;
  properties: CountryProperties;
  geometry: Geometry;
}

// Type for country data
interface CountryData extends GeoJSONType.FeatureCollection<Geometry, CountryProperties> {
  type: 'FeatureCollection';
  features: CountryFeature[];
}

// Type for map style function
type CountryStyleFunction = (feature: CountryFeature) => GeoJSONType.PathOptions;

// Countries with galleries
const countriesWithGalleries = [
  'US', 'AR', 'CH', 'DE', 'FR', 'GB', 'CR', 'SI', 'AT', 'AU', 'BE', 'GR'
] as const;

type CountryCode = typeof countriesWithGalleries[number];

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
      onEachFeature
    }: {
      center: [number, number];
      zoom: number;
      minZoom: number;
      maxZoom: number;
      onMapCreated: (map: LeafletMap) => void;
      countriesData: CountryData | null;
      countryStyle: CountryStyleFunction;
      onEachFeature: (feature: CountryFeature, layer: Layer) => void;
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

const NoGalleryModal = ({
  isOpen,
  country,
  onClose
}: {
  isOpen: boolean;
  country: string;
  onClose: () => void;
}) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 p-6 rounded-lg max-w-[90%] w-[400px] text-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-gray-100">
          No Gallery Available
        </h3>
        <p className="mb-6 text-gray-200">
          Sorry, there are no photo galleries available for 
          <span className="font-semibold text-white"> {country}</span> yet.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded border border-gray-600 text-blue-400 font-medium transition-colors hover:bg-gray-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

// Style function for country features
function getCountryStyle(feature: CountryFeature, countries: readonly string[]): L.PathOptions {
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
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [countriesData, setCountriesData] = useState<CountryData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag and load data
  useEffect(() => {
    setIsClient(true);
    
    const loadData = async () => {
      try {
        const response = await fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson');
        const data = await response.json() as CountryData;
        setCountriesData(data);
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [isClient, map]);

  // Memoize the country style function
  const countryStyle = useCallback((feature: CountryFeature) => 
    getCountryStyle(feature, countriesWithGalleries),
    []
  );

  // Handle mouse move for tooltip positioning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const onEachFeature = useCallback((feature: CountryFeature, layer: Layer) => {
    const countryCode = feature.properties.iso_a2 as CountryCode;
    const hasGallery = countriesWithGalleries.includes(countryCode);

    const handleMouseOver = (e: L.LeafletEvent) => {
      const target = e.target as L.Path;
      const layerStyle: L.PathOptions = {
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      };

      target.setStyle(layerStyle);
      if (!L.Browser.ie && !L.Browser.edge) {
        target.bringToFront();
      }
      
      setHoveredCountry(feature.properties.name);
    };

    const handleMouseOut = (e: L.LeafletEvent) => {
      const target = e.target as L.Path;
      target.setStyle(getCountryStyle(feature, countriesWithGalleries));
      setHoveredCountry('');
    };

    const handleClick = () => {
      if (hasGallery) {
        router.push(`/galleries/${countryCode.toLowerCase()}`);
      } else {
        setSelectedCountry(feature.properties.name);
        setIsModalOpen(true);
      }
    };

    if (layer instanceof L.Path) {
      layer.on({
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        click: handleClick
      });
    }
  }, [router]);

  // Handle map instance when it's created
  const setMapInstance = useCallback((mapInstance: LeafletMap) => {
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
    
    // Handle window resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

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
            onMapCreated={setMapInstance}
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

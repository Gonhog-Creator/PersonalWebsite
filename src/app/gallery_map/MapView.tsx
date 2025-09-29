'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L, { Map as LeafletMap, Layer } from 'leaflet';

// Create a custom type that extends Leaflet's Map type
type CustomMap = L.Map & {
  zoomControl?: L.Control.Zoom;
}

// Type for country feature properties
interface CountryProperties {
  name: string;
  iso_a2: string;
  [key: string]: unknown;
}

// Type for country feature
type CountryFeature = GeoJSON.Feature<GeoJSON.Geometry, CountryProperties> & {
  id?: string | number;
};

// Type for country data
type CountryData = GeoJSON.FeatureCollection<GeoJSON.Geometry, CountryProperties>;

// Type for map style function
type CountryStyleFunction = (feature?: CountryFeature) => L.PathOptions;

// Mapping of country codes to their gallery page paths
const countryToGalleryMap: Record<string, string> = {
  'US': 'united-states',
  'AR': 'argentina',
  'CH': 'switzerland',
  'DE': 'germany',
  'FR': 'france',
  'GB': 'uk',
  'CR': 'costa-rica',
  'SI': 'slovenia',
  'AT': 'austria',
  'AU': 'australia',
  'BE': 'belgium',
  'GR': 'greece',
  'ES': 'spain',
  'IT': 'italy',
  'PT': 'portugal',
  'GB-SCT': 'scotland'  // Special case for Scotland
} as const;

// Countries with galleries (using the keys from the mapping above)
const countriesWithGalleries = Object.keys(countryToGalleryMap) as Array<keyof typeof countryToGalleryMap>;

type CountryCode = typeof countriesWithGalleries[number];

// Helper component to handle dynamic map loading
const MapWithNoSSR = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { MapContainer, TileLayer, GeoJSON, useMap } = mod;
    
    // Create a controller component to handle map instance
  interface MapControllerProps {
    onMapCreated: (map: LeafletMap) => void;
    mapRef: React.RefObject<LeafletMap | null>;
  }
  
  const MapController = ({ onMapCreated, mapRef }: MapControllerProps) => {
    const map = useMap();
    
    useEffect(() => {
      if (!map) return;
      
      // Remove any existing zoom controls first
      map.zoomControl?.remove();
      
      // Add our custom zoom control
      const zoomControl = L.control.zoom({
        position: 'bottomright'
      });
      zoomControl.addTo(map);
      
      // Store the zoom control reference for cleanup
      const customMap = map as CustomMap;
      customMap.zoomControl = zoomControl;
      
      // Update the ref and call the onMapCreated callback
      if (mapRef) {
        mapRef.current = customMap;
      }
      onMapCreated(customMap);
      
      // Cleanup function
      return () => {
        if (customMap.zoomControl) {
          customMap.removeControl(customMap.zoomControl);
        }
      };
    }, [map, onMapCreated, mapRef]);
    
    return null;
  };

  return function MapComponent({ 
      center, 
      zoom, 
      minZoom, 
      maxZoom, 
      onMapCreated,
      countriesData,
      countryStyle,
      onEachFeature,
      mapRef
    }: {
      center: [number, number];
      zoom: number;
      minZoom: number;
      maxZoom: number;
      onMapCreated: (map: LeafletMap) => void;
      countriesData: CountryData | null;
      countryStyle: CountryStyleFunction;
      onEachFeature: (feature: CountryFeature, layer: Layer) => void;
      mapRef: React.RefObject<LeafletMap | null>;
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
          whenReady={() => {}}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            opacity={0.3}
          />
          
          <MapController onMapCreated={onMapCreated} mapRef={mapRef} />
          
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
              onClick={() => window.location.href = '/'}
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

// NoGalleryModal component has been removed as it's not being used

// Style function for country features
const getCountryStyle = (
  feature: CountryFeature, 
  galleryCountries: readonly string[] = countriesWithGalleries as readonly string[]
): L.PathOptions => {
  
  const countryCode = feature.properties.iso_a2;
  const hasGallery = galleryCountries.includes(countryCode);
  
  return {
    weight: hasGallery ? 1.2 : 0.3,
    color: hasGallery ? '#1e40af' : 'rgba(30, 64, 175, 0.5)',
    fillColor: hasGallery ? '#3b82f6' : 'rgba(30, 64, 175, 0.1)',
    fillOpacity: hasGallery ? 0.7 : 0.2,
    opacity: 1,
    dashArray: '',
    fillRule: 'evenodd',
  };
};

export default function MapView() {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Map reference is used by the MapController component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mapRef = useRef<LeafletMap | null>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [countriesData, setCountriesData] = useState<CountryData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // These state variables are used in the component's event handlers
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag and load data
  useEffect(() => {
    if (isClient) return; // Skip if already client-side
    
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
    
    // No cleanup needed here as we want to keep the data loaded
  }, [isClient]);

  // Memoize the country style function
  const countryStyle = useCallback((feature?: CountryFeature) => {
    if (!feature) return {};
    // countriesWithGalleries is a constant, no need to include it in dependencies
    return getCountryStyle(feature, countriesWithGalleries as readonly string[]);
  }, []); // No dependencies needed as we only use constants

  // Handle mouse move for tooltip positioning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);
  
  // Handle mouse over for UK to show Scotland/UK text
  const handleUkMouseMove = useCallback((e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    
    // Check if we're over Scotland
    const isScotland = (
      lat >= 54.6 && lat <= 60.9 &&
      lng >= -8.2 && lng <= -0.7
    );
    
    const newHoverText = isScotland ? 'Scotland' : 'United Kingdom';
    
    // Only update if the hover text would change
    setHoveredCountry(prevHovered => newHoverText !== prevHovered ? newHoverText : prevHovered);
  }, [setHoveredCountry]);

  const onEachFeature = useCallback((feature: CountryFeature, layer: Layer) => {
    const countryCode = feature.properties.iso_a2 as CountryCode;
    const hasGallery = countriesWithGalleries.includes(countryCode);

    const handleMouseOver = (e: L.LeafletMouseEvent) => {
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
      
      // Set initial hover text based on country
      if (countryCode === 'GB') {
        setHoveredCountry('United Kingdom');
        // Add mousemove handler for UK to detect Scotland
        target.on('mousemove', handleUkMouseMove);
      } else {
        setHoveredCountry(feature.properties.name);
      }
    };

    const handleMouseOut = (e: L.LeafletEvent) => {
      const target = e.target as L.Path;
      target.setStyle(getCountryStyle(feature, countriesWithGalleries as readonly string[]));
      
      // Remove mousemove handler when leaving UK
      if (countryCode === 'GB') {
        target.off('mousemove', handleUkMouseMove);
      }
      
      setHoveredCountry('');
    };

    const handleClick = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      
      // Check if this is a click on the UK
      if (countryCode === 'GB') {
        const { lat, lng } = e.latlng;
        
        // Rough bounding box for Scotland
        const isScotland = (
          lat >= 54.6 && lat <= 60.9 &&  // North to South
          lng >= -8.2 && lng <= -0.7     // West to East
        );
        
        if (isScotland) {
          // Use the GB-SCT code for Scotland
          const gallerySlug = countryToGalleryMap['GB-SCT'];
          if (gallerySlug) {
            const galleryPath = `/galleries/${gallerySlug}`;
            console.log('Navigating to Scotland:', galleryPath);
            router.push(galleryPath);
            return;
          }
        } else {
          // For rest of UK, use the GB code
          const gallerySlug = countryToGalleryMap[countryCode];
          if (gallerySlug) {
            const galleryPath = `/galleries/${gallerySlug}`;
            console.log('Navigating to UK:', galleryPath);
            router.push(galleryPath);
            return;
          }
        }
      } else if (hasGallery) {
        // For all other countries with galleries
        const gallerySlug = countryToGalleryMap[countryCode];
        if (gallerySlug) {
          const galleryPath = `/galleries/${gallerySlug}`;
          console.log(`Navigating to ${feature.properties.name}:`, galleryPath);
          router.push(galleryPath);
          return;
        }
      }
      
      // If no gallery or not a recognized country, show the modal
      setSelectedCountry(feature);
      setIsModalOpen(true);
    };

    if (layer instanceof L.Path) {
      layer.on({
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        click: handleClick
      });
    }
  }, [router, handleUkMouseMove]); // Added handleUkMouseMove to dependencies

  // Handle map instance when it's created
  const setMapInstance = useCallback((mapInstance: LeafletMap) => {
    // Skip if we already have a map instance or if the new instance is invalid
    if (map || !mapInstance) return;

    // Set the map instance
    setMap(mapInstance);
    
    // Set initial view and settings
    mapInstance.setView([15, 0], 2.5);
    mapInstance.setMinZoom(2);
    mapInstance.setMaxZoom(22);
    
    // Remove any existing zoom controls
    mapInstance.zoomControl?.remove();
    
    // Add a single zoom control to bottom right
    const zoomControl = L.control.zoom({
      position: 'bottomright'
    });
    zoomControl.addTo(mapInstance);
    
    // Store the zoom control reference for cleanup
    const customMap = mapInstance as CustomMap;
    customMap.zoomControl = zoomControl;
    
    // Handle window resize with debounce
    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        if (mapInstance && !(mapInstance.getContainer() as { _leaflet_id?: number })._leaflet_id) {
          mapInstance.invalidateSize();
        }
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function to be called when the component unmounts or when the map instance changes
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      
      // Clean up the map instance if it exists
      if (mapInstance?.remove) {
        // Remove zoom control if it exists
        if (customMap.zoomControl) {
          mapInstance.removeControl(customMap.zoomControl);
        }
        mapInstance.off();
        mapInstance.remove();
        setMap(null);
      }
    };
  }, [map]); // Add map to dependency array to prevent stale closures

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
          
          .leaflet-control-zoom {
            border: none;
            background: none;
          }
          
          .leaflet-control-zoom-in,
          .leaflet-control-zoom-out {
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-bottom: 1px solid #444;
            width: 30px;
            height: 30px;
            line-height: 30px;
            display: block;
            text-align: center;
            text-decoration: none;
            font: bold 18px 'Lucida Console', Monaco, monospace;
            border-radius: 4px 4px 0 0;
          }
          
          .leaflet-control-zoom-out {
            border-top: 1px solid #444;
            border-radius: 0 0 4px 4px;
          }
          
          .leaflet-control-zoom-in:hover,
          .leaflet-control-zoom-out:hover {
            background-color: #4f46e5;
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
            onMapCreated={(map) => {
              setMapInstance(map);
              mapRef.current = map;
            }}
            countriesData={countriesData}
            countryStyle={countryStyle}
            onEachFeature={onEachFeature}
            mapRef={mapRef}
          />
        )}
        
        {/* Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
            onClick={() => setIsModalOpen(false)}
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
                }}> {selectedCountry?.properties?.name || 'this location'}</span> yet.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  onClick={() => setIsModalOpen(false)}
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

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from 'react-leaflet';
import { italyRegions, getRegionStyle, RegionFeature, RegionProperties } from '@/data/italyRegions';

// Map content component that handles map initialization
function MapContent({ 
  onEachRegion, 
  hoveredRegion,
  onMapCreated 
}: { 
  onEachRegion: (feature: RegionFeature, layer: L.Layer) => void; 
  hoveredRegion: string | null;
  onMapCreated: (map: L.Map) => void;
}) {
  const map = useMap();
  const mapInitialized = useRef(false);
  
  useEffect(() => {
    if (!mapInitialized.current && map) {
      mapInitialized.current = true;
      onMapCreated(map);
      
      // Set bounds to Italy when map is initialized
      const bounds = L.latLngBounds(
        L.latLng(36.6199, 6.7499),  // Southwest
        L.latLng(47.1154, 18.4802)  // Northeast
      );
      
      // Use a small timeout to ensure the container is properly sized
      const timer = setTimeout(() => {
        try {
          map.invalidateSize();
          map.fitBounds(bounds, { 
            padding: [20, 20],
            animate: false
          });
        } catch (e) {
          console.error('Error initializing map bounds:', e);
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [map, onMapCreated]);
  
  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        attribution='© OpenStreetMap contributors'
        noWrap={true}
      />
      {italyRegions.features.map((feature) => (
        <GeoJSON
          key={feature.id as string}
          data={feature}
          style={getRegionStyle(feature as RegionFeature, hoveredRegion === feature.properties.name)}
          onEachFeature={onEachRegion}
        />
      ))}
      <ZoomControl position="bottomright" />
    </>
  );
}

// Main map component
export default function ItalyMap() {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapInitialized = useRef(false);
  // Create a unique ID for the map container
  const mapContainerId = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);
  const cleanupDone = useRef(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
    
    // Generate a new unique ID for the map container
    mapContainerId.current = `map-${Math.random().toString(36).substr(2, 9)}`;
    
    // Cleanup function for the map
    return () => {
      if (cleanupDone.current) return;
      cleanupDone.current = true;
      
      if (mapRef.current) {
        const cleanupMap = async () => {
          try {
            const map = mapRef.current;
            if (!map) return;
            
            // Check if the map is still valid
            if (!map.getContainer || !map.getContainer().parentNode) {
              return;
            }
            
            // Store container reference before removing the map
            const container = map.getContainer();
            
            // Remove all event listeners
            if (typeof map.off === 'function') {
              try {
                map.off();
              } catch (e) {
                console.warn('Error removing event listeners:', e);
              }
            }
            
            // Stop any ongoing animations
            if (typeof map.stop === 'function') {
              try {
                map.stop();
              } catch (e) {
                console.warn('Error stopping animations:', e);
              }
            }
            
            // Remove all map layers
            if (typeof map.eachLayer === 'function') {
              try {
                map.eachLayer(layer => {
                  try {
                    if (typeof map.removeLayer === 'function') {
                      map.removeLayer(layer);
                    }
                  } catch (e) {
                    console.warn('Error removing layer:', e);
                  }
                });
              } catch (e) {
                console.warn('Error during layer cleanup:', e);
              }
            }
            
            // Remove the map instance
            if (typeof map.remove === 'function') {
              try {
                map.remove();
              } catch (e) {
                console.warn('Error removing map:', e);
              }
            }
            
            // Clear the container
            if (container) {
              try {
                // Clear the container
                container.innerHTML = '';
                
                // Remove the container from the DOM
                if (container.parentNode) {
                  container.parentNode.removeChild(container);
                }
                
                // Clear any remaining references
                const leafletContainer = container as HTMLElement & { _leaflet_id?: number };
                if (leafletContainer._leaflet_id) {
                  delete leafletContainer._leaflet_id;
                }
                
                // Force garbage collection if available
                if (typeof window !== 'undefined' && window.gc) {
                  try {
                    window.gc();
                  } catch (e) {
                    console.warn('Error running garbage collection:', e);
                  }
                }
                
              } catch (e) {
                console.warn('Error cleaning up container:', e);
              }
            }
            
          } catch (e) {
            console.error('Error during map cleanup:', e);
          } finally {
            mapRef.current = null;
            cleanupDone.current = true;
          }
        };

        cleanupMap();
      }
    };
  }, []); // No dependencies to prevent unnecessary re-renders

  // Handle map creation
  const handleMapCreated = useCallback((map: L.Map) => {
    if (mapInitialized.current) return;
    mapInitialized.current = true;
    
    // Only set the map reference if we don't have one
    if (!mapRef.current) {
      mapRef.current = map;
      
      // Set initial bounds
      const bounds = L.latLngBounds(
        L.latLng(36.6199, 6.7499),
        L.latLng(47.1154, 18.4802)
      );
      
      // Use requestAnimationFrame to ensure the container is properly sized
      let rafId: number | null = null;
      
      const initMap = () => {
        const container = map?.getContainer() as (HTMLElement & { _leaflet_id?: number }) | undefined;
        if (map && (!container || !container._leaflet_id)) return;
        
        rafId = requestAnimationFrame(() => {
          try {
            if (map && typeof map.fitBounds === 'function' && map.getContainer()) {
              map.invalidateSize();
              map.fitBounds(bounds, { 
                padding: [50, 50],
                animate: false
              });
            }
          } catch (e) {
            console.error('Error setting map bounds:', e);
          }
        });
      };
      
      // Initial setup
      initMap();
      
      // Cleanup function
      return () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        if (map) {
          try {
            map.off();
            map.remove();
          } catch (e) {
            console.warn('Error in map cleanup:', e);
          }
        }
      };
    }
  }, []);

  // Handle mouse move for tooltip
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPosition({
      x: e.clientX + 15,
      y: e.clientY + 15
    });
  }, []);

  // Handle region interactions
  const onEachRegion = useCallback((feature: GeoJSON.Feature<GeoJSON.Geometry, RegionProperties>, layer: L.Layer) => {
    const handleMouseOver = (e: L.LeafletMouseEvent) => {
      const layer = e.target as L.Path;
      layer.setStyle(getRegionStyle(feature as RegionFeature, true));
      setHoveredRegion(feature.properties.name);
      
      const container = document.getElementById('map-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        setTooltipPosition({
          x: e.containerPoint.x + rect.left + 15,
          y: e.containerPoint.y + rect.top - 15
        });
      }
    };

    const handleMouseOut = (e: L.LeafletMouseEvent) => {
      const layer = e.target as L.Path;
      layer.setStyle(getRegionStyle(feature as RegionFeature, false));
      setHoveredRegion(null);
    };

    const handleClick = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      
      // Small delay to allow the click animation to complete
      setTimeout(() => {
        const galleryPath = feature.properties.galleryPath;
        if (galleryPath) {
          // Ensure the path is properly formatted for Next.js routing
          let normalizedPath = galleryPath;
          if (!normalizedPath.endsWith('/')) {
            normalizedPath += '/';
          }
          // Remove any double slashes that might have been introduced
          normalizedPath = normalizedPath.replace(/([^:]\/)\/+/g, '$1');
          console.log('Navigating to:', normalizedPath);
          router.push(normalizedPath);
        }
      }, 100);
    };

    layer.off(); // Remove any existing event handlers
    layer.on({
      mouseover: handleMouseOver,
      mouseout: handleMouseOut,
      click: handleClick
    });
  }, [router]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen"
      onMouseMove={handleMouseMove}
      id="map-container"
    >
      <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2">
        <button
          onClick={() => router.back()}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          ← Back to World Map
        </button>
        
        <Menu as="div" className="relative w-full">
          <div className="w-full">
            <Menu.Button className="inline-flex w-full justify-between items-center rounded-md bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              <span>Quick Links</span>
              <ChevronDownIcon
                className="ml-2 h-5 w-5 text-gray-800 dark:text-white"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 right-0 mt-2 w-full origin-top divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 w-full">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push('/galleries/italy/padova')}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900 dark:text-white text-left`}
                    >
                      Padova
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push('/galleries/italy/trieste')}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900 dark:text-white text-left`}
                    >
                      Trieste
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push('/galleries/italy/venice')}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900 dark:text-white text-left`}
                    >
                      Venice
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="w-full h-full" id={mapContainerId.current} key={mapContainerId.current}>
        {isClient && (
          <MapContainer
            center={[41.8719, 12.5674]}
            zoom={6}
            minZoom={6.1}
            maxZoom={12}
            maxBounds={[
              [36.6199, 6.7499], // Southwest coordinates (south, west)
              [47.1154, 18.4802]  // Northeast coordinates (north, east)
            ]}
            maxBoundsViscosity={1.0} // Prevents the user from dragging outside the bounds
            style={{ height: '100%', width: '100%' }}
            zoomControl={false} // Disable default zoom controls (we use the ones in the bottom right)
            ref={(map) => {
              if (map) {
                handleMapCreated(map);
              }
            }}
            preferCanvas={true}
            className="z-0"
          >
            <MapContent 
              onEachRegion={onEachRegion}
              hoveredRegion={hoveredRegion}
              onMapCreated={handleMapCreated}
            />
          </MapContainer>
        )}
      </div>

      {hoveredRegion && (
        <div 
          className="fixed z-[1000] px-3 py-1 bg-gray-900/90 text-white text-sm rounded-md shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transition: 'left 0.05s, top 0.05s',
          }}
        >
          {hoveredRegion}
        </div>
      )}
    </div>
  );
}

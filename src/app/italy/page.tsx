'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { italyRegions, getRegionStyle, RegionFeature, RegionProperties } from '@/data/italyRegions';

// Main map component with all its children
const MapComponent = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } = mod;
    
    // Inner component that needs access to the map instance
    function MapContent({ onEachRegion, hoveredRegion }: { 
      onEachRegion: (feature: RegionFeature, layer: L.Layer) => void; 
      hoveredRegion: string | null;
    }) {
      const map = useMap();
      
      useEffect(() => {
        // Set bounds to Italy when map is initialized
        const bounds = L.latLngBounds(
          L.latLng(36.6199, 6.7499),  // Southwest
          L.latLng(47.1154, 18.4802)  // Northeast
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }, [map]);
      
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
    
    // Return the main map component
    return function MapWrapper({ onEachRegion, hoveredRegion, onMapCreated }: { 
      onEachRegion: (feature: RegionFeature, layer: L.Layer) => void;
      hoveredRegion: string | null;
      onMapCreated: (map: L.Map) => void;
    }) {
      const [mapReady, setMapReady] = useState(false);
      const mapRef = useRef<L.Map | null>(null);
      
      // Set up the map ref callback
      const mapRefCallback = useCallback((map: L.Map | null) => {
        if (map) {
          mapRef.current = map;
          setMapReady(true);
          onMapCreated(map);
        }
      }, [onMapCreated]);
      
      return (
        <MapContainer
          center={[41.8719, 12.5674]}
          zoom={5}
          minZoom={6}
          maxZoom={10}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          className="z-0"
          ref={mapRefCallback}
        >
          {mapReady && (
            <MapContent 
              onEachRegion={onEachRegion} 
              hoveredRegion={hoveredRegion} 
            />
          )}
        </MapContainer>
      );
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function ItalyMap() {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setIsClient(true);
    return () => {
      // Cleanup map instance when component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPosition({
      x: e.clientX + 15,
      y: e.clientY + 15
    });
  }, []);

  const onEachRegion = useCallback((feature: GeoJSON.Feature<GeoJSON.Geometry, RegionProperties>, layer: L.Layer) => {
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
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
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const layer = e.target as L.Path;
        layer.setStyle(getRegionStyle(feature as RegionFeature, false));
        setHoveredRegion(null);
      },
      click: (e: L.LeafletMouseEvent) => {
        e.originalEvent.preventDefault();
        const galleryPath = feature.properties.galleryPath;
        if (galleryPath) {
          router.push(galleryPath);
        }
      }
    });
  }, [router]);

  const handleMapCreated = useCallback((map: L.Map) => {
    mapRef.current = map;
    // Set initial bounds
    const bounds = L.latLngBounds(
      L.latLng(36.6199, 6.7499),
      L.latLng(47.1154, 18.4802)
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, []);

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
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        ← Back to World Map
      </button>

      <div className="w-full h-full">
        <MapComponent 
          onEachRegion={onEachRegion}
          hoveredRegion={hoveredRegion}
          onMapCreated={handleMapCreated}
        />
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

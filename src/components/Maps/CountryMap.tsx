'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { RegionFeature, RegionProperties, getRegionStyle } from '@/data/italyRegions';

// Dynamically import all Leaflet components to avoid SSR issues
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

const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Using RegionFeature and RegionProperties from italyRegions.ts

interface CountryMapProps {
  regions: GeoJSON.FeatureCollection<GeoJSON.Geometry, RegionProperties>;
  bounds: L.LatLngBoundsExpression;
  onRegionClick?: (region: string) => void;
  hoveredRegion?: string | null;
  onHover?: (region: string | null) => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function CountryMap({
  regions,
  bounds,
  onRegionClick,
  hoveredRegion,
  onHover,
  style,
  className = ''
}: CountryMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
      }
    };
  }, []);

  // Set up map when component mounts
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Set initial view
    map.fitBounds(bounds, { padding: [50, 50] });
    
    // Handle window resize
    const handleResize = () => {
      try {
        map.invalidateSize();
      } catch (e) {
        console.error('Error resizing map:', e);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [bounds]);

  const handleEachFeature = useCallback((feature: RegionFeature, layer: L.Layer) => {
    layer.on({
      mouseover: () => onHover?.(feature.properties.name),
      mouseout: () => onHover?.(null),
      click: () => onRegionClick?.(feature.properties.name)
    });
  }, [onHover, onRegionClick]);

  // Using getRegionStyle from italyRegions.ts

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ ...style, height: '100%', width: '100%' }}>
      <MapContainer
        center={[41.8719, 12.5674]} // Center of Italy
        zoom={6}
        minZoom={6.1}
        maxZoom={12}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        maxBounds={[
          [36.6199, 6.7499], // Southwest coordinates (south, west)
          [47.1154, 18.4802]  // Northeast coordinates (north, east)
        ]}
        maxBoundsViscosity={1.0}
        preferCanvas={true}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='© OpenStreetMap contributors'
          noWrap
        />
        {regions.features.map((feature) => (
          <GeoJSON
            key={feature.id}
            data={feature}
            style={getRegionStyle(feature as RegionFeature, hoveredRegion === feature.properties.name)}
            onEachFeature={handleEachFeature}
          />
        ))}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}

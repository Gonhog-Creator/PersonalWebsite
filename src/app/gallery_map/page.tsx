'use client';

import dynamic from 'next/dynamic';

// Import the map component with no SSR
const MapView = dynamic(
  () => import('./MapView'),
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

export default function WorldMapPage() {
  return <MapView />;
}

'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, Fragment } from 'react';
import { italyRegions } from '@/data/italyRegions';
import dynamic from 'next/dynamic';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Dynamically import the CountryMap component with SSR disabled
const CountryMap = dynamic(
  () => import('@/components/Maps/CountryMap'),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function ItalyMap() {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleRegionClick = useCallback((region: string) => {
    // Find the feature that matches the region name
    const regionFeature = italyRegions.features.find(
      (f) => f.properties.name.toLowerCase() === region.toLowerCase()
    );
    
    if (regionFeature?.properties?.galleryPath) {
      const path = regionFeature.properties.galleryPath;
      if (path) {
        const normalizedPath = path.endsWith('/') ? path : `${path}/`;
        router.push(normalizedPath);
      }
    }
  }, [router]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPosition({
      x: e.clientX + 10,
      y: e.clientY + 10
    });
  }, []);

  return (
    <div className="h-screen w-full" onMouseMove={handleMouseMove} id="map-container">
      <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2">
        <button
          onClick={() => router.back()}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
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
            <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
              <div className="px-1 py-1 max-h-60 overflow-y-auto">
                {italyRegions.features
                  .filter(feature => feature.properties.galleryPath)
                  .map((feature) => (
                    <Menu.Item key={feature.id as string}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => {
                            const path = feature.properties.galleryPath;
                            if (path) {
                              router.push(path.endsWith('/') ? path : `${path}/`);
                            }
                          }}
                        >
                          {feature.properties.name}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg">
        <h1 className="text-base font-semibold">Italy</h1>
      </div>
      
      <CountryMap
        regions={italyRegions}
        bounds={[
          [36.6199, 6.7499],  // Southwest
          [47.1154, 18.4802]  // Northeast
        ]}
        onRegionClick={handleRegionClick}
        hoveredRegion={hoveredRegion}
        onHover={setHoveredRegion}
      />

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

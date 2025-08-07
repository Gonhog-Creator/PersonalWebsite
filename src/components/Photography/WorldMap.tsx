'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';

// List of countries with galleries and their coordinates [x, y] in the SVG
const COUNTRIES = [
  { code: 'US', name: 'United States', x: '25%', y: '30%' },
  { code: 'AR', name: 'Argentina', x: '30%', y: '80%' },
  { code: 'CH', name: 'Switzerland', x: '50%', y: '35%' },
  { code: 'DE', name: 'Germany', x: '52%', y: '30%' },
  { code: 'FR', name: 'France', x: '48%', y: '32%' },
  { code: 'GB', name: 'United Kingdom', x: '46%', y: '25%' },
  { code: 'CR', name: 'Costa Rica', x: '20%', y: '60%' },
  { code: 'SI', name: 'Slovenia', x: '52%', y: '35%' },
  { code: 'AT', name: 'Austria', x: '52%', y: '32%' },
  { code: 'AU', name: 'Australia', x: '85%', y: '70%' },
  { code: 'BE', name: 'Belgium', x: '48%', y: '30%' },
  { code: 'GR', name: 'Greece', x: '55%', y: '45%' },
];

type WorldMapProps = {
  onCountryClick?: (countryCode: string) => void;
};

const WorldMap = ({ onCountryClick }: WorldMapProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  const handleCountryClick = useCallback((code: string) => {
    if (onCountryClick) {
      onCountryClick(code);
    }
  }, [onCountryClick]);

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden bg-gray-800">
      {/* World Map SVG */}
      <svg 
        viewBox="0 0 1000 500" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="100%" height="100%" fill="#1e3a8a" />
        
        {/* Continents (simplified shapes) */}
        <path 
          d="M200,100 Q300,50 400,100 Q500,150 500,250 Q450,400 300,400 Q200,350 150,250 Q150,150 200,100 Z" 
          fill="#1e40af" 
          stroke="#1e3a8a" 
          strokeWidth="2"
        />
        <path 
          d="M400,100 Q500,150 600,100 Q700,150 700,250 Q650,350 600,300 Q550,250 500,300 Q450,250 400,200 Z" 
          fill="#1e40af" 
          stroke="#1e3a8a" 
          strokeWidth="2"
        />
        <path 
          d="M200,400 Q300,450 400,400 Q450,350 500,400 Q550,450 600,400 Q650,350 700,400 Q750,450 800,400 Q850,350 850,250 Q900,200 950,250 L950,500 L50,500 L50,400 Q100,350 150,400 Z" 
          fill="#1e40af" 
          stroke="#1e3a8a" 
          strokeWidth="2"
        />
        
        {/* Country markers */}
        {COUNTRIES.map((country) => {
          const isHovered = hoveredCountry === country.name;
          return (
            <g 
              key={country.code}
              className="cursor-pointer transition-transform hover:scale-110"
              transform={`translate(${country.x}, ${country.y})`}
              onMouseEnter={() => setHoveredCountry(country.name)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => handleCountryClick(country.code)}
            >
              <circle 
                cx="0" 
                cy="0" 
                r={isHovered ? '8' : '6'} 
                fill="#3b82f6" 
                stroke="white" 
                strokeWidth="2"
                className="transition-all duration-200"
              />
              {isHovered && (
                <text
                  x="0"
                  y="-12"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  className="pointer-events-none select-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {country.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Info box */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
        {hoveredCountry || 'Click on a country to view photos'}
      </div>
    </div>
  );
};

export default WorldMap;

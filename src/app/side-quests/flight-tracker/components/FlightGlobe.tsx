'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls, useTexture } from '@react-three/drei';
import { Settings, X } from 'lucide-react';
import * as THREE from 'three';
import {
  allFlights,
  getLocation,
  yearGroups,
  yearColors,
  type Flight,
} from '@/data/flightTrackerData';

const RADIUS = 2;
const ARC_SEGMENTS = 64;
const ARC_HEIGHT = 0.35;

function latLonToVector3(lat: number, lon: number, radius: number) {
  const latRad = (lat * Math.PI) / 180;
  // Shift longitude so the 0° meridian sits at the front of the globe
  const lonRad = ((lon + 90) * Math.PI) / 180;
  const x = -radius * Math.cos(latRad) * Math.cos(lonRad);
  const z = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = radius * Math.sin(latRad);
  return new THREE.Vector3(x, y, z);
}

function FlightArc({ flight, color }: { flight: Flight; color: string }) {
  const points = useMemo(() => {
    const from = getLocation(flight.from);
    const to = getLocation(flight.to);
    const start = latLonToVector3(from.lat, from.lon, RADIUS);
    const end = latLonToVector3(to.lat, to.lon, RADIUS);
    const pts: THREE.Vector3[] = [];
    const axis = new THREE.Vector3().crossVectors(start, end).normalize();
    const angle = start.angleTo(end);

    for (let i = 0; i <= ARC_SEGMENTS; i++) {
      const t = i / ARC_SEGMENTS;
      const base = new THREE.Vector3()
        .copy(start)
        .applyAxisAngle(axis, angle * t)
        .normalize()
        .multiplyScalar(RADIUS);
      const lift = base
        .clone()
        .normalize()
        .multiplyScalar(ARC_HEIGHT * Math.sin(Math.PI * t));
      pts.push(base.add(lift));
    }

    return pts;
  }, [flight]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.8}
    />
  );
}

function Earth() {
  const texture = useTexture('/img/earth-daymap.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = true;
  texture.wrapS = THREE.RepeatWrapping;
  // Offset the texture so the 0° meridian is at the front of the sphere
  texture.offset.x = 0.25;

  return (
    <mesh>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.65}
        metalness={0.05}
      />
    </mesh>
  );
}

function LocationMarkers({ flights }: { flights: Flight[] }) {
  const locs = useMemo(() => {
    const keys = new Set<string>();
    flights.forEach((f) => {
      keys.add(f.from);
      keys.add(f.to);
    });
    return Array.from(keys).map((key) => getLocation(key));
  }, [flights]);

  return (
    <>
      {locs.map((loc) => {
        const pos = latLonToVector3(loc.lat, loc.lon, RADIUS + 0.02);
        return (
          <mesh key={loc.key} position={pos}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        );
      })}
    </>
  );
}

function Scene({
  visibleYears,
  autoRotate,
}: {
  visibleYears: Set<number>;
  autoRotate: boolean;
}) {
  const flights = useMemo(
    () => allFlights.filter((f) => visibleYears.has(f.year)),
    [visibleYears]
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <Earth />
      <LocationMarkers flights={flights} />
      {flights.map((flight, i) => (
        <FlightArc
          key={`${flight.year}-${i}`}
          flight={flight}
          color={yearColors[flight.year]}
        />
      ))}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI / 2 - 0.45}
        maxPolarAngle={Math.PI / 2 + 0.45}
      />
    </>
  );
}

export function FlightGlobe() {
  const [mounted, setMounted] = useState(false);
  const [visibleYears, setVisibleYears] = useState<Set<number>>(
    () => new Set(yearGroups.map((g) => g.year))
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading globe...
      </div>
    );
  }

  const toggleYear = (year: number) => {
    setVisibleYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  return (
    <div className="relative w-full h-screen bg-gray-950">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor('#030712')}
      >
        <Suspense fallback={null}>
          <Scene visibleYears={visibleYears} autoRotate={autoRotate} />
        </Suspense>
      </Canvas>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-white hover:bg-gray-800 transition-colors"
        aria-label="Open settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      <p className="fixed bottom-6 left-6 z-30 text-[10px] text-gray-500/80">
        Earth texture by Solar System Scope / CC BY 4.0
      </p>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Flight Tracker</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-xs mb-4">
              Drag to spin, scroll to zoom.
            </p>
            <div className="space-y-2 mb-4">
              {yearGroups.map((g) => (
                <label
                  key={g.year}
                  className="flex items-center gap-2 text-sm cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-600"
                    checked={visibleYears.has(g.year)}
                    onChange={() => toggleYear(g.year)}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="text-gray-200">{g.year}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setAutoRotate((v) => !v)}
              className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 transition-colors"
            >
              {autoRotate ? 'Pause spin' : 'Auto spin'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

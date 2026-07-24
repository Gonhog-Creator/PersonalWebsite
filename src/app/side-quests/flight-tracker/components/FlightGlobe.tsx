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
const EARTH_RADIUS_KM = 6371;
const ESTIMATED_CRUISE_SPEED_KMH = 850;

function latLonToVector3(lat: number, lon: number, radius: number) {
  const latRad = (lat * Math.PI) / 180;
  // Shift longitude so the 0° meridian sits at the front of the globe
  const lonRad = ((lon + 90) * Math.PI) / 180;
  const x = -radius * Math.cos(latRad) * Math.cos(lonRad);
  const z = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = radius * Math.sin(latRad);
  return new THREE.Vector3(x, y, z);
}

function estimateFlightHours(flight: Flight) {
  const from = getLocation(flight.from);
  const to = getLocation(flight.to);
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const deltaLat = ((to.lat - from.lat) * Math.PI) / 180;
  const deltaLon = ((to.lon - from.lon) * Math.PI) / 180;
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const distance =
    2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return distance / ESTIMATED_CRUISE_SPEED_KMH;
}

function formatEstimatedDuration(hours: number) {
  const totalMinutes = Math.round(hours * 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const remainingMinutes = totalMinutes % (24 * 60);
  const wholeHours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  if (days > 0) return `${days}d ${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
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
  const totalEstimatedFlightHours = useMemo(
    () => allFlights.reduce((total, flight) => total + estimateFlightHours(flight), 0),
    []
  );

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

      <div className="pointer-events-none fixed right-4 top-4 z-20 w-[min(220px,calc(100vw-2rem))] rounded-xl border border-gray-700 bg-gray-900/85 p-4 shadow-xl backdrop-blur-sm sm:right-6 sm:top-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400">
          Estimated time in air
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {formatEstimatedDuration(totalEstimatedFlightHours)}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          Based on route distance and average cruising speed.
        </p>
      </div>

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
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-white font-semibold">Flight Tracker</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Drag to spin, scroll to zoom.
            </p>
            <div className="space-y-3 mb-6">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Visible years
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Choose which routes appear on the globe.
                </p>
              </div>
              <div className="rounded-lg border border-gray-700/80 bg-gray-950/40 p-2 space-y-1">
                {yearGroups.map((g) => (
                  <label
                    key={g.year}
                    className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer select-none transition-colors ${
                      visibleYears.has(g.year)
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500/40"
                      checked={visibleYears.has(g.year)}
                      onChange={() => toggleYear(g.year)}
                    />
                    <span
                      className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/10"
                      style={{ backgroundColor: g.color }}
                    />
                    <span className="font-medium">{g.year}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-800 pt-5">
              <button
                onClick={() => setAutoRotate((v) => !v)}
                className="min-h-10 w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {autoRotate ? 'Pause spin' : 'Auto spin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

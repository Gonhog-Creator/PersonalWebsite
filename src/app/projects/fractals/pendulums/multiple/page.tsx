'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Pagination } from '@/components/ui/pagination';

export default function MultiplePendulumsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [separation, setSeparation] = useState(0.1);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: -100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showTrails, setShowTrails] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [length1, setLength1] = useState(1.5);
  const [length2, setLength2] = useState(1.5);
  const [initialAngle1, setInitialAngle1] = useState(90);
  const [initialAngle2, setInitialAngle2] = useState(90);

  const animationRef = useRef<number>();
  const trailsRef = useRef<{x: number, y: number}[][]>([]);
  const angleHistoryRef = useRef<{time: number, theta2: number[]}[]>([]);
  const simulationTimeRef = useRef(0);
  
  // Animation state refs to persist during pause/resume
  const animationStateRef = useRef<{
    theta1: number[];
    theta2: number[];
    omega1: number[];
    omega2: number[];
  }>({
    theta1: [],
    theta2: [],
    omega1: [],
    omega2: []
  });
  
  const numPendulums = 5; // Fixed number of pendulums

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isRunning) {
        handleStart();
      } else if (e.key === ' ' && isRunning) {
        e.preventDefault();
        setIsPaused(!isPaused);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isPaused, numPendulums, separation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2 + panOffset.x;
    const centerY = canvas.height / 2 + panOffset.y;
    const scale = 100 * zoom;

    const drawStaticPendulums = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw grid
      const baseGridSize = 20;
      let fineGridSize, majorGridSize;
      if (zoom < 0.5) {
        fineGridSize = baseGridSize * 4;
        majorGridSize = baseGridSize * 8;
      } else if (zoom < 1) {
        fineGridSize = baseGridSize * 2;
        majorGridSize = baseGridSize * 4;
      } else if (zoom < 2) {
        fineGridSize = baseGridSize;
        majorGridSize = baseGridSize * 2;
      } else {
        fineGridSize = baseGridSize / 2;
        majorGridSize = baseGridSize;
      }
      
      fineGridSize *= zoom;
      majorGridSize *= zoom;
      
      const worldLeft = -centerX;
      const worldRight = canvas.width - centerX;
      const worldTop = -centerY;
      const worldBottom = canvas.height - centerY;
      
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      
      for (let x = Math.floor(worldLeft / fineGridSize) * fineGridSize; x <= worldRight; x += fineGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, worldTop);
        ctx.lineTo(x, worldBottom);
        ctx.stroke();
      }
      
      for (let y = Math.floor(worldTop / fineGridSize) * fineGridSize; y <= worldBottom; y += fineGridSize) {
        ctx.beginPath();
        ctx.moveTo(worldLeft, y);
        ctx.lineTo(worldRight, y);
        ctx.stroke();
      }
      
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      for (let x = Math.floor(worldLeft / majorGridSize) * majorGridSize; x <= worldRight; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, worldTop);
        ctx.lineTo(x, worldBottom);
        ctx.stroke();
      }
      
      for (let y = Math.floor(worldTop / majorGridSize) * majorGridSize; y <= worldBottom; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(worldLeft, y);
        ctx.lineTo(worldRight, y);
        ctx.stroke();
      }
      
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.moveTo(worldLeft, 0);
      ctx.lineTo(worldRight, 0);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, worldTop);
      ctx.lineTo(0, worldBottom);
      ctx.stroke();
      
      ctx.restore();

      // Draw static double pendulums (in screen coordinates like animated version)
      for (let i = 0; i < numPendulums; i++) {
        const theta1 = (initialAngle1 * Math.PI) / 180;
        const theta2 = (initialAngle2 + i * separation) * Math.PI / 180;
        
        // First pendulum position (in screen coordinates)
        const x1 = centerX + length1 * scale * Math.sin(theta1);
        const y1 = centerY + length1 * scale * Math.cos(theta1);
        
        // Second pendulum position (in screen coordinates)
        const x2 = x1 + length2 * scale * Math.sin(theta2);
        const y2 = y1 + length2 * scale * Math.cos(theta2);

        const hue = (i * 360 / numPendulums);
        
        // Draw first pendulum
        ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        
        // Draw second pendulum
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw joints
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y2, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw pivot
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    drawStaticPendulums();

    if (!isRunning) {
      drawStaticPendulums();
    }

    const animate = () => {
      let { theta1, theta2, omega1, omega2 } = animationStateRef.current;
      
      if (!isPaused) {
        // Constants from John Allard's implementation - EXACT SAME AS SINGLE PENDULUM
        const g = 9.81; // gravity
        const m1 = 1.0; // mass 1
        const m2 = 1.0; // mass 2
        const L1 = length1; // length 1
        const L2 = length2; // length 2
        const dt = 0.02; // timestep for 2x speed
        
        // Double pendulum equations for multiple pendulums
        for (let i = 0; i < numPendulums; i++) {
          const t1 = theta1[i];
          const t2 = theta2[i];
          const w1 = omega1[i];
          const w2 = omega2[i];
          
          // John Allard's double pendulum equations - EXACT SAME AS SINGLE PENDULUM
          // Upper omega prime (angular acceleration for first pendulum)
          const upperOmegaPrime = (theta1, theta2, omega1, omega2) => {
            const numerator = -g * (2*m1 + m2) * Math.sin(theta1) - g * m2 * Math.sin(theta1 - 2*theta2);
            const term1 = -2 * Math.sin(theta1 - theta2) * m2;
            const term2 = L2 * omega2 * omega2 + L1 * omega1 * omega1 * Math.cos(theta1 - theta2);
            const fullNumerator = numerator + term1 * term2;
            const denominator = L1 * (2*m1 + m2 * (1 - Math.cos(2*(theta1 - theta2))));
            return fullNumerator / denominator;
          };
          
          // Lower omega prime (angular acceleration for second pendulum)
          const lowerOmegaPrime = (theta1, theta2, omega1, omega2) => {
            const numerator = 2 * Math.sin(theta1 - theta2);
            const term1 = L1 * omega1 * omega1 * (m1 + m2);
            const term2 = g * Math.cos(theta1) * (m1 + m2);
            const term3 = L2 * m2 * omega2 * omega2 * Math.cos(theta1 - theta2);
            const fullNumerator = numerator * (term1 + term2 + term3);
            const denominator = L2 * (2*m1 + m2 * (1 - Math.cos(2*(theta1 - theta2))));
            return fullNumerator / denominator;
          };
          
          // RK4 implementation - EXACT SAME AS SINGLE PENDULUM
          // k1
          const k1_theta1 = w1;
          const k1_theta2 = w2;
          const k1_omega1 = upperOmegaPrime(t1, t2, w1, w2);
          const k1_omega2 = lowerOmegaPrime(t1, t2, w1, w2);
          
          // k2
          const temp_theta1_2 = t1 + k1_theta1 * dt/2;
          const temp_theta2_2 = t2 + k1_theta2 * dt/2;
          const temp_omega1_2 = w1 + k1_omega1 * dt/2;
          const temp_omega2_2 = w2 + k1_omega2 * dt/2;
          
          const k2_omega1 = upperOmegaPrime(temp_theta1_2, temp_theta2_2, temp_omega1_2, temp_omega2_2);
          const k2_omega2 = lowerOmegaPrime(temp_theta1_2, temp_theta2_2, temp_omega1_2, temp_omega2_2);
          const k2_theta1 = temp_omega1_2;
          const k2_theta2 = temp_omega2_2;
          
          // k3
          const temp_theta1_3 = t1 + k2_theta1 * dt/2;
          const temp_theta2_3 = t2 + k2_theta2 * dt/2;
          const temp_omega1_3 = w1 + k2_omega1 * dt/2;
          const temp_omega2_3 = w2 + k2_omega2 * dt/2;
          
          const k3_omega1 = upperOmegaPrime(temp_theta1_3, temp_theta2_3, temp_omega1_3, temp_omega2_3);
          const k3_omega2 = lowerOmegaPrime(temp_theta1_3, temp_theta2_3, temp_omega1_3, temp_omega2_3);
          const k3_theta1 = temp_omega1_3;
          const k3_theta2 = temp_omega2_3;
          
          // k4
          const temp_theta1_4 = t1 + k3_theta1 * dt;
          const temp_theta2_4 = t2 + k3_theta2 * dt;
          const temp_omega1_4 = w1 + k3_omega1 * dt;
          const temp_omega2_4 = w2 + k3_omega2 * dt;
          
          const k4_omega1 = upperOmegaPrime(temp_theta1_4, temp_theta2_4, temp_omega1_4, temp_omega2_4);
          const k4_omega2 = lowerOmegaPrime(temp_theta1_4, temp_theta2_4, temp_omega1_4, temp_omega2_4);
          const k4_theta1 = temp_omega1_4;
          const k4_theta2 = temp_omega2_4;
          
          // Update state using RK4 formula
          theta1[i] = t1 + (k1_theta1 + 2*k2_theta1 + 2*k3_theta1 + k4_theta1) * dt / 6;
          theta2[i] = t2 + (k1_theta2 + 2*k2_theta2 + 2*k3_theta2 + k4_theta2) * dt / 6;
          omega1[i] = w1 + (k1_omega1 + 2*k2_omega1 + 2*k3_omega1 + k4_omega1) * dt / 6;
          omega2[i] = w2 + (k1_omega2 + 2*k2_omega2 + 2*k3_omega2 + k4_omega2) * dt / 6;
        }
        
        animationStateRef.current = { theta1, theta2, omega1, omega2 };
      }

      // Update simulation time
      simulationTimeRef.current += 0.02; // Add timestep
      
      // Record angle history for graph (keep last 10 seconds)
      angleHistoryRef.current.push({
        time: simulationTimeRef.current,
        theta2: theta2.map(angle => angle * 180 / Math.PI) // Convert to degrees
      });
      
      // Keep only last 10 seconds of data
      const tenSecondsAgo = simulationTimeRef.current - 10;
      angleHistoryRef.current = angleHistoryRef.current.filter(point => point.time > tenSecondsAgo);

      // Clear and redraw
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Redraw grid (same as above)
      const baseGridSize = 20;
      let fineGridSize, majorGridSize;
      if (zoom < 0.5) {
        fineGridSize = baseGridSize * 4;
        majorGridSize = baseGridSize * 8;
      } else if (zoom < 1) {
        fineGridSize = baseGridSize * 2;
        majorGridSize = baseGridSize * 4;
      } else if (zoom < 2) {
        fineGridSize = baseGridSize;
        majorGridSize = baseGridSize * 2;
      } else {
        fineGridSize = baseGridSize / 2;
        majorGridSize = baseGridSize;
      }
      
      fineGridSize *= zoom;
      majorGridSize *= zoom;
      
      const worldLeft = -centerX;
      const worldRight = canvas.width - centerX;
      const worldTop = -centerY;
      const worldBottom = canvas.height - centerY;
      
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      
      for (let x = Math.floor(worldLeft / fineGridSize) * fineGridSize; x <= worldRight; x += fineGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, worldTop);
        ctx.lineTo(x, worldBottom);
        ctx.stroke();
      }
      
      for (let y = Math.floor(worldTop / fineGridSize) * fineGridSize; y <= worldBottom; y += fineGridSize) {
        ctx.beginPath();
        ctx.moveTo(worldLeft, y);
        ctx.lineTo(worldRight, y);
        ctx.stroke();
      }
      
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      for (let x = Math.floor(worldLeft / majorGridSize) * majorGridSize; x <= worldRight; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, worldTop);
        ctx.lineTo(x, worldBottom);
        ctx.stroke();
      }
      
      for (let y = Math.floor(worldTop / majorGridSize) * majorGridSize; y <= worldBottom; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(worldLeft, y);
        ctx.lineTo(worldRight, y);
        ctx.stroke();
      }
      
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.moveTo(worldLeft, 0);
      ctx.lineTo(worldRight, 0);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, worldTop);
      ctx.lineTo(0, worldBottom);
      ctx.stroke();
      
      ctx.restore();

      // Draw trails
      if (showTrails && trailsRef.current.length > 0) {
        for (let i = 0; i < numPendulums; i++) {
          const trail = trailsRef.current[i];
          if (trail && trail.length > 1) {
            const hue = (i * 360 / numPendulums);
            ctx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.3)`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            trail.forEach((point, index) => {
              // Apply current panOffset when drawing - same as single pendulum
              const screenX = point.x + panOffset.x;
              const screenY = point.y + panOffset.y;
              if (index === 0) {
                ctx.moveTo(screenX, screenY);
              } else {
                ctx.lineTo(screenX, screenY);
              }
            });
            ctx.stroke();
          }
        }
      }

      // Draw double pendulums (in screen coordinates like single pendulum)
      for (let i = 0; i < numPendulums; i++) {
        const t1 = theta1[i];
        const t2 = theta2[i];
        
        // First pendulum position (in screen coordinates)
        const x1 = centerX + length1 * scale * Math.sin(t1);
        const y1 = centerY + length1 * scale * Math.cos(t1);
        
        // Second pendulum position (in screen coordinates)
        const x2 = x1 + length2 * scale * Math.sin(t2);
        const y2 = y1 + length2 * scale * Math.cos(t2);

        // Update trails (track second pendulum end)
        if (!isPaused && showTrails) {
          if (!trailsRef.current[i]) {
            trailsRef.current[i] = [];
          }
          // Store world coordinates (without panOffset) - same as single pendulum
          trailsRef.current[i].push({ 
            x: x2 - panOffset.x, 
            y: y2 - panOffset.y 
          });
          
          // Limit trail length
          if (trailsRef.current[i].length > 500) {
            trailsRef.current[i].shift();
          }
        }

        const hue = (i * 360 / numPendulums);
        
        // Draw first pendulum
        ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        
        // Draw second pendulum
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw joints
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y2, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw pivot
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, isPaused, separation, zoom, panOffset, showTrails, showInfo, length1, length2, initialAngle1, initialAngle2]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (isRunning) return;
    
    e.preventDefault();
    const zoomSpeed = 0.1;
    const newZoom = e.deltaY > 0 ? zoom - zoomSpeed : zoom + zoomSpeed;
    setZoom(Math.max(0.5, Math.min(3, newZoom)));
  };

  const handleStart = () => {
    const theta1 = [];
    const theta2 = [];
    const omega1 = [];
    const omega2 = [];
    
    for (let i = 0; i < numPendulums; i++) {
      theta1.push((initialAngle1 * Math.PI) / 180);
      theta2.push((initialAngle2 + i * separation) * Math.PI / 180);
      omega1.push(0);
      omega2.push(0);
    }
    
    animationStateRef.current = { theta1, theta2, omega1, omega2 };
    trailsRef.current = [];
    
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    trailsRef.current = [];
    angleHistoryRef.current = []; // Clear angle history
    simulationTimeRef.current = 0; // Reset simulation time
    
    const theta1 = [];
    const theta2 = [];
    const omega1 = [];
    const omega2 = [];
    
    for (let i = 0; i < numPendulums; i++) {
      theta1.push((initialAngle1 * Math.PI) / 180);
      theta2.push((initialAngle2 + i * separation) * Math.PI / 180);
      omega1.push(0);
      omega2.push(0);
    }
    
    animationStateRef.current = { theta1, theta2, omega1, omega2 };
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Top Bar with Pagination */}
      <div className="absolute top-4 left-4 z-20">
        {!isSidebarOpen && (
          <Pagination
            previous={{
              title: "Double Pendulum",
              href: "/projects/fractals/pendulums"
            }}
          />
        )}
      </div>
      
      {/* Right side pagination - always visible */}
      <div className="absolute top-4 right-4 z-20">
        <Pagination
          next={{
            title: "Back to Fractals",
            href: "/projects/fractals"
          }}
        />
      </div>

      {/* Pull Tab on Left Side */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isSidebarOpen ? 'left-80' : 'left-0'} z-30 transition-all duration-300`}>
        <MagneticButton>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-r-lg transition-colors duration-200 shadow-lg"
          >
            <div className="flex items-center">
              {isSidebarOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>
        </MagneticButton>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-gray-800 border-r border-gray-700 transition-all duration-300 overflow-hidden flex flex-col`}>
          <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center">
            <div className="w-full">
              {/* Length 1 Slider */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Length 1: {length1.toFixed(1)}
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={length1}
                    onChange={(e) => setLength1(parseFloat(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>

              {/* Length 2 Slider */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Length 2: {length2.toFixed(1)}
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={length2}
                    onChange={(e) => setLength2(parseFloat(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>

              {/* Initial Angle 1 Slider */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Initial Angle 1: {initialAngle1}°
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="1"
                    value={initialAngle1}
                    onChange={(e) => setInitialAngle1(parseInt(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>

              {/* Initial Angle 2 Slider */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Initial Angle 2: {initialAngle2}°
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="1"
                    value={initialAngle2}
                    onChange={(e) => setInitialAngle2(parseInt(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>

              {/* Separation Slider */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Separation: {separation.toFixed(1)}°
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="0.01"
                    max="1.0"
                    step="0.01"
                    value={separation}
                    onChange={(e) => setSeparation(parseFloat(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>

              <div className="h-12"></div>

              {/* Trail Toggle */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <div className="flex items-center justify-center space-x-3">
                  <input
                    type="checkbox"
                    id="trails"
                    checked={showTrails}
                    onChange={(e) => setShowTrails(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="trails" className="text-sm font-medium text-gray-200">
                    Show Trails
                  </label>
                </div>
              </div>

              {/* More Info Toggle */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <div className="flex items-center justify-center space-x-3">
                  <input
                    type="checkbox"
                    id="info"
                    checked={showInfo}
                    onChange={(e) => setShowInfo(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="info" className="text-sm font-medium text-gray-200">
                    More Info
                  </label>
                </div>
              </div>

              {/* Spacer before buttons */}
              <div className="h-12"></div>

              {/* Control Buttons */}
              <div className="pb-6 space-y-3 flex flex-col items-center">
                {!isRunning ? (
                  <MagneticButton>
                    <button
                      onClick={handleStart}
                      className="w-32 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Start
                    </button>
                  </MagneticButton>
                ) : (
                  <>
                    {isPaused ? (
                      <MagneticButton>
                        <button
                          onClick={() => setIsPaused(false)}
                          className="w-32 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          Resume
                        </button>
                      </MagneticButton>
                    ) : (
                      <MagneticButton>
                        <button
                          onClick={() => setIsPaused(true)}
                          className="w-32 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          Pause
                        </button>
                      </MagneticButton>
                    )}
                  </>
                )}
                
                <MagneticButton>
                  <button
                    onClick={handleReset}
                    className="w-32 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Reset
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Area */}
        <div className="flex-1 bg-white relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={1600}
            height={1200}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move"
            style={{ imageRendering: 'crisp-edges' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
          
          {/* Angle Graph */}
          {showInfo && (
            <div className="absolute bottom-4 right-4 w-80 h-48 bg-white bg-opacity-80 rounded-lg shadow-lg border border-gray-300">
              <canvas
                ref={(canvas) => {
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      const drawGraph = () => {
                        // Set canvas size
                        canvas.width = 320;
                        canvas.height = 192;
                        
                        // Clear canvas
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        
                        // Calculate Y-axis range based on visible data only
                        let minY = -50;
                        let maxY = 50;
                        
                        if (angleHistoryRef.current.length > 0) {
                          const angles: number[] = [];
                          angleHistoryRef.current.forEach(point => {
                            angles.push(...point.theta2);
                          });
                          
                          if (angles.length > 0) {
                            const minAngle = Math.min(...angles);
                            const maxAngle = Math.max(...angles);
                            const range = maxAngle - minAngle;
                            const padding = range * 0.1; // 10% padding
                            
                            minY = minAngle - padding;
                            maxY = maxAngle + padding;
                            
                            // Ensure minimum range of 20 degrees
                            if (maxY - minY < 20) {
                              const center = (minY + maxY) / 2;
                              minY = center - 10;
                              maxY = center + 10;
                            }
                          }
                        }
                        
                        // Draw grid
                        ctx.strokeStyle = '#e0e0e0';
                        ctx.lineWidth = 0.5;
                        
                        // Horizontal grid lines
                        for (let i = 0; i <= 5; i++) {
                          const y = (canvas.height - 40) * i / 5 + 20;
                          ctx.beginPath();
                          ctx.moveTo(40, y);
                          ctx.lineTo(canvas.width - 20, y);
                          ctx.stroke();
                        }
                        
                        // Vertical grid lines
                        for (let i = 0; i <= 10; i++) {
                          const x = (canvas.width - 60) * i / 10 + 40;
                          ctx.beginPath();
                          ctx.moveTo(x, 20);
                          ctx.lineTo(x, canvas.height - 20);
                          ctx.stroke();
                        }
                        
                        // Draw axes
                        ctx.strokeStyle = '#666666';
                        ctx.lineWidth = 1;
                        
                        // X-axis (time)
                        const zeroY = canvas.height - 20 - (canvas.height - 40) * (maxY / (maxY - minY));
                        ctx.beginPath();
                        ctx.moveTo(40, zeroY);
                        ctx.lineTo(canvas.width - 20, zeroY);
                        ctx.stroke();
                        
                        // Y-axis (angle)
                        ctx.beginPath();
                        ctx.moveTo(40, 20);
                        ctx.lineTo(40, canvas.height - 20);
                        ctx.stroke();
                        
                        // Draw data lines for each pendulum
                        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']; // Red to blue
                        
                        for (let pendulumIndex = 0; pendulumIndex < numPendulums; pendulumIndex++) {
                          ctx.strokeStyle = colors[pendulumIndex];
                          ctx.lineWidth = 2;
                          ctx.beginPath();
                          
                          let firstPoint = true;
                          angleHistoryRef.current.forEach(point => {
                            const angle = point.theta2[pendulumIndex];
                            if (angle !== undefined) {
                              const x = ((point.time - (simulationTimeRef.current - 10)) / 10) * (canvas.width - 60) + 40;
                              const y = canvas.height - 20 - (canvas.height - 40) * (1 - (angle - minY) / (maxY - minY));
                              
                              if (firstPoint) {
                                ctx.moveTo(x, y);
                                firstPoint = false;
                              } else {
                                ctx.lineTo(x, y);
                              }
                            }
                          });
                          
                          ctx.stroke();
                        }
                        
                        // Draw axis labels
                        ctx.fillStyle = '#374151';
                        ctx.font = '10px sans-serif';
                        
                        // Y-axis labels
                        ctx.textAlign = 'right';
                        for (let i = 0; i <= 5; i++) {
                          const value = minY + (maxY - minY) * (1 - i / 5);
                          const y = (canvas.height - 40) * i / 5 + 20;
                          ctx.fillText(value.toFixed(0) + '°', 35, y + 3);
                        }
                        
                        // X-axis labels
                        ctx.textAlign = 'center';
                        for (let i = 0; i <= 10; i++) {
                          const value = (simulationTimeRef.current - 10) + (10 * i / 10);
                          const x = (canvas.width - 60) * i / 10 + 40;
                          ctx.fillText(value.toFixed(0) + 's', x, canvas.height - 5);
                        }
                        
                        // Draw legend
                        ctx.textAlign = 'left';
                        for (let i = 0; i < numPendulums; i++) {
                          ctx.fillStyle = colors[i];
                          ctx.fillRect(50 + (i * 50), 5, 8, 8);
                          ctx.fillStyle = '#374151';
                          ctx.fillText(`P${i + 1}`, 62 + (i * 50), 12);
                        }
                      };
                      
                      // Update graph continuously when showInfo is enabled
                      const updateGraph = () => {
                        drawGraph();
                        requestAnimationFrame(updateGraph);
                      };
                      
                      updateGraph();
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

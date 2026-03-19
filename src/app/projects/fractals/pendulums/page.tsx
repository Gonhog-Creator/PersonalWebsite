'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/magnetic-button';

export default function PendulumsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [length1, setLength1] = useState(1.0);
  const [length2, setLength2] = useState(1.0);
  const [angle1, setAngle1] = useState(90);
  const [angle2, setAngle2] = useState(90);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: -100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const animationRef = useRef<number>();
  const trailRef = useRef<{x: number, y: number}[]>([]);
  
  // Animation state refs to persist during pause/resume
  const animationStateRef = useRef({
    a1: 0,
    a2: 0,
    a1_v: 0,
    a2_v: 0
  });

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
  }, [isRunning, isPaused, length1, length2, angle1, angle2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2 + panOffset.x;
    const centerY = canvas.height / 2 + panOffset.y;
    const scale = 100 * zoom;

    // Convert angles to radians
    let a1 = (angle1 * Math.PI) / 180;
    let a2 = (angle2 * Math.PI) / 180;
    let a1_v = 0;
    let a2_v = 0;
    const g = 9.81;

    const drawStaticPendulum = () => {
      // Clear canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save the current context state
      ctx.save();
      
      // Translate to the center point (pendulum pivot)
      ctx.translate(centerX, centerY);
      
      // Draw Desmos-style grid with dynamic scaling
      const baseGridSize = 20;
      
      // Calculate appropriate grid density based on zoom
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
      
      // Apply zoom to grid sizes
      fineGridSize *= zoom;
      majorGridSize *= zoom;
      
      // Calculate grid bounds in world coordinates
      const worldLeft = -centerX;
      const worldRight = canvas.width - centerX;
      const worldTop = -centerY;
      const worldBottom = canvas.height - centerY;
      
      // Draw fine grid lines (lighter)
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      
      // Vertical fine grid lines
      for (let x = Math.floor(worldLeft / fineGridSize) * fineGridSize; x <= worldRight; x += fineGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, worldTop);
        ctx.lineTo(x, worldBottom);
        ctx.stroke();
      }
      
      // Horizontal fine grid lines
      for (let y = Math.floor(worldTop / fineGridSize) * fineGridSize; y <= worldBottom; y += fineGridSize) {
        ctx.beginPath();
        ctx.moveTo(worldLeft, y);
        ctx.lineTo(worldRight, y);
        ctx.stroke();
      }
      
      // Draw major grid lines (darker)
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      // Vertical major grid lines
      for (let x = Math.floor(worldLeft / majorGridSize) * majorGridSize; x <= worldRight; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, worldTop);
        ctx.lineTo(x, worldBottom);
        ctx.stroke();
      }
      
      // Horizontal major grid lines
      for (let y = Math.floor(worldTop / majorGridSize) * majorGridSize; y <= worldBottom; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(worldLeft, y);
        ctx.lineTo(worldRight, y);
        ctx.stroke();
      }
      
      // Draw axes (at origin 0,0)
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1.5;
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(worldLeft, 0);
      ctx.lineTo(worldRight, 0);
      ctx.stroke();
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(0, worldTop);
      ctx.lineTo(0, worldBottom);
      ctx.stroke();
      
      // Restore the context state (back to original coordinate system)
      ctx.restore();

      // Calculate positions in the original coordinate system
      const x1 = centerX + length1 * scale * Math.sin(a1);
      const y1 = centerY + length1 * scale * Math.cos(a1);
      const x2 = x1 + length2 * scale * Math.sin(a2);
      const y2 = y1 + length2 * scale * Math.cos(a2);

      // Draw pendulum in screen coordinates
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw masses
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x1, y1, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(x2, y2, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw pivot
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    // Initial draw
    drawStaticPendulum();

    // Redraw when parameters change
    if (!isRunning) {
      drawStaticPendulum();
    }

    const animate = () => {
      // Get current animation state from refs
      let { a1, a2, a1_v, a2_v } = animationStateRef.current;
      
      // Standard double pendulum with gravity (from Wikipedia)
      const m1 = 1.0;
      const m2 = 1.0;
      const g = 9.81;
      
      // Calculate the derivatives using the standard equations
      const delta = a2 - a1;
      const den1 = (m1 + m2) * length1 - m2 * length1 * Math.cos(delta) * Math.cos(delta);
      const den2 = (length2 / length1) * den1;
      
      // Prevent division by zero
      const safeDen1 = Math.abs(den1) < 1e-10 ? 1e-10 : den1;
      const safeDen2 = Math.abs(den2) < 1e-10 ? 1e-10 : den2;
      
      // Calculate angular accelerations (standard form)
      const num1 = -m2 * length1 * a1_v * a1_v * Math.sin(delta) * Math.cos(delta)
                  + m2 * g * Math.sin(a2) * Math.cos(delta)
                  + m2 * length2 * a2_v * a2_v * Math.sin(delta)
                  - (m1 + m2) * g * Math.sin(a1);
      
      const num2 = -m2 * length2 * a2_v * a2_v * Math.sin(delta) * Math.cos(delta)
                  + (m1 + m2) * g * Math.sin(a1) * Math.cos(delta)
                  - (m1 + m2) * length1 * a1_v * a1_v * Math.sin(delta)
                  - (m1 + m2) * g * Math.sin(a2);
      
      const a1_a = num1 / safeDen1;
      const a2_a = num2 / safeDen2;
      
      // 4th order Runge-Kutta integration for maximum precision
      const dt = 0.01;
      
      // RK4 implementation
      const k1_a1 = a1_a;
      const k1_a2 = a2_a;
      const k1_v1 = a1_v;
      const k1_v2 = a2_v;
      
      // Calculate k2
      const a1_temp1 = a1 + k1_v1 * dt/2;
      const a2_temp1 = a2 + k1_v2 * dt/2;
      const a1_v_temp1 = a1_v + k1_a1 * dt/2;
      const a2_v_temp1 = a2_v + k1_a2 * dt/2;
      
      const delta_temp1 = a2_temp1 - a1_temp1;
      const den1_temp1 = (m1 + m2) * length1 - m2 * length1 * Math.cos(delta_temp1) * Math.cos(delta_temp1);
      const den2_temp1 = (length2 / length1) * den1_temp1;
      const safeDen1_temp1 = Math.abs(den1_temp1) < 1e-10 ? 1e-10 : den1_temp1;
      const safeDen2_temp1 = Math.abs(den2_temp1) < 1e-10 ? 1e-10 : den2_temp1;
      
      const num1_temp1 = -m2 * length1 * a1_v_temp1 * a1_v_temp1 * Math.sin(delta_temp1) * Math.cos(delta_temp1)
                       + m2 * g * Math.sin(a2_temp1) * Math.cos(delta_temp1)
                       + m2 * length2 * a2_v_temp1 * a2_v_temp1 * Math.sin(delta_temp1)
                       - (m1 + m2) * g * Math.sin(a1_temp1);
      
      const num2_temp1 = -m2 * length2 * a2_v_temp1 * a2_v_temp1 * Math.sin(delta_temp1) * Math.cos(delta_temp1)
                       + (m1 + m2) * g * Math.sin(a1_temp1) * Math.cos(delta_temp1)
                       - (m1 + m2) * length1 * a1_v_temp1 * a1_v_temp1 * Math.sin(delta_temp1)
                       - (m1 + m2) * g * Math.sin(a2_temp1);
      
      const k2_a1 = num1_temp1 / safeDen1_temp1;
      const k2_a2 = num2_temp1 / safeDen2_temp1;
      const k2_v1 = a1_v_temp1;
      const k2_v2 = a2_v_temp1;
      
      // Calculate k3
      const a1_temp2 = a1 + k2_v1 * dt/2;
      const a2_temp2 = a2 + k2_v2 * dt/2;
      const a1_v_temp2 = a1_v + k2_a1 * dt/2;
      const a2_v_temp2 = a2_v + k2_a2 * dt/2;
      
      const delta_temp2 = a2_temp2 - a1_temp2;
      const den1_temp2 = (m1 + m2) * length1 - m2 * length1 * Math.cos(delta_temp2) * Math.cos(delta_temp2);
      const den2_temp2 = (length2 / length1) * den1_temp2;
      const safeDen1_temp2 = Math.abs(den1_temp2) < 1e-10 ? 1e-10 : den1_temp2;
      const safeDen2_temp2 = Math.abs(den2_temp2) < 1e-10 ? 1e-10 : den2_temp2;
      
      const num1_temp2 = -m2 * length1 * a1_v_temp2 * a1_v_temp2 * Math.sin(delta_temp2) * Math.cos(delta_temp2)
                       + m2 * g * Math.sin(a2_temp2) * Math.cos(delta_temp2)
                       + m2 * length2 * a2_v_temp2 * a2_v_temp2 * Math.sin(delta_temp2)
                       - (m1 + m2) * g * Math.sin(a1_temp2);
      
      const num2_temp2 = -m2 * length2 * a2_v_temp2 * a2_v_temp2 * Math.sin(delta_temp2) * Math.cos(delta_temp2)
                       + (m1 + m2) * g * Math.sin(a1_temp2) * Math.cos(delta_temp2)
                       - (m1 + m2) * length1 * a1_v_temp2 * a1_v_temp2 * Math.sin(delta_temp2)
                       - (m1 + m2) * g * Math.sin(a2_temp2);
      
      const k3_a1 = num1_temp2 / safeDen1_temp2;
      const k3_a2 = num2_temp2 / safeDen2_temp2;
      const k3_v1 = a1_v_temp2;
      const k3_v2 = a2_v_temp2;
      
      // Calculate k4
      const a1_temp3 = a1 + k3_v1 * dt;
      const a2_temp3 = a2 + k3_v2 * dt;
      const a1_v_temp3 = a1_v + k3_a1 * dt;
      const a2_v_temp3 = a2_v + k3_a2 * dt;
      
      const delta_temp3 = a2_temp3 - a1_temp3;
      const den1_temp3 = (m1 + m2) * length1 - m2 * length1 * Math.cos(delta_temp3) * Math.cos(delta_temp3);
      const den2_temp3 = (length2 / length1) * den1_temp3;
      const safeDen1_temp3 = Math.abs(den1_temp3) < 1e-10 ? 1e-10 : den1_temp3;
      const safeDen2_temp3 = Math.abs(den2_temp3) < 1e-10 ? 1e-10 : den2_temp3;
      
      const num1_temp3 = -m2 * length1 * a1_v_temp3 * a1_v_temp3 * Math.sin(delta_temp3) * Math.cos(delta_temp3)
                       + m2 * g * Math.sin(a2_temp3) * Math.cos(delta_temp3)
                       + m2 * length2 * a2_v_temp3 * a2_v_temp3 * Math.sin(delta_temp3)
                       - (m1 + m2) * g * Math.sin(a1_temp3);
      
      const num2_temp3 = -m2 * length2 * a2_v_temp3 * a2_v_temp3 * Math.sin(delta_temp3) * Math.cos(delta_temp3)
                       + (m1 + m2) * g * Math.sin(a1_temp3) * Math.cos(delta_temp3)
                       - (m1 + m2) * length1 * a1_v_temp3 * a1_v_temp3 * Math.sin(delta_temp3)
                       - (m1 + m2) * g * Math.sin(a2_temp3);
      
      const k4_a1 = num1_temp3 / safeDen1_temp3;
      const k4_a2 = num2_temp3 / safeDen2_temp3;
      const k4_v1 = a1_v_temp3;
      const k4_v2 = a2_v_temp3;
      
      // Update using RK4 formula
      a1 += (k1_v1 + 2*k2_v1 + 2*k3_v1 + k4_v1) * dt / 6;
      a2 += (k1_v2 + 2*k2_v2 + 2*k3_v2 + k4_v2) * dt / 6;
      a1_v += (k1_a1 + 2*k2_a1 + 2*k3_a1 + k4_a1) * dt / 6;
      a2_v += (k1_a2 + 2*k2_a2 + 2*k3_a2 + k4_a2) * dt / 6;
      
      // Calculate positions for drawing
      const x1 = centerX + length1 * scale * Math.sin(a1);
      const y1 = centerY + length1 * scale * Math.cos(a1);
      const x2 = x1 + length2 * scale * Math.sin(a2);
      const y2 = y1 + length2 * scale * Math.cos(a2);
      
      // Save updated state back to refs
      animationStateRef.current = { a1, a2, a1_v, a2_v };

      // Clear canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save the current context state
      ctx.save();
      
      // Translate to the center point (pendulum pivot)
      ctx.translate(centerX, centerY);
      
      // Draw Desmos-style grid with dynamic scaling
      const baseGridSize = 20;
      
      // Calculate appropriate grid density based on zoom
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
      
      // Apply zoom to grid sizes
      fineGridSize *= zoom;
      majorGridSize *= zoom;
      
      // Calculate grid bounds in world coordinates
      const worldLeft = -centerX;
      const worldRight = canvas.width - centerX;
      const worldTop = -centerY;
      const worldBottom = canvas.height - centerY;
      
      // Draw fine grid lines (lighter)
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      
      // Vertical fine grid lines
      for (let x = Math.floor(worldLeft / fineGridSize) * fineGridSize; x <= worldRight; x += fineGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, worldTop);
        ctx.lineTo(x, worldBottom);
        ctx.stroke();
      }
      
      // Horizontal fine grid lines
      for (let y = Math.floor(worldTop / fineGridSize) * fineGridSize; y <= worldBottom; y += fineGridSize) {
        ctx.beginPath();
        ctx.moveTo(worldLeft, y);
        ctx.lineTo(worldRight, y);
        ctx.stroke();
      }
      
      // Draw major grid lines (darker)
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      // Vertical major grid lines
      for (let x = Math.floor(worldLeft / majorGridSize) * majorGridSize; x <= worldRight; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, worldTop);
        ctx.lineTo(x, worldBottom);
        ctx.stroke();
      }
      
      // Horizontal major grid lines
      for (let y = Math.floor(worldTop / majorGridSize) * majorGridSize; y <= worldBottom; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(worldLeft, y);
        ctx.lineTo(worldRight, y);
        ctx.stroke();
      }
      
      // Draw axes (at origin 0,0)
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1.5;
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(worldLeft, 0);
      ctx.lineTo(worldRight, 0);
      ctx.stroke();
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(0, worldTop);
      ctx.lineTo(0, worldBottom);
      ctx.stroke();
      
      // Restore the context state (back to original coordinate system)
      ctx.restore();

      // Add to trail
      trailRef.current.push({x: x2, y: y2});
      
      if (trailRef.current.length > 500) {
        trailRef.current.shift();
      }

      // Draw trail
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      trailRef.current.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      // Draw pendulum
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw masses
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x1, y1, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(x2, y2, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw pivot
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isRunning && !isPaused) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, isPaused, length1, length2, angle1, angle2, zoom, panOffset]);

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
    // Disable zooming while pendulum is running
    if (isRunning) return;
    
    e.preventDefault();
    const zoomSpeed = 0.1;
    const newZoom = e.deltaY > 0 ? zoom - zoomSpeed : zoom + zoomSpeed;
    setZoom(Math.max(0.5, Math.min(3, newZoom)));
  };

  const handleStart = () => {
    // Initialize animation state with current angles
    const a1_rad = (angle1 * Math.PI) / 180;
    const a2_rad = (angle2 * Math.PI) / 180;
    
    animationStateRef.current = {
      a1: a1_rad,
      a2: a2_rad,
      a1_v: 0,
      a2_v: 0
    };
    
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    trailRef.current = [];
    
    // Reset animation state
    const a1_rad = (angle1 * Math.PI) / 180;
    const a2_rad = (angle2 * Math.PI) / 180;
    
    animationStateRef.current = {
      a1: a1_rad,
      a2: a2_rad,
      a1_v: 0,
      a2_v: 0
    };
    
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
      {/* Top Bar with Back Button */}
      <div className="absolute top-4 left-4 z-20">
        {/* Back to Fractals Button - Hidden when sidebar is open */}
        {!isSidebarOpen && (
          <Link 
            href="/projects/fractals"
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200 text-lg font-medium"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Fractals</span>
          </Link>
        )}
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
              {/* Length 1 */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Pendulum 1 Length: {length1.toFixed(2)} m
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={length1}
                    onChange={(e) => setLength1(parseFloat(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>

              <div className="h-8"></div>

              {/* Length 2 */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Pendulum 2 Length: {length2.toFixed(2)} m
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={length2}
                    onChange={(e) => setLength2(parseFloat(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>

              <div className="h-8"></div>

              {/* Angle 1 */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Pendulum 1 Angle: {angle1.toFixed(0)}°
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={angle1}
                    onChange={(e) => setAngle1(parseFloat(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>

              <div className="h-8"></div>

              {/* Angle 2 */}
              <div className="px-6 py-4 flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                  Pendulum 2 Angle: {angle2.toFixed(0)}°
                </label>
                <div className="flex justify-center">
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={angle2}
                    onChange={(e) => setAngle2(parseFloat(e.target.value))}
                    className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons - Fixed at bottom with 5% buffer */}
          <div className="pb-[5vh] px-6 space-y-3 flex flex-col items-center">
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

        {/* Main Grid Area */}
        <div className="flex-1 bg-white relative">
          <canvas
            ref={canvasRef}
            width={1600}
            height={1200}
            className="w-full h-full cursor-move"
            style={{ imageRendering: 'crisp-edges' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
          
          {/* Overlay Info */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Settings</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>L₁: {length1.toFixed(2)} m</p>
              <p>L₂: {length2.toFixed(2)} m</p>
              <p>θ₁: {angle1.toFixed(0)}°</p>
              <p>θ₂: {angle2.toFixed(0)}°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

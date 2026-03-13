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
    const centerY = 200 + panOffset.y;
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

      // Draw Desmos-style grid
      const gridSize = 20 * zoom;
      const majorGridSize = 100 * zoom;
      
      // Calculate grid offset based on pan
      const offsetX = panOffset.x % gridSize;
      const offsetY = panOffset.y % gridSize;
      
      // Draw fine grid lines (lighter)
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      
      for (let x = offsetX; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = offsetY; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw major grid lines (darker)
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      const majorOffsetX = panOffset.x % majorGridSize;
      const majorOffsetY = panOffset.y % majorGridSize;
      
      for (let x = majorOffsetX; x <= canvas.width; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = majorOffsetY; y <= canvas.height; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw axes if they intersect the visible area
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1.5;
      
      // X-axis (if centerY is within canvas bounds)
      if (centerY >= 0 && centerY <= canvas.height) {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
      }
      
      // Y-axis (if centerX is within canvas bounds)
      if (centerX >= 0 && centerX <= canvas.width) {
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
      }

      // Calculate positions
      const x1 = centerX + length1 * scale * Math.sin(a1);
      const y1 = centerY + length1 * scale * Math.cos(a1);
      const x2 = x1 + length2 * scale * Math.sin(a2);
      const y2 = y1 + length2 * scale * Math.cos(a2);

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
    };

    // Initial draw
    drawStaticPendulum();

    // Redraw when parameters change
    if (!isRunning) {
      drawStaticPendulum();
    }

    const animate = () => {
      // Double pendulum equations
      const num1 = -g * (2 * 1 + 1) * Math.sin(a1);
      const num2 = -1 * g * Math.sin(a1 - 2 * a2);
      const num3 = -2 * Math.sin(a1 - a2) * 1;
      const num4 = a2_v * a2_v * length2 + a1_v * a1_v * length1 * Math.cos(a1 - a2);
      const den = length1 * (2 * 1 + 1 - 1 * Math.cos(2 * a1 - 2 * a2));
      const a1_a = (num1 + num2 + num3 * num4) / den;

      const num5 = 2 * Math.sin(a1 - a2);
      const num6 = a1_v * a1_v * length1 * (1 + 1);
      const num7 = g * (1 + 1) * Math.cos(a1);
      const num8 = a2_v * a2_v * length2 * 1 * Math.cos(a1 - a2);
      const den2 = length2 * (2 * 1 + 1 - 1 * Math.cos(2 * a1 - 2 * a2));
      const a2_a = (num5 * (num6 + num7 + num8)) / den2;

      // Update velocities and angles
      a1_v += a1_a * 0.02;
      a2_v += a2_a * 0.02;
      a1 += a1_v * 0.02;
      a2 += a2_v * 0.02;

      // Calculate positions
      const x1 = centerX + length1 * scale * Math.sin(a1);
      const y1 = centerY + length1 * scale * Math.cos(a1);
      const x2 = x1 + length2 * scale * Math.sin(a2);
      const y2 = y1 + length2 * scale * Math.cos(a2);

      // Clear canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Desmos-style grid
      const gridSize = 20; // Fine grid lines
      const majorGridSize = 100; // Major grid lines
      
      // Draw fine grid lines (lighter)
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw major grid lines (darker)
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      for (let x = 0; x <= canvas.width; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw axes if they intersect the visible area
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1.5;
      
      // X-axis (if centerY is within canvas bounds)
      if (centerY >= 0 && centerY <= canvas.height) {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
      }
      
      // Y-axis (if centerX is within canvas bounds)
      if (centerX >= 0 && centerX <= canvas.width) {
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
      }

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
    e.preventDefault();
    const zoomSpeed = 0.1;
    const newZoom = e.deltaY > 0 ? zoom - zoomSpeed : zoom + zoomSpeed;
    setZoom(Math.max(0.5, Math.min(3, newZoom)));
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    trailRef.current = [];
    
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

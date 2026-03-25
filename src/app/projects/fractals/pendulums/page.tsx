'use client';

// TODO: make ability to decode first or second
//pendulum path (traced by angle and time) into constituent
//frequencies using fourier transform and make the
//"noise" of that specific pendulum setup

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Pagination } from '@/components/ui/pagination';

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
  const [trail, setTrail] = useState(true);
  const [trail1, setTrail1] = useState(false); // Off by default
  const [trail2, setTrail2] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const animationRef = useRef<number>();
  const trailRef = useRef<{x: number, y: number}[]>([]);
  const trail1Ref = useRef<{x: number, y: number}[]>([]);
  const trail2Ref = useRef<{x: number, y: number}[]>([]);
  const angleHistoryRef = useRef<{time: number, theta1: number, theta2: number}[]>([]);
  const simulationTimeRef = useRef(0); // Track simulation time separately
  
  // Animation state refs to persist during pause/resume
  const animationStateRef = useRef({
    theta1: 0,
    theta2: 0,
    omega1: 0,
    omega2: 0
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
    let theta1 = (angle1 * Math.PI) / 180;
    let theta2 = (angle2 * Math.PI) / 180;
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

      // Calculate positions using standard coordinate system
      // First pendulum position (from origin)
      const x1 = centerX + length1 * scale * Math.sin(theta1);
      const y1 = centerY + length1 * scale * Math.cos(theta1);
      
      // Second pendulum position (relative to first pendulum)
      const x2 = x1 + length2 * scale * Math.sin(theta2);
      const y2 = y1 + length2 * scale * Math.cos(theta2);

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
      let { theta1, theta2, omega1, omega2 } = animationStateRef.current;
      
      // Only update physics if not paused
      if (!isPaused) {
        
        // Constants from John Allard's implementation
        const g = 9.81; // gravity
        const m1 = 1.0; // mass 1
        const m2 = 1.0; // mass 2
        const L1 = length1; // length 1
        const L2 = length2; // length 2
        const dt = 0.02; // timestep for 2x speed
        
        // John Allard's double pendulum equations
        // Upper omega prime (angular acceleration for first pendulum)
        const upperOmegaPrime = () => {
          const numerator = -g * (2*m1 + m2) * Math.sin(theta1) - g * m2 * Math.sin(theta1 - 2*theta2);
          const term1 = -2 * Math.sin(theta1 - theta2) * m2;
          const term2 = L2 * omega2 * omega2 + L1 * omega1 * omega1 * Math.cos(theta1 - theta2);
          const fullNumerator = numerator + term1 * term2;
          const denominator = L1 * (2*m1 + m2 * (1 - Math.cos(2*(theta1 - theta2))));
          return fullNumerator / denominator;
        };
        
        // Lower omega prime (angular acceleration for second pendulum)
        const lowerOmegaPrime = () => {
          const numerator = 2 * Math.sin(theta1 - theta2);
          const term1 = L1 * omega1 * omega1 * (m1 + m2);
          const term2 = g * Math.cos(theta1) * (m1 + m2);
          const term3 = L2 * m2 * omega2 * omega2 * Math.cos(theta1 - theta2);
          const fullNumerator = numerator * (term1 + term2 + term3);
          const denominator = L2 * (2*m1 + m2 * (1 - Math.cos(2*(theta1 - theta2))));
          return fullNumerator / denominator;
        };
        
        // RK4 implementation
        const rk4 = () => {
          // k1
          const k1_theta1 = omega1;
          const k1_theta2 = omega2;
          const k1_omega1 = upperOmegaPrime();
          const k1_omega2 = lowerOmegaPrime();
          
          // k2
          const temp_theta1_2 = theta1 + k1_theta1 * dt/2;
          const temp_theta2_2 = theta2 + k1_theta2 * dt/2;
          const temp_omega1_2 = omega1 + k1_omega1 * dt/2;
          const temp_omega2_2 = omega2 + k1_omega2 * dt/2;
          
          // Calculate k2 omega values with temporary state
          const k2_omega1 = (() => {
            const numerator = -g * (2*m1 + m2) * Math.sin(temp_theta1_2) - g * m2 * Math.sin(temp_theta1_2 - 2*temp_theta2_2);
            const term1 = -2 * Math.sin(temp_theta1_2 - temp_theta2_2) * m2;
            const term2 = L2 * temp_omega2_2 * temp_omega2_2 + L1 * temp_omega1_2 * temp_omega1_2 * Math.cos(temp_theta1_2 - temp_theta2_2);
            const fullNumerator = numerator + term1 * term2;
            const denominator = L1 * (2*m1 + m2 * (1 - Math.cos(2*(temp_theta1_2 - temp_theta2_2))));
            return fullNumerator / denominator;
          })();
          
          const k2_omega2 = (() => {
            const numerator = 2 * Math.sin(temp_theta1_2 - temp_theta2_2);
            const term1 = L1 * temp_omega1_2 * temp_omega1_2 * (m1 + m2);
            const term2 = g * Math.cos(temp_theta1_2) * (m1 + m2);
            const term3 = L2 * m2 * temp_omega2_2 * temp_omega2_2 * Math.cos(temp_theta1_2 - temp_theta2_2);
            const fullNumerator = numerator * (term1 + term2 + term3);
            const denominator = L2 * (2*m1 + m2 * (1 - Math.cos(2*(temp_theta1_2 - temp_theta2_2))));
            return fullNumerator / denominator;
          })();
          
          const k2_theta1 = temp_omega1_2;
          const k2_theta2 = temp_omega2_2;
          
          // k3
          const temp_theta1_3 = theta1 + k2_theta1 * dt/2;
          const temp_theta2_3 = theta2 + k2_theta2 * dt/2;
          const temp_omega1_3 = omega1 + k2_omega1 * dt/2;
          const temp_omega2_3 = omega2 + k2_omega2 * dt/2;
          
          const k3_omega1 = (() => {
            const numerator = -g * (2*m1 + m2) * Math.sin(temp_theta1_3) - g * m2 * Math.sin(temp_theta1_3 - 2*temp_theta2_3);
            const term1 = -2 * Math.sin(temp_theta1_3 - temp_theta2_3) * m2;
            const term2 = L2 * temp_omega2_3 * temp_omega2_3 + L1 * temp_omega1_3 * temp_omega1_3 * Math.cos(temp_theta1_3 - temp_theta2_3);
            const fullNumerator = numerator + term1 * term2;
            const denominator = L1 * (2*m1 + m2 * (1 - Math.cos(2*(temp_theta1_3 - temp_theta2_3))));
            return fullNumerator / denominator;
          })();
          
          const k3_omega2 = (() => {
            const numerator = 2 * Math.sin(temp_theta1_3 - temp_theta2_3);
            const term1 = L1 * temp_omega1_3 * temp_omega1_3 * (m1 + m2);
            const term2 = g * Math.cos(temp_theta1_3) * (m1 + m2);
            const term3 = L2 * m2 * temp_omega2_3 * temp_omega2_3 * Math.cos(temp_theta1_3 - temp_theta2_3);
            const fullNumerator = numerator * (term1 + term2 + term3);
            const denominator = L2 * (2*m1 + m2 * (1 - Math.cos(2*(temp_theta1_3 - temp_theta2_3))));
            return fullNumerator / denominator;
          })();
          
          const k3_theta1 = temp_omega1_3;
          const k3_theta2 = temp_omega2_3;
          
          // k4
          const temp_theta1_4 = theta1 + k3_theta1 * dt;
          const temp_theta2_4 = theta2 + k3_theta2 * dt;
          const temp_omega1_4 = omega1 + k3_omega1 * dt;
          const temp_omega2_4 = omega2 + k3_omega2 * dt;
          
          const k4_omega1 = (() => {
            const numerator = -g * (2*m1 + m2) * Math.sin(temp_theta1_4) - g * m2 * Math.sin(temp_theta1_4 - 2*temp_theta2_4);
            const term1 = -2 * Math.sin(temp_theta1_4 - temp_theta2_4) * m2;
            const term2 = L2 * temp_omega2_4 * temp_omega2_4 + L1 * temp_omega1_4 * temp_omega1_4 * Math.cos(temp_theta1_4 - temp_theta2_4);
            const fullNumerator = numerator + term1 * term2;
            const denominator = L1 * (2*m1 + m2 * (1 - Math.cos(2*(temp_theta1_4 - temp_theta2_4))));
            return fullNumerator / denominator;
          })();
          
          const k4_omega2 = (() => {
            const numerator = 2 * Math.sin(temp_theta1_4 - temp_theta2_4);
            const term1 = L1 * temp_omega1_4 * temp_omega1_4 * (m1 + m2);
            const term2 = g * Math.cos(temp_theta1_4) * (m1 + m2);
            const term3 = L2 * m2 * temp_omega2_4 * temp_omega2_4 * Math.cos(temp_theta1_4 - temp_theta2_4);
            const fullNumerator = numerator * (term1 + term2 + term3);
            const denominator = L2 * (2*m1 + m2 * (1 - Math.cos(2*(temp_theta1_4 - temp_theta2_4))));
            return fullNumerator / denominator;
          })();
          
          const k4_theta1 = temp_omega1_4;
          const k4_theta2 = temp_omega2_4;
          
          // Update state using RK4 formula
          theta1 += (k1_theta1 + 2*k2_theta1 + 2*k3_theta1 + k4_theta1) * dt / 6;
          theta2 += (k1_theta2 + 2*k2_theta2 + 2*k3_theta2 + k4_theta2) * dt / 6;
          omega1 += (k1_omega1 + 2*k2_omega1 + 2*k3_omega1 + k4_omega1) * dt / 6;
          omega2 += (k1_omega2 + 2*k2_omega2 + 2*k3_omega2 + k4_omega2) * dt / 6;
        };
        
        // Update state using RK4
        rk4();
        
        // Save updated state back to refs
        animationStateRef.current = { theta1, theta2, omega1, omega2 };
      } // End of if (!isPaused)

      // Always draw the current state (even when paused)
      // Use standard coordinate system where 0° = down
      // First pendulum position (from origin)
      const x1 = centerX + length1 * scale * Math.sin(theta1);
      const y1 = centerY + length1 * scale * Math.cos(theta1);
      
      // Second pendulum position (relative to first pendulum)
      const x2 = x1 + length2 * scale * Math.sin(theta2);
      const y2 = y1 + length2 * scale * Math.cos(theta2);
      
      // Update trails only if not paused
      if (!isPaused) {
        // Update simulation time
        simulationTimeRef.current += 0.02; // Add timestep
        
        // Record angle history for graph (keep last 10 seconds)
        angleHistoryRef.current.push({
          time: simulationTimeRef.current,
          theta1: theta1 * 180 / Math.PI, // Convert to degrees
          theta2: theta2 * 180 / Math.PI
        });
        
        // Keep only last 10 seconds of data
        const tenSecondsAgo = simulationTimeRef.current - 10;
        angleHistoryRef.current = angleHistoryRef.current.filter(point => point.time > tenSecondsAgo);
        
        if (trail1) {
          // Store world coordinates (without panOffset)
          trail1Ref.current.push({ 
            x: centerX + length1 * scale * Math.sin(theta1) - panOffset.x, 
            y: centerY + length1 * scale * Math.cos(theta1) - panOffset.y 
          });
        }
        if (trail2) {
          // Store world coordinates (without panOffset)
          trail2Ref.current.push({ 
            x: centerX + length1 * scale * Math.sin(theta1) + length2 * scale * Math.sin(theta2) - panOffset.x, 
            y: centerY + length1 * scale * Math.cos(theta1) + length2 * scale * Math.cos(theta2) - panOffset.y 
          });
        }
      }

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

      // Draw trails
      if (trail1 && trail1Ref.current.length > 1) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'; // Blue for pendulum 1
        ctx.lineWidth = 2;
        ctx.beginPath();
        trail1Ref.current.forEach((point, index) => {
          // Apply current panOffset when drawing
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
      
      if (trail2 && trail2Ref.current.length > 1) {
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'; // Purple for pendulum 2
        ctx.lineWidth = 2;
        ctx.beginPath();
        trail2Ref.current.forEach((point, index) => {
          // Apply current panOffset when drawing
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

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, isPaused, length1, length2, angle1, angle2, zoom, panOffset, trail1, trail2]);

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
    const theta1_rad = (angle1 * Math.PI) / 180;
    const theta2_rad = (angle2 * Math.PI) / 180;
    
    animationStateRef.current = {
      theta1: theta1_rad,
      theta2: theta2_rad,
      omega1: 0,
      omega2: 0
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
    trail1Ref.current = [];
    trail2Ref.current = [];
    angleHistoryRef.current = []; // Clear angle history
    simulationTimeRef.current = 0; // Reset simulation time
    
    // Reset animation state
    const theta1_rad = (angle1 * Math.PI) / 180;
    const theta2_rad = (angle2 * Math.PI) / 180;
    
    animationStateRef.current = {
      theta1: theta1_rad,
      theta2: theta2_rad,
      omega1: 0,
      omega2: 0
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
      {/* Top Bar with Pagination */}
      <div className="absolute top-4 left-4 z-20">
        {!isSidebarOpen && (
          <Pagination
            previous={{
              title: "Back to Fractals",
              href: "/projects/fractals"
            }}
          />
        )}
      </div>
      
      {/* Right side pagination - always visible */}
      <div className="absolute top-4 right-4 z-20">
        <Pagination
          next={{
            title: "Multiple Pendulums",
            href: "/projects/fractals/pendulums/multiple"
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

              {/* Tracer Controls */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-200 text-center">Tracer Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-3">
                    <input
                      type="checkbox"
                      id="trail1"
                      checked={trail1}
                      onChange={(e) => setTrail1(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="trail1" className="text-sm font-medium text-gray-200">
                      Tracer 1 (Blue)
                    </label>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <input
                      type="checkbox"
                      id="trail2"
                      checked={trail2}
                      onChange={(e) => setTrail2(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="trail2" className="text-sm font-medium text-gray-200">
                      Tracer 2 (Purple)
                    </label>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <input
                      type="checkbox"
                      id="showInfo"
                      checked={showInfo}
                      onChange={(e) => setShowInfo(e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="showInfo" className="text-sm font-medium text-gray-200">
                      More Info
                    </label>
                  </div>
                </div>
              </div>

              {/* Spacer before buttons */}
              <div className="h-12"></div>

              {/* Control Buttons - Below controls with spacer */}
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

          {/* Removed bottom buttons since they're now below controls */}
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
                          // Only collect angles for enabled tracers
                          const angles: number[] = [];
                          if (trail1) {
                            angles.push(...angleHistoryRef.current.map(p => p.theta1));
                          }
                          if (trail2) {
                            angles.push(...angleHistoryRef.current.map(p => p.theta2));
                          }
                          
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
                        ctx.lineWidth = 1;
                        
                        // Horizontal grid lines
                        for (let i = 0; i <= 4; i++) {
                          const y = (i / 4) * canvas.height;
                          ctx.beginPath();
                          ctx.moveTo(0, y);
                          ctx.lineTo(canvas.width, y);
                          ctx.stroke();
                        }
                        
                        // Vertical grid lines
                        for (let i = 0; i <= 10; i++) {
                          const x = (i / 10) * canvas.width;
                          ctx.beginPath();
                          ctx.moveTo(x, 0);
                          ctx.lineTo(x, canvas.height);
                          ctx.stroke();
                        }
                        
                        // Draw axes
                        ctx.strokeStyle = '#666';
                        ctx.lineWidth = 2;
                        
                        // X-axis (0 degrees if in range, otherwise at bottom)
                        const zeroY = maxY >= 0 && minY <= 0 
                          ? canvas.height - ((0 - minY) / (maxY - minY)) * canvas.height
                          : canvas.height;
                        
                        ctx.beginPath();
                        ctx.moveTo(0, zeroY);
                        ctx.lineTo(canvas.width, zeroY);
                        ctx.stroke();
                        
                        // Draw angle data
                        const currentTime = simulationTimeRef.current;
                        const tenSecondsAgo = currentTime - 10;
                        
                        // Draw theta1 (blue) - only if trail1 is enabled
                        if (angleHistoryRef.current.length > 1 && trail1) {
                          ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
                          ctx.lineWidth = 2;
                          ctx.beginPath();
                          
                          angleHistoryRef.current.forEach((point, index) => {
                            const x = ((point.time - tenSecondsAgo) / 10) * canvas.width;
                            const y = canvas.height - ((point.theta1 - minY) / (maxY - minY)) * canvas.height;
                            
                            if (index === 0) {
                              ctx.moveTo(x, y);
                            } else {
                              ctx.lineTo(x, y);
                            }
                          });
                          ctx.stroke();
                        }
                        
                        // Draw theta2 (purple) - only if trail2 is enabled
                        if (angleHistoryRef.current.length > 1 && trail2) {
                          ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
                          ctx.lineWidth = 2;
                          ctx.beginPath();
                          
                          angleHistoryRef.current.forEach((point, index) => {
                            const x = ((point.time - tenSecondsAgo) / 10) * canvas.width;
                            const y = canvas.height - ((point.theta2 - minY) / (maxY - minY)) * canvas.height;
                            
                            if (index === 0) {
                              ctx.moveTo(x, y);
                            } else {
                              ctx.lineTo(x, y);
                            }
                          });
                          ctx.stroke();
                        }
                        
                        // Draw labels
                        ctx.fillStyle = '#333';
                        ctx.font = '10px sans-serif';
                        
                        // Y-axis labels (auto-scaled)
                        ctx.fillText(`${maxY.toFixed(0)}°`, 5, 15);
                        ctx.fillText(`${minY.toFixed(0)}°`, 5, canvas.height - 5);
                        
                        // X-axis labels
                        ctx.fillText('-10s', 5, canvas.height - 5);
                        ctx.fillText('0s', canvas.width - 20, canvas.height - 5);
                        
                        // Show 0° label if in range
                        if (maxY >= 0 && minY <= 0) {
                          ctx.fillText('0°', 5, zeroY - 5);
                        }
                        
                        // Legend - only show enabled tracers
                        if (trail1) {
                          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
                          ctx.fillText('θ₁', canvas.width - 40, 15);
                        }
                        if (trail2) {
                          ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
                          ctx.fillText('θ₂', trail1 ? canvas.width - 25 : canvas.width - 40, 15);
                        }
                      };
                      
                      // Initial draw
                      drawGraph();
                      
                      // Set up continuous updates
                      const interval = setInterval(() => {
                        if (showInfo) {
                          drawGraph();
                        } else {
                          clearInterval(interval);
                        }
                      }, 50); // Update every 50ms for smooth animation
                      
                      // Cleanup on unmount
                      return () => clearInterval(interval);
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

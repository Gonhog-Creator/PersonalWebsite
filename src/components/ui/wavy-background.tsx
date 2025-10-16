"use client";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  // _waveWidth is intentionally unused but kept for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  waveWidth: _waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const noise = useRef(createNoise3D());
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ntRef = useRef(0);
  const wRef = useRef(0);
  const hRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctxRef.current = ctx;
    wRef.current = canvas.width = window.innerWidth;
    hRef.current = canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    ntRef.current = 0;
    
    const handleResize = () => {
      if (!canvas || !ctx) return;
      wRef.current = canvas.width = window.innerWidth;
      hRef.current = canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [blur]);

  const waveColors = useMemo(() => colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ], [colors]);

  const getSpeed = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  }, [speed]);

  const drawWave = useCallback((n: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    ntRef.current += getSpeed();
    const currentWaveColors = waveColors; // Capture the current value
    
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = 12; // Thin line
      ctx.strokeStyle = currentWaveColors[i % currentWaveColors.length];
      
      // Position the wave at 1/4 of the container height
      const verticalPos = hRef.current * 0.25;
      
      // Draw wave with significantly increased amplitude
      for (let x = 0; x < wRef.current; x += 3) {
        const y = noise.current(x / 300, 0.1 * i, ntRef.current) * 80; // Increased amplitude to 80 and adjusted frequency
        ctx.lineTo(x, y + verticalPos);
      }
      
      ctx.stroke();
      ctx.closePath();
    }
  }, [getSpeed, waveColors]);

  const animationId = useRef<number | null>(null);
  
  const render = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, wRef.current, hRef.current);
    
    // Set background
    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, wRef.current, hRef.current);
    
    // Draw the waves
    drawWave(5);
    
    // Continue the animation loop
    animationId.current = requestAnimationFrame(render);
  }, [backgroundFill, waveOpacity, drawWave]);

  // Initialize and start the animation
  useEffect(() => {
    const cleanup = init();
    
    // Start the animation loop
    render();
    
    // Cleanup function
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [init, render]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

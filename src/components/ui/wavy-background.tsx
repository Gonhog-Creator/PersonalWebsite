"use client";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
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
  const noise = createNoise3D();
  let i: number,
    x: number,
    ctx: CanvasRenderingContext2D | null = null,
    canvas: HTMLCanvasElement | null = null;
  const ntRef = useRef(0);
  const wRef = useRef(0);
  const hRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx = canvas.getContext("2d");
    if (!ctx) return;
    
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
    render();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];
  const drawWave = useCallback((n: number) => {
    if (!ctx) return;
    
    ntRef.current += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = 12; // Thin line
      ctx.strokeStyle = waveColors[i % waveColors.length];
      
      // Position the wave at 1/4 of the container height
      const verticalPos = hRef.current * 0.25;
      
      // Draw wave with significantly increased amplitude
      for (x = 0; x < wRef.current; x += 3) {
        const y = noise(x / 300, 0.1 * i, ntRef.current) * 80; // Increased amplitude to 80 and adjusted frequency
        ctx.lineTo(x, y + verticalPos);
      }
      
      ctx.stroke();
      ctx.closePath();
    }
  }, [ctx, noise, waveColors]);

  const animationId = useRef<number | null>(null);
  
  const render = useCallback(() => {
    if (!ctx) return;
    
    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, wRef.current, hRef.current);
    drawWave(5);
    animationId.current = requestAnimationFrame(render);
  }, [ctx, backgroundFill, waveOpacity, drawWave]);

  useEffect(() => {
    // Initialize canvas and start animation
    const init = () => {
      if (!canvasRef.current) return;
      
      canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      
      ctx = context;
      wRef.current = ctx.canvas.width = window.innerWidth;
      hRef.current = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
      
      const handleResize = () => {
        if (!ctx) return;
        wRef.current = ctx.canvas.width = window.innerWidth;
        hRef.current = ctx.canvas.height = window.innerHeight;
        ctx.filter = `blur(${blur}px)`;
      };
      
      window.addEventListener('resize', handleResize);
      render();
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };
    
    init();
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [blur, render]);

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

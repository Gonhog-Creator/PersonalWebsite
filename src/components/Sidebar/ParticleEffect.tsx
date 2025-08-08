'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ParticleEffectProps {
  isHovered: boolean;
  isWhiteBg: boolean;
}

type Particle = {
  element: HTMLDivElement;
  delay: number;
  duration: number;
  startTime: number | null;
  animationId: number | null;
};

export function ParticleEffect({ isHovered, isWhiteBg }: ParticleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isMounted = useRef(true);
  const animationFrameRef = useRef<number>();

  // Clean up all animations
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    particlesRef.current = [];
  }, []);

  // Initialize particles
  useEffect(() => {
    isMounted.current = true;
    
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particleCount = 15; // Slightly reduced number of particles
    const particles: Particle[] = [];
    
    // Clear existing particles
    cleanup();
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 1.5 + 0.8; // Smaller particles
      const posY = 5 + (Math.random() * 90); // Full vertical coverage
      const duration = Math.random() * 0.8 + 0.5; // Faster animation (0.5-1.3s)
      const delay = Math.random() * 0.5; // Shorter delay (0-0.5s)
      
      // Softer particles
      const particleColor = isWhiteBg 
        ? 'rgba(24, 26, 27, 0.7)' 
        : 'rgba(255, 255, 255, 0.8)';
      const particleShadow = isWhiteBg 
        ? '0 0 3px rgba(31, 41, 55, 0.8)' 
        : '0 0 4px rgba(255, 255, 255, 0.7)';
      
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${particleColor};
        border-radius: 50%;
        left: -20px;
        top: ${posY}%;
        opacity: 0;
        pointer-events: none;
        box-shadow: ${particleShadow};
        will-change: transform, opacity;
        transform: translateX(0);
        transition: opacity 0.1s ease-out, transform 0.1s linear;
      `;
      
      container.appendChild(particle);
      
      particles.push({
        element: particle,
        delay: delay * 1000,
        duration: duration * 1000,
        startTime: null,
        animationId: null
      });
    }
    
    particlesRef.current = particles;
    
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [isWhiteBg, cleanup]);

  // Handle animation
  useEffect(() => {
    if (!isHovered) {
      // Fade out all particles
      particlesRef.current.forEach(p => {
        if (p.animationId) {
          cancelAnimationFrame(p.animationId);
          p.animationId = null;
        }
        p.element.style.opacity = '0';
        p.element.style.transform = 'translateX(0)';
        p.startTime = null;
      });
      return;
    }
    
    // Start animations for all particles
    const animate = () => {
      if (!isMounted.current || !isHovered) return;
      
      const now = Date.now();
      let anyAnimating = false;
      
      particlesRef.current.forEach(p => {
        if (!p.startTime) {
          p.startTime = now + p.delay; // Convert to milliseconds
        }
        
        if (now < p.startTime) {
          anyAnimating = true;
          return;
        }
        
        const elapsed = now - p.startTime;
        const progress = Math.min(elapsed / (p.duration), 1); // Don't loop, just go to 1
        
        // Fade in at start, fade out at end
        let opacity = 1;
        if (progress < 0.2) {
          opacity = progress * 5; // Fade in for first 20%
        } else if (progress > 0.8) {
          opacity = (1 - progress) * 5; // Fade out for last 20%
        }
        
        p.element.style.opacity = `${opacity}`;
        
        // Move right and fade out at the end
        p.element.style.transform = `translateX(${progress * 150}px)`; // Increased distance to go behind icon
        
        // If animation complete, reset particle
        if (progress >= 1) {
          p.startTime = now + (Math.random() * 2000); // Wait 0-2s before restarting
          p.element.style.opacity = '0';
          p.element.style.transform = 'translateX(0)';
        }
        
        anyAnimating = true;
      });
      
      if (anyAnimating || isHovered) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [isHovered]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', // Full width to go behind icon
        height: '100%', // Full height
        pointerEvents: 'none',
        zIndex: 0, // Behind the icon
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.2s ease',
        paddingRight: '60px', // Space for the icon
      }}
    />
  );
}

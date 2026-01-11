'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image, { type ImageProps } from 'next/image';

interface ZoomableImageProps extends Omit<ImageProps, 'onMouseDown' | 'onWheel' | 'onDoubleClick'> {
  className?: string;
}

export function ZoomableImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  ...props 
}: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isOverImage, setIsOverImage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle wheel events for zooming and prevent page scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isOverImage) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Calculate new scale (no upper limit, small lower limit)
    const delta = -e.deltaY * 0.002;
    setScale(prevScale => {
      const newScale = Math.max(0.1, prevScale + delta * prevScale);
      
      // Calculate the position to zoom toward cursor
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const x = e.clientX - container.left;
        const y = e.clientY - container.top;
        
        // Calculate the position relative to the image
        const imgX = x - container.width / 2 - position.x;
        const imgY = y - container.height / 2 - position.y;
        
        // Calculate the new position to zoom toward cursor
        const newX = (imgX * newScale) / prevScale - imgX;
        const newY = (imgY * newScale) / prevScale - imgY;
        
        setPosition({
          x: newX,
          y: newY
        });
      }
      
      return newScale;
    });
  }, [isOverImage, position.x, position.y]);

  // Add/remove wheel event listener with debounce
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Debounce wheel event for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedWheel = (e: WheelEvent) => {
      e.preventDefault();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleWheel(e), 16); // ~60fps
    };

    container.addEventListener('wheel', debouncedWheel, { passive: false });
    
    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('wheel', debouncedWheel);
    };
  }, [handleWheel]);

  // Reset zoom and position when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    
    document.body.style.overflow = 'hidden';
    document.body.style.cursor = 'grabbing';
  };

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  }, [isDragging, startPos.x, startPos.y]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = isOverImage && scale > 1 ? 'grab' : 'default';
  }, [isOverImage, scale]);

  // Handle React wheel event (optimized)
  const handleReactWheel = useCallback((e: React.WheelEvent) => {
    if (!isOverImage) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Optimize by using requestAnimationFrame
    requestAnimationFrame(() => {
      const newScale = scale + (-e.deltaY * 0.002) * scale;
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const x = e.clientX - container.left;
        const y = e.clientY - container.top;
        const imgX = x - container.width / 2 - position.x;
        const imgY = y - container.height / 2 - position.y;
        const newX = (imgX * newScale) / scale - imgX;
        const newY = (imgY * newScale) / scale - imgY;
        
        // Batch state updates
        setScale(Math.max(0.1, newScale));
        setPosition(prev => ({
          x: prev.x - newX,
          y: prev.y - newY,
        }));
      }
    });
  }, [isOverImage, position.x, position.y, scale]);

  // Handle double click to reset zoom
  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Add/remove global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.userSelect = '';
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Memoize mouse handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(() => {
    setIsOverImage(true);
    if (scale > 1) {
      document.body.style.cursor = 'grab';
    }
  }, [scale]);

  const handleMouseLeave = useCallback(() => {
    setIsOverImage(false);
    document.body.style.cursor = '';
    document.body.style.overflow = 'unset';
  }, []);

  // Extract fill from props and memoize to avoid unnecessary re-renders
  const { fill, priority = false, ...restProps } = props;
  const hasFill = fill !== false; // Default to true if not specified
  
  // Memoize the image style to prevent unnecessary recalculations
  const imageStyle = useMemo(() => ({
    objectFit: 'contain',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
  }), []);
  
  // Memoize the container style
  const containerStyle = useMemo(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate3d(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px), 0) scale(${scale})`,
    transformOrigin: 'center',
    willChange: 'transform',
    width: hasFill ? '100%' : width || 'auto',
    height: hasFill ? '100%' : height || 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    minWidth: '100%',
    minHeight: '100%',
  }), [hasFill, height, position.x, position.y, scale, width]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        width: '100%',
        height: '100%',
        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        overflow: 'visible',
        position: 'relative',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsOverImage(true)}
      onMouseLeave={handleMouseLeave}
      onWheel={handleReactWheel}
      onDoubleClick={handleDoubleClick}
    >
      <div style={containerStyle}>
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          fill={hasFill}
          priority={priority}
          {...(hasFill ? {} : { width, height })}
          className="select-none touch-none"
          style={imageStyle}
          draggable={false}
          loading={priority ? 'eager' : 'lazy'}
          {...restProps}
        />
      </div>
    </div>
  );
}

export default ZoomableImage;
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';

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

  // Handle wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Calculate new scale (no upper limit, small lower limit)
    const delta = -e.deltaY * 0.002;
    const newScale = Math.max(0.1, scale + delta * scale);
    
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      
      // Get cursor position relative to container
      const x = e.clientX - container.left;
      const y = e.clientY - container.top;
      
      // Calculate the position relative to the image
      const imgX = x - container.width / 2 - position.x;
      const imgY = y - container.height / 2 - position.y;
      
      // Calculate the new position to zoom toward cursor
      const newX = (imgX * newScale) / scale - imgX;
      const newY = (imgY * newScale) / scale - imgY;
      
      setScale(newScale);
      setPosition(prev => ({
        x: prev.x - newX,
        y: prev.y - newY,
      }));
    }
  };

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

  // Update cursor style when hovering over the image
  const handleMouseEnter = () => {
    setIsOverImage(true);
    if (scale > 1) {
      document.body.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    setIsOverImage(false);
    if (!isDragging) {
      document.body.style.cursor = '';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center',
          willChange: 'transform',
          width: width || '100%',
          height: height || '100%',
        }}
        onMouseDown={handleMouseDown}
      >
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block max-w-none"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
          draggable={false}
          {...props}
        />
      </div>
      
      {/* Zoom controls */}
      {scale > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <button 
            onClick={() => setScale(prev => Math.max(0.1, prev - 0.5))}
            className="w-8 h-8 flex items-center justify-center text-white text-xl font-bold bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={() => setScale(prev => prev + 0.5)}
            className="w-8 h-8 flex items-center justify-center text-white text-xl font-bold bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Zoom in"
          >
            +
          </button>
          {scale > 1 && (
            <button 
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Reset zoom"
            >
              1:1
            </button>
          )}
        </div>
      )}
    </div>
  );
}
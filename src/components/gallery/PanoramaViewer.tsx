'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { FaTimes, FaExpand } from 'react-icons/fa';

interface PanoramaViewerProps extends Omit<ImageProps, 'onClick' | 'className'> {
  location?: string;
}

export function PanoramaViewer({ location, ...imageProps }: PanoramaViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isOverImage, setIsOverImage] = useState(false);
  const [dimensions, setDimensions] = useState({ width: '100%', height: 'auto' });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle image load to get natural dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const maxWidth = Math.min(containerWidth, img.naturalWidth);
    
    setDimensions({
      width: `${maxWidth}px`,
      height: 'auto',
    });
    
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Reset zoom and position when closing
    setTimeout(() => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }, 300);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    const x = e.clientX - startPos.x;
    const y = e.clientY - startPos.y;
    
    setPosition({ x, y });
  }, [isDragging, scale, startPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (scale <= 1) {
      document.body.style.cursor = '';
    } else {
      document.body.style.cursor = 'grab';
    }
  }, [scale]);

  const handleMouseEnter = useCallback(() => {
    setIsOverImage(true);
    if (scale > 1) {
      document.body.style.cursor = 'grab';
    }
  }, [scale]);

  const handleMouseLeave = useCallback(() => {
    setIsOverImage(false);
    if (!isDragging) {
      document.body.style.cursor = '';
    }
  }, [isDragging]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    // Determine zoom direction and calculate new scale
    const zoomFactor = 0.1; // Controls zoom speed
    const zoomDirection = e.deltaY < 0 ? 1 : -1; // Invert scroll direction for natural feel
    const newScale = scale * (1 + zoomDirection * zoomFactor);
    
    // Limit zoom range
    const clampedScale = Math.max(1, Math.min(newScale, 5));
    
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      
      // Get mouse position relative to container
      const mouseX = e.clientX - container.left;
      const mouseY = e.clientY - container.top;
      
      // Calculate the mouse position as a percentage of the container
      const xPercent = mouseX / container.width;
      const yPercent = mouseY / container.height;
      
      // Calculate the current position of the point under the cursor
      const currentX = position.x + (xPercent * container.width * (1 - 1/scale));
      const currentY = position.y + (yPercent * container.height * (1 - 1/scale));
      
      // Calculate the new position to keep the point under the cursor
      const newX = xPercent * container.width * (1 - 1/clampedScale);
      const newY = yPercent * container.height * (1 - 1/clampedScale);
      
      // Update scale and position
      setScale(clampedScale);
      setPosition({
        x: newX - (currentX - position.x) * (clampedScale / scale),
        y: newY - (currentY - position.y) * (clampedScale / scale)
      });
    }
  }, [scale, position]);

  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  }, [scale]);

  // Set up drag handlers
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Thumbnail */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div 
          className="relative"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: '100%',
            margin: '0 auto',
            aspectRatio: 'auto'
          }}
        >
          <Image
            {...imageProps}
            ref={imgRef}
            onLoad={handleImageLoad}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              display: 'block'
            }}
            alt={imageProps.alt || 'Panorama view'}
          />
        </div>
        <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-full py-3 bg-black/80 flex flex-col items-center">
            <p className="text-white text-sm md:text-base font-medium text-center px-2">
              {location}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button 
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors p-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            aria-label="Close"
          >
            <FaTimes />
          </button>

          <div 
            ref={containerRef}
            className="relative w-full h-[80vh] cursor-grab active:cursor-grabbing px-4"
            onClick={e => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={handleDoubleClick}
            onWheel={handleWheel}
            style={{ cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'default') }}
          >
            <div 
              ref={imageRef}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                transformOrigin: 'center center',
                touchAction: 'none',
              }}
            >
              <Image
                {...imageProps}
                fill
                className="object-contain select-none"
                alt={imageProps.alt || 'Panorama view'}
                priority
                draggable={false}
              />
            </div>
            
            {/* Location indicator at the top right */}
            {location && (
              <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                {location}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

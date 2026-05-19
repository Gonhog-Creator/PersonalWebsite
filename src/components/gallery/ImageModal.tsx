'use client';

import { useEffect, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ZoomableImage } from '@/components/gallery/ZoomableImage';

interface ImageModalProps {
  images: Array<{ id?: number; src: string; alt: string }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export function ImageModal({ images, currentIndex, onClose, onNavigate }: ImageModalProps) {
  const currentImage = images[currentIndex];

  // Use refs to store callbacks to avoid re-attaching event listener
  const onCloseRef = useRef(onClose);
  const onNavigateRef = useRef(onNavigate);

  // Update refs when callbacks change
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      } else if (e.key === 'ArrowLeft') {
        onNavigateRef.current('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigateRef.current('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array - listener only attached once

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 z-10"
        aria-label="Close lightbox"
      >
        <FaTimes size={24} />
      </button>

      {/* Previous button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('prev');
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 z-10"
        aria-label="Previous image"
      >
        <FaChevronLeft size={32} />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('next');
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 z-10"
        aria-label="Next image"
      >
        <FaChevronRight size={32} />
      </button>

      {/* Image */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
        <ZoomableImage
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

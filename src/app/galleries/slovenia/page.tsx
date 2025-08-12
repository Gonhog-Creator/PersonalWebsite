'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import { GradientButton } from '@/components/ui/gradient-button';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { PanoramaViewer } from '@/components/gallery/PanoramaViewer';

// Dynamically import the GalleryNavbar with SSR disabled
const GalleryNavbar = dynamic(
  () => import('@/components/gallery/GalleryNavbar'),
  { ssr: false }
);

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  location: string;
}

// Helper function to generate image paths
const getImagePath = (id: number) => {
  const basePath = '/img/Slovenia/slovenia';
  return `${basePath} (${id}).jpg`;
};

// Generate gallery images array
export const galleryImages: GalleryImage[] = Array.from({ length: 25 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    src: getImagePath(id),
    alt: `Photo ${id}`,
    location: 'Slovenia'
  };
});

// Add specific alt text for all images
const imageDetails: Record<number, { alt: string }> = {
  // Add your image descriptions here
  // Format: id: { alt: 'description' },
  // Example:
  // 1: { alt: 'Lake Bled with island church' },
  // 2: { alt: 'Vintgar Gorge wooden walkway' },
};

// Update gallery images with details
galleryImages.forEach(img => {
  if (imageDetails[img.id]) {
    Object.assign(img, imageDetails[img.id]);
  }
});

// Masonry breakpoints
const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

type GalleryView = 'photos' | 'panoramas' | 'drone';

export default function SloveniaGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentView, setCurrentView] = useState<GalleryView>('photos');
  const router = useRouter();

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Preload images
  useEffect(() => {
    galleryImages.forEach(img => {
      const imgEl = new Image();
      imgEl.src = img.src;
      imgEl.onload = () => console.log(`✅ Image loaded: ${img.src}`);
      imgEl.onerror = () => console.error(`❌ Error loading image: ${img.src}`);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GalleryNavbar currentPath="/galleries/slovenia" />

      <ProjectHeader
        title="Slovenia"
        subtitle="Photography collection from Slovenia"
        backgroundImage="/img/Slovenia/hero.jpg"
      />

      <div className="container mx-auto px-4 py-16">
        {/* View Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <GradientButton
            onClick={() => setCurrentView('photos')}
            isActive={currentView === 'photos'}
          >
            Photos
          </GradientButton>
          
          <GradientButton
            onClick={() => setCurrentView('panoramas')}
            isActive={currentView === 'panoramas'}
          >
            Panoramas
          </GradientButton>
        </div>

        {/* Main Content */}
        {currentView === 'photos' && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid flex w-auto"
            columnClassName="masonry-column px-2"
          >
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="mb-4 cursor-pointer group"
                onClick={() => openLightbox(image)}
              >
                <div className="relative w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
              </div>
            ))}
          </Masonry>
        )}

        {/* Panoramas Section */}
        {currentView === 'panoramas' && (
          <div className="space-y-10">
            {[1, 2, 3].map((id) => (
              <div key={id} className="w-full group relative" style={{ marginBottom: '40px' }}>
                <PanoramaViewer
                  src={`/img/Slovenia/panorama-slovenia-${id}.JPG`}
                  location="Slovenia"
                />
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 p-2"
              aria-label="Close lightbox"
            >
              <FaTimes />
            </button>
            <div className="relative max-w-6xl w-full max-h-[90vh]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1600}
                height={1200}
                className="w-full h-auto max-h-[85vh] object-contain"
                priority
              />
              <div className="mt-2 text-center text-white">
                <p>{selectedImage.alt}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

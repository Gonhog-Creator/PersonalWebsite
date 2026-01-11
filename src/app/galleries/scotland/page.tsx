'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { GradientButton } from '@/components/ui/gradient-button';
import { FaTimes } from 'react-icons/fa';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { PanoramaViewer } from '@/components/gallery/PanoramaViewer';
import { ZoomableImage } from '@/components/gallery/ZoomableImage';
import { YouTubePlayer } from '@/components/gallery/YouTubePlayer';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  location: string;
}

type GalleryView = 'photos' | 'panoramas' | 'drone';

// Helper function to generate image paths
const getImagePath = (id: number) => {
  const basePath = '/img/Scotland/scotland';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos: number[] = [];

// Image details for alt text
const imageDetails: Record<number, { alt: string }> = {
  1: { alt: 'DescriptionComingSoon' },
  2: { alt: 'DescriptionComingSoon' },
  3: { alt: 'DescriptionComingSoon' },
  4: { alt: 'DescriptionComingSoon' },
  5: { alt: 'DescriptionComingSoon' },
  6: { alt: 'DescriptionComingSoon' },
  7: { alt: 'DescriptionComingSoon' },
  8: { alt: 'DescriptionComingSoon' },
  9: { alt: 'DescriptionComingSoon' },
  10: { alt: 'DescriptionComingSoon' },
  11: { alt: 'DescriptionComingSoon' },
  12: { alt: 'DescriptionComingSoon' },
  13: { alt: 'DescriptionComingSoon' },
  14: { alt: 'DescriptionComingSoon' },
  15: { alt: 'DescriptionComingSoon' },
  16: { alt: 'DescriptionComingSoon' },
  17: { alt: 'DescriptionComingSoon' },
  18: { alt: 'DescriptionComingSoon' },
  19: { alt: 'DescriptionComingSoon' },
  20: { alt: 'DescriptionComingSoon' },
  21: { alt: 'DescriptionComingSoon' },
  22: { alt: 'DescriptionComingSoon' },
  23: { alt: 'DescriptionComingSoon' },
  24: { alt: 'DescriptionComingSoon' },
  25: { alt: 'DescriptionComingSoon' },
  26: { alt: 'DescriptionComingSoon' },
  27: { alt: 'DescriptionComingSoon' },
  28: { alt: 'DescriptionComingSoon' },
  29: { alt: 'DescriptionComingSoon' },
  30: { alt: 'DescriptionComingSoon' },
  31: { alt: 'DescriptionComingSoon' },
  32: { alt: 'DescriptionComingSoon' },
  33: { alt: 'DescriptionComingSoon' },
  34: { alt: 'DescriptionComingSoon' },
  35: { alt: 'DescriptionComingSoon' },
  36: { alt: 'DescriptionComingSoon' },
  37: { alt: 'DescriptionComingSoon' },
  38: { alt: 'DescriptionComingSoon' },
  39: { alt: 'DescriptionComingSoon' },
  40: { alt: 'DescriptionComingSoon' },
  41: { alt: 'DescriptionComingSoon' },
  42: { alt: 'DescriptionComingSoon' },
  43: { alt: 'DescriptionComingSoon' },
  44: { alt: 'DescriptionComingSoon' },
  45: { alt: 'DescriptionComingSoon' },
  46: { alt: 'DescriptionComingSoon' },
  47: { alt: 'DescriptionComingSoon' },
};

export default function ScotlandGallery() {
  // Generate gallery images with useMemo, excluding missing photos
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 47 }, (_, i) => {
      const id = i + 1;
      const details = imageDetails[id] || {};
      return {
        id,
        src: getImagePath(id),
        location: 'France',
        ...details,
        alt: details.alt || `Photo ${id}`
      };
    }).filter(image => !missingPhotos.includes(image.id));
  }, []);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentView, setCurrentView] = useState<GalleryView>('photos');


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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Verify image paths in development only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Verifying image paths...');
      galleryImages.forEach(img => {
        const imgEl = new window.Image();
        imgEl.onload = () => console.log(`✅ Image loaded: ${img.src}`);
        imgEl.onerror = () => console.error(`❌ Error loading image: ${img.src}`);
        imgEl.src = img.src;
      });
    }
  }, [galleryImages]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Project Header */}
      <ProjectHeader />

      {/* Header with title and navigation */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/img/Scotland/scotland_panorama (1).jpg"
            alt="Scotland Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Scotland</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              Backpacking through Scotland means embracing the rain-soaked landscapes, exploring the historic charm of St Andrews,
              and experiencing the vibrant culture of its cities. Every moment is an adventure in this rugged and beautiful land
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <section className="w-full bg-gray-900 py-12">
        <div className="w-full flex justify-center px-4">
          <div className="flex items-center justify-center gap-8 md:gap-16 lg:gap-32">
            <GradientButton
              variant={currentView === 'panoramas' ? 'variant' : 'default'}
              className="px-6 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold transform scale-100 md:scale-125 lg:scale-150 origin-center"
              onClick={() => setCurrentView('panoramas')}
            >
              Panoramas
            </GradientButton>
            <GradientButton
              variant={currentView === 'photos' ? 'variant' : 'default'}
              className="px-6 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold transform scale-100 md:scale-125 lg:scale-150 origin-center"
              onClick={() => setCurrentView('photos')}
            >
              Photos
            </GradientButton>
            <GradientButton
              variant={currentView === 'drone' ? 'variant' : 'default'}
              className="px-6 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold transform scale-100 md:scale-125 lg:scale-150 origin-center"
              onClick={() => setCurrentView('drone')}
            >
              Drone Videos
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <div className="w-full bg-gray-900 pb-12">
        {currentView === 'photos' ? (
          <div className="w-full px-4">
            <Masonry
              breakpointCols={{
                default: 5,
                1600: 4,
                1200: 3,
                800: 2,
                500: 1
              }}
              className="flex w-auto"
              columnClassName="masonry-column"
            >
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer overflow-hidden transition-all duration-300 mb-4 mx-1"
                  onClick={() => openLightbox(image)}
                >
                  <div className="relative w-full overflow-hidden rounded-lg">
                    <style jsx global>{`
                      .masonry-column {
                        padding-left: 8px !important;
                        padding-right: 8px !important;
                      }
                      .masonry-column > div {
                        margin-bottom: 16px !important;
                        border-radius: 0.5rem;
                        overflow: hidden;
                      }
                      .masonry-column:first-child {
                        padding-left: 0 !important;
                      }
                      .masonry-column:last-child {
                        padding-right: 0 !important;
                      }
                    `}</style>
                    <div className="relative w-full h-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={800}
                        height={600}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        style={{ display: 'block' }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      />
                      {
            /* Hover effect disabled as per user request
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <p className="text-white text-sm md:text-base font-semibold px-6 py-4 w-full text-center">
                {image.alt}
              </p>
            </div>
            */
          }
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </div>
        ) : null}

        {currentView === 'panoramas' && (
          <div className="w-full">
            <div className="w-full bg-gray-900 py-12">
              <div className="w-full flex justify-center">
                <div className="w-full max-w-4xl px-4">
                  <div className="w-full text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Tried to get every Scotsman in the picture.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <div className="w-full py-8">
                {[
                  { id: 1, location: 'DescriptionComingSoon' },
                  { id: 2, location: 'DescriptionComingSoon' },
                  { id: 3, location: 'DescriptionComingSoon' },
                  { id: 4, location: 'DescriptionComingSoon' },
                  { id: 5, location: 'DescriptionComingSoon' },
                  { id: 6, location: 'DescriptionComingSoon' },
                  { id: 7, location: 'DescriptionComingSoon' },
                  { id: 8, location: 'DescriptionComingSoon' },
                  { id: 9, location: 'DescriptionComingSoon' },
                  { id: 10, location: 'DescriptionComingSoon' },
                  { id: 11, location: 'DescriptionComingSoon' },
                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Scotland/scotland_panorama (${item.id}).jpg`}
                      alt={`${item.location}`}
                      priority={index <= 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'drone' && (
          <div className="w-full flex justify-center items-center min-h-screen py-16">
            <div className="w-full max-w-6xl px-4 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Scotland 2025 Recap</h2>
              <div className="w-full max-w-6xl">
                <YouTubePlayer 
                  videoId="WeV3YlxsnYk"
                  title="Scotland 2025 Drone Footage"
                  className="rounded-lg shadow-xl"
                />
              </div>
              {/* Add space below the video */}
              <div className="h-32 w-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={handleBackdropClick}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            aria-label="Close lightbox"
          >
            <FaTimes size={24} />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <ZoomableImage
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
            <BackToTop />
    </div>
  );
}
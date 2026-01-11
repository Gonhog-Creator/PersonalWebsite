'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import { GradientButton } from '@/components/ui/gradient-button';
import { FaTimes } from 'react-icons/fa';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { PanoramaViewer } from '@/components/gallery/PanoramaViewer';
import { ZoomableImage } from '@/components/gallery/ZoomableImage';
import { VideoPlayer } from '@/components/gallery/VideoPlayer';

import { BackToTop } from '@/components/ui/BackToTop';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  location: string;
}

type GalleryView = 'photos' | 'panoramas' | 'drone';

// Helper function to generate image paths
const getImagePath = (id: number) => {
  const basePath = '/img/United Kingdom/united_kingdom';
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
  48: { alt: 'DescriptionComingSoon' },
  49: { alt: 'DescriptionComingSoon' },
  50: { alt: 'DescriptionComingSoon' },
  51: { alt: 'DescriptionComingSoon' },
  52: { alt: 'DescriptionComingSoon' },
  53: { alt: 'DescriptionComingSoon' },
  54: { alt: 'DescriptionComingSoon' },
  55: { alt: 'DescriptionComingSoon' },
  56: { alt: 'DescriptionComingSoon' },
  57: { alt: 'DescriptionComingSoon' },
  58: { alt: 'DescriptionComingSoon' },
  59: { alt: 'DescriptionComingSoon' },
  60: { alt: 'DescriptionComingSoon' },
  61: { alt: 'DescriptionComingSoon' },
  62: { alt: 'DescriptionComingSoon' },
  63: { alt: 'DescriptionComingSoon' },
  64: { alt: 'DescriptionComingSoon' },
  65: { alt: 'DescriptionComingSoon' },
  66: { alt: 'DescriptionComingSoon' },
  67: { alt: 'DescriptionComingSoon' },
  68: { alt: 'DescriptionComingSoon' },
  69: { alt: 'DescriptionComingSoon' },
  70: { alt: 'DescriptionComingSoon' },
  71: { alt: 'DescriptionComingSoon' },
  72: { alt: 'DescriptionComingSoon' },
  73: { alt: 'DescriptionComingSoon' },
  74: { alt: 'DescriptionComingSoon' },
  75: { alt: 'DescriptionComingSoon' },
  76: { alt: 'DescriptionComingSoon' },
  77: { alt: 'DescriptionComingSoon' },
  78: { alt: 'DescriptionComingSoon' },
  79: { alt: 'DescriptionComingSoon' },
  80: { alt: 'DescriptionComingSoon' },
  81: { alt: 'DescriptionComingSoon' },
  82: { alt: 'DescriptionComingSoon' },
  83: { alt: 'DescriptionComingSoon' },
  84: { alt: 'DescriptionComingSoon' },
  85: { alt: 'DescriptionComingSoon' },
  86: { alt: 'DescriptionComingSoon' },
  87: { alt: 'DescriptionComingSoon' },
  88: { alt: 'DescriptionComingSoon' },
  89: { alt: 'DescriptionComingSoon' },
  90: { alt: 'DescriptionComingSoon' },
  91: { alt: 'DescriptionComingSoon' },
  92: { alt: 'DescriptionComingSoon' },
  93: { alt: 'DescriptionComingSoon' },
  94: { alt: 'DescriptionComingSoon' },
  95: { alt: 'DescriptionComingSoon' },
  96: { alt: 'DescriptionComingSoon' },
  97: { alt: 'DescriptionComingSoon' },
};

export default function UnitedKingdomGallery() {
  const [currentView, setCurrentView] = useState<GalleryView>('photos');
  
  // Generate gallery images with useMemo, excluding missing photos
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 97 }, (_, i) => {
      const id = i + 1;
      const details = imageDetails[id] || {};
      return {
        id,
        src: getImagePath(id),
        location: 'United Kingdom',
        ...details,
        alt: details.alt || `Photo ${id}`
      };
    }).filter(image => !missingPhotos.includes(image.id));
  }, []);

  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);
  
  const openLightbox = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  }, []);
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  }, [closeLightbox]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox]);

  // Verify image paths
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
            src="/img/United Kingdom/united_kingdom_panorama (2).jpg"
            alt="United Kingdom Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">United Kingdom</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              From the vibrant streets and historic landmarks of London to the timeless legacy of Shakespeare’s birthplace, the United Kingdom is a land rich in culture, history, and literary heritage.
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
                      London from the sky.
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
                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/United Kingdom/united_kingdom_panorama (${item.id}).jpg`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">United Kingdom 2025 Recap</h2>
              <div className="w-full max-w-6xl">
                <VideoPlayer 
                  src="/vids/United Kingdom 2025 Recap 2k.mp4"
                  title="United Kingdom 2025 Drone Footage"
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

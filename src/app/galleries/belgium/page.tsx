'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Masonry from 'react-masonry-css';
import { FaTimes } from 'react-icons/fa';
import { GradientButton } from '@/components/ui/gradient-button';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { PanoramaViewer } from '@/components/gallery/PanoramaViewer';
import { ZoomableImage } from '@/components/gallery/ZoomableImage';
import { YouTubePlayer } from '@/components/gallery/YouTubePlayer';
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
  const basePath = '/img/Belgium/belgium';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos = [36, 47];

export default function BelgiumGallery() {
  // State declarations
  const [currentView, setCurrentView] = useState<GalleryView>('photos');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadedTabs, setLoadedTabs] = useState<Set<GalleryView>>(new Set());

  const handleTabChange = (view: GalleryView) => {
    setCurrentView(view);
  };

  // Load images only when the photos tab is active
  useEffect(() => {
    if (currentView === 'photos' && !loadedTabs.has('photos')) {
      const images = Array.from({ length: 89 }, (_, i) => {
        const id = i + 1;
        return {
          id,
          src: getImagePath(id),
          location: 'Belgium'
        };
      }).filter(image => !missingPhotos.includes(image.id));
      
      setGalleryImages(images);
      setLoadedTabs(prev => new Set([...prev, 'photos']));
    }
  }, [currentView, loadedTabs]);

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

  // Verify image paths when photos tab is active
  useEffect(() => {
    if (currentView === 'photos' && galleryImages.length > 0) {
      console.log('Verifying image paths...');
      galleryImages.forEach(img => {
        const imgEl = new window.Image();
        imgEl.onload = () => console.log(`✅ Image loaded: ${img.src}`);
        imgEl.onerror = () => console.error(`❌ Error loading image: ${img.src}`);
        imgEl.src = img.src;
      });
    }
  }, [currentView, galleryImages]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Project Header */}
      <ProjectHeader />

      {/* Header with title and navigation */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/img/Belgium/belgium_panorama (8).jpg"
            alt="Belgium Gallery Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/50 p-8 rounded-lg max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Belgium</h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                  From the medieval charm of Bruges&apos; canals to the modern European Union headquarters in Brussels,
                  Belgium offers a fascinating blend of history, culture, and world-renowned cuisine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* Navigation Section */}
        <section className="w-full bg-gray-900 py-12">
          <div className="w-full flex justify-center px-4">
            <div className="flex items-center justify-center gap-8 md:gap-16 lg:gap-32">
              <GradientButton
                variant={currentView === 'panoramas' ? 'variant' : 'default'}
                className="px-6 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold transform scale-100 md:scale-125 lg:scale-150 origin-center"
                onClick={() => handleTabChange('panoramas')}
                onMouseEnter={() => {
                  if (!loadedTabs.has('panoramas')) {
                    setLoadedTabs(prev => new Set([...prev, 'panoramas']));
                  }
                }}
              >
                Panoramas
              </GradientButton>
              <GradientButton
                variant={currentView === 'photos' ? 'variant' : 'default'}
                className="px-6 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold transform scale-100 md:scale-125 lg:scale-150 origin-center"
                onClick={() => handleTabChange('photos')}
                onMouseEnter={() => {
                  if (!loadedTabs.has('photos')) {
                    setLoadedTabs(prev => new Set([...prev, 'photos']));
                  }
                }}
              >
                Photos
              </GradientButton>
              <GradientButton
                variant={currentView === 'drone' ? 'variant' : 'default'}
                className="px-6 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold transform scale-100 md:scale-125 lg:scale-150 origin-center"
                onClick={() => handleTabChange('drone')}
                onMouseEnter={() => {
                  if (!loadedTabs.has('drone')) {
                    setLoadedTabs(prev => new Set([...prev, 'drone']));
                  }
                }}
              >
                Drone Videos
              </GradientButton>
            </div>
          </div>
        </section>

      {/* Content Sections */}
      {currentView === 'photos' && (
        <div className="w-full py-8">
          {galleryImages.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
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
                {galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer overflow-hidden transition-all duration-300 mb-4 mx-1"
                    onClick={() => openLightbox(image)}
                  >
                    <div className="relative w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={800}
                        height={600}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        style={{ display: 'block' }}
                        loading="lazy"
                        decoding="async"
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
                ))}
              </Masonry>
            </div>
          )}
        </div>
      )}

        {currentView === 'panoramas' && (
          <div className="w-full">
            <div className="w-full bg-gray-900 py-12">
              <div className="w-full flex justify-center">
                <div className="w-full max-w-4xl px-4">
                  <div className="w-full text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Have you ever seen this many old houses in one photo?
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
                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Belgium/belgium_panorama (${item.id}).jpg`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Belgium 2025 Recap</h2>
              <div className="w-full max-w-6xl">
                <YouTubePlayer 
                  videoId="4JV1n0iVC0c"
                  title="Belgium 2025 Drone Footage"
                  className="rounded-lg shadow-xl"
                />
              </div>
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
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white text-center">
              <p className="font-medium">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
            <BackToTop />
    </div>
  );
}
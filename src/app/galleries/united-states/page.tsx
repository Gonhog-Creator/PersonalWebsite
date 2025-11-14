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

/*
For updating this gallery, update all things in steps 1-4
1 - Image path for gallery
2 - Page content
3 - Image details for alt text
4 - Export Name
*/


//STEP ONE
const getImagePath = (id: number) => {
  const basePath = '/img/USA';
  return `${basePath}/usa (${id}).jpg`;
};

//STEP TWO
const PAGE_CONTENT = {
  title: 'United States of America',
  description: '35 states, 20 national parks, 11,200 miles. Through two road trips through the western United States, I have seen a large swath of this great country and enjoyed every second of it.',
  header: {
    backgroundImage: '/img/USA/panorama-USA-1.jpg',
    altText: 'USA Panorama'
  },
  panoramas: {
    description: 'Maybe with a big enough photo I can see every state bird.',
    imagePath: '/img/USA/panorama-USA-'
  },
  video: {
    id: '',
    title: 'USA Recap'
  }
};

// Get the number of panorama images
const panoramaCount = 7; // Update this number based on your actual panorama count


//STEP FOUR
export default function USAGallery() {
  // Generate gallery images with useMemo, excluding photo #2
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 68 }, (_, i) => {
      const id = i + 1;
      // Skip photo #2
      if (id === 2) return null;
      
      const details = { alt: `Photo ${id}` };
      const image: GalleryImage = {
        id,
        src: getImagePath(id),
        alt: details.alt
      };
      return image;
    }).filter((img): img is GalleryImage => img !== null);
  }, []);


  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentView, setCurrentView] = useState<GalleryView>('photos');
  const openLightbox = (image: GalleryImage) => {setSelectedImage(image); document.body.style.overflow = 'hidden';};
  const closeLightbox = () => {setSelectedImage(null); document.body.style.overflow = 'unset';};

  const handleBackdropClick = (e: React.MouseEvent) => {if (e.target === e.currentTarget) {closeLightbox();}};

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Verify image paths
  // Debug effect to verify image paths (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Verifying image paths...');
      galleryImages.forEach(img => {
        const imgEl = new window.Image();
        imgEl.onload = () => console.log(`✅ Image loaded: ${img.src}`);
        imgEl.onerror = () => {
          console.error(`❌ Error loading image: ${img.src}`);
          // Try with different case variations
          const tryVariations = [
            img.src.replace(/\.jpg$/i, '.JPG'),
            img.src.replace(/\.JPG$/i, '.jpg'),
            img.src.replace('usa ', 'USA '),
            img.src.replace('USA ', 'usa ')
          ];
          
          tryVariations.forEach(variation => {
            if (variation !== img.src) {
              console.log(`🔄 Trying variation: ${variation}`);
              const testImg = new window.Image();
              testImg.onload = () => console.log(`✅ Found working variation: ${variation}`);
              testImg.onerror = () => console.log(`❌ Variation failed: ${variation}`);
              testImg.src = variation;
            }
          });
        };
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
            src={PAGE_CONTENT.header.backgroundImage}
            alt={PAGE_CONTENT.header.altText}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{PAGE_CONTENT.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              {PAGE_CONTENT.description}
            </p>
          </div>
        </div>
      </div>
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
                        padding-left: 8px;
                        padding-right: 8px;
                      }
                      .masonry-column > div {
                        margin-bottom: 16px;
                        border-radius: 0.5rem;
                        overflow: hidden;
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
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Try different case variations if the image fails to load
                          if (target.src.includes('.jpg')) {
                            target.src = target.src.replace(/\.jpg$/i, '.JPG');
                          } else if (target.src.includes('.JPG')) {
                            target.src = target.src.replace(/\.JPG$/i, '.jpg');
                          }
                        }}
                        unoptimized={true} // Try with unoptimized to see if it helps with loading
                      />
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
                      {PAGE_CONTENT.panoramas.description}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <div className="w-full py-8">
                {Array.from({ length: panoramaCount }, (_, i) => (
                  <div key={i + 1} className="w-full mx-auto" style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`${PAGE_CONTENT.panoramas.imagePath}${i + 1}.jpg`}
                      alt={`${PAGE_CONTENT.title} Panorama ${i + 1}`}
                      priority={i < 3}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">{PAGE_CONTENT.video.title}</h2>
              <div className="w-full max-w-6xl">
                <YouTubePlayer
                  videoId={PAGE_CONTENT.video.id}
                  title={PAGE_CONTENT.video.title}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="h-16 w-full"></div>
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
    </div>
  );
}

interface ImageDetails {
  alt: string;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

type GalleryView = 'photos' | 'panoramas' | 'drone';

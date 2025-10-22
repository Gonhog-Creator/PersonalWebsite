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
  const basePath = '/img/Argentina/argentina';
  return `${basePath} (${id}).jpg`;
};

//STEP TWO
const PAGE_CONTENT = {
  title: 'Argentina',
  description: 'From the Perito Moreno Glacier to El Chalten in Calafate to the vast plains and volcanoes of Patagonia, Argentina is a country of immense beauty, rich culture, and breathtaking landscapes.',
  header: {
    backgroundImage: '/img/Argentina/argentina_panorama (8).jpg',
    altText: 'Argentina Panorama'
  },
  panoramas: {
    description: 'From glaciers to dusty deserts, I think I photographed plenty of Argentina.',
    imagePath: '/img/Argentina/argentina_panorama'
  },
  video: {
    id: 'UBHQtwZpIk0',
    title: 'Argentina 2025 Travel Recap'
  }
};

//STEP ThREE
// Image details for alt text
const imageDetails: Record<number, ImageDetails> = {
  1: { alt: 'DescriptionComingSoon' },
  2: { alt: 'DescriptionComingSoon' },
};
const panoramaDetails: Record<number, { location: string }> = {
  1: { location: 'DescriptionComingSoon' },
  2: { location: 'DescriptionComingSoon' },
  3: { location: 'DescriptionComingSoon' },
  4: { location: 'DescriptionComingSoon' },
  5: { location: 'DescriptionComingSoon' },
  6: { location: 'DescriptionComingSoon' },
  7: { location: 'DescriptionComingSoon' }
};

//STEP FOUR
export default function PadovaGallery() {
  // Generate gallery images with useMemo
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 353 }, (_, i) => {
      const details = imageDetails[i + 1] || { alt: `Photo ${i + 1}` };
      const image: GalleryImage = {
        id: i + 1,
        src: getImagePath(i + 1),
        alt: details.alt
      };
      return image;
    });
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
        imgEl.onerror = () => console.error(`❌ Error loading image: ${img.src}`);
        imgEl.src = img.src;
      });
    }
  }, [galleryImages]);

  // Generate panorama images with useMemo, using the panoramaDetails for locations
  const panoramaImages = useMemo(() => {
    return Object.entries(panoramaDetails).map(([id, details]) => ({
      id: parseInt(id),
      location: details.location || 'DescriptionComingSoon'
    }));
  }, []);

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
                      {PAGE_CONTENT.panoramas.description}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <div className="w-full py-8">
                {panoramaImages.map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`${PAGE_CONTENT.panoramas.imagePath} (${item.id}).jpg`}
                      alt={`Panorama ${item.id}`}
                      location={item.location}
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
'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { GradientButton } from '@/components/ui/gradient-button';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { PanoramaViewer } from '@/components/gallery/PanoramaViewer';
import { ZoomableImage } from '@/components/gallery/ZoomableImage';
import { YouTubePlayer } from '@/components/gallery/YouTubePlayer';
import { BackToTop } from '@/components/ui/BackToTop';
import { ImageModal } from '@/components/gallery/ImageModal';

type GalleryView = 'sunsets' | 'landscape' | 'birds' | 'animals' | 'plants' | 'urban' | 'drone' | 'panoramas';

// Image counts for each category
const IMAGE_COUNTS = {
  sunsets: 36,    // Update these numbers based on your actual image counts
  landscape: 30,
  birds: 58,
  animals: 63,
  plants: 47,
  urban: 103,
  drone: 19,
  panoramas: 76
};

// Category metadata
const CATEGORIES: Record<GalleryView, { title: string; description: string }> = {
  sunsets: {
    title: 'Sunsets',
    description: 'Stunning sunsets from around the world'
  },
  landscape: {
    title: 'Landscapes',
    description: 'Breathtaking natural landscapes'
  },
  birds: {
    title: 'Birds',
    description: 'Beautiful bird photography'
  },
  animals: {
    title: 'Animals',
    description: 'Wildlife up close'
  },
  plants: {
    title: 'Plants',
    description: 'Macro and plant photography'
  },
  urban: {
    title: 'Urban',
    description: 'Cityscapes and urban exploration'
  },
  drone: {
    title: 'Drone',
    description: 'Aerial photography'
  },
  panoramas: {
    title: 'Panoramas',
    description: 'Wide panoramic views'
  }
};

// Helper function to get image path
const getImagePath = (category: GalleryView, id: number) => {
  const basePath = `/img/Best/${category.charAt(0).toUpperCase() + category.slice(1)}`;
  return `${basePath}/${category} (${id}).jpg`;
};

export default function BestsGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<GalleryView>('sunsets');

  // Generate gallery images for the current view
  const galleryImages = useMemo(() => {
    if (currentView === 'panoramas') return [];
    
    return Array.from({ length: IMAGE_COUNTS[currentView] }, (_, i) => {
      const id = i + 1;
      return {
        id,
        src: getImagePath(currentView, id),
        alt: `${CATEGORIES[currentView].title} ${id}`
      };
    });
  }, [currentView]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (selectedIndex === null) return;
    
    if (direction === 'next') {
      setSelectedIndex((prev) => (prev! + 1) % galleryImages.length);
    } else {
      setSelectedIndex((prev) => (prev! - 1 + galleryImages.length) % galleryImages.length);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Project Header */}
      <ProjectHeader />

      {/* Header with title and navigation */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/img/Best/Panoramas/panoramas (42).jpg"
            alt="Best Shots"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">My Best Shots</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
                  A curated collection of my favorite photographs from around the world
            </p>
          </div>
        </div>
      </div>
      <section className="w-full flex justify-center bg-gray-900 py-12 px-0">
        <div className="w-full  flex justify-center max-w-[80vw] mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {Object.entries(CATEGORIES).map(([key, { title }]) => (
              <GradientButton
                key={key}
                variant={currentView === key ? 'variant' : 'default'}
                className="flex-1 min-w-[200px] px-8 py-5 sm:px-10 sm:py-6 text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap hover:opacity-90 transform hover:scale-105 shadow-lg text-center"
                onClick={() => setCurrentView(key as GalleryView)}
              >
                {title}
              </GradientButton>
            ))}
          </div>
        </div>
      </section>

      {/* Add masonry styles */}
      <style jsx global>{masonryStyles}</style>
      
      {/* Gallery Content */}
      <div className="w-full bg-gray-900 pb-12">
        <div className="w-full px-4">
          <div className="text-center mb-8">
            <p className="text-gray-300 italic">{CATEGORIES[currentView].description}</p>
          </div>
          
          {currentView !== 'panoramas' ? (
            <Masonry
              breakpointCols={{
                default: 4,
                1600: 3,
                1200: 2,
                800: 1
              }}
              className="flex w-auto masonry-container"
              columnClassName="masonry-column"
            >
              {galleryImages.map((image, index) => (
                <div 
                  key={image.id}
                  className="relative group cursor-pointer overflow-hidden transition-all duration-300 mb-4 mx-1"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative w-full overflow-hidden rounded-lg">
                    <div className="relative w-full h-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={800}
                        height={600}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        style={{ display: 'block' }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          ) : (
            <div className="w-full max-w-full overflow-hidden">
              <div className="w-full py-8">
                {Array.from({ length: IMAGE_COUNTS.panoramas }, (_, i) => (
                  <div key={i} className="w-full mx-auto" style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Best/Panoramas/panoramas (${i + 1}).jpg`}
                      alt={`Panorama ${i + 1}`}
                      priority={i < 2}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <ImageModal
          images={galleryImages}
          currentIndex={selectedIndex}
          onClose={closeLightbox}
          onNavigate={navigateImage}
        />
      )}

      <BackToTop />
    </div>
  );
}

// Add global styles for masonry layout
const masonryStyles = `
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
  
  /* Add negative margin to the container to compensate for column padding */
  .masonry-container {
    margin: 0 -8px;
  }
`;
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
  // Handle special case for ID 2 which is missing
  if (id === 2) return null;
  
  const basePath = '/img/USA/usa';
  const extension = id <= 47 ? '.JPG' : '.jpg';
  return `${basePath} (${id})${extension}`;
};

// Generate gallery images array
export const galleryImages: GalleryImage[] = Array.from({ length: 62 }, (_, i) => {
  const id = i + 1;
  // Skip the missing image
  if (id === 2) return null;
  
  return {
    id,
    src: getImagePath(id) || '',
    alt: `Photo ${id}`,
    location: 'USA'
  };
}).filter(Boolean) as GalleryImage[];

// Add specific alt text and locations for some images
const imageDetails: Record<number, { alt: string; location?: string }> = {
  1: { alt: 'Golden Gate Bridge at sunset', location: 'San Francisco, CA' },
  3: { alt: 'Manhattan skyline from Brooklyn Bridge', location: 'New York, NY' },
  4: { alt: 'Antelope Canyon beams of light', location: 'Page, AZ' },
  5: { alt: 'Mount Rainier wildflowers', location: 'Washington' },
  6: { alt: 'Chicago skyline from Lake Michigan', location: 'Chicago, IL' },
  7: { alt: 'Grand Prismatic Spring', location: 'Yellowstone National Park, WY' },
  8: { alt: 'Las Vegas Strip at night', location: 'Las Vegas, NV' },
  9: { alt: 'New Orleans French Quarter balcony', location: 'New Orleans, LA' },
  10: { alt: 'Seattle Space Needle', location: 'Seattle, WA' },
  11: { alt: 'Zion National Park canyon', location: 'Springdale, UT' },
  12: { alt: 'Miami South Beach', location: 'Miami, FL' },
  13: { alt: 'Bryce Canyon hoodoos', location: 'Bryce Canyon National Park, UT' },
  14: { alt: 'New York Times Square', location: 'New York, NY' },
  15: { alt: 'Arches National Park', location: 'Moab, UT' },
  16: { alt: 'San Francisco Lombard Street', location: 'San Francisco, CA' },
  17: { alt: 'New Orleans French Quarter', location: 'New Orleans, LA' },
  18: { alt: 'Seattle Pike Place Market', location: 'Seattle, WA' },
  19: { alt: 'New York Central Park', location: 'New York, NY' },
  20: { alt: 'San Francisco Golden Gate Park', location: 'San Francisco, CA' },
  21: { alt: 'Las Vegas Bellagio Fountains', location: 'Las Vegas, NV' },
  22: { alt: 'Chicago Cloud Gate', location: 'Chicago, IL' },
  23: { alt: 'Miami Art Deco District', location: 'Miami Beach, FL' },
  24: { alt: 'New Orleans Jackson Square', location: 'New Orleans, LA' },
  25: { alt: 'Seattle Space Needle from Kerry Park', location: 'Seattle, WA' },
  26: { alt: 'New York Brooklyn Bridge', location: 'New York, NY' },
  27: { alt: 'San Francisco Alcatraz Island', location: 'San Francisco, CA' },
  28: { alt: 'Las Vegas Welcome Sign', location: 'Las Vegas, NV' },
  29: { alt: 'Chicago Navy Pier', location: 'Chicago, IL' },
  30: { alt: 'Miami Little Havana', location: 'Miami, FL' },
  31: { alt: 'New Orleans Garden District', location: 'New Orleans, LA' },
  32: { alt: 'Seattle Gum Wall', location: 'Seattle, WA' },
  33: { alt: 'New York Statue of Liberty', location: 'New York, NY' },
  34: { alt: 'San Francisco Painted Ladies', location: 'San Francisco, CA' },
  35: { alt: 'Las Vegas Fremont Street', location: 'Las Vegas, NV' },
  36: { alt: 'Chicago Millennium Park', location: 'Chicago, IL' },
  37: { alt: 'Miami Wynwood Walls', location: 'Miami, FL' },
  38: { alt: 'New Orleans Frenchmen Street', location: 'New Orleans, LA' },
  39: { alt: 'Seattle Chihuly Garden and Glass', location: 'Seattle, WA' },
  40: { alt: 'New York Empire State Building', location: 'New York, NY' },
  41: { alt: 'San Francisco Coit Tower', location: 'San Francisco, CA' },
  42: { alt: 'Las Vegas High Roller', location: 'Las Vegas, NV' },
  43: { alt: 'Chicago Willis Tower Skydeck', location: 'Chicago, IL' },
  44: { alt: 'Miami Vizcaya Museum and Gardens', location: 'Miami, FL' },
  45: { alt: 'New Orleans City Park', location: 'New Orleans, LA' },
  46: { alt: 'Seattle Museum of Pop Culture', location: 'Seattle, WA' },
  47: { alt: 'New York Top of the Rock', location: 'New York, NY' },
  48: { alt: 'San Francisco Cable Cars', location: 'San Francisco, CA' },
  49: { alt: 'Las Vegas Neon Museum', location: 'Las Vegas, NV' },
  50: { alt: 'Chicago Art Institute', location: 'Chicago, IL' },
  51: { alt: 'Miami Bayside Marketplace', location: 'Miami, FL' },
  52: { alt: 'New Orleans Audubon Park', location: 'New Orleans, LA' },
  53: { alt: 'Seattle Space Needle at night', location: 'Seattle, WA' },
  54: { alt: 'New York Times Square at night', location: 'New York, NY' },
  55: { alt: 'San Francisco Golden Gate Bridge at night', location: 'San Francisco, CA' },
  56: { alt: 'Las Vegas Strip at night', location: 'Las Vegas, NV' },
  57: { alt: 'Chicago Navy Pier at night', location: 'Chicago, IL' },
  58: { alt: 'Miami South Beach at night', location: 'Miami, FL' },
  59: { alt: 'New Orleans French Quarter at night', location: 'New Orleans, LA' },
  60: { alt: 'Seattle Space Needle from Kerry Park at night', location: 'Seattle, WA' },
  61: { alt: 'New York Brooklyn Bridge at night', location: 'New York, NY' },
  62: { alt: 'San Francisco Alcatraz Island at night', location: 'San Francisco, CA' },
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

type GalleryView = 'photos' | 'panoramas';

export default function UnitedStatesGallery() {
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
      <GalleryNavbar currentPath="/galleries/united-states" />

      <ProjectHeader
        title="United States"
        subtitle="Photography collection from the United States"
        backgroundImage="/img/USA/hero.jpg"
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

        {/* Gallery Content */}
        <div className="w-full bg-gray-900 pb-12">
          {currentView === 'photos' && (
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
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white text-sm md:text-base font-semibold px-6 py-4 w-full text-center">
                            {image.alt} - {image.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </div>
          )}

          {currentView === 'panoramas' && (
            <div className="space-y-10">
              {[
                { id: 1, location: 'Arizona' },
                { id: 2, location: 'Utah' },
                { id: 3, location: 'California' }
              ].map((item) => (
                <div key={item.id} className="w-full group relative" style={{ marginBottom: '40px' }}>
                  <PanoramaViewer
                    src={`/img/USA/panorama-USA-${item.id}.JPG`}
                    location={item.location}
                  />
                </div>
              ))}
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
                <p>{selectedImage.alt} - {selectedImage.location}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

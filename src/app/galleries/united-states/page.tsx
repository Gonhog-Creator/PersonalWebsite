'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { GradientButton } from '@/components/ui/gradient-button';
import { FaTimes } from 'react-icons/fa';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { PanoramaViewer } from '@/components/gallery/PanoramaViewer';
import { ZoomableImage } from '@/components/gallery/ZoomableImage';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  location: string;
}

type GalleryView = 'photos' | 'panoramas' | 'drone';

// Helper function to generate image paths
const getImagePath = (id: number) => {
  const basePath = '/img/USA/usa';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos: number[] = [2];

// Image details with descriptions and locations
const imageDetails: Record<number, { alt: string; location: string }> = {
  1: { alt: 'Waterfall created by glaciermelt', location: 'Washington' },
  3: { alt: 'Entrance to Reno', location: 'Nevada' },
  4: { alt: 'Mojave Sand Dunes', location: 'California' },
  5: { alt: 'Montezuma Castle', location: 'Arizona' },
  6: { alt: 'Arch at Bryce Canyon National Park', location: 'Utah' },
  7: { alt: 'Natural Arches', location: 'Oregon' },
  8: { alt: 'Diablo Lake', location: 'Washington' },
  9: { alt: 'Mountain', location: 'Arizona' },
  10: { alt: 'Arches National Park', location: 'Utah' },
  11: { alt: 'Me hiking', location: 'Oregon' },
  12: { alt: 'Death Valley', location: 'California' },
  13: { alt: 'Coastline', location: 'Oregon' },
  14: { alt: 'Inside vegetation', location: 'Oregon' },
  15: { alt: 'Handstand on Devil\'s Bridge', location: 'Arizona' },
  16: { alt: 'Standing with redwoods', location: 'California' },
  17: { alt: 'Pinecone', location: 'Oregon' },
  18: { alt: 'Standing IN redwoods', location: 'California' },
  19: { alt: 'Me and hoodoos', location: 'Utah' },
  20: { alt: 'Smoke in the air', location: 'Oregon' },
  21: { alt: 'Standing in arches', location: 'Utah' },
  22: { alt: 'Smokey sunset', location: 'Oregon' },
  23: { alt: 'Grand Canyon', location: 'Arizona' },
  24: { alt: 'Flaming skies', location: 'Oregon' },
  25: { alt: 'Standing in arches', location: 'Utah' },
  26: { alt: 'Rough Skinned Newt', location: 'Oregon' },
  27: { alt: 'Standing in arches', location: 'Utah' },
  28: { alt: 'Saguaro Cactus', location: 'Arizona' },
  29: { alt: 'Bryce Canyon National Park', location: 'Arizona' },
  30: { alt: 'Mt. Olympus over runway', location: 'Washington' },
  31: { alt: 'Leavenworth', location: 'Washington' },
  32: { alt: 'Mount Olympus from afar', location: 'Washington' },
  33: { alt: 'Sunset road', location: 'Washington' },
  34: { alt: 'Sea and Mt. Olympus', location: 'Washington' },
  35: { alt: 'Snow and Mt. Olympus', location: 'Washington' },
  36: { alt: 'Seattle', location: 'Washington' },
  37: { alt: 'Rainbow clouds', location: 'Washington' },
  38: { alt: 'Fern Canyon', location: 'Oregon' },
  39: { alt: 'Mount Rainier over Lost Lake', location: 'Oregon' },
  40: { alt: 'Snowballs', location: 'Washington' },
  41: { alt: 'Montezuma Well', location: 'Arizona' },
  42: { alt: 'Backflip', location: 'Arizona' },
  43: { alt: 'Banana Slug', location: 'Oregon' },
  44: { alt: 'Mountain Lake', location: 'Oregon' },
  45: { alt: 'Waterfall', location: 'Oregon' },
  46: { alt: 'Interesting rock formation', location: 'Utah' },
  47: { alt: 'Kalaloch Tree of Life', location: 'Oregon' },
  48: { alt: 'Just hanging out', location: 'Oregon' },
  49: { alt: 'Dustdevil', location: 'Montana' },
  50: { alt: 'River rapids', location: 'Montana' },
  51: { alt: 'Waterfall', location: 'Montana' },
  52: { alt: 'Lake MacDonald', location: 'Montana' },
  53: { alt: 'Sunset', location: 'Montana' },
  54: { alt: 'Mount Rushmore', location: 'South Dakota' },
  55: { alt: 'Mount Rushmore', location: 'South Dakota' },
  56: { alt: 'Sunset', location: 'South Dakota' },
  57: { alt: 'Lichen on tree', location: 'Oregon' },
  58: { alt: 'Mountain', location: 'Oregon' },
  59: { alt: 'Lost Lake', location: 'Oregon' },
  60: { alt: 'Mount Rainier with clouds', location: 'Oregon' },
  61: { alt: 'Jeff relaxes', location: 'Oregon' },
  62: { alt: 'Mount Rainier over Lost Lake', location: 'Oregon' },
  63: { alt: 'Bird on tree', location: 'Oregon' },
  64: { alt: 'Mountain Zen', location: 'Oregon' },
};

// Panorama locations data
const panoramaLocations = [
  { id: 1, location: 'Grand Canyon' },
  { id: 2, location: 'Yosemite' },
  { id: 3, location: 'Yellowstone' },
  { id: 4, location: 'Zion' },
  { id: 5, location: 'Glacier' },
  { id: 6, location: 'Arches' },
  { id: 7, location: 'Bryce Canyon' },
  { id: 8, location: 'Mount Rainier' },
  { id: 9, location: 'Olympic' }
];

export default function USAGallery() {
  // Generate gallery images with useMemo, excluding missing photos
  const galleryImages = useMemo<GalleryImage[]>(() => {
    // Start with images from imageDetails
    const images = Object.entries(imageDetails)
      .map(([id, details]) => ({
        id: parseInt(id, 10),
        src: getImagePath(parseInt(id, 10)),
        alt: details.alt,
        location: details.location
      }));
    
    // Add any additional images that might not be in imageDetails
    for (let i = 1; i <= 50; i++) {
      if (!missingPhotos.includes(i) && !imageDetails[i]) {
        images.push({
          id: i,
          src: getImagePath(i),
          alt: `Photo ${i}`,
          location: 'USA'
        });
      }
    }
    
    return images.filter(image => !missingPhotos.includes(image.id));
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

  // Verify image paths
  useEffect(() => {
    console.log('Verifying image paths...');
    galleryImages.forEach(img => {
      const imgEl = new window.Image();
      imgEl.onload = () => console.log(`✅ Image loaded: ${img.src}`);
      imgEl.onerror = () => console.error(`❌ Error loading image: ${img.src}`);
      imgEl.src = img.src;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Project Header */}
      <ProjectHeader />

      {/* Header with title and navigation */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/img/USA/panorama-USA-1.jpg"
            alt="USA Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">United States of America</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              35 states, 20 national parks, 11,200 miles. Through two road trips through the western United States, I have seen a large swath of this great country and enjoyed every second of it.
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
              breakpointCols={breakpointCols}
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
                          {image.alt}
                        </p>
                      </div>
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
                      Maybe with a big enough photo I can see every state bird.
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
                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/USA/panorama-USA-${item.id}.jpg`}
                      alt={`${item.location}`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">United States From Above</h2>
              <div className="aspect-w-16 aspect-h-9 w-full max-w-6xl">
                <video
                  className="w-full h-auto rounded-lg shadow-xl"
                  controls
                  loop
                  playsInline
                  src="/vids/USA 2025 Recap 2k.mp4"
                >
                  Your browser does not support the video tag.
                </video>
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
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white text-center">
              <p className="font-medium">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

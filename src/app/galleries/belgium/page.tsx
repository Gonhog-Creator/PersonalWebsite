'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
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
  const basePath = '/img/Belgium/belgium';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos = [36, 47];

// Image details for alt text
const imageDetails: Record<number, { alt: string }> = {
  1: { alt: 'Arafed man with a backpack and a backpack on his back.' },
  2: { alt: 'There is a man riding a bike down a cobblestone street.' },
  3: { alt: 'Baskets of doughnuts and other pastries are on display in a store window.' },
  4: { alt: 'There are many people waiting at the train station for the train.' },
  5: { alt: 'There is a long hallway with a bunch of stairs and a sign.' },
  6: { alt: 'There is a statue of a man riding a horse in a park.' },
  7: { alt: 'There is a glass of beer sitting on a table.' },
  8: { alt: 'Arafed view of a tall building with a clock tower.' },
  9: { alt: 'There is a river running through a city with buildings on both sides.' },
  10: { alt: 'There is a large building with statues on the top of it.' },
  11: { alt: 'Several people riding bikes down a cobblestone street in a city.' },
  12: { alt: 'There are many chairs and tables on the street in the city.' },
  13: { alt: 'There is a bar with a lot of bottles of wine on the shelves.' },
  14: { alt: 'There is a table with a bowl of soup on it.' },
  15: { alt: 'Painting of a painting of a ship in a harbor with people on the shore.' },
  16: { alt: 'There is a man standing in a church with a large painting on the wall.' },
  17: { alt: 'There is a doorway with a clock above it in a building.' },
  18: { alt: 'There are many flags flying in front of a building.' },
  19: { alt: 'People walking around a plaza in front of a tall building.' },
  20: { alt: 'Arafed church with a colorful altar and stained glass windows.' },
  21: { alt: 'There is a wooden door with a lion on it.' },
  22: { alt: 'There is a windmill in the distance with a fence in the foreground.' },
  23: { alt: 'Arafed windmill in a field with a cloudy sky in the background.' },
  24: { alt: 'There is a tall tower with a clock on it and a flag on top.' },
  25: { alt: 'Flags flying in the wind on top of a building with a clock tower.' },
  26: { alt: 'There is a large building with a clock on the top of it.' },
  27: { alt: 'There is a clock tower with a steeple on top of it.' },
  28: { alt: 'Arafed view of a full moon in a blue sky.' },
  29: { alt: 'Arafed view of a city with a sunset in the background.' },
  30: { alt: 'Arafed view of a city with a clock tower and a sunset.' },
  31: { alt: 'Someone standing on a tile floor with a piece of paper on it.' },
  32: { alt: 'Arafed man sitting on the ground in front of a windmill.' },
  33: { alt: 'Three men sitting on a bench next to a wall with graffiti.' },
  34: { alt: 'Arafed view of a canal with buildings and trees along it.' },
  35: { alt: 'People walking on a cobblestone street in front of a large building.' },
  37: { alt: 'People walking on a cobblestone street in front of a cathedral.' },
  38: { alt: 'People walking on a sidewalk in front of a large cathedral.' },
  39: { alt: 'Araffes are walking on the street in front of a church.' },
  40: { alt: 'There is a man riding a bike in front of a building.' },
  41: { alt: 'There are many people walking down the sidewalk of a market.' },
  42: { alt: 'There is a room with a lot of books and liquor bottles.' },
  43: { alt: 'There is a room filled with books and liquor bottles.' },
  44: { alt: 'Arafed man walking down a narrow alley way in a city.' },
  45: { alt: 'Boats are traveling down a canal in a city with tall buildings.' },
  46: { alt: 'There is a tunnel with a stone floor and a brick ceiling.' },
  48: { alt: 'Arafed view of a city with a river and a bridge.' },
  49: { alt: 'Arafed view of a city through a window in a stone wall.' },
  50: { alt: 'There is a flag flying high above a city with a clock tower.' },
  51: { alt: 'There is a man sitting on a bench in front of a window.' },
  52: { alt: 'There is a man sitting in front of a window with a light on.' },
  53: { alt: 'Arafed man sitting in front of a window talking on a cell phone.' },
  54: { alt: 'There is a man sitting in front of a window talking on a cell phone.' },
  55: { alt: 'Arafed man standing in a jail cell with a gun.' },
  56: { alt: 'Arafed man sitting in a stone wall with a backpack on his back.' },
  57: { alt: 'Drawing of a man sitting on a chair with a group of people.' },
  58: { alt: 'There are people standing in a room with stone walls and wooden floors.' },
  59: { alt: 'There is a large brick building with a clock on top.' },
  60: { alt: 'There are many people on a boat going down the river.' },
  61: { alt: 'Arafed building with a clock tower on the top of it.' },
  62: { alt: 'People walking on the sidewalk in front of a red building.' },
  63: { alt: 'Cars parked in front of a large building with a statue on top.' },
  64: { alt: 'Arafed cathedral with a clock tower and a clock on the front.' },
  65: { alt: 'There is a room with a lot of books and a lamp.' },
  66: { alt: 'Arafed tower with a flag on top of it with a clock.' },
  67: { alt: 'Arafed tower with a flag on top of it with a clock.' },
  68: { alt: 'Arafed tower with a clock on the top of it.' },
  69: { alt: 'Arafed stone angel on a building with a clock on it.' },
  70: { alt: 'There is a statue of an angel on a pedestal in front of a building.' },
  71: { alt: 'There is a statue of a man on the top of a building.' },
  72: { alt: 'There is a street light that is on a pole in front of a building.' },
  73: { alt: 'Graffiti on a wall of a building with a man walking by.' },
  74: { alt: 'Graffiti covered wall with people walking down it in a narrow alley.' },
  75: { alt: 'Three baskets of food are sitting on a table with a person.' },
  76: { alt: 'There is a man wearing a helmet and a helmet on his head.' },
  77: { alt: 'There are many different types of swords displayed on display.' },
  78: { alt: 'There are many guns in the glass case on display.' },
  79: { alt: 'There are two guns in a glass case on display.' },
  80: { alt: 'There are two men that are standing in a tunnel.' },
  81: { alt: 'There is a man that is standing next to a pole.' },
  82: { alt: 'A close up of a pole with stickers on it.' },
  83: { alt: 'Arafed man sitting in front of a window with a glass window.' },
  84: { alt: 'Arafed man sitting in front of a window with a cell phone.' },
  85: { alt: 'Arafed view of a full moon in a blue sky.' },
  87: { alt: 'Nighttime view of a city with a bridge and a clock tower.' },
  88: { alt: 'There are two people sitting on the steps of a building.' },
  89: { alt: 'There is a statue of jesus on a wall in a window.' },
};

// Panorama locations data
const panoramaLocations = [
  { id: 1, location: 'Brussels' },
  { id: 2, location: 'Bruges' },
  { id: 3, location: 'Ghent' },
  { id: 4, location: 'Antwerp' },
  { id: 5, location: 'Leuven' },
  { id: 6, location: 'Mechelen' },
  { id: 7, location: 'Ypres' },
  { id: 8, location: 'Dinant' },
  { id: 9, location: 'Durbuy' }
];



export default function BelgiumGallery() {
  // Generate gallery images with useMemo, excluding missing photos
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 89 }, (_, i) => {
      const id = i + 1;
      const details = imageDetails[id] || {};
      return {
        id,
        src: getImagePath(id),
        location: 'Belgium',
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
            src="/img/Belgium/belgium_panorama (5).jpg"
            alt="Belgium Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Belgium</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              The medieval charm of Ghent’s historic streets and the picturesque canals of Bruges reveal Belgium’s rich past, where centuries-old architecture and vibrant culture come alive.
              Along the way, indulging in world-famous Belgian chocolate and crispy waffles makes the experience even sweeter.
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
                        loading="lazy"
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Belgium 2025 Recap</h2>
              <div className="aspect-w-16 aspect-h-9 w-full max-w-6xl">
                <video
                  className="w-full h-auto rounded-lg shadow-xl"
                  controls
                  loop
                  playsInline
                  preload="none"
                  src="/vids/Belgium 2025 Recap 2k.mp4"
                >
                  Your browser does not support the video tag.
                </video>
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
    </div>
  );
}

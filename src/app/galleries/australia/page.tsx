'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { GradientButton } from '@/components/ui/gradient-button';
import { FaTimes } from 'react-icons/fa';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { PanoramaViewer } from '@/components/gallery/PanoramaViewer';
import { ZoomableImage } from '@/components/gallery/ZoomableImage';
import { VideoPlayer } from '@/components/gallery/VideoPlayer';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  location: string;
}

type GalleryView = 'photos' | 'panoramas' | 'drone';

// Helper function to generate image paths
const getImagePath = (id: number) => {
  const basePath = '/img/Australia/australia';
  return `${basePath} (${id}).jpg`;
};

// Image details for alt text
const imageDetails: Record<number, { alt: string }> = {
  1: { alt: 'Adelaide Central Market' },
  2: { alt: 'Smoked meats' },
  3: { alt: 'Outback' },
  4: { alt: 'Sunset in Alice Springs' },
  5: { alt: 'Red-capped Robin' },
  6: { alt: 'Australia Zebra Finches kissing' },
  7: { alt: 'Curious Ground Bird' },
  8: { alt: 'Red-tailed Black Cockatoo' },
  9: { alt: 'Asutralian Numbat' },
  10: { alt: 'Pink Flower' },
  11: { alt: 'Kangaroo' },
  12: { alt: 'Ostritch' },
  13: { alt: 'Dingo' },
  14: { alt: 'Biking through the outback' },
  15: { alt: 'Biking through the outback' },
  16: { alt: 'Simpsons Gap - Alice Springs' },
  17: { alt: 'Water droplets' },
  18: { alt: 'Knobbly fruit' },
  19: { alt: 'Sailboat' },
  20: { alt: 'Little Boat' },
  21: { alt: 'Underground Hotel - Cooper Pedy' },
  22: { alt: 'Snorkling (from above)' },
  23: { alt: 'Green flashes in opal' },
  24: { alt: 'Mining equipment - Cooper Pedy' },
  25: { alt: 'Bynoe\'s gecko' },
  26: { alt: 'Sunset - Coober Pedy' },
  27: { alt: 'Sunset - Coober Pedy' },
  28: { alt: 'Mining equipment - Cooper Pedy' },
  29: { alt: 'Tray of uncut opals' },
  30: { alt: 'Standing on mining equipment' },
  31: { alt: 'Bucket Truck - Cooper Pedy' },
  32: { alt: 'Cruiser' },
  33: { alt: 'Beach Estuary' },
  34: { alt: 'Egret on sand' },
  35: { alt: 'Sunlight through trees' },
  36: { alt: 'Australian flag' },
  37: { alt: 'Trees on rocks' },
  38: { alt: 'Yellow cockroach' },
  39: { alt: 'Dingo Footprint' },
  40: { alt: 'Sand Dunes - Fraser Island' },
  41: { alt: 'Sand Dunes - Fraser Island' },
  42: { alt: 'Sunset - Fraser Island' },
  43: { alt: 'Rollout - Fraser Island' },
  44: { alt: 'Camera selfie' },
  45: { alt: 'Outcropping' },
  46: { alt: 'An eye for an eye' },
  47: { alt: 'Lace Monitor' },
  48: { alt: 'Lace Monitor' },
  49: { alt: 'Lace Monitor' },
  50: { alt: 'S.S. Maheno Wreck - Fraser Island' },
  51: { alt: 'S.S. Maheno Wreck - Fraser Island' },
  52: { alt: 'Sailboats' },
  53: { alt: 'Lighthouse' },
  54: { alt: 'Bee on flower' },
  55: { alt: 'Flower' },
  56: { alt: 'Common Blackbird' },
  57: { alt: 'Rainbow lorikeets' },
  58: { alt: 'Walkway - Sydney' },
  59: { alt: 'Street musician' },
  60: { alt: 'St. Mary\'s Cathedral - Sydney' },
  61: { alt: 'The one and only' },
  62: { alt: 'Sydney Skyline' },
  63: { alt: 'Cocklebay Warf fountain' },
  64: { alt: 'Mall stop' },
  65: { alt: 'Marcus Who?' },
  66: { alt: 'Root Tangle' },
  67: { alt: 'Opera at night' },
  68: { alt: 'Skyline at night' },
  69: { alt: 'Blue-faced Honeyeater' },
  70: { alt: 'Sailboat' },
  71: { alt: 'Me on sailboat' },
  72: { alt: 'Sailboat Group' },
  73: { alt: 'Sunset - Whitsundays' },
  74: { alt: 'More sailboats' },
  75: { alt: 'Jet ski fun' },
  76: { alt: 'Lace Monitor' },
  77: { alt: 'Golden Orb Weaver Spider' },
  78: { alt: 'Sand balls' },
  79: { alt: 'White Whitsunday Beach sand' },
  80: { alt: 'Lil crab' },
  81: { alt: 'Me' },
  82: { alt: 'Coral Reef from the sky' },
  83: { alt: 'Big Fish' },
  84: { alt: 'Bigger Fish' },
  85: { alt: 'Zak, the captain' },
  86: { alt: 'Sunset - Whitsundays' },
  87: { alt: 'Squid' },
  88: { alt: 'Squid' },
  89: { alt: 'Yellow-bellied Sunbird' },
  90: { alt: 'Spiny Orbweaver Spider' },
  91: { alt: 'Bird' },
  92: { alt: 'Adelaide Airport' },
  93: { alt: 'Grey-headed FLying Fox' },
  94: { alt: 'Flower' },
  95: { alt: 'Flower' },
  96: { alt: 'Lily (you thought it was going to be flower didn\'t you)' },
  97: { alt: 'Flying out' },
  98: { alt: 'Whitsunday\'s island and reef from above' },
  99: { alt: 'Sunset at Alice Springs' },
};

// Masonry breakpoints


export default function AustraliaGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentView, setCurrentView] = useState<GalleryView>('photos');
  
  // Generate gallery images with useMemo
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 99 }, (_, i) => {
      const id = i + 1;
      const details = imageDetails[id] || { alt: `Australia Photo ${id}` };
      return {
        id,
        src: getImagePath(id),
        alt: details.alt,
        location: 'Australia' // Default location, can be updated if needed
      };
    });
  }, []);

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
            src="/img/Argentina/argentina_panorama (8).jpg"
            alt="Argentina Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Australia</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              Dusty bus rides through the Australian outback and sail-driven adventures on the eastern coast.
              Scuba diving through the Great Barrier Reef and walking through beautiful cities.
              The land down under is a magnificnent place.
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
                      Pictures large enough to capture the outback.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <div className="w-full py-8">
                {[
                  { id: 1, location: 'Whitsunday\'s island and reef from above' },
                  { id: 2, location: 'Sunset at Alice Springs' },
                  { id: 3, location: 'Sunset over the Whitsundays' },
                  { id: 4, location: 'Brisbane' },
                  { id: 5, location: 'Fraser Island Sand Dunes' },
                  { id: 6, location: 'Adelaide' },
                  { id: 7, location: 'Bondi Beach Cliffs - Sydney' },
                  { id: 8, location: 'Great Barrier Reef Scuba Diving' },
                  { id: 9, location: 'S.S. Maheno Wreck - Fraser Island' },
                  { id: 10, location: 'Ridgeline in Alice Springs' },
                  { id: 11, location: 'Coastline' },
                  { id: 12, location: 'Sunset at Alice Springs' },
                  { id: 13, location: 'Melbourne' },
                  { id: 14, location: 'Sunset at Alice Springs' },
                  { id: 15, location: 'Fraser Island Sand Dunes' },
                  { id: 16, location: 'Melbourne' },
                  { id: 17, location: 'Coastline in Sydney' },
                  { id: 18, location: 'Whitsunday Coastline' },
                  { id: 19, location: 'Whitsunday Coastline' },
                  { id: 20, location: 'Fraser Island Dunes' },
                  { id: 21, location: 'Whitsunday Island' },
                  { id: 22, location: 'Whitsunday Beach' },
                  { id: 23, location: 'Sydney Opera House' },
                  { id: 24, location: 'Coober Pedy' },
                  { id: 25, location: 'Sydney Opera House' },
                  { id: 26, location: 'Whitsunday Beach' }

                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Australia/panorama-australia (${item.id}).jpg`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Australia Drone Footage</h2>
              <div className="w-full max-w-6xl">
                <VideoPlayer 
                  src="/vids/Australia 2025 Recap 2k.mp4"
                  title="Australia 2025 Drone Footage"
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
    </div>
  );
}

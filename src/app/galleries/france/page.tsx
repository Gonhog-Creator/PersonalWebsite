'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  const basePath = '/img/France/france';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos = [147];

// Image details for alt text
const imageDetails: Record<number, { alt: string }> = {
  // Scenic views and landscapes
  1: { alt: 'There are many people walking around in the courtyard of a palace.' },
  2: { alt: 'There is a bridge over a river with a boat going under it.' },
  3: { alt: 'Aerial view of a city with a castle on a hill.' },
  4: { alt: 'Arafed view of a town on a hill with a full moon in the sky.' },
  5: { alt: 'Arafed view of a garden with a circular lawn and a building in the background.' },
  6: { alt: 'There is a large castle on a hill with a clock tower.' },
  7: { alt: 'There is a large garden with a lot of trees and bushes.' },
  8: { alt: 'Araffe view of a city with a lot of buildings and a tall tower.' },
  9: { alt: 'Arafed view of a city with a large cathedral and a crane.' },
  10: { alt: 'Boats are docked on the river in a city with tall buildings.' },
  11: { alt: 'Araful looking street with people walking and cars parked on both sides.' },
  12: { alt: 'People walking around a courtyard in front of a large building.' },
  13: { alt: 'There is a boat that is floating down the river in the city.' },
  14: { alt: 'Araffe wheel with white spokes and a sky background.' },
  15: { alt: 'Arafed view of a winding road in the mountains with a view of a valley.' },
  16: { alt: 'Arafed arch with a statue on top of it in a courtyard.' },
  17: { alt: 'Arafed view of a city with a clock tower and a sunset.' },
  18: { alt: 'Aerial view of a city with a large park and a river.' },
  19: { alt: 'Arafed view of a large cathedral with a clock tower.' },
  20: { alt: 'Araffe ferris wheel in front of a city skyline at sunset.' },
  21: { alt: 'Sunset over a bridge with a boat in the water.' },
  22: { alt: 'There is a statue of a man on a horse in a plaza.' },
  23: { alt: 'There are many people walking through a hallway in a building.' },
  24: { alt: 'Arafed ceiling with a painting of a banquet in a palace.' },
  25: { alt: 'There is a painting on the ceiling of a room with a clock.' },
  26: { alt: 'There is a bust of a man with a large head on a pedestal.' },
  27: { alt: 'There are many people walking in a large hall with chandeliers.' },
  28: { alt: 'There are many gold vases with crystal chandeliers in a room.' },
  29: { alt: 'There are two people playing with a frisbee in a courtyard.' },
  30: { alt: 'There is a man kneeling down to a golden gate.' },
  31: { alt: 'There are many tomatoes in a box on the table.' },
  32: { alt: 'Someone is cutting up a piece of meat with a knife.' },
  33: { alt: 'There is a small tree that is in front of a statue.' },
  34: { alt: 'There is a archway that leads to a path through a hedged area.' },
  35: { alt: 'There is a statue of a woman sitting on a pedestal.' },
  36: { alt: 'Arafed statue of a woman holding a vase in a park.' },
  37: { alt: 'There is a statue of a dog and a deer on a rock.' },
  38: { alt: 'There are many people walking around a fountain in a park.' },
  39: { alt: 'There is a statue of a woman laying on a bench.' },
  40: { alt: 'There is a long path that leads to a tunnel of trees.' },
  41: { alt: 'Arafed statue of a man with a goat in a park.' },
  42: { alt: 'There is a statue of an angel holding a bird in a park.' },
  43: { alt: 'Aerial view of a large garden with a lot of trees.' },
  44: { alt: 'Aerial view of a river running through a lush green forest.' },
  45: { alt: 'Boats are docked on the river at dusk near a bridge.' },
  46: { alt: 'Boats are docked on the water at dusk near a bridge.' },
  47: { alt: 'Araffe carousel at sunset with cars parked in front of it.' },
  48: { alt: 'Araffes in front of the eiffel tower at sunset.' },
  49: { alt: 'Araffe tower with a light on at night in a park.' },
  50: { alt: 'There is a tall obel with a yellow top in a parking lot.' },
  51: { alt: 'Arafed view of a large arch with a car in front of it.' },
  52: { alt: 'There are two statues on the top of a bridge with a sky background.' },
  53: { alt: 'Arafed building with a tower and a bridge over a river.' },
  54: { alt: 'There are many people walking around a city square in the daytime.' },
  55: { alt: 'There is a clock tower that is on the side of a building.' },
  56: { alt: 'Arafed view of a cathedral with two spires and a boat in the water.' },
  57: { alt: 'Arafed view of a church with a reflection in the water.' },
  58: { alt: 'Arafed view of a church with a reflection in the water.' },
  59: { alt: 'Arafed view of a church with a body of water in front of it.' },
  60: { alt: 'Arafed view of a city with a river running through it.' },
  61: { alt: 'Aerial view of a city with a river running through it.' },
  62: { alt: 'Arafed view of a city with a river and a bridge.' },
  63: { alt: 'Arafed view of a church with a bridge and a river.' },
  64: { alt: 'There is a large building with a clock tower in the background.' },
  65: { alt: 'Arafed stained glass window in a church with a clock on the wall.' },
  66: { alt: 'There is a clock on the wall of a building with a ceiling.' },
  67: { alt: 'Arafed view of a large cathedral with a clock tower.' },
  68: { alt: 'There is a tall tower with a clock on top of it.' },
  69: { alt: 'There are many people walking down the street in the city.' },
  70: { alt: 'People are walking down a narrow street lined with buildings and lamps.' },
  71: { alt: 'Brightly colored flowers line a brick wall in front of a building.' },
  72: { alt: 'There is a man sitting in a cave with a light on.' },
  73: { alt: 'A close up of a piece of food with a drop of water on it.' },
  74: { alt: 'There is a man standing in a cave with icicles hanging from the ceiling.' },
  75: { alt: 'There are many rocks and water in the cave.' },
  76: { alt: 'There is a cave with a lot of water and rocks.' },
  77: { alt: 'There are two horses that are standing in the dirt.' },
  78: { alt: 'There is a field of sunflowers in front of a building.' },
  79: { alt: 'There is a small river with a boat in it surrounded by trees.' },
  80: { alt: 'There is a bird that is standing in the water.' },
  81: { alt: 'There is a cave with a hole in it that is filled with water.' },
  82: { alt: 'There is a bear that is standing in the water by the rocks.' },
  83: { alt: 'There is a small waterfall running through a forest filled with trees.' },
  84: { alt: 'There is a man riding a boat down a river in the woods.' },
  85: { alt: 'There is a small river running through a small town.' },
  86: { alt: 'Lavender field in front of a church with a clock tower.' },
  87: { alt: 'Lavender field in front of a church with a steeple and steeple.' },
  88: { alt: 'Lavender field in front of a church with a steeple and steeple.' },
  89: { alt: 'Lavender bushes line a path in a field of lavender.' },
  90: { alt: 'Purple flowers in a field with a blurry background.' },
  91: { alt: 'Lavender flowers with a bee on them in a field.' },
  92: { alt: 'Lavender flower with a lady bug on it.' },
  93: { alt: 'Aerial view of a castle perched on a cliff in the mountains.' },
  94: { alt: 'Arafed bee on a lavender flower with a blurry background.' },
  95: { alt: 'There is a small waterfall flowing through a canyon with a rock face.' },
  96: { alt: 'Arafed bee on a lavender flower with a blurry background.' },
  97: { alt: 'There is a train that is going down the tracks on the mountain.' },
  98: { alt: 'Lavender fields in a lavender field with a church in the distance.' },
  99: { alt: 'There is a net hanging over a field of oranges.' },
  100: { alt: 'There are many street signs on a pole in the city.' },
  101: { alt: 'Painting of a man riding a horse next to a building.' },
  102: { alt: 'Painting of irises in a garden with a stone wall.' },
  103: { alt: 'Painting of a man with a beard on a stone wall.' },
  104: { alt: 'Arafed statue of a man with a bird in his hand.' },
  105: { alt: 'Starry night painting on a wall with a yellow border.' },
  106: { alt: 'There is a courtyard with a fountain and a garden in it.' },
  107: { alt: 'Three framed pictures of people on a wall with a brick wall.' },
  108: { alt: 'There is a large garden with a stone wall and a stone fence.' },
  109: { alt: 'There is a small bed in a room with a painting on the wall.' },
  110: { alt: 'There is a view of a field through a window of a building.' },
  111: { alt: 'There are two pink flowers that are blooming in the garden.' },
  112: { alt: 'There is a close up of a bunch of flowers with yellow stems.' },
  113: { alt: 'There are many yellow sunflowers in a field of green leaves.' },
  114: { alt: 'Someone holding a purple flower in their hand with a blurry background.' },
  115: { alt: 'There is a butterfly that is sitting on a flower in the grass.' },
  116: { alt: 'There is a butterfly that is flying over some lavender flowers.' },
  117: { alt: 'There is a butterfly that is sitting on a flower.' },
  118: { alt: 'There is a view of a mountain with a winding road.' },
  119: { alt: 'Aerial view of a road winding through a valley with trees.' },
  120: { alt: 'Arafed view of a town with a castle on top of a hill.' },
  121: { alt: 'Arafed view of a town on a hill with a church on top.' },
  122: { alt: 'There is a small church in the middle of a vineyard.' },
};

export default function FranceGallery() {
  const [currentView, setCurrentView] = useState<GalleryView>('photos');
  
  // Generate gallery images with useMemo, excluding missing photos
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 122 }, (_, i) => {
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
            src="/img/France/france_panorama (6).jpg"
            alt="France Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">France</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              From the historic streets and iconic architecture of Paris to the charming canals and timbered houses of Strasbourg,
              and the sun-drenched landscapes of Southern France, this country is a rich tapestry of culture, history, and breathtaking beauty.
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
                      Paris from above is a beautiful sight.
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
                  { id: 12, location: 'DescriptionComingSoon' },
                  { id: 13, location: 'DescriptionComingSoon' },
                  { id: 14, location: 'DescriptionComingSoon' },
                  { id: 15, location: 'DescriptionComingSoon' },
                  { id: 16, location: 'DescriptionComingSoon' },
                  { id: 17, location: 'DescriptionComingSoon' },
                  { id: 18, location: 'DescriptionComingSoon' },
                  { id: 19, location: 'DescriptionComingSoon' },
                  { id: 20, location: 'DescriptionComingSoon' },
                  { id: 21, location: 'DescriptionComingSoon' },
                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/France/france_panorama (${item.id}).jpg`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">France 2025 Recap</h2>
              <div className="w-full max-w-6xl">
                <YouTubePlayer 
                  videoId="IxwI3ugcBK4"
                  title="France 2025 Drone Footage"
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
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white text-center">
              <p className="font-medium">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

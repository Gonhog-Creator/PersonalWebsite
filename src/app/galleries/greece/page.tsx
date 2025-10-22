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

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  location: string;
}

type GalleryView = 'photos' | 'panoramas' | 'drone';

// Helper function to generate image paths
const getImagePath = (id: number) => {
  const basePath = '/img/Greece/greece';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos: number[] = [];

// Image details for alt text
const imageDetails: Record<number, { alt: string }> = {
  1: { alt: 'Mountains in the background with a city on top of them.' },
  2: { alt: 'Arafed view of a sunset over a city with a train going by.' },
  3: { alt: 'Arafed view of a hill with a building on top of it.' },
  4: { alt: 'Aerial view of a city with a lot of buildings and a train.' },
  5: { alt: 'There is a man standing on a roof looking out over a city.' },
  6: { alt: 'There is a small lizard that is sitting on a finger.' },
  7: { alt: 'There is a tree with oranges growing on it and a blue sky in the background.' },
  8: { alt: 'There is a tree with many fruits growing on it.' },
  9: { alt: 'There is a large bush of pink flowers in the middle of the garden.' },
  10: { alt: 'There is a close up of a flower with a blurry background.' },
  11: { alt: 'There is a bush of flowers that are in front of a building.' },
  12: { alt: 'Sunset over a mountain range with a plane flying in the sky.' },
  13: { alt: 'Sunset on the beach with people standing on the sand and a boat in the water.' },
  14: { alt: 'Purple flowers on a tree in a park with a bench.' },
  15: { alt: 'There are many small rocks on the ground with holes in them.' },
  16: { alt: 'There is a stone archway in the middle of a building.' },
  17: { alt: 'There is a stone arch in the middle of a ruin.' },
  18: { alt: 'There is a stone block sitting in the middle of a field.' },
  19: { alt: 'People sitting on the steps of a stone amplisk.' },
  20: { alt: 'Aerial view of a large concrete structure with a circular design.' },
  21: { alt: 'Araffe on a rock with moss and lichens.' },
  22: { alt: 'Arafed man doing a handstand on a mountain top.' },
  23: { alt: 'There is a person sitting on a rock on a mountain.' },
  24: { alt: 'There is a small ant that is walking on the ground.' },
  25: { alt: 'There is a thistle plant with purple flowers in the foreground.' },
  26: { alt: 'Arafed view of a mountain with a view of the ocean.' },
  27: { alt: 'There are many people standing on a mountain top with a view of the ocean.' },
  28: { alt: 'There is a building that is built into the side of a mountain.' },
  29: { alt: 'There is a flag on a rock in the middle of the ocean.' },
  30: { alt: 'There is a man and woman standing outside of a church.' },
  31: { alt: 'They are standing outside of a building with a table and chairs.' },
  32: { alt: 'People walking down a street in a village with a mountain in the background.' },
  33: { alt: 'There are many chairs and umbrellas on the beach near the water.' },
  34: { alt: 'There is a boat that is going through the water with people on it.' },
  35: { alt: 'There is a man that is holding a frisbee on his head.' },
  36: { alt: 'There is a small boat that is traveling in the water.' },
  37: { alt: 'There is a sign that is on the ground near a tree.' },
  38: { alt: 'Arafed sign on the ground that says propylon 31st century bc.' },
  39: { alt: 'There is a man walking through a field with a horse.' },
  40: { alt: 'There are many stone pillars in the middle of a field.' },
  41: { alt: 'There are many stone blocks in the middle of a field.' },
  42: { alt: 'Someone standing next to a large rock with a face on it.' },
  43: { alt: 'Arafed group of people standing in a circle in a park.' },
  44: { alt: 'Several people standing in front of a row of columns in a park.' },
  45: { alt: 'There is a stone with a sign that says to be loved.' },
  46: { alt: 'There is a stone building with a clock tower on top of it.' },
  47: { alt: 'There is a stone building with a stone arch in the middle of it.' },
  48: { alt: 'There is a white boat with a black sail on the water.' },
  49: { alt: 'Several boats are anchored in the clear blue waters of the ocean.' },
  50: { alt: 'Two boats in the water near a rocky shore with a blue sky.' },
  51: { alt: 'Boats in the water with people on them in the water.' },
  52: { alt: 'Boats in the water with people on them in the water.' },
  53: { alt: 'There are two large ships in the water near a hill.' },
  54: { alt: 'People walking along a pier with a boat in the water.' },
  55: { alt: 'There is a sign that says, elanyka toyopie, a hellenic post.' },
  56: { alt: 'There is a large hill with a lot of trees on it.' },
  57: { alt: 'There are two signs on the side of the road that read the direction.' },
  58: { alt: 'There is a boat that is floating in the water near the mountains.' },
  59: { alt: 'Yellow flag with a black eagle on it flying in the sky.' },
  60: { alt: 'A close up of a greek flag flying in the wind.' },
  61: { alt: 'There is a man riding a bike down a dirt road.' },
  62: { alt: 'Arafed view of a sunset over a bay with boats in the water.' },
  63: { alt: 'Sunset over a small town with a body of water in the distance.' },
  64: { alt: 'Arafed view of a sunset over a body of water.' },
  65: { alt: 'Arafed sailboat docked in a harbor with a mountain in the background.' },
  66: { alt: 'There is a red and white boat in the water near a dock.' },
  67: { alt: 'There is a boat that is docked in the water near a dock.' },
  68: { alt: 'There are three cats that are laying down on the ground.' },
  69: { alt: 'There is a white statue of a man on a shelf.' },
  70: { alt: 'Arafed blue and white flag flying in the wind.' },
  71: { alt: 'There is a view of a mountain with a body of water.' },
  72: { alt: 'Arafed view of a bay with boats and a city in the background.' },
  73: { alt: 'There is a boat that is floating in the water near a beach.' },
  74: { alt: 'There is a small church on a mountain with a steeple.' },
  75: { alt: 'There are many baskets of sponges and other items on display.' },
  76: { alt: 'There are many shelves of potatoes in a room with wooden crates.' },
  77: { alt: 'There are many teddy bears on display in a room.' },
  78: { alt: 'There are two men sitting on the bow of a boat.' },
  79: { alt: 'There are two people sitting on the bow of a boat.' },
  80: { alt: 'There is a man sitting on a boat in the water.' },
  81: { alt: 'There is a man sitting on a boat in the water.' },
  82: { alt: 'Arafed sailboat in the water with two people on deck.' },
  83: { alt: 'There are many boats in the water and one is white.' },
  84: { alt: 'Araffes in the foreground of a city with a mountain in the background.' },
  85: { alt: 'Arafed view of a sunset over a city with mountains in the background.' },
  86: { alt: 'Cars parked on the side of a street in a city.' },
  87: { alt: 'Cars parked on the side of a street in a city.' },
  88: { alt: 'Cars parked on the side of the road in a residential area.' },
  92: { alt: 'Arafed view of a large building with scaffolding on the top.' },
  93: { alt: 'There are people standing in front of a large building with columns.' },
  94: { alt: 'People are standing on a hill with a flag flying in the air.' },
  95: { alt: 'Arafed view of a large stone structure with columns and a few people.' },
  96: { alt: 'There is a man flying a kite on a clear day.' },
  97: { alt: 'There is a man standing on a rock in front of a building.' },
  98: { alt: 'There are people standing in front of a large building with columns.' },
  99: { alt: 'There is a stone structure with statues on it in front of a mountain.' },
  100: { alt: 'Arafed man with curly hair and a pink shirt smiling.' },
  101: { alt: 'There are many vases on display on the shelf in the museum.' },
  102: { alt: 'There is a vase with a painting of a man and a woman on horseback.' },
  103: { alt: 'There is a statue of a man carrying a sheep on his back.' },
  104: { alt: 'There are many men in uniform standing in a line.' },
  105: { alt: 'Several soldiers in white uniforms are marching in front of a building.' },
  106: { alt: 'There are many people in the parade marching with instruments.' },
  107: { alt: 'There is a man in a uniform standing next to a building.' },
  108: { alt: 'Zebra butterfly on a flower with a green background.' },
  109: { alt: 'Zebra butterfly on a flower with yellow and white flowers in the background.' },
  110: { alt: 'Zebra butterfly on a flower with a blurry background.' },
  111: { alt: 'There is a large building on top of a hill with a flag flying.' },
};


export default function GreeceGallery() {
  const [currentView, setCurrentView] = useState<GalleryView>('photos');
  
  // Generate gallery images with useMemo, excluding missing photos
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 111 }, (_, i) => {
      const id = i + 1;
      const details = imageDetails[id] || {};
      return {
        id,
        src: getImagePath(id),
        location: 'Greece',
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
      const verifyImages = async () => {
        for (const img of galleryImages) {
          try {
            const response = await fetch(img.src, { method: 'HEAD' });
            if (!response.ok) {
              console.error(`❌ Error loading image: ${img.src}`);
            }
          } catch (error) {
            console.error(`❌ Error checking image: ${img.src}`, error);
          }
        }
      };
      verifyImages();
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
            src="/img/Greece/greece_panorama (23).jpg"
            alt="Greece Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Greece</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              Salt mines, mountains, ice caves, palaces, and more castles than you can count. Welcome to Greece.
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
                      Even Hercules didn&apos;t see this much ocean.
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
                  { id: 22, location: 'DescriptionComingSoon' },
                  { id: 23, location: 'DescriptionComingSoon' },
                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Greece/greece_panorama (${item.id}).jpg`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Greece 2025 Recap</h2>
              <div className="w-full max-w-6xl">
                <VideoPlayer 
                  src="/vids/Greece 2025 Recap 2k.mp4"
                  title="Greece 2025 Drone Footage"
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

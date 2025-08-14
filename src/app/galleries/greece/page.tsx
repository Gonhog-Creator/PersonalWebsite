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
import { ZoomableImage } from '@/components/gallery/ZoomableImage';

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
  const basePath = '/img/Greece/greece';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos = [];

// Generate gallery images array, excluding missing photos
export const galleryImages: GalleryImage[] = Array.from(
  { length: 111 },
  (_, i) => ({
    id: i + 1,
    src: getImagePath(i + 1),
    alt: `Photo ${i + 1}`,
    location: 'Greece'  // Default location
  })
).filter(image => !missingPhotos.includes(image.id));

// Add specific alt text for all images
const imageDetails: Record<number, { alt: string }> = {
  1: { alt: 'Mountains in the background with a city on top of them.' },
  1: { alt: 'Arafed view of a mountain with a very tall rock formation.' },
  2: { alt: 'Arafed view of a sunset over a city with a train going by.' },
  2: { alt: 'Arafed view of a sunset over a body of water.' },
  3: { alt: 'Arafed view of a hill with a building on top of it.' },
  3: { alt: 'Arafed stone seating in front of a large stone structure.' },
  4: { alt: 'Aerial view of a city with a lot of buildings and a train.' },
  4: { alt: 'Aerial view of a small island with a lot of houses on it.' },
  5: { alt: 'There is a man standing on a roof looking out over a city.' },
  5: { alt: 'There is a picture of a view of a mountain range with a lake.' },
  6: { alt: 'There is a small lizard that is sitting on a finger.' },
  6: { alt: 'Arafed view of a mountain with a lake and a mountain range.' },
  7: { alt: 'There is a tree with oranges growing on it and a blue sky in the background.' },
  7: { alt: 'Arafed view of a bay with several boats in it.' },
  8: { alt: 'There is a tree with many fruits growing on it.' },
  8: { alt: 'There are two people on the top of a mountain with a view of the ocean.' },
  9: { alt: 'There is a large bush of pink flowers in the middle of the garden.' },
  9: { alt: 'Arafed view of a mountain with a few trees and a person on a horse.' },
  10: { alt: 'There is a close up of a flower with a blurry background.' },
  10: { alt: 'There is a man that is standing on a mountain with a backpack.' },
  11: { alt: 'There is a bush of flowers that are in front of a building.' },
  11: { alt: 'There is a large group of trees that are in the middle of a mountain.' },
  12: { alt: 'Sunset over a mountain range with a plane flying in the sky.' },
  12: { alt: 'Arafed view of a mountain with a lake and a church.' },
  13: { alt: 'Sunset on the beach with people standing on the sand and a boat in the water.' },
  13: { alt: 'Araffe view of a city with a sunset in the background.' },
  14: { alt: 'Purple flowers on a tree in a park with a bench.' },
  14: { alt: 'There is a man standing on a mountain top looking at the view.' },
  15: { alt: 'There are many small rocks on the ground with holes in them.' },
  15: { alt: 'There are many boats in the water near a mountain.' },
  16: { alt: 'There is a stone archway in the middle of a building.' },
  16: { alt: 'There is a view of a mountain range with a few people on it.' },
  17: { alt: 'There is a stone arch in the middle of a ruin.' },
  17: { alt: 'Sunset over the ocean with a mountain range and a power line.' },
  18: { alt: 'There is a stone block sitting in the middle of a field.' },
  18: { alt: 'There is a large stone wall with a small building on it.' },
  19: { alt: 'People sitting on the steps of a stone amplisk.' },
  19: { alt: 'Araffes sitting on a hill overlooking a valley and a lake.' },
  20: { alt: 'Aerial view of a large concrete structure with a circular design.' },
  20: { alt: 'There is a stone structure with steps and steps leading up to it.' },
  21: { alt: 'Araffe on a rock with moss and lichens.' },
  21: { alt: 'There is a view of a mountain range with a lake and mountains in the distance.' },
  22: { alt: 'Arafed man doing a handstand on a mountain top.' },
  22: { alt: 'Arafed view of a town and a body of water from a hill.' },
  23: { alt: 'There is a person sitting on a rock on a mountain.' },
  23: { alt: 'Aerial view of a small island with a lot of buildings.' },
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
  65: { alt: 'Arafed view of a sunset over a bay with boats in the water.' },
  66: { alt: 'Arafed sailboat docked in a harbor with a mountain in the background.' },
  67: { alt: 'There is a red and white boat in the water near a dock.' },
  68: { alt: 'There is a boat that is docked in the water near a dock.' },
  69: { alt: 'There are three cats that are laying down on the ground.' },
  70: { alt: 'There is a white statue of a man on a shelf.' },
  71: { alt: 'Arafed blue and white flag flying in the wind.' },
  72: { alt: 'There is a view of a mountain with a body of water.' },
  73: { alt: 'Arafed view of a bay with boats and a city in the background.' },
  74: { alt: 'There is a boat that is floating in the water near a beach.' },
  75: { alt: 'There is a small church on a mountain with a steeple.' },
  76: { alt: 'There are many baskets of sponges and other items on display.' },
  77: { alt: 'There are many shelves of potatoes in a room with wooden crates.' },
  78: { alt: 'There are many teddy bears on display in a room.' },
  79: { alt: 'There are two men sitting on the bow of a boat.' },
  80: { alt: 'There are two people sitting on the bow of a boat.' },
  81: { alt: 'There is a man sitting on a boat in the water.' },
  82: { alt: 'Arafed sailboat in the water with two people on deck.' },
  83: { alt: 'There are many boats in the water and one is white.' },
  84: { alt: 'Araffes in the foreground of a city with a mountain in the background.' },
  85: { alt: 'Arafed view of a sunset over a city with mountains in the background.' },
  86: { alt: 'Cars parked on the side of a street in a city.' },
  87: { alt: 'Cars parked on the side of a street in a city.' },
  88: { alt: 'Cars parked on the side of the road in a residential area.' },
  89: { alt: 'Arafed view of a city with a large building on top of it.' },
  90: { alt: 'There is a large stone structure on the hill with trees.' },
  91: { alt: 'There are many people standing in front of a building with columns.' },
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


// Update gallery images with details
galleryImages.forEach(img => {
  if (imageDetails[img.id]) {
    img.alt = imageDetails[img.id].alt;
  } else {
    console.warn(`No description found for image ${img.id}`);
  }
});

// Masonry breakpoints
const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

type GalleryView = 'photos' | 'panoramas' | 'drone';

export default function ScotlandGallery() {
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
              variant={currentView === 'panoramas' ? 'variant' : 'outline'}
              className="px-6 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold transform scale-100 md:scale-125 lg:scale-150 origin-center"
              onClick={() => setCurrentView('panoramas')}
            >
              Panoramas
            </GradientButton>
            <GradientButton
              variant={currentView === 'photos' ? 'variant' : 'outline'}
              className="px-6 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold transform scale-100 md:scale-125 lg:scale-150 origin-center"
              onClick={() => setCurrentView('photos')}
            >
              Photos
            </GradientButton>
            <GradientButton
              variant={currentView === 'drone' ? 'variant' : 'outline'}
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
                      Even Hercules didn't see this much ocean.
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
              <div className="aspect-w-16 aspect-h-9 w-full max-w-6xl">
                <video
                  className="w-full h-auto rounded-lg shadow-xl"
                  controls
                  loop
                  playsInline
                  src="/vids/Greece 2025 Recap 2k.mp4"
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

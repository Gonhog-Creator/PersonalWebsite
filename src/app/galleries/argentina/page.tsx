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
  const basePath = '/img/Argentina/argentina';
  return `${basePath} (${id}).jpg`;
};

// Generate gallery images array
export const galleryImages: GalleryImage[] = Array.from({ length: 105 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    src: getImagePath(id),
    alt: `Photo ${id}`
  };
});

// Add specific alt text for all images
const imageDetails: Record<number, { alt: string }> = {
  1: { alt: 'Arafed iceberg with a boat in the water near a mountain.' },
  2: { alt: 'There is a man standing in a doorway looking out at the water.' },
  2: { alt: 'There is a large iceberg with a rainbow in the sky.' },
  3: { alt: 'Mountains with a body of water in the foreground and a blue sky.' },
  3: { alt: 'There is a large iceberg in the middle of a lake.' },
  4: { alt: 'There is a small river running through a grassy field.' },
  4: { alt: 'There is a large iceberg in the middle of a lake.' },
  5: { alt: 'Mountains and a body of water with a few clouds in the sky.' },
  5: { alt: 'People standing on a bridge looking at a glacier in the distance.' },
  6: { alt: 'There is a horse that is standing in the grass by the trees.' },
  6: { alt: 'There is a large glacier that is melting in the water.' },
  7: { alt: 'Mountains in the distance with a lake and a few trees.' },
  7: { alt: 'There is a large iceberg that is in the water.' },
  8: { alt: 'There is a rainbow that is in the sky over the water.' },
  8: { alt: 'Mountains with snow on them and a few trees in the foreground.' },
  9: { alt: 'There is a rainbow that is in the sky over the water.' },
  9: { alt: 'There is a large lake in the middle of a mountain with a few people.' },
  10: { alt: 'There is a rainbow that is in the sky over the water.' },
  10: { alt: 'There is a man standing on a rock overlooking a mountain lake.' },
  11: { alt: 'Mountains with a rainbow in the sky and a lake in the foreground.' },
  11: { alt: 'There are many people standing on the edge of a mountain.' },
  12: { alt: 'There is a rainbow in the sky over a glacier and a rainbow.' },
  12: { alt: 'Mountains with a few clouds in the sky and a body of water.' },
  13: { alt: 'Rainbow over a glacier with a rainbow in the sky.' },
  13: { alt: 'There is a rainbow in the sky over a mountain lake.' },
  14: { alt: 'Araffes of ice with a rainbow in the sky.' },
  14: { alt: 'There is a rainbow in the sky over a mountain lake.' },
  15: { alt: 'Araffes of ice on a mountain side with a mountain in the background.' },
  15: { alt: 'There is a rainbow in the sky over a glacier with a rainbow.' },
  16: { alt: 'There is a large iceberg with a small amount of water.' },
  16: { alt: 'There is a large iceberg with a rainbow in the sky.' },
  17: { alt: 'There is a large glacier with a large amount of ice on it.' },
  17: { alt: 'Arafed iceberg with a glacier in the background and mountains in the background.' },
  18: { alt: 'There is a large glacier with a large amount of ice on it.' },
  18: { alt: 'There is a large iceberg that is in the middle of the water.' },
  19: { alt: 'Arafed icebergs are melting in the water near a mountain.' },
  20: { alt: 'Arafed map of the area of the park with a picture of the area.' },
  21: { alt: 'Arafed view of a glacier with a rainbow in the sky.' },
  22: { alt: 'Araffes are walking on a glacier with a rainbow in the sky.' },
  23: { alt: 'There are two people standing together in front of a glacier.' },
  24: { alt: 'There are three people standing on a bridge overlooking a lake.' },
  25: { alt: 'There is a boat that is floating in the water near a glacier.' },
  26: { alt: 'There is a large iceberg that is floating in the water.' },
  27: { alt: 'There is a large iceberg with a large amount of water.' },
  28: { alt: 'There is a flag flying in the wind on a cloudy day.' },
  29: { alt: 'Mountains in the background with a glacier in the foreground.' },
  30: { alt: 'There is a large iceberg with a lot of water coming out of it.' },
  31: { alt: 'There is a large iceberg with a huge wave coming out of it.' },
  32: { alt: 'There is a road going through the desert with a mountain in the background.' },
  33: { alt: 'There is a person riding a snowboard on a snowy slope.' },
  34: { alt: 'There are two horses grazing in a field with mountains in the background.' },
  35: { alt: 'There are two llamas in the field with mountains in the background.' },
  36: { alt: 'Smiling woman standing in front of a lake with mountains in the background.' },
  37: { alt: 'They are standing on a rocky beach with a view of the ocean.' },
  38: { alt: 'Smiling man in grey hoodie standing on rocky area with ocean in background.' },
  39: { alt: 'Mountains in the distance with a body of water in the foreground.' },
  40: { alt: 'There are three antelope standing in a field with mountains in the background.' },
  41: { alt: 'Several animals are running in a field with a mountain in the background.' },
  42: { alt: 'There is a llama that is walking in the grass.' },
  43: { alt: 'There is a lone horse standing in the middle of a barren field.' },
  44: { alt: 'There is a llama that is sitting in the grass.' },
  45: { alt: 'There is a llama that is standing in the grass.' },
  46: { alt: 'Mountains in the distance with a fence and a road in the foreground.' },
  47: { alt: 'There are two llamas standing in a field with mountains in the background.' },
  48: { alt: 'There is a llama standing in a field with mountains in the background.' },
  49: { alt: 'Mountains in the distance with a road sign in the foreground.' },
  50: { alt: 'There is a road going through the mountains with a mountain in the background.' },
  51: { alt: 'Mountains with snow on them and a blue sky in the background.' },
  52: { alt: 'Mountains in the distance with a road in the foreground.' },
  53: { alt: 'There is a sign that says bienvenidos on the side of the road.' },
  54: { alt: 'There is a sign that says el capitan in spanish on the side of the road.' },
  55: { alt: 'There is a dog that is running in the grass with a frisbee.' },
  56: { alt: 'There is a house that is on the side of a hill.' },
  57: { alt: 'Mountains and a river in the foreground with a blue sky.' },
  58: { alt: 'There is a dirt path that is surrounded by trees and bushes.' },
  59: { alt: 'There is a waterfall that is flowing down a mountain side.' },
  60: { alt: 'There is a waterfall in the woods with a fallen tree.' },
  61: { alt: 'There is a waterfall in the middle of a forest with a person standing on the rocks.' },
  62: { alt: 'There is a waterfall in the middle of a forest with a fallen tree.' },
  63: { alt: 'There is a man standing on a tree stump looking at a waterfall.' },
  64: { alt: 'There is a man standing on a fallen tree in front of a waterfall.' },
  65: { alt: 'There is a man standing on a fallen tree in the water.' },
  66: { alt: 'There is a lone tree on a rocky hill with a mountain in the background.' },
  67: { alt: 'Mountains in the distance with a blue sky and clouds.' },
  68: { alt: 'Mountains with snow on them and trees in the foreground.' },
  69: { alt: 'Mountains with snow on them and a blue sky with clouds.' },
  70: { alt: 'Mountains with a lake and a mountain range in the background.' },
  71: { alt: 'Mountains with snow and ice in the background and a lake in the foreground.' },
  72: { alt: 'There is a man standing on a rock with his arms raised.' },
  73: { alt: 'There is a man doing a handstand on a rock near a lake.' },
  74: { alt: 'There is a large blue lake in the middle of a mountain.' },
  75: { alt: 'There is a man sitting on a rock with a backpack on.' },
  76: { alt: 'Arafed man standing on top of a mountain with a backpack.' },
  77: { alt: 'There is a man standing on a mountain with a backpack.' },
  78: { alt: 'There are three people standing on a rock in front of a mountain.' },
  79: { alt: 'There is a man standing on a mountain top with a backpack.' },
  80: { alt: 'There is a man standing on a rocky mountain with a backpack.' },
  81: { alt: 'Mountains with snow on them and a blue sky in the background.' },
  82: { alt: 'There is a stream running through a forest with rocks and trees.' },
  83: { alt: 'There is a waterfall in the middle of a forest with rocks.' },
  84: { alt: 'Mountains with snow on them and a person on a horse.' },
  85: { alt: 'Mountains with a glacier in the background and a small stream of water.' },
  86: { alt: 'There is a large glacier that is melting off of the side of a mountain.' },
  87: { alt: 'There is a green bird sitting on a branch of a tree.' },
  88: { alt: 'There is a green bird sitting on a branch of a tree.' },
  89: { alt: 'There is a green bird sitting on a branch with a red beak.' },
  90: { alt: 'There is a green bird sitting on a branch in the woods.' },
  91: { alt: 'Several people are riding horses in a field with trees in the background.' },
  92: { alt: 'There is a man riding a horse in a field with other horses.' },
  93: { alt: 'There are many people riding horses in a field of grass.' },
  94: { alt: 'There is a woman riding a horse in a field.' },
  95: { alt: 'Horses are running in a field with people on them.' },
  96: { alt: 'There is a man riding a horse in a field with other horses.' },
  97: { alt: 'There is a man riding a horse with a frisbee in his hand.' },
  98: { alt: 'There is a man riding a horse in a field waving.' },
  99: { alt: 'There is a woman riding a horse in a field.' },
  100: { alt: 'There is a man riding a horse in a field with a hat on.' },
  101: { alt: 'There is a man riding a horse with a hat on.' },
  102: { alt: 'There is a man riding a horse in a field with a frisbee.' },
  103: { alt: 'There is a man riding a horse in a field with a hat on.' },
  104: { alt: 'There is a man riding a horse with a frisbee in his hand.' },
  105: { alt: 'They are standing in the grass with a frisbee in their hand.' },
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

type GalleryView = 'photos' | 'panoramas' | 'drone';

export default function ArgentinaGallery() {
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Argentina</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              From the Perito Moreno Glacier to El Chalten in Calafate to the vast plains and volcanoes of Patagonia,
              Argentina is a country of immense beauty, rich culture, and breathtaking landscapes.
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
                          {image.alt} - {image.location}
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
                      I promise I got every speck of glacier.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <div className="w-full py-8">
                {[
                  { id: 1, location: 'Patagonia' },
                  { id: 2, location: 'El Chalten' },
                  { id: 3, location: 'Perito Moreno Glacier' },
                  { id: 4, location: 'Buenos Aires' },
                  { id: 5, location: 'Mendoza' },
                  { id: 6, location: 'Bariloche' },
                  { id: 7, location: 'Salta' },
                  { id: 8, location: 'Iguazu Falls' },
                  { id: 9, location: 'Ushuaia' }
                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Argentina/argentina_panorama (${item.id}).jpg`}
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
          <div className="w-full min-h-[50vh] flex items-center justify-center">
            <div className="text-center px-4 py-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Drone Videos Coming Soon</h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">Check back later for amazing aerial footage!</p>
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
              <p className="font-medium">{selectedImage.alt} - {selectedImage.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const basePath = '/img/Austria/austria';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos = [38, 28, 40, 41, 51, 52, 54, 56, 60, 89, 92, 111, , 117,127, 129, 130, 160];

// Generate gallery images array, excluding missing photos
export const galleryImages: GalleryImage[] = Array.from(
  { length: 215 },
  (_, i) => ({
    id: i + 1,
    src: getImagePath(i + 1),
    alt: `Photo ${i + 1}`,
    location: 'Austria'  // Default location
  })
).filter(image => !missingPhotos.includes(image.id));

// Add specific alt text for all images
const imageDetails: Record<number, { alt: string }> = {
  1: { alt: 'There is a smoke coming out of a chimney on a building.' },
  1: { alt: 'There is a view of a city from a hill top.' },
  2: { alt: 'Arafed image of a diagram of a large rock with a bunch of tools.' },
  2: { alt: 'There is a view of a city from a high up.' },
  3: { alt: 'There is a man standing in a cave with a light shining through it.' },
  3: { alt: 'There is a man standing on a cliff looking at the mountains.' },
  4: { alt: 'There is a man standing in a cave with a lantern.' },
  4: { alt: 'There is a view of a mountain valley with a winding road.' },
  5: { alt: 'Araffe with a large pretzel in his hands at a table.' },
  5: { alt: 'Mountains are in the background.' },
  6: { alt: 'There is a small house on a hill with a lot of trees.' },
  6: { alt: 'There is a view of a city from a high up.' },
  7: { alt: 'There is a man sitting on a bench with a suitcase.' },
  7: { alt: 'Mountains with a valley in the foreground and a road in the foreground.' },
  8: { alt: 'People are riding on a train in a tunnel with a light on.' },
  8: { alt: 'Mountains with a valley in the distance and a road in the foreground.' },
  9: { alt: 'Arafed statue of the virgin of guadalupe in a cave.' },
  9: { alt: 'Mountains with a valley below and a valley below with a valley below.' },
  10: { alt: 'There is a plaque on the wall that says it is a great place to see.' },
  10: { alt: 'There is a man sitting on a ledge looking out over a mountain.' },
  11: { alt: 'People walking in a tunnel with neon lights and signs.' },
  11: { alt: 'Mountains with a few people on top of them and a few trees.' },
  12: { alt: 'There are many people standing around a machine in a building.' },
  12: { alt: 'There is a man standing on a rock looking at the mountains.' },
  13: { alt: 'There is a clock that reads your speed on the wall.' },
  13: { alt: 'There is a lone tree in front of a mountain range.' },
  14: { alt: 'There is a plaque with a quote on it that says what i could do.' },
  14: { alt: 'Buildings with spires and towers in a city with a castle in the background.' },
  15: { alt: 'There is a white object with a branch on it in the dark.' },
  15: { alt: 'Buildings along the river in a city with a bridge.' },
  16: { alt: 'Yellow building with a clock on the front of it in a city.' },
  16: { alt: 'Arafed view of a city with a park and a river.' },
  17: { alt: 'Arafed sign showing instructions to use a slide safety device.' },
  17: { alt: 'People walking around a courtyard in front of a large building.' },
  18: { alt: 'There is a painting on the wall of a church with a sunburst.' },
  18: { alt: 'There is a room with a bed, chairs, and a table.' },
  19: { alt: 'There is a view of a river and a bridge from a hill.' },
  19: { alt: 'There are two men standing in a room with blue walls.' },
  20: { alt: 'There is a very large altar with a large clock in it.' },
  20: { alt: 'There is a fountain with statues on it in a park.' },
  21: { alt: 'There is a large gold statue in a church with a window.' },
  21: { alt: 'Araffe view of a large building with a clock tower in the middle of a field.' },
  22: { alt: 'There is a view of a town from a hill top.' },
  22: { alt: 'Arafed view of a city square with a clock tower in the background.' },
  23: { alt: 'People are standing in a large room with a lot of boxes on the floor.' },
  23: { alt: 'Arafed view of a large building with a clock tower.' },
  24: { alt: 'Mountains and valleys with a river running through them.' },
  25: { alt: 'There is a large ornate painting on the wall of a church.' },
  26: { alt: 'There is a small house in the middle of a green valley.' },
  27: { alt: 'Araffes are standing in front of a large building with a clock on it.' },
  28: { alt: 'There is a snail crawling on the ground with a shell.' },
  29: { alt: 'There is a large golden egg in front of a castle on a hill.' },
  30: { alt: 'There is a yellow banner hanging from a building on a hill.' },
  31: { alt: 'There are people walking on a walkway with umbrellas in the rain.' },
  32: { alt: 'There are two display cases with different items in them.' },
  33: { alt: 'There is a train station with cars parked on the tracks.' },
  34: { alt: 'Mountains and trees surround a river with a castle on a hill.' },
  35: { alt: 'Arafed view of a city from a window of a castle.' },
  36: { alt: 'There is a road going through a mountain with a mountain in the background.' },
  37: { alt: 'There is a model of a castle on a hill with trees.' },
  39: { alt: 'Mountains with a few trees and a bird flying in the sky.' },
  42: { alt: 'Arafed mannequin in uniform in a glass case.' },
  43: { alt: 'There is a small cabin in the middle of a field with mountains in the background.' },
  44: { alt: 'There is a display of old fashioned radio equipment on a table.' },
  45: { alt: 'There is a dirt road that is surrounded by tall trees.' },
  46: { alt: 'Mountains with a castle on top of it surrounded by trees.' },
  47: { alt: 'Mountains with a castle in the distance and a few trees.' },
  48: { alt: 'Mountains with a valley in the distance and a town in the distance.' },
  49: { alt: 'Arafed statue of a person sitting on a stone bench.' },
  50: { alt: 'Mountains with a few clouds in the sky and a cow grazing.' },
  53: { alt: 'Mountains and valleys with a small town in the distance.' },
  55: { alt: 'Mountains with a valley and a town in the middle of it.' },
  57: { alt: 'There is a wooden walkway going up a mountain side.' },
  58: { alt: 'There is a man that is climbing up a mountain on a rock.' },
  59: { alt: 'There is a man riding a horse on a mountain side.' },
  61: { alt: 'There is a man sitting on a rock on a mountain.' },
  62: { alt: 'There is a view of a mountain from a cave.' },
  63: { alt: 'There is a sign that is posted on the wall of a building.' },
  64: { alt: 'There is a cave with ice and water inside of it.' },
  65: { alt: 'There is a man standing in a cave with ice on the ground.' },
  66: { alt: 'People are looking at a large ice bear in a cave.' },
  67: { alt: 'People standing on a boat in a cave with a light on.' },
  68: { alt: 'There is a cave with a stream running through it.' },
  69: { alt: 'There is a rock with a hole in it sitting on a rock.' },
  70: { alt: 'People standing on a bridge in a cave with a light on.' },
  71: { alt: 'There is a man holding a light in his hand.' },
  72: { alt: 'There is a small waterfall in a cave with a large ice fall.' },
  73: { alt: 'People are standing in a cave with a light at the end.' },
  74: { alt: 'There is a man standing in a cave with a fire.' },
  75: { alt: 'People are standing in a cave with ice and water.' },
  76: { alt: 'There is a stone wall with a sign and a vase on it.' },
  77: { alt: 'There is a man standing in a cave with a flashlight.' },
  78: { alt: 'There is a man standing in a cave with a flashlight.' },
  79: { alt: 'People are walking up a staircase in a cave with a view of the water.' },
  80: { alt: 'People are walking up a set of stairs in a cave.' },
  81: { alt: 'There is a small goat that is walking on a rocky hill.' },
  82: { alt: 'There is a goat that is standing on a rocky hill.' },
  83: { alt: 'There is a goat that is walking on a rocky hill.' },
  84: { alt: 'There are two animals that are walking in the woods together.' },
  85: { alt: 'Arafed train on tracks next to a river and a road.' },
  86: { alt: 'There are many houses in the middle of a green field.' },
  87: { alt: 'There is a view of a small village in the middle of a mountain.' },
  88: { alt: 'Mountains with a few trees and a few clouds in the sky.' },
  90: { alt: 'There are people walking inside of a church with a dome.' },
  91: { alt: 'Arafed ceiling with a clock and paintings on it.' },
  93: { alt: 'There is a statue in front of a large building with a clock on it.' },
  94: { alt: 'Pedestrians and cars on a city street with a clock tower in the background.' },
  95: { alt: 'There is a clock tower on the side of a building.' },
  96: { alt: 'There is a river running through a city with a clock tower in the background.' },
  97: { alt: 'There are two people walking down a path between two statues.' },
  98: { alt: 'There is a fountain with water spouting out of it in a park.' },
  99: { alt: 'People walking around a park with a fountain in the middle of it.' },
  100: { alt: 'There is a statue of a horse with a rider on it.' },
  101: { alt: 'There is a street with cars and buildings on both sides.' },
  102: { alt: 'Painting of a man in a golden coat and hat holding a cane.' },
  103: { alt: 'Arafed portrait of a woman in a blue dress sitting in a chair.' },
  104: { alt: 'There is a chair that is sitting on a table in front of a window.' },
  105: { alt: 'Painting of a woman in a blue dress sitting on a chair.' },
  106: { alt: 'There is a table with a glass top in a room with paintings.' },
  107: { alt: 'There is a room with a table, chairs, and a mirror.' },
  108: { alt: 'There are four chairs in a room with a large clock on the wall.' },
  109: { alt: 'There is a room with a desk, chairs, and a clock.' },
  110: { alt: 'There is a desk with a laptop on it in a room.' },
  112: { alt: 'Arafed picture of a woman in a white dress in a blue room.' },
  113: { alt: 'There is a table with a white table cloth and red chairs.' },
  114: { alt: 'Two paintings of women in formal dresses are on a wall.' },
  115: { alt: 'Painting of a painting of a landscape on a wall in a room.' },
  116: { alt: 'Painting of a landscape with figures in a mountainous landscape with a man taking a picture.' },
  118: { alt: 'There is a room with a chandelier and a painting on the wall.' },
  119: { alt: 'There are many people walking in a large room with a ceiling painted with paintings.' },
  120: { alt: 'Arafed ceiling with a painting of angels and angels on it.' },
  121: { alt: 'Doorway view of a room with a piano and chandelier.' },
  122: { alt: 'There is a room with a chandelier and a table in it.' },
  123: { alt: 'Painting of a large group of people in a room with a chandelier.' },
  124: { alt: 'Painting of a large crowd of people in a large room.' },
  125: { alt: 'There is a room with a gold and black wall and a gold chair.' },
  126: { alt: 'There is a room with a painting and chairs in it.' },
  127: { alt: 'There is a wall with a lot of gold decorations on it.' },
  128: { alt: 'There is a large wooden panel with gold decorations on it.' },
  131: { alt: 'There is a cat sitting on a wooden floor with a pattern on it.' },
  132: { alt: 'Arafed picture of a painting of a man in a red robe.' },
  133: { alt: 'Arafed picture of a woman in a white dress and a veil.' },
  134: { alt: 'Arafed bed with a red and gold bed cover and a red and gold canopy.' },
  135: { alt: 'There is a large building with a lot of windows on it.' },
  136: { alt: 'Trees line a path in a park with a statue in the distance.' },
  137: { alt: 'There is a fountain with a statue in the middle of it.' },
  138: { alt: 'There is a statue of a man standing on top of a rock.' },
  139: { alt: 'There is a fountain in the middle of a garden with statues.' },
  140: { alt: 'There is a statue of two people sitting on a rock near a fountain.' },
  141: { alt: 'There is a large building with a fountain in front of it.' },
  142: { alt: 'There are two birds that are standing on the side of a wall.' },
  143: { alt: 'Arafed duck standing on a rock with a blue sky in the background.' },
  144: { alt: 'Arafed duck with orange and blue feathers standing on a rock.' },
  145: { alt: 'There is a large tower with a clock on it in the middle of a city.' },
  146: { alt: 'Araffes in front of a large glass building with a clock on top.' },
  147: { alt: 'Arafed church with a clock tower and a traffic light.' },
  148: { alt: 'There is a white building with a gold dome on top.' },
  149: { alt: 'Arafed man in a hat and jacket holding a camera in a store.' },
  150: { alt: 'There are many different types of cheeses on display in a store.' },
  151: { alt: 'Arafed baskets of strawberries in a blue basket on a table.' },
  152: { alt: 'People walking down a sidewalk lined with tables and chairs.' },
  153: { alt: 'There are many different kinds of food on display in a market.' },
  154: { alt: 'Cars parked on the side of a street in a city.' },
  155: { alt: 'Bottles of alcohol are on display in a store window.' },
  156: { alt: 'Arafly shot of a building with a clock on the top of it.' },
  157: { alt: 'There is a large building with a clock on the top of it.' },
  158: { alt: 'Arafed view of a tall building with a clock on the front of it.' },
  159: { alt: 'There is a large building with a clock tower in front of it.' },
  161: { alt: 'There is a large building with a green dome on top of it.' },
  162: { alt: 'There is a large white building with a green dome and a clock tower.' },
  163: { alt: 'There is a building with a large arched window and a green fence.' },
  164: { alt: 'There is a large building with a green dome and a clock tower.' },
  165: { alt: 'There is a large building with a green roof and a car parked in front of it.' },
  166: { alt: 'There is a man riding a bike in the street with a backpack.' },
  167: { alt: 'People are walking around in front of a large building with a clock tower.' },
  168: { alt: 'There is a statue of a man riding a horse with a group of people on it.' },
  169: { alt: 'There are many different kinds of jewels in the display case.' },
  170: { alt: 'There is a pie with a face made of oranges on it.' },
  171: { alt: 'Arafed ceiling with a painting and a woman standing in front of it.' },
  172: { alt: 'There is a large room with a ceiling painted with a painting.' },
  173: { alt: 'Arafed view of a large building with a statue in front of it.' },
  174: { alt: 'Several people laying on the grass in front of a building.' },
  175: { alt: 'Araful looking building with a clock tower and a lot of people.' },
  176: { alt: 'There is a large building with a clock on the top of it.' },
  177: { alt: 'There is a fountain with a fountain head in the middle of a park.' },
  178: { alt: 'There is a statue of a lion with a gold head on top of a monument.' },
  179: { alt: 'Arafed building with a lot of windows and balconies on the side.' },
  180: { alt: 'There is a large building with a green dome on top.' },
  181: { alt: 'There is a large building with statues on top of it.' },
  182: { alt: 'There is a small black car parked on the side of the road.' },
  183: { alt: 'Cloudy sky with clouds and a flag on top of a building.' },
  184: { alt: 'There is a clock tower on the side of a building.' },
  185: { alt: 'There is a koala sleeping on a tree branch in a zoo.' },
  186: { alt: 'There is a koala bear that is hanging from a tree.' },
  187: { alt: 'There is a small kangaroo standing on the ground in the sun.' },
  188: { alt: 'Panda bear sitting in a tree with leaves and green foliage.' },
  189: { alt: 'There is a hippo laying on the ground in the dirt.' },
  190: { alt: 'There is a small rodent that is sitting on the ground.' },
  191: { alt: 'There is a small animal standing on its hind legs.' },
  192: { alt: 'There is a small rodent sitting on the ground eating a piece of food.' },
  193: { alt: 'There is a small animal that is laying down on the ground.' },
  194: { alt: 'There are two animals that are standing on a tree branch.' },
  195: { alt: 'There is a small animal climbing up a tree trunk.' },
  196: { alt: 'There is a small animal that is sitting on a tree.' },
  197: { alt: 'There is a small animal that is sitting on a tree branch.' },
  198: { alt: 'Three monkeys sitting on a rock with one sitting on the ground.' },
  199: { alt: 'There is a seal that is laying on a rock in the water.' },
  200: { alt: 'There is a seal that is sitting on a rock with its mouth open.' },
  201: { alt: 'There is an elephant that is eating grass in the zoo.' },
  202: { alt: 'There is a lemur sitting on a tree branch in the forest.' },
  203: { alt: 'There is a small lemur sitting on a tree branch.' },
  204: { alt: 'There is a baby lemur sitting on its mother\' s back.' },
  205: { alt: 'There are two baby lemurs sitting on the ground together.' },
  206: { alt: 'There are two lemurs sitting together on the ground.' },
  207: { alt: 'There is a small bird sitting on a branch of a tree.' },
  208: { alt: 'There are two birds sitting on a branch in the woods.' },
  209: { alt: 'There is a monkey hanging from a tree branch with a rope.' },
  210: { alt: 'Arafed monkey sitting on a tree branch with a flower in its mouth.' },
  211: { alt: 'Arafed view of a large cathedral with a clock tower.' },
  212: { alt: 'There is a very tall building with a lot of windows on it.' },
  213: { alt: 'Woman walking down the street with a cell phone in her hand.' },
  214: { alt: 'There is a ferris wheel in the middle of a park.' },
  215: { alt: 'Araffes on a ferris wheel with a sky background.' },
};

// Update gallery images with details
galleryImages.forEach(img => {
  if (imageDetails[img.id]) {
    img.alt = imageDetails[img.id].alt;
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

export default function AustriaGallery() {
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
            src="/img/Austria/austria_panorama (5).jpg"
            alt="Austria Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Austria</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              Salt mines, mountains, ice caves, palaces, and more castles than you can count. Welcome to Austria.
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
                      Weinershnitzel and salt mines for days.
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
                  { id: 24, location: 'DescriptionComingSoon' },
                  { id: 25, location: 'DescriptionComingSoon' },
                  { id: 26, location: 'DescriptionComingSoon' }

                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Austria/austria_panorama (${item.id}).jpg`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Austria 2025 Recap</h2>
              <div className="aspect-w-16 aspect-h-9 w-full max-w-6xl">
                <video
                  className="w-full h-auto rounded-lg shadow-xl"
                  controls
                  loop
                  playsInline
                  src="/vids/Austria 2025 Recap 2k.mp4"
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

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
  const basePath = '/img/Costa Rica/costarica';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos = [147];

// Image details for alt text
const imageDetails: Record<number, { alt: string }> = {
  1: { alt: 'Cows in a field' },
  2: { alt: 'Mossy Birch' },
  3: { alt: 'Polymnia Tigerwing Butterfly' },
  4: { alt: 'Rooty Path' },
  5: { alt: 'Walking through the jungle' },
  6: { alt: 'Lory bush flower' },
  7: { alt: 'Bromeliad infested tree' },
  8: { alt: 'Foggy Jungle' },
  9: { alt: 'Ants headed underground' },
  10: { alt: 'Large bromeliad' },
  11: { alt: 'Hiking Companion' },
  12: { alt: 'Mangrovevine flower' },
  13: { alt: 'Possibly Corrida Yerba De Guava' },
  14: { alt: 'Monopyle maxonii C.V.Morton' },
  15: { alt: 'Moss on tree' },
  16: { alt: 'Unfurling fern' },
  17: { alt: 'Spotted Tropical Froghopper' },
  18: { alt: 'Two-spotted Tiger Beetle' },
  19: { alt: 'Brilliant Forest Frog' },
  20: { alt: 'Brilliant Forest Frog' },
  21: { alt: 'Turk\'s-cap flower' },
  22: { alt: 'Drymonia conchocalyx' },
  23: { alt: 'Spotted Tropical Froghopper' },
  24: { alt: 'Tropical Milkweed' },
  25: { alt: 'That\'s a cow' },
  26: { alt: 'Great Kiskadee' },
  27: { alt: 'Anole' },
  28: { alt: 'Forest path' },
  29: { alt: 'Tiny anole' },
  30: { alt: 'Ant carrying puff' },
  32: { alt: 'Arenal Volcano' },
  33: { alt: 'Orange Lampyridae Lucidota' },
  34: { alt: 'Spiral ginger' },
  35: { alt: 'Bird footprints in mud' },
  36: { alt: 'Vines on tree' },
  37: { alt: 'Hezia Clearwing' },
  38: { alt: 'Broad-billed Motmot' },
  39: { alt: 'Magnolia Green Jumping Spider' },
  40: { alt: 'Entrance to Mariola Bee hive' },
  41: { alt: 'Blue-jeans Poison Dart Frog' },
  42: { alt: 'Brown Anole' },
  43: { alt: 'Clouded Snail-eater' },
  45: { alt: 'Fitzinger\'s Rubber Frog' },
  46: { alt: 'Carpenter Ants' },
  47: { alt: 'Anole' },
  48: { alt: 'Juvenile Kingfisher' },
  49: { alt: 'Common Mexican Tree Frog' },
  50: { alt: 'Common Mexican Tree Frog' },
  51: { alt: 'Common Mexican Tree Frog' },
  52: { alt: 'Ghost Glass Frog' },
  53: { alt: 'Ghost Glass Frog' },
  54: { alt: 'Cicada' },
  55: { alt: 'Anole' },
  56: { alt: 'Uncurling Vine' },
  58: { alt: 'Eyelash Pitviper' },
  59: { alt: 'Eyelash Pitviper' },
  60: { alt: 'Eyelash Pitviper' },
  61: { alt: 'Rio Celeste' },
  62: { alt: 'Rio Celeste' },
  63: { alt: 'Rio Celeste' },
  64: { alt: 'Central American Whiptail' },
  65: { alt: 'Rufous-tailed Jacamar' },
  66: { alt: 'Rufous-tailed Jacamar' },
  67: { alt: 'Rufous-tailed Jacamar' },
  68: { alt: 'Rufous-tailed Jacamar' },
  69: { alt: 'Rufous-tailed Jacamar' },
  70: { alt: 'Blue Fungus Beetle' },
  71: { alt: 'Rio Celeste' },
  72: { alt: 'Rio Celeste' },
  73: { alt: 'More bromeliads' },
  74: { alt: 'Goldfish plant' },
  75: { alt: 'Howler Monkeys' },
  76: { alt: 'Howler Monkeys' },
  77: { alt: 'Howler Monkeys' },
  78: { alt: 'Blue-jeans Poison Dart Frog' },
  79: { alt: 'Blue-jeans Poison Dart Frog' },
  80: { alt: 'Black Striped Snake' },
  81: { alt: 'Blue-jeans Poison Dart Frog' },
  82: { alt: 'Handstand' },
  83: { alt: 'Blue Glasswing Butterfly' },
  84: { alt: 'Bromeliads' },
  85: { alt: 'Many-scaled Anole' },
  86: { alt: 'Fitzinger\'s Robber Frog' },
  87: { alt: 'Brilliant Forest Frog' },
  88: { alt: 'Brilliant Forest Frog' },
  89: { alt: 'Castniid Moth' },
  90: { alt: 'Orange-bellied Trogon' },
  91: { alt: 'Orange-bellied Trogon' },
  92: { alt: 'Jungle Path' },
  93: { alt: 'Juvenile Leafhopper' },
  94: { alt: 'Caterpillar' },
  95: { alt: 'Yellow-throated Toucan' },
  96: { alt: 'Yellow-throated Toucan' },
  97: { alt: 'Cherrie\'s Tanager' },
  98: { alt: 'Costa Rican Jungle' },
  99: { alt: 'Central American Agouti' },
  100: { alt: 'Crocodile' },
  101: { alt: 'Crocodile' },
  102: { alt: 'Crocodile' },
  103: { alt: 'Crocodile' },
  104: { alt: 'Crocodile' },
  105: { alt: 'American Purple Gallinule' },
  106: { alt: 'Yellow-throated Toucan' },
  107: { alt: 'Costa Rican Green and Black Poison Dart Frog' },
  108: { alt: 'Melinaea Clearwing Butterfly' },
  109: { alt: 'Jungle path' },
  110: { alt: 'Costa Rican Green and Black Poison Dart Frog' },
  111: { alt: 'Black-hooded Antshrike' },
  112: { alt: 'Black Spiny-tailed Iguana' },
  113: { alt: 'Macaw' },
  114: { alt: 'Macaw' },
  115: { alt: 'Macaw' },
  116: { alt: 'Macaw' },
  117: { alt: 'Macaw' },
  118: { alt: 'Macaw' },
  119: { alt: 'Macaw' },
  120: { alt: 'Macaw' },
  121: { alt: 'Macaw' },
  122: { alt: 'Macaw' },
  123: { alt: 'Macaw' },
  124: { alt: 'Macaw' },
  125: { alt: 'Macaw' },
  126: { alt: 'Plantains' },
  127: { alt: 'Red' },
  128: { alt: 'Jungle' },
  129: { alt: 'Creek' },
  130: { alt: 'White-nosed Coati' },
  131: { alt: 'Caterpillar' },
  132: { alt: 'Jungle View' },
  133: { alt: 'Southern Mealy Amazon Parrot' },
  134: { alt: 'Zingiber Spectabile Plant' },
  135: { alt: 'Peacock Flower' },
  136: { alt: 'Dragonfly' },
  137: { alt: 'Nauyaca Waterfall' },
  138: { alt: 'Nauyaca Waterfall' },
  139: { alt: 'Amazonian Black-throated Trogon' },
  140: { alt: 'Blue Morpho Butterfly' },
  141: { alt: 'White-lipped Peccary' },
  142: { alt: 'White-lipped Peccaries' },
  143: { alt: 'Yellow-throated Toucan' },
  144: { alt: 'Yellow-throated Toucan' },
  145: { alt: 'Pillar at Whale Tail Beach' },
  146: { alt: 'Pillar at Whale Tail Beach' },
  148: { alt: 'Common Dink Frog' },
  149: { alt: 'Tailless Whip Scorpion' },
  150: { alt: 'Owl Butterfly' },
  151: { alt: 'Purple Pinktoe Tarantula' },
  152: { alt: 'Green Giant Canopy Anole' },
  153: { alt: 'Helmeted Basilisk/Smooth Headed Iguana' },
  155: { alt: 'Eyelash Palm-Pitviper' },
  156: { alt: 'Granular Poison Dart Frog' },
  157: { alt: 'Granular Poison Dart Frog' },
  158: { alt: 'Ghost Glass Frog' },
  159: { alt: 'Fer-de-lance Viper' },
  160: { alt: 'Brazilian Red-cloaks Flower' },
  161: { alt: 'Common Basilisk' },
  162: { alt: 'Dirt Road' },
  163: { alt: 'White-faced Capuchin Monkey' },
  164: { alt: 'Mango!' },
  165: { alt: 'Sunset' },
  166: { alt: 'Amazonian Black-throated Trogon' },
  167: { alt: 'Guayaquil Woodpecker' },
  168: { alt: 'Great Curassow' },
  169: { alt: 'Spider Monkey' },
  170: { alt: 'Caterpillar' },
  171: { alt: 'Rosette Spoonbill, Great Egrets, Zebra Heron above' },
  172: { alt: 'Great Curassow' },
  173: { alt: 'Central American Tapir' },
  174: { alt: 'Central American Tapir' },
  175: { alt: 'Iguana' },
  176: { alt: 'Spider Monkey' },
  177: { alt: 'Spider Monkey' },
  178: { alt: 'Jewel Scarab' },
  180: { alt: 'Base Camp at Corcovado National Park' },
  181: { alt: 'Sloth' },
  182: { alt: 'Giant Golden-winged Damselfly' },
  183: { alt: 'White-nosed Coati' },
  184: { alt: 'Dwarf Squirrel' },
  185: { alt: 'Spider Monkey' },
  186: { alt: 'Many-scaled Anole' },
  187: { alt: 'Anole' },
  188: { alt: 'Waterfall' },
  189: { alt: 'Anole' },
  190: { alt: 'Melinaea Butterfly' },
  191: { alt: 'Melinaea Butterfly' },
  192: { alt: 'Dwarf Squirrel' },
  193: { alt: 'Central American Squirrel Monkey' },
  194: { alt: 'Central American Squirrel Monkey' },
  195: { alt: 'Central American Squirrel Monkey and baby!' },
  196: { alt: 'Central American Squirrel Monkey eating' },
  197: { alt: 'Iguana' },
  198: { alt: 'Rainbow Crab' },
  199: { alt: 'Jungle Path' },
  200: { alt: 'White-faced Capuchin Monkey' },
  201: { alt: 'White-faced Capuchin Monkey' },
  202: { alt: 'White-faced Capuchin Monkey' },
  203: { alt: 'Fiery-billed Aracari' },
  204: { alt: 'Fiery-billed Aracari' },
  205: { alt: 'White-faced Capuchin Monkey' },
  206: { alt: 'White-faced Capuchin Monkey' },
  207: { alt: 'Manuel Antonio National Park Coastline' },
  208: { alt: 'Bromeliad' },
  209: { alt: 'Macaw' },
  210: { alt: 'Resplendent Quetzal' },
  211: { alt: 'Resplendent Quetzal' },
  212: { alt: 'Resplendent Quetzal' },
  213: { alt: 'Resplendent Quetzal' }
};
// Panorama locations data
const panoramaLocations = [
  { id: 1, location: 'Manuel Antonio' },
  { id: 2, location: 'Monteverde' },
  { id: 3, location: 'Arenal' },
  { id: 4, location: 'Tortuguero' },
  { id: 5, location: 'Cahuita' },
  { id: 6, location: 'Puerto Viejo' },
  { id: 7, location: 'Corcovado' },
  { id: 8, location: 'Rincon de la Vieja' },
  { id: 9, location: 'Santa Teresa' }
];

export default function CostaRicaGallery() {
  // Generate gallery images with useMemo, excluding missing photos
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 213 }, (_, i) => {
      const id = i + 1;
      return {
        id,
        src: getImagePath(id),
        alt: `Photo ${id}`,
        location: 'Costa Rica',
        ...(imageDetails[id] || {})
      };
    }).filter(image => !missingPhotos.includes(image.id));
  }, []);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentView, setCurrentView] = useState<'photos' | 'panoramas' | 'drone'>('photos');


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
            src="/img/Costa Rica/panorama-costarica (7).jpg"
            alt="Costa Rica Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Costa Rica</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              Hiking El Cerro Chato, seeing the beautiful Macaws, listening to howler monkeys, and admiring snakes of all colors, Costa Rica is a country of immense jungle, vibrant culture, and beautiful coastlines.
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
                      Cause I want ALL the jungle leaves.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <div className="w-full py-8">
                {[
                  { id: 1, location: 'Manuel Anotonio National Park Coastline' },
                  { id: 2, location: 'Costa Rican Jungle' },
                  { id: 3, location: 'Whale Tail Beach' },
                  { id: 4, location: 'Whale Tail Beach' },
                  { id: 5, location: 'Sunset' },
                  { id: 6, location: 'Sunset' },
                  { id: 7, location: 'Jungle Lake' },
                  { id: 8, location: 'Coastline' },
                  { id: 9, location: 'Mountain Range' },
                  { id: 10, location: 'Waterfall' },
                  { id: 11, location: 'Crocodile Bridge' },
                  { id: 12, location: 'Coastline' },
                  { id: 13, location: 'Volcan Arenal' },
                  { id: 14, location: 'Nauyaca Waterfall' },
                  { id: 15, location: 'Crocodile' },
                  { id: 16, location: 'Coastline at Corcovado National Park' },
                  { id: 17, location: 'Jungle Expanse' }
                ].map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Costa Rica/panorama-costarica (${item.id}).jpg`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Costa Rica 2025 Recap</h2>
              <div className="aspect-w-16 aspect-h-9 w-full max-w-6xl">
                <video
                  className="w-full h-auto rounded-lg shadow-xl"
                  controls
                  loop
                  playsInline
                  src="/vids/Costa Rica 2025 Recap 2k.mp4"
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

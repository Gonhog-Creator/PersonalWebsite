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
  const basePath = '/img/Costa Rica/costarica';
  return `${basePath} (${id}).jpg`;
};

// List of missing photo numbers to exclude
const missingPhotos = [147];

// Generate gallery images array, excluding missing photos
export const galleryImages: GalleryImage[] = Array.from(
  { length: 213 },
  (_, i) => ({
    id: i + 1,
    src: getImagePath(i + 1),
    alt: `Photo ${i + 1}`,
    location: 'Costa Rica'  // Default location
  })
).filter(image => !missingPhotos.includes(image.id));

// Add specific alt text for all images
const imageDetails: Record<number, { alt: string }> = {
  // Scenic views and landscapes
  1: { alt: 'Panoramic view of San José city from a hilltop with mountains in the distance.' },
  2: { alt: 'Aerial view of the lush green rainforest canopy in Costa Rica.' },
  3: { alt: 'Hiker standing on a cliff overlooking the cloud forest in Monteverde.' },
  4: { alt: 'Sunset over the Pacific Ocean from a beach in Manuel Antonio National Park.' },
  5: { alt: 'Aerial view of the Arenal Volcano with a perfect conical shape.' },
  6: { alt: 'Traditional Costa Rican house surrounded by tropical vegetation.' },
  7: { alt: 'Tourist resting on a bench with a view of the cloud forest.' },
  8: { alt: 'Scenic mountain road winding through the Costa Rican highlands.' },
  9: { alt: 'Statue of the Virgin Mary in a cave at La Paz Waterfall Gardens.' },
  10: { alt: 'Viewpoint overlooking the Central Valley with San José in the distance.' },
  
  // Wildlife and nature
  11: { alt: 'Scarlet macaw perched on a tree branch in the rainforest.' },
  12: { alt: 'Tour group observing a sloth in the treetops.' },
  13: { alt: 'Hummingbird hovering near colorful tropical flowers.' },
  14: { alt: 'Coatimundi foraging near a hiking trail in the forest.' },
  15: { alt: 'White-faced capuchin monkey eating fruit in the canopy.' },
  16: { alt: 'Aerial view of the Tarcoles River winding through mangroves.' },
  17: { alt: 'Sign explaining the importance of the cloud forest ecosystem.' },
  18: { alt: 'Colorful poison dart frog on a leaf in the rainforest.' },
  19: { alt: 'Scenic view of the Rio Celeste waterfall with its bright blue water.' },
  20: { alt: 'Butterfly garden with numerous colorful species in flight.' },
  
  // Beaches and coastal areas
  21: { alt: 'Pristine white sand beach with palm trees in Manuel Antonio.' },
  22: { alt: 'Dramatic sunset over the Pacific Ocean at Playa Hermosa.' },
  23: { alt: 'Rocky coastline with waves crashing in the Nicoya Peninsula.' },
  24: { alt: 'Secluded beach cove accessible only by boat in the Osa Peninsula.' },
  25: { alt: 'Surfers catching waves at the famous Playa Hermosa break.' },
  
  // Volcanoes and hot springs
  26: { alt: 'Arenal Volcano with a perfect conical shape on a clear day.' },
  27: { alt: 'Relaxing in the Tabacón Hot Springs with tropical surroundings.' },
  28: { alt: 'Hiking trail through the lava fields of Arenal Volcano National Park.' },
  29: { alt: 'Steam rising from volcanic vents in the Poás Volcano crater.' },
  30: { alt: 'Panoramic view of the Irazú Volcano crater with its green lake.' },
  
  // Cloud forest and rainforest
  31: { alt: 'Suspension bridge through the Monteverde Cloud Forest canopy.' },
  32: { alt: 'Epiphyte-covered trees in the Monteverde Cloud Forest.' },
  33: { alt: 'Early morning mist rising through the cloud forest trees.' },
  34: { alt: 'Hiking trail through the dense primary rainforest.' },
  35: { alt: 'View from a treetop platform in the cloud forest.' },
  
  // Waterfalls and rivers
  36: { alt: 'La Fortuna Waterfall cascading into an emerald pool.' },
  37: { alt: 'Swimming in the cool waters below La Fortuna Waterfall.' },
  38: { alt: 'White water rafting on the Pacuare River through the rainforest.' },
  39: { alt: 'Peaceful river winding through the jungle with lush vegetation.' },
  40: { alt: 'Kayaking on the calm waters of the Damas Island mangroves.' },
  
  // Culture and people
  41: { alt: 'Traditional oxcart painting demonstration in Sarchí.' },
  42: { alt: 'Colorful oxcart, a Costa Rican cultural symbol, on display.' },
  43: { alt: 'Local artisan making traditional Costa Rican coffee.' },
  44: { alt: 'Fresh tropical fruits at a local farmers market.' },
  45: { alt: 'Traditional Costa Rican meal with rice, beans, plantains, and fresh fish.' },
  
  // Adventure activities
  46: { alt: 'Ziplining through the cloud forest canopy in Monteverde.' },
  47: { alt: 'Hanging bridges tour through the rainforest canopy.' },
  48: { alt: 'Horseback riding through the countryside near La Fortuna.' },
  49: { alt: 'Mountain biking on forest trails with scenic views.' },
  50: { alt: 'Stand-up paddleboarding on a calm lake with volcano views.' },
  
  // Wildlife (continued)
  51: { alt: 'Three-toed sloth hanging from a tree branch.' },
  52: { alt: 'Toucan with colorful beak perched in a tree.' },
  53: { alt: 'Red-eyed tree frog on a leaf at night.' },
  54: { alt: 'Howler monkey resting in the treetops.' },
  55: { alt: 'Iguana sunning itself on a rock near the beach.' },
  
  // Beaches (continued)
  56: { alt: 'Palm-fringed beach with turquoise waters in the Caribbean.' },
  57: { alt: 'Surfers waiting for waves at Playa Hermosa.' },
  58: { alt: 'Secluded beach at sunset with dramatic clouds.' },
  59: { alt: 'Rocky tide pools teeming with marine life.' },
  60: { alt: 'Beachfront restaurant with thatched roof and ocean view.' },
  
  // Additional scenic views
  61: { alt: 'Panoramic view of the Central Valley from a mountain overlook.' },
  62: { alt: 'Sunrise over the cloud forest with mist in the valleys.' },
  63: { alt: 'Traditional wooden bridge over a jungle river.' },
  64: { alt: 'Coffee plantation with rows of coffee plants on hillsides.' },
  65: { alt: 'Butterfly garden with hundreds of colorful butterflies.' },
  
  // More wildlife
  66: { alt: 'Scarlet macaws feeding on almonds in the treetops.' },
  67: { alt: 'White-faced capuchin monkey eating fruit.' },
  68: { alt: 'Jesus Christ lizard walking on water in a pond.' },
  69: { alt: 'Blue morpho butterfly with its wings open, showing bright blue color.' },
  70: { alt: 'Green iguana basking in the sun on a tree branch.' },
  
  // Additional activities
  71: { alt: 'Guided night walk through the rainforest.' },
  72: { alt: 'Chocolate making demonstration with cacao beans.' },
  73: { alt: 'Coffee tour showing the process from bean to cup.' },
  74: { alt: 'Birdwatching in the cloud forest with a guide.' },
  75: { alt: 'Relaxing in natural hot springs with volcano views.' },
  
  // Additional scenic and cultural
  76: { alt: 'Traditional oxcart with colorful designs in Sarchí.' },
  77: { alt: 'Local market with fresh tropical fruits and vegetables.' },
  78: { alt: 'Historic church in a small Costa Rican town.' },
  79: { alt: 'Colorful houses in a traditional Costa Rican village.' },
  80: { alt: 'Sunset over the Pacific Ocean from a beachfront restaurant.' },
  
  // Additional wildlife
  81: { alt: 'Agouti foraging on the forest floor.' },
  82: { alt: 'Keel-billed toucan in the rainforest canopy.' },
  83: { alt: 'Basilisk lizard on a branch near a river.' },
  84: { alt: 'White-nosed coati searching for food.' },
  85: { alt: 'Toucan flying through the forest with its large colorful bill.' },
  
  // Additional landscapes and activities
  86: { alt: 'Hiking trail through the cloud forest with hanging moss.' },
  87: { alt: 'Waterfall in the rainforest surrounded by lush vegetation.' },
  88: { alt: 'Suspension bridge high above the forest floor.' },
  89: { alt: 'Kayaking on a calm river through the jungle.' },
  90: { alt: 'Relaxing in a hammock with an ocean view.' },
  
  // More culture and people
  91: { alt: 'Local artisan making traditional Costa Rican crafts.' },
  92: { alt: 'Traditional Costa Rican oxcart with bright colors.' },
  93: { alt: 'Cooking class learning to make traditional dishes.' },
  94: { alt: 'Local musician playing traditional Costa Rican music.' },
  95: { alt: 'Family making tortillas the traditional way.' },
  
  // Additional scenic and nature
  96: { alt: 'View of the Poás Volcano crater on a clear day.' },
  97: { alt: 'Misty morning in the cloud forest.' },
  98: { alt: 'Sunset over the Pacific with palm tree silhouettes.' },
  99: { alt: 'Rainbow over the rainforest after a tropical shower.' },
  100: { alt: 'Panoramic view of the Central Valley from a mountain top.' },
  
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

export default function CostaRicaGallery() {
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
            src="/img/Costa Rica/panorama-costarica (7).jpg"
            alt="Costa Rica Panorama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/50 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Costa Rica</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              Salt mines, mountains, ice caves, palaces, and more castles than you can count. Welcome to Costa Rica.
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

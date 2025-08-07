'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { GradientButton } from '@/components/ui/gradient-button';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  location: string;
}

// Helper function to generate image paths
const getImagePath = (id: number) => {
  // Handle special case for ID 2 which is missing
  if (id === 2) return null;
  
  const basePath = '/img/USA/usa';
  const extension = id <= 47 ? '.JPG' : '.jpg';
  return `${basePath} (${id})${extension}`;
};

// Generate gallery images array
export const galleryImages: GalleryImage[] = Array.from({ length: 62 }, (_, i) => {
  const id = i + 1;
  // Skip the missing image
  if (id === 2) return null;
  
  return {
    id,
    src: getImagePath(id) || '',
    alt: `Photo ${id}`,
    location: 'USA'
  };
}).filter(Boolean) as GalleryImage[];

// Add specific alt text and locations for some images
const imageDetails: Record<number, Partial<GalleryImage>> = {
  1: { alt: 'Waterfall created by glaciermelt', location: 'Washington' },
  3: { alt: 'Entrance to Reno', location: 'Nevada' },
  4: { alt: 'Mojave Sand Dunes', location: 'California' },
  5: { alt: 'Montezuma Castle', location: 'Arizona' },
  6: { alt: 'Arch at Bryce Canyon National Park', location: 'Utah' },
  7: { alt: 'Natural Arches', location: 'Oregon' },
  8: { alt: 'El Diablo Lake', location: 'Washington' },
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
  46: { alt: 'Interesting rock formation', location: 'Arizona' },
  47: { alt: 'Hoodoos at sunset', location: 'Utah' },
  48: { alt: 'Just hanging out', location: 'Arizona' },
  49: { alt: 'Dustdevil', location: 'Montana' },
  50: { alt: 'Mountain reflection', location: 'Washington' },
  51: { alt: 'Desert plants', location: 'Arizona' },
  52: { alt: 'Mountain lake', location: 'Oregon' },
  53: { alt: 'Red rock formations', location: 'Arizona' },
  54: { alt: 'Coastal sunset', location: 'Oregon' },
  55: { alt: 'Mountain stream', location: 'Washington' },
  56: { alt: 'Desert flora', location: 'Arizona' },
  57: { alt: 'Alpine lake', location: 'Washington' },
  58: { alt: 'Mountain', location: 'Oregon' },
  59: { alt: 'Lost Lake', location: 'Oregon' },
  60: { alt: 'Mount Rainier with clouds', location: 'Oregon' },
  61: { alt: 'Jeff relaxes', location: 'Oregon' },
  62: { alt: 'Mount Rainier over Lost Lake', location: 'Oregon' },
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

export default function UnitedStatesGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
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
    <div className="min-h-screen bg-[#05001a]">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <h1 className="text-2xl font-serif text-black mb-2">JOSÉ MARÍA BARBEITO</h1>
          <hr className="border-t border-black w-1/2 mx-auto my-2" />
          <nav className="mt-2">
            <a href="/" className="mx-4 text-gray-800 hover:text-gray-600 transition-colors">Home</a>
            <a href="/#projects" className="mx-4 text-gray-800 hover:text-gray-600 transition-colors">Projects</a>
            <a href="/#photography" className="mx-4 text-gray-800 hover:text-gray-600 transition-colors">Photography</a>
            <a href="/about" className="mx-4 text-gray-800 hover:text-gray-600 transition-colors">About Me</a>
          </nav>
        </div>
      </header>

      {/* Hero Section with Panorama */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/img/USA/panorama-USA-1.JPG"
            alt="USA Panorama"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="bg-black/70 p-8 rounded-lg max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">United States of America</h1>
            <p className="text-xl text-gray-100 mb-6">
              35 states, 20 national parks, 11,200 miles. Through two road trips through the western United States, 
              I have seen a large swath of this great country and enjoyed every second of it.
            </p>
            <a 
              href="#panoramas" 
              className="inline-block mt-4 text-white hover:text-gray-300 transition-colors"
            >
              Panoramas
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <section className="w-full bg-gray-900 py-12">
        <div className="w-full flex justify-center px-4">
          <div className="flex items-center justify-center gap-32">
            <GradientButton 
              variant="variant"
              className="px-10 py-5 text-lg font-bold transform scale-150 origin-center"
              onClick={() => {}}
            >
              Photos
            </GradientButton>
            <GradientButton 
              variant="variant"
              className="px-10 py-5 text-lg font-bold transform scale-150 origin-center"
              onClick={() => {}}
            >
              Panoramas
            </GradientButton>
            <GradientButton 
              variant="variant"
              className="px-10 py-5 text-lg font-bold transform scale-150 origin-center"
              onClick={() => {}}
            >
              Drone Videos
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <div className="w-full bg-gray-900 pb-12">
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
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              className="object-contain"
              priority
              style={{ maxWidth: '100%', maxHeight: '100%' }}
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

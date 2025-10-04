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

interface ImageDetails {
  alt: string;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

type GalleryView = 'photos' | 'panoramas' | 'drone';

// Helper function to generate image paths
const getImagePath = (id: number) => {
  const basePath = '/img/Argentina/argentina';
  return `${basePath} (${id}).jpg`;
};

// Image details for alt text and location
const imageDetails: Record<number, ImageDetails> = {
  1: { alt: 'DescriptionComingSoon' },
  2: { alt: 'DescriptionComingSoon' },
  3: { alt: 'DescriptionComingSoon' },
  4: { alt: 'DescriptionComingSoon' },
  5: { alt: 'DescriptionComingSoon' },
  6: { alt: 'DescriptionComingSoon' },
  7: { alt: 'DescriptionComingSoon' },
  8: { alt: 'DescriptionComingSoon' },
  9: { alt: 'DescriptionComingSoon' },
  10: { alt: 'DescriptionComingSoon' },
  11: { alt: 'DescriptionComingSoon' },
  12: { alt: 'DescriptionComingSoon' },
  13: { alt: 'DescriptionComingSoon' },
  14: { alt: 'DescriptionComingSoon' },
  15: { alt: 'DescriptionComingSoon' },
  16: { alt: 'DescriptionComingSoon' },
  17: { alt: 'DescriptionComingSoon' },
  18: { alt: 'DescriptionComingSoon' },
  19: { alt: 'DescriptionComingSoon' },
  20: { alt: 'DescriptionComingSoon' },
  21: { alt: 'DescriptionComingSoon' },
  22: { alt: 'DescriptionComingSoon' },
  23: { alt: 'DescriptionComingSoon' },
  24: { alt: 'DescriptionComingSoon' },
  25: { alt: 'DescriptionComingSoon' },
  26: { alt: 'DescriptionComingSoon' },
  27: { alt: 'DescriptionComingSoon' },
  28: { alt: 'DescriptionComingSoon' },
  29: { alt: 'DescriptionComingSoon' },
  30: { alt: 'DescriptionComingSoon' },
  31: { alt: 'DescriptionComingSoon' },
  32: { alt: 'DescriptionComingSoon' },
  33: { alt: 'DescriptionComingSoon' },
  34: { alt: 'DescriptionComingSoon' },
  35: { alt: 'DescriptionComingSoon' },
  36: { alt: 'DescriptionComingSoon' },
  37: { alt: 'DescriptionComingSoon' },
  38: { alt: 'DescriptionComingSoon' },
  39: { alt: 'DescriptionComingSoon' },
  40: { alt: 'DescriptionComingSoon' },
  41: { alt: 'DescriptionComingSoon' },
  42: { alt: 'DescriptionComingSoon' },
  43: { alt: 'DescriptionComingSoon' },
  44: { alt: 'DescriptionComingSoon' },
  45: { alt: 'DescriptionComingSoon' },
  46: { alt: 'DescriptionComingSoon' },
  47: { alt: 'DescriptionComingSoon' },
  48: { alt: 'DescriptionComingSoon' },
  49: { alt: 'DescriptionComingSoon' },
  50: { alt: 'DescriptionComingSoon' },
  51: { alt: 'DescriptionComingSoon' },
  52: { alt: 'DescriptionComingSoon' },
  53: { alt: 'DescriptionComingSoon' },
  54: { alt: 'DescriptionComingSoon' },
  55: { alt: 'DescriptionComingSoon' },
  56: { alt: 'DescriptionComingSoon' },
  57: { alt: 'DescriptionComingSoon' },
  58: { alt: 'DescriptionComingSoon' },
  59: { alt: 'DescriptionComingSoon' },
  60: { alt: 'DescriptionComingSoon' },
  61: { alt: 'DescriptionComingSoon' },
  62: { alt: 'DescriptionComingSoon' },
  63: { alt: 'DescriptionComingSoon' },
  64: { alt: 'DescriptionComingSoon' },
  65: { alt: 'DescriptionComingSoon' },
  66: { alt: 'DescriptionComingSoon' },
  67: { alt: 'DescriptionComingSoon' },
  68: { alt: 'DescriptionComingSoon' },
  69: { alt: 'DescriptionComingSoon' },
  70: { alt: 'DescriptionComingSoon' },
  71: { alt: 'DescriptionComingSoon' },
  72: { alt: 'DescriptionComingSoon' },
  73: { alt: 'DescriptionComingSoon' },
  74: { alt: 'DescriptionComingSoon' },
  75: { alt: 'DescriptionComingSoon' },
  76: { alt: 'DescriptionComingSoon' },
  77: { alt: 'DescriptionComingSoon' },
  78: { alt: 'DescriptionComingSoon' },
  79: { alt: 'DescriptionComingSoon' },
  80: { alt: 'DescriptionComingSoon' },
  81: { alt: 'DescriptionComingSoon' },
  82: { alt: 'DescriptionComingSoon' },
  83: { alt: 'DescriptionComingSoon' },
  84: { alt: 'DescriptionComingSoon' },
  85: { alt: 'DescriptionComingSoon' },
  86: { alt: 'DescriptionComingSoon' },
  87: { alt: 'DescriptionComingSoon' },
  88: { alt: 'DescriptionComingSoon' },
  89: { alt: 'DescriptionComingSoon' },
  90: { alt: 'DescriptionComingSoon' },
  91: { alt: 'DescriptionComingSoon' },
  92: { alt: 'DescriptionComingSoon' },
  93: { alt: 'DescriptionComingSoon' },
  94: { alt: 'DescriptionComingSoon' },
  95: { alt: 'DescriptionComingSoon' },
  96: { alt: 'DescriptionComingSoon' },
  97: { alt: 'DescriptionComingSoon' },
  98: { alt: 'DescriptionComingSoon' },
  99: { alt: 'DescriptionComingSoon' },
  100: { alt: 'DescriptionComingSoon' },
  101: { alt: 'DescriptionComingSoon' },
  102: { alt: 'DescriptionComingSoon' },
  103: { alt: 'DescriptionComingSoon' },
  104: { alt: 'DescriptionComingSoon' },
  105: { alt: 'DescriptionComingSoon' },
  106: { alt: 'DescriptionComingSoon' },
  107: { alt: 'DescriptionComingSoon' },
  108: { alt: 'DescriptionComingSoon' },
  109: { alt: 'DescriptionComingSoon' },
  110: { alt: 'DescriptionComingSoon' },
  111: { alt: 'DescriptionComingSoon' },
  112: { alt: 'DescriptionComingSoon' },
  113: { alt: 'DescriptionComingSoon' },
  114: { alt: 'DescriptionComingSoon' },
  115: { alt: 'DescriptionComingSoon' },
  116: { alt: 'DescriptionComingSoon' },
  117: { alt: 'DescriptionComingSoon' },
  118: { alt: 'DescriptionComingSoon' },
  119: { alt: 'DescriptionComingSoon' },
  120: { alt: 'DescriptionComingSoon' },
  121: { alt: 'DescriptionComingSoon' },
  122: { alt: 'DescriptionComingSoon' },
  123: { alt: 'DescriptionComingSoon' },
  124: { alt: 'DescriptionComingSoon' },
  125: { alt: 'DescriptionComingSoon' },
  126: { alt: 'DescriptionComingSoon' },
  127: { alt: 'DescriptionComingSoon' },
  128: { alt: 'DescriptionComingSoon' },
  129: { alt: 'DescriptionComingSoon' },
  130: { alt: 'DescriptionComingSoon' },
  131: { alt: 'DescriptionComingSoon' },
  132: { alt: 'DescriptionComingSoon' },
  133: { alt: 'DescriptionComingSoon' },
  134: { alt: 'DescriptionComingSoon' },
  135: { alt: 'DescriptionComingSoon' },
  136: { alt: 'DescriptionComingSoon' },
  137: { alt: 'DescriptionComingSoon' },
  138: { alt: 'DescriptionComingSoon' },
  139: { alt: 'DescriptionComingSoon' },
  140: { alt: 'DescriptionComingSoon' },
  141: { alt: 'DescriptionComingSoon' },
  142: { alt: 'DescriptionComingSoon' },
  143: { alt: 'DescriptionComingSoon' },
  144: { alt: 'DescriptionComingSoon' },
  145: { alt: 'DescriptionComingSoon' },
  146: { alt: 'DescriptionComingSoon' },
  147: { alt: 'DescriptionComingSoon' },
  148: { alt: 'DescriptionComingSoon' },
  149: { alt: 'DescriptionComingSoon' },
  150: { alt: 'DescriptionComingSoon' },
  151: { alt: 'DescriptionComingSoon' },
  152: { alt: 'DescriptionComingSoon' },
  153: { alt: 'DescriptionComingSoon' },
  154: { alt: 'DescriptionComingSoon' },
  155: { alt: 'DescriptionComingSoon' },
  156: { alt: 'DescriptionComingSoon' },
  157: { alt: 'DescriptionComingSoon' },
  158: { alt: 'DescriptionComingSoon' },
  159: { alt: 'DescriptionComingSoon' },
  160: { alt: 'DescriptionComingSoon' },
  161: { alt: 'DescriptionComingSoon' },
  162: { alt: 'DescriptionComingSoon' },
  163: { alt: 'DescriptionComingSoon' },
  164: { alt: 'DescriptionComingSoon' },
  165: { alt: 'DescriptionComingSoon' },
  166: { alt: 'DescriptionComingSoon' },
  167: { alt: 'DescriptionComingSoon' },
  168: { alt: 'DescriptionComingSoon' },
  169: { alt: 'DescriptionComingSoon' },
  170: { alt: 'DescriptionComingSoon' },
  171: { alt: 'DescriptionComingSoon' },
  172: { alt: 'DescriptionComingSoon' },
  173: { alt: 'DescriptionComingSoon' },
  174: { alt: 'DescriptionComingSoon' },
  175: { alt: 'DescriptionComingSoon' },
  176: { alt: 'DescriptionComingSoon' },
  177: { alt: 'DescriptionComingSoon' },
  178: { alt: 'DescriptionComingSoon' },
  179: { alt: 'DescriptionComingSoon' },
  180: { alt: 'DescriptionComingSoon' },
  181: { alt: 'DescriptionComingSoon' },
  182: { alt: 'DescriptionComingSoon' },
  183: { alt: 'DescriptionComingSoon' },
  184: { alt: 'DescriptionComingSoon' },
  185: { alt: 'DescriptionComingSoon' },
  186: { alt: 'DescriptionComingSoon' },
  187: { alt: 'DescriptionComingSoon' },
  188: { alt: 'DescriptionComingSoon' },
  189: { alt: 'DescriptionComingSoon' },
  190: { alt: 'DescriptionComingSoon' },
  191: { alt: 'DescriptionComingSoon' },
  192: { alt: 'DescriptionComingSoon' },
  193: { alt: 'DescriptionComingSoon' },
  194: { alt: 'DescriptionComingSoon' },
  195: { alt: 'DescriptionComingSoon' },
  196: { alt: 'DescriptionComingSoon' },
  197: { alt: 'DescriptionComingSoon' },
  198: { alt: 'DescriptionComingSoon' },
  199: { alt: 'DescriptionComingSoon' },
  200: { alt: 'DescriptionComingSoon' },
  201: { alt: 'DescriptionComingSoon' },
  202: { alt: 'DescriptionComingSoon' },
  203: { alt: 'DescriptionComingSoon' },
  204: { alt: 'DescriptionComingSoon' },
  205: { alt: 'DescriptionComingSoon' },
  206: { alt: 'DescriptionComingSoon' },
  207: { alt: 'DescriptionComingSoon' },
  208: { alt: 'DescriptionComingSoon' },
  209: { alt: 'DescriptionComingSoon' },
  210: { alt: 'DescriptionComingSoon' },
  211: { alt: 'DescriptionComingSoon' },
  212: { alt: 'DescriptionComingSoon' },
  213: { alt: 'DescriptionComingSoon' },
  214: { alt: 'DescriptionComingSoon' },
  215: { alt: 'DescriptionComingSoon' },
  216: { alt: 'DescriptionComingSoon' },
  217: { alt: 'DescriptionComingSoon' },
  218: { alt: 'DescriptionComingSoon' },
  219: { alt: 'DescriptionComingSoon' },
  220: { alt: 'DescriptionComingSoon' },
  221: { alt: 'DescriptionComingSoon' },
  222: { alt: 'DescriptionComingSoon' },
  223: { alt: 'DescriptionComingSoon' },
  224: { alt: 'DescriptionComingSoon' },
  225: { alt: 'DescriptionComingSoon' },
  226: { alt: 'DescriptionComingSoon' },
  227: { alt: 'DescriptionComingSoon' },
  228: { alt: 'DescriptionComingSoon' },
  229: { alt: 'DescriptionComingSoon' },
  230: { alt: 'DescriptionComingSoon' },
  231: { alt: 'DescriptionComingSoon' },
  232: { alt: 'DescriptionComingSoon' },
  233: { alt: 'DescriptionComingSoon' },
  234: { alt: 'DescriptionComingSoon' },
  235: { alt: 'DescriptionComingSoon' },
  236: { alt: 'DescriptionComingSoon' },
  237: { alt: 'DescriptionComingSoon' },
  238: { alt: 'DescriptionComingSoon' },
  239: { alt: 'DescriptionComingSoon' },
  240: { alt: 'DescriptionComingSoon' },
  241: { alt: 'DescriptionComingSoon' },
  242: { alt: 'DescriptionComingSoon' },
  243: { alt: 'DescriptionComingSoon' },
  244: { alt: 'DescriptionComingSoon' },
  245: { alt: 'DescriptionComingSoon' },
  246: { alt: 'DescriptionComingSoon' },
  247: { alt: 'DescriptionComingSoon' },
  248: { alt: 'DescriptionComingSoon' },
  249: { alt: 'DescriptionComingSoon' },
  250: { alt: 'DescriptionComingSoon' },
  251: { alt: 'DescriptionComingSoon' },
  252: { alt: 'DescriptionComingSoon' },
  253: { alt: 'DescriptionComingSoon' },
  254: { alt: 'DescriptionComingSoon' },
  255: { alt: 'DescriptionComingSoon' },
  256: { alt: 'DescriptionComingSoon' },
  257: { alt: 'DescriptionComingSoon' },
  258: { alt: 'DescriptionComingSoon' },
  259: { alt: 'DescriptionComingSoon' },
  260: { alt: 'DescriptionComingSoon' },
  261: { alt: 'DescriptionComingSoon' },
  262: { alt: 'DescriptionComingSoon' },
  263: { alt: 'DescriptionComingSoon' },
  264: { alt: 'DescriptionComingSoon' },
  265: { alt: 'DescriptionComingSoon' },
  266: { alt: 'DescriptionComingSoon' },
  267: { alt: 'DescriptionComingSoon' },
  268: { alt: 'DescriptionComingSoon' },
  269: { alt: 'DescriptionComingSoon' },
  270: { alt: 'DescriptionComingSoon' },
  271: { alt: 'DescriptionComingSoon' },
  272: { alt: 'DescriptionComingSoon' },
  273: { alt: 'DescriptionComingSoon' },
  274: { alt: 'DescriptionComingSoon' },
  275: { alt: 'DescriptionComingSoon' },
  276: { alt: 'DescriptionComingSoon' },
  277: { alt: 'DescriptionComingSoon' },
  278: { alt: 'DescriptionComingSoon' },
  279: { alt: 'DescriptionComingSoon' },
  280: { alt: 'DescriptionComingSoon' },
  281: { alt: 'DescriptionComingSoon' },
  282: { alt: 'DescriptionComingSoon' },
  283: { alt: 'DescriptionComingSoon' },
  284: { alt: 'DescriptionComingSoon' },
  285: { alt: 'DescriptionComingSoon' },
  286: { alt: 'DescriptionComingSoon' },
  287: { alt: 'DescriptionComingSoon' },
  288: { alt: 'DescriptionComingSoon' },
  289: { alt: 'DescriptionComingSoon' },
  290: { alt: 'DescriptionComingSoon' },
  291: { alt: 'DescriptionComingSoon' },
  292: { alt: 'DescriptionComingSoon' },
  293: { alt: 'DescriptionComingSoon' },
  294: { alt: 'DescriptionComingSoon' },
  295: { alt: 'DescriptionComingSoon' },
  296: { alt: 'DescriptionComingSoon' },
  297: { alt: 'DescriptionComingSoon' },
  298: { alt: 'DescriptionComingSoon' },
  299: { alt: 'DescriptionComingSoon' },
  300: { alt: 'DescriptionComingSoon' },
  301: { alt: 'DescriptionComingSoon' },
  302: { alt: 'DescriptionComingSoon' },
  303: { alt: 'DescriptionComingSoon' },
  304: { alt: 'DescriptionComingSoon' },
  305: { alt: 'DescriptionComingSoon' },
  306: { alt: 'DescriptionComingSoon' },
  307: { alt: 'DescriptionComingSoon' },
  308: { alt: 'DescriptionComingSoon' },
  309: { alt: 'DescriptionComingSoon' },
  310: { alt: 'DescriptionComingSoon' },
  311: { alt: 'DescriptionComingSoon' },
  312: { alt: 'DescriptionComingSoon' },
  313: { alt: 'DescriptionComingSoon' },
  314: { alt: 'DescriptionComingSoon' },
  315: { alt: 'DescriptionComingSoon' },
  316: { alt: 'DescriptionComingSoon' },
  317: { alt: 'DescriptionComingSoon' },
  318: { alt: 'DescriptionComingSoon' },
  319: { alt: 'DescriptionComingSoon' },
  320: { alt: 'DescriptionComingSoon' },
  321: { alt: 'DescriptionComingSoon' },
  322: { alt: 'DescriptionComingSoon' },
  323: { alt: 'DescriptionComingSoon' },
  324: { alt: 'DescriptionComingSoon' },
  325: { alt: 'DescriptionComingSoon' },
  326: { alt: 'DescriptionComingSoon' },
  327: { alt: 'DescriptionComingSoon' },
  328: { alt: 'DescriptionComingSoon' },
  329: { alt: 'DescriptionComingSoon' },
  330: { alt: 'DescriptionComingSoon' },
  331: { alt: 'DescriptionComingSoon' },
  332: { alt: 'DescriptionComingSoon' },
  333: { alt: 'DescriptionComingSoon' },
  334: { alt: 'DescriptionComingSoon' },
  335: { alt: 'DescriptionComingSoon' },
  336: { alt: 'DescriptionComingSoon' },
  337: { alt: 'DescriptionComingSoon' },
  338: { alt: 'DescriptionComingSoon' },
  339: { alt: 'DescriptionComingSoon' },
  340: { alt: 'DescriptionComingSoon' },
  341: { alt: 'DescriptionComingSoon' },
  342: { alt: 'DescriptionComingSoon' },
  343: { alt: 'DescriptionComingSoon' },
  344: { alt: 'DescriptionComingSoon' },
  345: { alt: 'DescriptionComingSoon' },
  346: { alt: 'DescriptionComingSoon' },
  347: { alt: 'DescriptionComingSoon' },
  348: { alt: 'DescriptionComingSoon' },
  349: { alt: 'DescriptionComingSoon' },
  350: { alt: 'DescriptionComingSoon' },
  351: { alt: 'DescriptionComingSoon' },
  352: { alt: 'DescriptionComingSoon' },
  353: { alt: 'DescriptionComingSoon' },
};

export default function ArgentinaGallery() {
  // Generate gallery images with useMemo
  const galleryImages = useMemo<GalleryImage[]>(() => {
    return Array.from({ length: 353 }, (_, i) => {
      const details = imageDetails[i + 1] || { alt: `Photo ${i + 1}` };
      const image: GalleryImage = {
        id: i + 1,
        src: getImagePath(i + 1),
        alt: details.alt
      };
      
      // Location property has been removed
      
      return image;
    });
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
  // Debug effect to verify image paths (development only)
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

  // Panorama images data
  const panoramaImages = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 14 },
    { id: 15 },
    { id: 16 },
    { id: 17 },
    { id: 18 },
    { id: 19 },
    { id: 20 },
    { id: 21 },
    { id: 22 },
    { id: 23 },
    { id: 24 },
    { id: 25 },
    { id: 26 },
    { id: 27 },
    { id: 28 },
    { id: 29 },
    { id: 30 },
    { id: 31 },
    { id: 32 },
    { id: 33 },
    { id: 34 },
    { id: 35 },
    { id: 36 },
    { id: 37 },
    { id: 38 },
    { id: 39 },
    { id: 40 },
    { id: 41 },
    { id: 42 },
    { id: 43 },
    { id: 44 },
    { id: 45 },
    { id: 46 },
    { id: 47 },
    { id: 48 },
    { id: 49 },
    { id: 50 },
    { id: 51 },
    { id: 52 },
    { id: 53 },
    { id: 54 }
  ];

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
                      From glaciers to dusty deserts, I think I photographed plenty of Argentina.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <div className="w-full py-8">
                {panoramaImages.map((item, index) => (
                  <div key={item.id} className={`w-full ${index > 0 ? 'mt-12' : ''} mx-auto`} style={{ marginBottom: '40px' }}>
                    <PanoramaViewer
                      src={`/img/Argentina/argentina_panorama (${item.id}).jpg`}
                      alt={`Panorama ${item.id}`}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Argentina Drone Footage</h2>
              <div className="w-full max-w-6xl text-center">
                <p className="text-gray-300 text-lg md:text-xl mb-8">
                  Drone footage coming soon. Check back later for amazing aerial views of Argentina!
                </p>
                {/* Placeholder for future video */}
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                  <p>Video Coming Soon</p>
                </div>
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

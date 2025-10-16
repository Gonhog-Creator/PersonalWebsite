'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import { RainbowBorderButton } from '../ui/rainbow-borders-button';
import 'aos/dist/aos.css';
import { SilverBorderButton } from "@/components/ui/SilverBorderButton";

type GalleryItem = {
  id: string;
  title: string;
  image: string;
  count: number;
  category: string;
  location: string;
  date: string;
  aspectRatio?: string;
};

// Gallery data is used in the component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const galleries: GalleryItem[] = [
  {
    id: 'united-states',
    title: 'United States',
    image: '/img/USA/usa-1.jpg',
    count: 64,
    category: 'Travel',
    location: 'Various Locations',
    date: '2020-2023',
    aspectRatio: 'aspect-square'
  },
  {
    id: 'united-kingdom',
    title: 'United Kingdom',
    image: '/img/United Kingdom/uk-1.jpg',
    count: 24,
    category: 'Urban',
    location: 'London, England',
    date: 'Summer 2022',
    aspectRatio: 'aspect-video'
  },
  {
    id: 'germany',
    title: 'Germany',
    image: '/img/Germany/germany-1.jpg',
    count: 18,
    category: 'Architecture',
    location: 'Berlin, Germany',
    date: 'Spring 2022',
    aspectRatio: 'aspect-square'
  },
  {
    id: 'nature',
    title: 'Nature & Landscapes',
    image: '/img/Austria/nature-1.jpg',
    count: 32,
    category: 'Nature',
    location: 'Various Locations',
    date: '2019-2023',
    aspectRatio: 'aspect-video'
  },
  {
    id: 'portraits',
    title: 'Portrait Series',
    image: '/img/profile.png',
    count: 15,
    category: 'Portrait',
    location: 'New York, NY',
    date: '2021-2023',
    aspectRatio: 'aspect-square'
  },
  {
    id: 'street',
    title: 'Street Photography',
    image: '/img/United Kingdom/street-1.jpg',
    count: 28,
    category: 'Street',
    location: 'Various Cities',
    date: '2020-2023',
    aspectRatio: 'aspect-video'
  },
];


const Photography = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors duration-300" id="photography">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* World Map Section */}
        <div className="w-full flex flex-col items-center mb-32" data-aos="fade-up">
          <div className="w-full max-w-4xl px-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">World Map</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="w-full h-[500px] relative">
                <Image
                  src="/img/WorldMapImage.png"
                  alt="World Map"
                  fill
                  className="object-cover"
                  priority
                  style={{ objectPosition: 'center' }}
                />
              </div>
            </div>
            <div className="mt-8 mb-12 flex justify-center">
              <SilverBorderButton 
                as="a" 
                href="/gallery_map"
                width="220px"
                height="50px"
                className="text-base mx-auto"
              >
                View Map
              </SilverBorderButton>
            </div>
          </div>
        </div>

        {/* Spacing between sections */}
        <div className="h-24"></div>

        {/* Astrophotography Section */}
        <div className="mt-32 mb-32 text-center" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Astrophotography</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative w-full h-64">
                <Image 
                  src="/img/Astro/M31-10.6.25-4.75hours.jpg"
                  alt="Astrophotography 1" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative w-full h-64">
                <Image 
                  src="/img/Astro/astro-15.jpg"
                  alt="Astrophotography 2" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6 mb-12">
            <SilverBorderButton 
              as="a" 
              href="/astrophotography"
              width="180px"
              height="45px"
              className="text-sm mx-auto"
            >
              View Full Gallery
            </SilverBorderButton>
          </div>
        </div>

        {/* Spacing between sections */}
        <div className="h-24"></div>

        {/* All Galleries Section */}
        <div className="mt-20 text-center" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">View All Galleries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative w-full h-64">
                <Image 
                  src="/img/Greece/greece (67).jpg" 
                  alt="Greece" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative w-full h-64">
                <Image 
                  src="/img/Costa Rica/costarica (124).jpg" 
                  alt="Costa Rica" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-20 mt-6">
            <SilverBorderButton 
              as="a" 
              href="/galleries"
              width="220px"
              height="45px"
              className="text-sm"
            >
              View All Galleries
            </SilverBorderButton>
            <div>
              <RainbowBorderButton
                as="a"
                href="/carousel_gallery"
                width="260px"
                height="55px"
                className="text-base hover:scale-105 transition-transform"
              >
                Screensaver Gallery
              </RainbowBorderButton>
            </div>
          </div>
        </div>
        

      </div>
    </section>
  );
};

export default Photography;

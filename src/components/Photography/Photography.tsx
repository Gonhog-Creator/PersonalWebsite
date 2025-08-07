'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import dynamic from 'next/dynamic';

// Dynamically import the WorldMap component with no SSR
const WorldMap = dynamic(
  () => import('./WorldMap'),
  { ssr: false }
);

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

type TabType = 'world-map' | 'astrophotography' | 'all-galleries';

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

// Get unique categories for filters
const categories = ['all', ...new Set(galleries.map(gallery => gallery.category))];

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
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="text-blue-600 dark:text-blue-400">Photography</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Exploring the world through my lens.
          </p>
        </div>

        {/* World Map Section */}
        <div className="w-full flex flex-col items-center mb-16" data-aos="fade-up">
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
            <div className="mt-8 text-center">
              <a 
                href="/gallery_map" 
                className="inline-flex items-center justify-center px-14 py-5 text-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                View Map
              </a>
            </div>
          </div>
        </div>

        {/* Astrophotography Section */}
        <div className="mb-16" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Astrophotography</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/img/Astro/astro (12).jpg" 
                alt="Astrophotography 1" 
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/img/Astro/astro (22).jpg" 
                alt="Astrophotography 2" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          <div className="text-center mt-6">
            <a 
              href="/astro" 
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Full Gallery
            </a>
          </div>
        </div>

        {/* All Galleries Section */}
        <div data-aos="fade-up">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">View All Galleries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/img/Greece/greece (67).jpg" 
                alt="Greece" 
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/img/Costa Rica/costarica (124).jpg" 
                alt="Costa Rica" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          <div className="text-center mt-6">
            <a 
              href="/galleries" 
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Galleries
            </a>
          </div>
        </div>
        
        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link
            href="/photography"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
          >
            View All Galleries
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Photography;

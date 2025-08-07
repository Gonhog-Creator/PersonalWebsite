'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { GalleriesHeader } from '@/components/Galleries/GalleriesHeader';

// Gallery data with panorama images
const galleries = [
  {
    id: 'united-states',
    title: 'United States',
    image: '/img/USA/panorama-USA-1.JPG',
    count: 24,
    location: 'North America'
  },
  {
    id: 'argentina',
    title: 'Argentina',
    image: '/img/Argentina/panorama-argentina-1.JPG',
    count: 18,
    location: 'South America'
  },
  {
    id: 'australia',
    title: 'Australia',
    image: '/img/Australia/panorama-australia-1.JPG',
    count: 11,
    location: 'Oceania'
  },
  {
    id: 'costa-rica',
    title: 'Costa Rica',
    image: '/img/Costa Rica/panorama-costarica-1.JPG',
    count: 14,
    location: 'Central America'
  },
  {
    id: 'france',
    title: 'France',
    image: '/img/France/panorama-france-1.JPG',
    count: 10,
    location: 'Europe'
  },
  {
    id: 'belgium',
    title: 'Belgium',
    image: '/img/Belgium/panorama-belgium-1.JPG',
    count: 6,
    location: 'Europe'
  },
  {
    id: 'switzerland',
    title: 'Switzerland',
    image: '/img/Switzerland/panorama-switzerland-1.JPG',
    count: 15,
    location: 'Europe'
  },
  {
    id: 'austria',
    title: 'Austria',
    image: '/img/Austria/panorama-austria-1.JPG',
    count: 7,
    location: 'Europe'
  },
  {
    id: 'slovenia',
    title: 'Slovenia',
    image: '/img/Slovenia/panorama-slovenia-1.JPG',
    count: 9,
    location: 'Europe'
  },
  {
    id: 'germany',
    title: 'Germany',
    image: '/img/Germany/panorama-germany-1.JPG',
    count: 12,
    location: 'Europe'
  },
  {
    id: 'united-kingdom',
    title: 'United Kingdom',
    image: '/img/United Kingdom/panorama-uk-1.JPG',
    count: 8,
    location: 'Europe'
  },
  {
    id: 'greece',
    title: 'Greece',
    image: '/img/Greece/panorama-greece-1.JPG',
    count: 13,
    location: 'Europe'
  }
];

export default function GalleriesPage() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <GalleriesHeader />
      
      <main className="pt-32 pb-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              All <span className="text-blue-600 dark:text-blue-400">Galleries</span>
            </h1>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>

        <div className="w-full">
          {galleries.map((gallery, index) => (
            <div 
              key={gallery.id}
              data-aos="fade-up"
              data-aos-delay={100 + (index * 50)}
              className="relative w-full mb-8 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div 
                className="relative w-full h-[60vh] min-h-[500px] bg-cover bg-center"
                style={{
                  backgroundImage: `url(${gallery.image})`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  filter: 'brightness(0.9)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{gallery.title}</h2>
                    <div className="flex justify-center">
                      <Link 
                        href={`/galleries/${gallery.id}`}
                        className="inline-flex items-center justify-center px-10 py-3 border-2 border-white/20 bg-blue-600/90 hover:bg-blue-700 text-white text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        View Gallery
                        <svg 
                          className="ml-3 w-5 h-5" 
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
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}

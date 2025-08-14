'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GalleriesHeader } from '@/components/Galleries/GalleriesHeader';
import { MagneticButton } from '@/components/ui/magnetic-button';

// Gallery data with panorama images
const galleries = [
  {
    id: 'united-states',
    title: 'United States',
    image: '/img/USA/panorama-USA-1.JPG',
    count: 70,
    location: 'North America'
  },
  {
    id: 'argentina',
    title: 'Argentina',
    image: '/img/Argentina/argentina_panorama (10).jpg',
    count: 121,
    location: 'South America'
  },
  {
    id: 'australia',
    title: 'Australia',
    image: '/img/Australia/panorama-australia (10).jpg',
    count: 125,
    location: 'Oceania'
  },
  {
    id: 'costa-rica',
    title: 'Costa Rica',
    image: '/img/Costa Rica/panorama-costarica (17).jpg',
    count: 229,
    location: 'Central America'
  },
  {
    id: 'france',
    title: 'France',
    image: '/img/France/france_panorama (6).jpg',
    count: 143,
    location: 'Europe'
  },
  {
    id: 'belgium',
    title: 'Belgium',
    image: '/img/Belgium/belgium_panorama (9).jpg',
    count: 96,
    location: 'Europe'
  },
  {
    id: 'switzerland',
    title: 'Switzerland',
    image: '/img/Switzerland/switzerland_panorama (16).jpg',
    count: 74,
    location: 'Europe'
  },
  {
    id: 'austria',
    title: 'Austria',
    image: '/img/Austria/austria_panorama (22).jpg',
    count: 223,
    location: 'Europe'
  },
  {
    id: 'slovenia',
    title: 'Slovenia',
    image: '/img/Slovenia/slovenia_panorama (8).jpg',
    count: 69,
    location: 'Europe'
  },
  {
    id: 'germany',
    title: 'Germany',
    image: '/img/Germany/germany_panorama (2).jpg',
    count: 214,
    location: 'Europe'
  },
  {
    id: 'uk',
    title: 'United Kingdom',
    image: '/img/United Kingdom/united_kingdom_panorama (2).jpg',
    count: 102,
    location: 'Europe'
  },
  {
    id: 'greece',
    title: 'Greece',
    image: '/img/Greece/greece_panorama (5).jpg',
    count: 134,
    location: 'Europe'
  },
  {
    id: 'scotland',
    title: 'Scotland',
    image: '/img/Scotland/scotland_panorama (3).jpg',
    count: 58,
    location: 'Europe'
  }
];

export default function GalleriesPage() {
  const router = useRouter();

  // Sort galleries alphabetically by title
  const sortedGalleries = [...galleries].sort((a, b) => a.title.localeCompare(b.title));

  // Check if images exist on component mount (silently)
  useEffect(() => {
    sortedGalleries.forEach(gallery => {
      fetch(gallery.image, { method: 'HEAD' }).catch(() => {});
    });
  }, [sortedGalleries]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <GalleriesHeader />
      
      <main className="pt-16">
        {/* Adjustable height section */}
        <div className="h-32 bg-transparent"></div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 px-4" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              All <span className="text-blue-600 dark:text-blue-400">Galleries</span>
            </h1>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>

        <div className="w-full">
          {sortedGalleries.map((gallery, index) => (
            <div 
              key={gallery.id}
              className="relative w-full mb-8 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative w-full h-[35vh] min-h-[250px] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={gallery.image}
                    alt={`${gallery.title} panorama`}
                    className="w-full h-full object-cover object-center brightness-90"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'absolute inset-0 bg-black/60 flex items-center justify-center';
                      errorDiv.innerHTML = `
                        <p class="text-white text-lg">Image not available</p>
                      `;
                      target.parentNode?.appendChild(errorDiv);
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">{gallery.title}</h2>
                      <p className="text-white text-xl">
                        <span className="text-white">{gallery.location}</span> • 
                        <span className="text-white">{gallery.count} photos</span>
                      </p>
                    </div>
                    <MagneticButton distance={0.3}>
                      <Link 
                        href={`/galleries/${gallery.id}`}
                        className="inline-flex items-center justify-center px-16 py-6 text-lg font-medium bg-white text-blue-800 hover:bg-gray-100 transition-colors duration-300 rounded-sm relative overflow-hidden"
                        style={{
                          minWidth: '200px',
                          minHeight: '60px',
                          textAlign: 'center',
                          lineHeight: '1.2'
                        }}
                      >
                        View Gallery
                      </Link>
                    </MagneticButton>
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

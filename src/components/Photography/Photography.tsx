'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

type BentoTile = {
  href: string;
  title: string;
  subtitle: string;
  image: string;
  span: 'wide' | 'normal';
  previews: string[];
};

const tiles: BentoTile[] = [
  {
    href: '/gallery_map',
    title: 'World Map',
    subtitle: 'Explore photos by location',
    image: '/img/WorldMapImage.png',
    span: 'wide',
    previews: [
      '/img/Argentina/argentina (15).jpg',
      '/img/Australia/australia (42).jpg',
      '/img/Norway/norway (8).jpg',
      '/img/Italy/Bologna/Bologna (86).jpg',
      '/img/Switzerland/switzerland (12).jpg',
      '/img/Costa Rica/costarica (85).jpg',
    ],
  },
  {
    href: '/galleries/bests',
    title: 'The Bests',
    subtitle: 'My favorite shots',
    image: '/img/Best/Sunsets/sunsets (18).jpg',
    span: 'normal',
    previews: [
      '/img/Best/Landscape/landscape (1).jpg',
      '/img/Best/Birds/birds (1).jpg',
      '/img/Best/Animals/animals (1).jpg',
      '/img/Best/Plants/plants (1).jpg',
      '/img/Best/Urban/urban (1).jpg',
      '/img/Best/Drone/drone (1).jpg',
    ],
  },
  {
    href: '/astrophotography',
    title: 'Astrophotography',
    subtitle: 'Deep space imaging',
    image: '/img/Astro/M31-10.6.25-4.75hours.jpg',
    span: 'normal',
    previews: [
      '/img/Astro/M51-10.9.25-59x20sec.jpg',
      '/img/Astro/astro-15.jpg',
      '/img/Astro/EasternVeil 8.31.26 HOO Compressed.jpg',
      '/img/Astro/M42-12.1.25-394x10sec.jpg',
      '/img/Astro/M101-10.9.25-1123x10sec.jpg',
      '/img/Astro/M31-10.6.25-4.75hours.jpg',
    ],
  },
  {
    href: '/galleries',
    title: 'All Galleries',
    subtitle: 'Browse every country',
    image: '/img/Greece/greece (67).jpg',
    span: 'wide',
    previews: [
      '/img/Belgium/belgium (45).jpg',
      '/img/Czech Republic/czech-republic (53).jpg',
      '/img/Estonia/estonia (33).jpg',
      '/img/Slovenia/slovenia (13).jpg',
      '/img/Uruguay/uruguay (6).jpg',
      '/img/United Kingdom/united_kingdom (70).jpg',
    ],
  },
  {
    href: '/carousel_gallery',
    title: 'Screensaver',
    subtitle: 'Auto-playing slideshow',
    image: '/img/Costa Rica/costarica (124).jpg',
    span: 'normal',
    previews: [
      '/img/Sweden/sweden (7).jpg',
      '/img/Norway/norway (15).jpg',
      '/img/Argentina/argentina (30).jpg',
      '/img/France/france (10).jpg',
      '/img/Switzerland/switzerland (8).jpg',
      '/img/Costa Rica/costarica (50).jpg',
    ],
  },
];

const Photography = () => {
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Preload all preview images on mount
  useEffect(() => {
    const allPreviews = tiles.flatMap(t => t.previews);
    allPreviews.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const handleMouseEnter = useCallback((i: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredTile(i);
    }, 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  const activeTileIndex = hoveredTile !== null ? hoveredTile : 0;
  const activePreviews = tiles[activeTileIndex].previews;
  const leftPreviews = activePreviews.slice(0, 3);
  const rightPreviews = activePreviews.slice(3, 6);
  const isHovered = hoveredTile !== null;

  return (
    <section className="py-8 bg-gray-900" id="photography">
      <div className="flex items-stretch justify-center gap-4 px-4">
        {/* Left photo strip - visible on xl+ */}
        <div className="hidden xl:flex flex-col gap-3 w-[330px] 2xl:w-[450px] shrink-0">
          {leftPreviews.map((src, i) => (
              <div
                key={`L${i}`}
                className="relative flex-1 rounded-xl overflow-hidden bg-gray-800 min-h-0"
              >
                <img src={src} alt="Preview" loading="eager" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" />
              </div>
            ))}
        </div>

        {/* Bento grid */}
        <div className="flex-1 max-w-[96rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {tiles.map((tile, i) => (
              <Link
                key={tile.href}
                href={tile.href}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave()}
                className={`group relative block rounded-2xl overflow-hidden ${
                  tile.span === 'wide' ? 'md:col-span-2 lg:col-span-2' : ''
                } h-[280px] md:h-[340px]`}
              >
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {tile.title}
                  </h3>
                  <p className="text-sm text-gray-300 opacity-90">
                    {tile.subtitle}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right photo strip - visible on xl+ */}
        <div className="hidden xl:flex flex-col gap-3 w-[330px] 2xl:w-[450px] shrink-0">
          {rightPreviews.map((src, i) => (
              <div
                key={`R${i}`}
                className="relative flex-1 rounded-xl overflow-hidden bg-gray-800 min-h-0"
              >
                <img src={src} alt="Preview" loading="eager" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" />
              </div>
            ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Photography;

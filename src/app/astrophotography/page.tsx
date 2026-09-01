'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Masonry from 'react-masonry-css';
import { FaSearch, FaTimes, FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { dsoImages } from '@/data/dsoData';
import { astroPhotos } from '@/data/astroPhotos';
import { DSOImage, DSOType, CatalogueType } from '@/types/astro';
import { GradientButton } from '@/components/ui/gradient-button';
import { ImageModal } from '@/components/gallery/ImageModal';
import { DSOCard } from './DSOCard';
import { DSODetail } from './DSODetail';

type SortOption = 'title-asc' | 'title-desc' | 'year-asc' | 'year-desc' | 'telescope-priority';

const typeOptions: { value: DSOType; label: string }[] = [
  { value: 'galaxy', label: 'Galaxy' },
  { value: 'nebula', label: 'Nebula' },
  { value: 'star-cluster', label: 'Star Cluster' },
  { value: 'supernova', label: 'Supernova' },
  { value: 'other', label: 'Other' },
];

const allConstellations = Array.from(new Set(dsoImages.map(dso => dso.constellation))).sort();
const allTelescopes = Array.from(new Set(dsoImages.map(dso => dso.telescope))).sort();
const allYears = Array.from(new Set(dsoImages.map(dso => dso.year))).sort((a, b) => b - a);

const timelapseVideos = [
  { id: 1, title: 'ARSA 1', videoUrl: 'https://www.youtube.com/embed/4VhxYci-OL4' },
  { id: 2, title: 'BHI 2', videoUrl: 'https://www.youtube.com/embed/d57AOn_xmKk' },
  { id: 3, title: 'BHI 3', videoUrl: 'https://www.youtube.com/embed/6PL4C1qxzLw' },
  { id: 4, title: 'Fraser Island (1)', videoUrl: 'https://www.youtube.com/embed/U64d3EKE1Ww' },
  { id: 5, title: 'BHI (1)', videoUrl: 'https://www.youtube.com/embed/U1l8mnQj_WA' },
  { id: 6, title: 'Fraser Island (2)', videoUrl: 'https://www.youtube.com/embed/xsapqb72kdY' },
  { id: 7, title: 'Fraser Island (3)', videoUrl: 'https://www.youtube.com/embed/ztRyJjZjT2U' },
  { id: 8, title: 'Grindelwald, Switzerland', videoUrl: 'https://www.youtube.com/embed/mmbNqM2BS0Y' },
  { id: 9, title: 'Iruya, Argentina', videoUrl: 'https://www.youtube.com/embed/VZaoIrDDmi4' },
  { id: 10, title: 'Lost Lake, Oregon', videoUrl: 'https://www.youtube.com/embed/UsKO_U1A33Y' },
  { id: 11, title: 'Northern California', videoUrl: 'https://www.youtube.com/embed/GRzPwDJ9268' },
];

export default function Astrophotography() {
  const [currentView, setCurrentView] = useState<'dso' | 'timelapses' | 'normal'>('dso');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDSO, setSelectedDSO] = useState<DSOImage | null>(null);
  const [selectedDSOIndex, setSelectedDSOIndex] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<DSOType[]>([]);
  const [selectedConstellations, setSelectedConstellations] = useState<string[]>([]);
  const [selectedTelescopes, setSelectedTelescopes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedCatalogues, setSelectedCatalogues] = useState<CatalogueType[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('telescope-priority');
  const [imageLoadState, setImageLoadState] = useState<{ [key: string]: boolean }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDSO) {
        closeDSODetail();
      } else if (e.key === 'Escape' && selectedIndex !== null) {
        closeLightbox();
      } else if (selectedDSO && e.key === 'ArrowLeft') {
        navigateDSO('prev');
      } else if (selectedDSO && e.key === 'ArrowRight') {
        navigateDSO('next');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDSO, selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleImageLoad = (id: number) => {
    setImageLoadState(prev => ({ ...prev, [id]: true }));
  };

  const typeMap = useMemo(() => ({
    'galaxy': ['Galaxy'],
    'nebula': ['Emission Nebula', 'Reflection Nebula'],
    'star-cluster': ['Open Cluster', 'Globular Cluster'],
    'supernova': ['Supernova Remnant'],
    'other': ['Other'],
  }), []);

  const filteredDSO = useMemo(() => {
    let result = [...dsoImages];

    if (selectedTypes.length > 0) {
      result = result.filter(dso =>
        selectedTypes.some(selectedType => {
          const matchingTypes = typeMap[selectedType] || [];
          return matchingTypes.includes(dso.type);
        })
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(dso => {
        const typeLabel = typeOptions.find(t => t.value === dso.type)?.label || dso.type;
        return (
          dso.title.toLowerCase().includes(query) ||
          (dso.shortDescription && dso.shortDescription.toLowerCase().includes(query)) ||
          (dso.fullDescription && dso.fullDescription.toLowerCase().includes(query)) ||
          dso.constellation.toLowerCase().includes(query) ||
          typeLabel.toLowerCase().includes(query)
        );
      });
    }

    if (selectedConstellations.length > 0) {
      result = result.filter(dso => selectedConstellations.includes(dso.constellation));
    }
    if (selectedTelescopes.length > 0) {
      result = result.filter(dso => selectedTelescopes.includes(dso.telescope));
    }
    if (selectedCatalogues.length > 0) {
      result = result.filter(dso => dso.catalogues?.some(cat => selectedCatalogues.includes(cat.type)));
    }
    if (selectedYears.length > 0) {
      result = result.filter(dso => selectedYears.includes(dso.year));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc': return a.title.localeCompare(b.title);
        case 'title-desc': return b.title.localeCompare(a.title);
        case 'year-asc': return a.year - b.year;
        case 'year-desc': return b.year - a.year;
        case 'telescope-priority': {
          const priority: Record<string, number> = {};
          const telescopes = [...new Set(result.map(d => d.telescope))];
          telescopes.sort((a, b) => a.localeCompare(b));
          telescopes.forEach((t, i) => { priority[t] = i; });
          const pa = priority[a.telescope] ?? 99;
          const pb = priority[b.telescope] ?? 99;
          if (pa !== pb) return pa - pb;
          return b.year - a.year;
        }
        default: return 0;
      }
    });

    return result;
  }, [searchQuery, selectedTypes, selectedConstellations, selectedTelescopes, selectedYears, selectedCatalogues, sortBy, typeMap]);

  const openDSODetail = useCallback((dso: DSOImage) => {
    const index = filteredDSO.findIndex(d => d.id === dso.id);
    setSelectedDSOIndex(index >= 0 ? index : 0);
    setSelectedDSO(dso);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }, [filteredDSO]);

  const closeDSODetail = useCallback(() => {
    setSelectedDSO(null);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, []);

  const navigateDSO = useCallback((direction: 'next' | 'prev') => {
    if (filteredDSO.length === 0) return;
    setSelectedDSOIndex(prevIndex => {
      const newIndex = direction === 'next'
        ? (prevIndex + 1) % filteredDSO.length
        : (prevIndex - 1 + filteredDSO.length) % filteredDSO.length;
      setSelectedDSO(filteredDSO[newIndex]);
      return newIndex;
    });
  }, [filteredDSO]);

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  };

  const openLightboxByIndex = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (selectedIndex === null) return;
    if (direction === 'next') {
      setSelectedIndex((selectedIndex + 1) % astroPhotos.length);
    } else {
      setSelectedIndex((selectedIndex - 1 + astroPhotos.length) % astroPhotos.length);
    }
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedConstellations([]);
    setSelectedTelescopes([]);
    setSelectedYears([]);
    setSelectedCatalogues([]);
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedConstellations.length > 0 ||
    selectedTelescopes.length > 0 || selectedYears.length > 0 || selectedCatalogues.length > 0;

  const renderActiveFilterChips = () => {
    if (!hasActiveFilters) return null;
    return (
      <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-8">
        {selectedTypes.map(type => (
          <span key={`type-${type}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-100 border border-blue-700">
            {typeOptions.find(t => t.value === type)?.label || type.replace('-', ' ')}
            <button onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))} className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-800/50 hover:bg-blue-700/70">
              <FaTimes className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {selectedConstellations.map(c => (
          <span key={`const-${c}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-100 border border-purple-700">
            {c}
            <button onClick={() => setSelectedConstellations(selectedConstellations.filter(x => x !== c))} className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-purple-800/50 hover:bg-purple-700/70">
              <FaTimes className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {selectedTelescopes.map(t => (
          <span key={`tel-${t}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/50 text-green-100 border border-green-700">
            {t}
            <button onClick={() => setSelectedTelescopes(selectedTelescopes.filter(x => x !== t))} className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-800/50 hover:bg-green-700/70">
              <FaTimes className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {selectedYears.map(y => (
          <span key={`year-${y}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900/50 text-yellow-100 border border-yellow-700">
            {y}
            <button onClick={() => setSelectedYears(selectedYears.filter(x => x !== y))} className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-yellow-800/50 hover:bg-yellow-700/70">
              <FaTimes className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {selectedCatalogues.map(c => (
          <span key={`cat-${c}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-900/50 text-pink-100 border border-pink-700">
            {c.toUpperCase()}
            <button onClick={() => setSelectedCatalogues(selectedCatalogues.filter(x => x !== c))} className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-pink-800/50 hover:bg-pink-700/70">
              <FaTimes className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <button onClick={clearAllFilters} className="ml-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Clear all
        </button>
      </div>
    );
  };

  const renderDropdown = (
    label: string,
    id: string,
    children: React.ReactNode,
    widthClass = 'w-48'
  ) => (
    <div className={`relative dropdown-container ${openDropdown === id ? 'z-[9999]' : 'z-50'}`}>
      <button
        onClick={() => toggleDropdown(id)}
        className="flex items-center gap-2 px-5 py-3 bg-gray-700/90 hover:bg-gray-600/90 rounded-xl text-base font-medium text-white transition-all whitespace-nowrap shadow-md hover:shadow-lg"
      >
        {label}
        <FaChevronDown className={`text-xs transition-transform ${openDropdown === id ? 'transform rotate-180' : ''}`} />
      </button>
      {openDropdown === id && (
        <div className={`absolute mt-1 ${widthClass} bg-gray-800 rounded-lg shadow-2xl py-1 border border-gray-700 max-h-60 overflow-y-auto`}>
          {children}
        </div>
      )}
    </div>
  );

  const renderDSOView = () => (
    <div className="w-full px-4 py-6">
      {/* Search */}
      <div className="w-full max-w-2xl mx-auto px-4 mb-4">
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-lg group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 -z-10" />
            <div className="relative bg-gray-800/60 backdrop-blur-md border border-white/5 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:bg-gray-800/70">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full bg-transparent pl-8 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none text-lg"
                  placeholder="Search galaxies, nebulae, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  {searchQuery ? (
                    <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200" aria-label="Clear search">
                      <FaTimes className="h-5 w-5 text-gray-400 hover:text-white" />
                    </button>
                  ) : (
                    <FaSearch className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
            </div>
          </div>

          {/* Filters toggle */}
          <div className="flex justify-center w-full mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors shadow-lg"
            >
              <FaFilter />
              {showFilters ? 'Hide Filters' : 'Advanced Filters'}
              {showFilters ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
            </button>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="mt-3 p-5 bg-gray-800/80 backdrop-blur-md rounded-xl border border-white/10 relative z-50">
                  {renderActiveFilterChips()}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {renderDropdown('Type', 'type', typeOptions.map(({ value, label }) => (
                      <label key={value} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(value as DSOType)}
                          onChange={(e) => e.target.checked ? setSelectedTypes([...selectedTypes, value as DSOType]) : setSelectedTypes(selectedTypes.filter(t => t !== value))}
                          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-300">{label}</span>
                      </label>
                    )))}
                    {renderDropdown('Constellation', 'constellation', allConstellations.map(c => (
                      <label key={c} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedConstellations.includes(c)}
                          onChange={(e) => e.target.checked ? setSelectedConstellations([...selectedConstellations, c]) : setSelectedConstellations(selectedConstellations.filter(x => x !== c))}
                          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-300">{c}</span>
                      </label>
                    )))}
                    {renderDropdown('Telescope', 'telescope', allTelescopes.map(t => (
                      <label key={t} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTelescopes.includes(t)}
                          onChange={(e) => e.target.checked ? setSelectedTelescopes([...selectedTelescopes, t]) : setSelectedTelescopes(selectedTelescopes.filter(x => x !== t))}
                          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-300">{t}</span>
                      </label>
                    )))}
                    {renderDropdown('Year', 'year', allYears.map(y => (
                      <label key={y} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedYears.includes(y)}
                          onChange={(e) => e.target.checked ? setSelectedYears([...selectedYears, y]) : setSelectedYears(selectedYears.filter(x => x !== y))}
                          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-300">{y}</span>
                      </label>
                    )), 'w-32')}
                    {renderDropdown('Catalogue', 'catalogue', ['messier', 'ngc', 'ic', 'barnard', 'sharpless'].map(c => (
                      <label key={c} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCatalogues.includes(c as CatalogueType)}
                          onChange={(e) => e.target.checked ? setSelectedCatalogues([...selectedCatalogues, c as CatalogueType]) : setSelectedCatalogues(selectedCatalogues.filter(x => x !== c))}
                          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-300 capitalize">{c}</span>
                      </label>
                    )))}
                    {renderDropdown('Sort', 'sort', (
                      <>
                        {[
                          { val: 'telescope-priority' as SortOption, label: 'Telescope (Askar First)' },
                          { val: 'title-asc' as SortOption, label: 'Title (A-Z)' },
                          { val: 'title-desc' as SortOption, label: 'Title (Z-A)' },
                          { val: 'year-desc' as SortOption, label: 'Year (Newest First)' },
                          { val: 'year-asc' as SortOption, label: 'Year (Oldest First)' },
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => { setSortBy(opt.val); setOpenDropdown(null); }}
                            className={`w-full text-left px-4 py-2 text-sm ${sortBy === opt.val ? 'text-blue-400' : 'text-gray-300'} hover:bg-gray-700`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DSO Grid */}
      <div className="flex justify-center w-full mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full px-4 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredDSO.map((dso) => (
              <DSOCard key={dso.id} dso={dso} onSelect={openDSODetail} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {filteredDSO.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No results found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );

  const renderTimelapsesView = () => (
    <div className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <iframe
                src={`${timelapseVideos[currentVideoIndex].videoUrl}?autoplay=1&mute=1&enablejsapi=1`}
                title={timelapseVideos[currentVideoIndex].title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {timelapseVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentVideoIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
            <h3 className="text-white font-semibold">{timelapseVideos[currentVideoIndex].title}</h3>
          </div>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white mb-8 mt-12 text-center">Full Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {timelapseVideos.map((video, index) => (
          <div key={video.id} className="relative group cursor-pointer" onClick={() => setCurrentVideoIndex(index)}>
            <div className={`relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${index === currentVideoIndex ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-white/50'}`}>
              <iframe
                src={video.videoUrl}
                title={video.title}
                className="absolute inset-0 w-full h-full pointer-events-none"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="mt-3">
              <h3 className="text-base font-medium text-white text-center">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhotosView = () => (
    <div className="w-full py-12">
      <Masonry
        breakpointCols={{ default: 5, 1600: 4, 1200: 3, 800: 2, 500: 1 }}
        className="flex w-full"
        columnClassName="masonry-column"
      >
        {astroPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer overflow-hidden transition-all duration-300 mb-4 mx-1"
            onClick={() => openLightboxByIndex(index)}
          >
            <div className="relative w-full overflow-hidden rounded-lg">
              <div className={`relative aspect-[4/3] bg-gray-800 transition-opacity duration-300 ${imageLoadState[photo.id] ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={() => handleImageLoad(photo.id)}
                  priority={photo.id <= 10}
                />
                {!imageLoadState[photo.id] && (
                  <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="w-full">
                  <h3 className="text-white font-semibold text-lg mb-1">{photo.title}</h3>
                  <p className="text-gray-200 text-sm">{photo.location}</p>
                  <p className="text-gray-300 text-xs">{photo.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Masonry>
      <div className="mt-12 text-center px-4">
        <p className="text-gray-400 text-sm">
          {astroPhotos.length} photos • {new Set(astroPhotos.map(p => p.location)).size} locations
        </p>
      </div>
      <style jsx global>{`
        .masonry-column {
          padding-left: 8px;
          padding-right: 8px;
          background-clip: padding-box;
        }
        .masonry-column > div {
          margin-bottom: 16px;
          border-radius: 0.5rem;
          overflow: hidden;
          width: 100%;
        }
      `}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <style jsx global>{`
        html.modal-open header { display: none !important; }
        ::-webkit-scrollbar { display: none; }
        html { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* Lightbox for normal photos */}
      {selectedIndex !== null && (
        <ImageModal
          images={astroPhotos.map(p => ({ id: p.id, src: p.src, alt: p.alt }))}
          currentIndex={selectedIndex}
          onClose={closeLightbox}
          onNavigate={navigateImage}
        />
      )}

      {/* DSO Detail with FLIP transition */}
      <AnimatePresence mode="wait">
        {selectedDSO && (
          <DSODetail
            key={selectedDSO.id}
            dso={selectedDSO}
            onClose={closeDSODetail}
            onNavigate={navigateDSO}
          />
        )}
      </AnimatePresence>

      <ProjectHeader />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[500px] bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0">
          <Image
            src="/img/Astro/astro_pano.jpg"
            alt="Astrophotography Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-black/50 p-8 rounded-lg max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Astrophotography</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                Exploring the cosmos through long exposure photography and deep space imaging
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <section className="w-full bg-gray-900 py-4">
        <div className="w-full px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <GradientButton
              variant={currentView === 'normal' ? 'variant' : 'default'}
              className="w-full sm:w-auto min-w-[160px] text-sm md:text-base font-semibold px-5 py-2.5"
              onClick={() => setCurrentView('normal')}
            >
              Photos
            </GradientButton>
            <GradientButton
              variant={currentView === 'dso' ? 'variant' : 'default'}
              className="w-full sm:w-auto min-w-[160px] text-sm md:text-base font-semibold px-5 py-2.5"
              onClick={() => setCurrentView('dso')}
            >
              Deep Space Objects
            </GradientButton>
            <GradientButton
              variant={currentView === 'timelapses' ? 'variant' : 'default'}
              className="w-full sm:w-auto min-w-[160px] text-sm md:text-base font-semibold px-5 py-2.5"
              onClick={() => setCurrentView('timelapses')}
            >
              Timelapses
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="relative z-10">
        <div className={currentView === 'normal' ? 'w-full' : 'w-full px-4'}>
          {currentView === 'dso' && renderDSOView()}
          {currentView === 'timelapses' && renderTimelapsesView()}
          {currentView === 'normal' && renderPhotosView()}
        </div>
      </main>
    </div>
  );
}

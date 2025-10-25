'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Masonry from 'react-masonry-css';
import { FaSearch, FaTimes, FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Keep AnimatePresence if used elsewhere
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { dsoImages } from '@/data/dsoData';
import { astroPhotos } from '@/data/astroPhotos';
import { DSOImage, AstroPhoto, DSOType, CatalogueType } from '@/types/astro';
import { ZoomableImage } from '@/components/gallery/ZoomableImage';
import { GradientButton } from '@/components/ui/gradient-button';

// Type for the YouTube player event
interface YouTubePlayerEvent {
  data: number;
}

// Type for the YouTube player
type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  // Add other methods as needed
};

// Type for the YouTube Player constructor
type YouTubePlayerConstructor = {
  new (element: Element, config: { 
    events: { 
      onStateChange: (event: YouTubePlayerEvent) => void 
    } 
  }): YouTubePlayer;
};

// Extend Window interface to include YouTube types
declare global {
  interface Window {
    YT: {
      Player: YouTubePlayerConstructor;
      PlayerState: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

// Timelapse videos data - YouTube embed URLs
const timelapseVideos = [
  {
    id: 1,
    title: 'ARSA 1',
    videoUrl: 'https://www.youtube.com/embed/4VhxYci-OL4',
  },
  {
    id: 2,
    title: 'BHI 2',
    videoUrl: 'https://www.youtube.com/embed/d57AOn_xmKk',
  },
  {
    id: 3,
    title: 'BHI 3',
    videoUrl: 'https://www.youtube.com/embed/6PL4C1qxzLw',
  },
  {
    id: 4,
    title: 'Fraser Island (1)',
    videoUrl: 'https://www.youtube.com/embed/U64d3EKE1Ww',
  },
  {
    id: 5,
    title: 'BHI (1)',
    videoUrl: 'https://www.youtube.com/embed/U1l8mnQj_WA',
  },
  {
    id: 6,
    title: 'Fraser Island (2)',
    videoUrl: 'https://www.youtube.com/embed/xsapqb72kdY',
  },
  {
    id: 7,
    title: 'Fraser Island (3)',
    videoUrl: 'https://www.youtube.com/embed/ztRyJjZjT2U',
  },
  {
    id: 8,
    title: 'Grindelwald, Switzerland',
    videoUrl: 'https://www.youtube.com/embed/mmbNqM2BS0Y',
  },
  {
    id: 9,
    title: 'Iruya, Argentina',
    videoUrl: 'https://www.youtube.com/embed/VZaoIrDDmi4',
  },
  {
    id: 10,
    title: 'Lost Lake, Oregon',
    videoUrl: 'https://www.youtube.com/embed/UsKO_U1A33Y',
  },
  {
    id: 11,
    title: 'Northern California',
    videoUrl: 'https://www.youtube.com/embed/GRzPwDJ9268',
  }
];

type SortOption = 'title-asc' | 'title-desc' | 'year-asc' | 'year-desc';

// Type options with display names
const typeOptions: { value: DSOType; label: string }[] = [
  { value: 'galaxy', label: 'Galaxy' },
  { value: 'nebula', label: 'Nebula' },
  { value: 'star-cluster', label: 'Star Cluster' },
  { value: 'supernova', label: 'Supernova' },
  { value: 'other', label: 'Other' }
];

// Extract unique constellations and sort them
const allConstellations = Array.from(new Set(dsoImages.map(dso => dso.constellation))).sort();

// Extract unique telescopes and sort them
const allTelescopes = Array.from(new Set(dsoImages.map(dso => dso.telescope))).sort();

// Extract unique years and sort them in descending order
const allYears = Array.from(new Set(dsoImages.map(dso => dso.year))).sort((a, b) => b - a);

export default function AstrophotographyGallery() {
  const [currentView, setCurrentView] = useState<'dso' | 'timelapses' | 'normal'>('dso');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<DSOImage | AstroPhoto | null>(null);
  const [selectedDSO, setSelectedDSO] = useState<DSOImage | null>(null);
  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<DSOType[]>([]);
  const [selectedConstellations, setSelectedConstellations] = useState<string[]>([]);
  const [selectedTelescopes, setSelectedTelescopes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedCatalogues, setSelectedCatalogues] = useState<CatalogueType[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');
  const [imageLoadState, setImageLoadState] = useState<{ [key: string]: boolean }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dsoImageOrientation, setDsoImageOrientation] = useState<'horizontal' | 'vertical' | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Close lightbox with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Close lightbox when clicking outside the image
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  // Close lightbox function
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
    document.documentElement.classList.remove('modal-open');
  };

  // Open lightbox with the clicked image
  const openLightbox = (image: AstroPhoto | DSOImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('modal-open');
  };
  
  // YouTube IFrame API to handle video end
  useEffect(() => {
    if (currentView === 'timelapses') {
      // Load YouTube IFrame API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Setup player when API is ready
      window.onYouTubeIframeAPIReady = () => {
        const iframe = document.querySelector('iframe[src*="youtube"]');
        if (iframe) {
          new window.YT.Player(iframe, {
            events: {
              onStateChange: (event: YouTubePlayerEvent) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  setCurrentVideoIndex((prev) => (prev + 1) % timelapseVideos.length);
                }
              }
            }
          });
        }
      };

      // Cleanup function
      return () => {
        window.onYouTubeIframeAPIReady = () => {}; // Clear the callback
      };
    }
  }, [currentView, currentVideoIndex]);
  
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
    setImageLoadState(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Remove unused toggleDescription function

  // Filter and sort DSO images based on search query and filters
  // typeMap is now defined with useMemo for better performance
  const typeMap = useMemo(() => ({
    'galaxy': ['Galaxy'],
    'nebula': ['Emission Nebula', 'Reflection Nebula'],
    'star-cluster': ['Open Cluster', 'Globular Cluster'],
    'supernova': ['Supernova Remnant'],
    'other': ['Other']
  }), []);

  const filteredDSO = useMemo(() => {
    let result = [...dsoImages];
    
    // Apply type filter first
    if (selectedTypes.length > 0) {
      result = result.filter(dso => 
        selectedTypes.some(selectedType => {
          const matchingTypes = typeMap[selectedType] || [];
          return matchingTypes.includes(dso.type);
        })
      );
    }
    
    // Then apply search query filter
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
    // Apply type filter
    if (selectedTypes.length > 0) {
      result = result.filter(dso => {
        // Map the UI filter types to the actual data types
        const typeMap: Record<string, string[]> = {
          'galaxy': ['Galaxy'],
          'nebula': ['Emission Nebula', 'Reflection Nebula'],
          'star-cluster': ['Open Cluster', 'Globular Cluster'],
          'supernova': ['Supernova Remnant'],
          'other': ['Other']
        };

        return selectedTypes.some(selectedType => {
          const matchingTypes = typeMap[selectedType] || [];
          return matchingTypes.includes(dso.type);
        });
      });
    }
    
    // Apply constellation filter
    if (selectedConstellations.length > 0) {
      result = result.filter(dso => selectedConstellations.includes(dso.constellation));
    }
    
    // Apply telescope filter
    if (selectedTelescopes.length > 0) {
      result = result.filter(dso => selectedTelescopes.includes(dso.telescope));
    }
    
    // Apply catalogue filter
    if (selectedCatalogues.length > 0) {
      result = result.filter(dso => 
        dso.catalogues?.some(cat => selectedCatalogues.includes(cat.type))
      );
    }
    
    // Apply year filter
    if (selectedYears.length > 0) {
      result = result.filter(dso => selectedYears.includes(dso.year));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'year-asc':
          return a.year - b.year;
        case 'year-desc':
          return b.year - a.year;
        default:
          return 0;
      }
    });
    
    return result;
  }, [searchQuery, selectedTypes, selectedConstellations, selectedTelescopes, selectedYears, selectedCatalogues, sortBy, typeMap]);

  const openDSODetail = (dso: DSOImage) => {
    setSelectedDSO(dso);
    setDsoImageOrientation(null); // Reset orientation
    document.body.style.overflow = 'hidden';
  };

  const closeDSODetail = () => {
    setSelectedDSO(null);
    setDsoImageOrientation(null);
    document.body.style.overflow = 'unset';
  };

  // Handle DSO image load to detect orientation
  const handleDSOImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const orientation = img.naturalWidth > img.naturalHeight ? 'horizontal' : 'vertical';
    setDsoImageOrientation(orientation);
  };

  // Lightbox functions are now defined at the component level

  // Render the appropriate content based on the current view
  const renderContent = () => {
    switch (currentView) {
      case 'dso':
        return (
          <div className="w-full px-4 py-16">
            {/* Enhanced Search Bar */}
            <div className="w-full max-w-[1800px] mx-auto px-4 mb-16">
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery('');
                            }}
                            className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                            aria-label="Clear search"
                          >
                            <FaTimes className="h-5 w-5 text-gray-400 hover:text-white" />
                          </button>
                        ) : (
                          <FaSearch className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
                  </div>
                  <div className="mt-2 text-sm text-gray-400 transition-opacity duration-200 opacity-0 group-focus-within:opacity-100">
                    {searchQuery && <span>{filteredDSO.length} results found</span>}
                  </div>
                </div>
              </div>
              
              {/* Advanced Filters Button */}
              <div className="flex justify-center w-full py-4 !my-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors shadow-lg"
                >
                  <FaFilter />
                  {showFilters ? 'Hide Filters' : 'Advanced Filters'}
                  {showFilters ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                </button>
              </div>
              
              {/* Advanced Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="mt-6 p-8 bg-gray-800/80 backdrop-blur-md rounded-xl border border-white/10 relative z-50">
                      {/* Active Filters */}
                      <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-8">
                        {selectedTypes.map(type => (
                          <span key={`type-${type}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-100 border border-blue-700">
                            {typeOptions.find(t => t.value === type)?.label || type.replace('-', ' ')}
                            <button 
                              onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-800/50 hover:bg-blue-700/70"
                            >
                              <span className="sr-only">Remove {type} filter</span>
                              <FaTimes className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                        {selectedConstellations.map(constellation => (
                          <span key={`constellation-${constellation}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-100 border border-purple-700">
                            {constellation}
                            <button 
                              onClick={() => setSelectedConstellations(selectedConstellations.filter(c => c !== constellation))}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-purple-800/50 hover:bg-purple-700/70"
                            >
                              <span className="sr-only">Remove {constellation} filter</span>
                              <FaTimes className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                        {selectedTelescopes.map(telescope => (
                          <span key={`telescope-${telescope}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/50 text-green-100 border border-green-700">
                            {telescope}
                            <button 
                              onClick={() => setSelectedTelescopes(selectedTelescopes.filter(t => t !== telescope))}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-800/50 hover:bg-green-700/70"
                            >
                              <span className="sr-only">Remove {telescope} filter</span>
                              <FaTimes className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                        {selectedYears.map(year => (
                          <span key={`year-${year}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900/50 text-yellow-100 border border-yellow-700">
                            {year}
                            <button 
                              onClick={() => setSelectedYears(selectedYears.filter(y => y !== year))}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-yellow-800/50 hover:bg-yellow-700/70"
                            >
                              <span className="sr-only">Remove year {year} filter</span>
                              <FaTimes className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                        {selectedCatalogues.map(catalogue => (
                          <span key={`catalogue-${catalogue}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-900/50 text-pink-100 border border-pink-700">
                            {catalogue.toUpperCase()}
                            <button 
                              onClick={() => setSelectedCatalogues(selectedCatalogues.filter(c => c !== catalogue))}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-pink-800/50 hover:bg-pink-700/70"
                            >
                              <span className="sr-only">Remove {catalogue} filter</span>
                              <FaTimes className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                        {(selectedTypes.length > 0 || selectedConstellations.length > 0 || selectedTelescopes.length > 0 || selectedYears.length > 0 || selectedCatalogues.length > 0) && (
                          <button 
                            onClick={() => {
                              setSelectedTypes([]);
                              setSelectedConstellations([]);
                              setSelectedTelescopes([]);
                              setSelectedYears([]);
                              setSelectedCatalogues([]);
                            }}
                            className="ml-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-5">
                        {/* Type Filter Dropdown */}
                        <div className="relative z-50 dropdown-container">
                          <button 
                            onClick={() => toggleDropdown('type')}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-700/90 hover:bg-gray-600/90 rounded-xl text-base font-medium text-white transition-all whitespace-nowrap shadow-md hover:shadow-lg"
                          >
                            Type
                            <FaChevronDown className={`text-xs transition-transform ${openDropdown === 'type' ? 'transform rotate-180' : ''}`} />
                          </button>
                          {openDropdown === 'type' && (
                            <div className="absolute z-[9999] mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700">
                              {typeOptions.map(({ value, label }) => {
                                const dsoValue = value as DSOType;
                                return (
                                  <label key={value} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={selectedTypes.includes(dsoValue)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedTypes([...selectedTypes, dsoValue]);
                                        } else {
                                          setSelectedTypes(selectedTypes.filter(t => t !== dsoValue));
                                        }
                                      }}
                                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-300">{label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Constellation Dropdown */}
                        <div className="relative z-50 dropdown-container">
                          <button 
                            onClick={() => toggleDropdown('constellation')}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-700/90 hover:bg-gray-600/90 rounded-xl text-base font-medium text-white transition-all whitespace-nowrap shadow-md hover:shadow-lg"
                          >
                            Constellation
                            <FaChevronDown className={`text-xs transition-transform ${openDropdown === 'constellation' ? 'transform rotate-180' : ''}`} />
                          </button>
                          {openDropdown === 'constellation' && (
                            <div className="absolute z-[9999] mt-1 w-48 max-h-60 overflow-y-auto bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700">
                              {allConstellations.map((constellation) => (
                                <label key={constellation} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedConstellations.includes(constellation)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedConstellations([...selectedConstellations, constellation]);
                                      } else {
                                        setSelectedConstellations(selectedConstellations.filter(c => c !== constellation));
                                      }
                                    }}
                                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-300">{constellation}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Telescope Dropdown */}
                        <div className="relative z-50 dropdown-container">
                          <button 
                            onClick={() => toggleDropdown('telescope')}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-700/90 hover:bg-gray-600/90 rounded-xl text-base font-medium text-white transition-all whitespace-nowrap shadow-md hover:shadow-lg"
                          >
                            Telescope
                            <FaChevronDown className={`text-xs transition-transform ${openDropdown === 'telescope' ? 'transform rotate-180' : ''}`} />
                          </button>
                          {openDropdown === 'telescope' && (
                            <div className="absolute z-[9999] mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700">
                              {allTelescopes.map((telescope) => (
                                <label key={telescope} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedTelescopes.includes(telescope)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedTelescopes([...selectedTelescopes, telescope]);
                                      } else {
                                        setSelectedTelescopes(selectedTelescopes.filter(t => t !== telescope));
                                      }
                                    }}
                                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-300">{telescope}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Year Dropdown */}
                        <div className="relative z-50 dropdown-container">
                          <button 
                            onClick={() => toggleDropdown('year')}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-700/90 hover:bg-gray-600/90 rounded-xl text-base font-medium text-white transition-all whitespace-nowrap shadow-md hover:shadow-lg"
                          >
                            Year
                            <FaChevronDown className={`text-xs transition-transform ${openDropdown === 'year' ? 'transform rotate-180' : ''}`} />
                          </button>
                          {openDropdown === 'year' && (
                            <div className="absolute z-[9999] mt-1 w-32 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700">
                              {allYears.map((year) => (
                                <label key={year} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedYears.includes(year)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedYears([...selectedYears, year]);
                                      } else {
                                        setSelectedYears(selectedYears.filter(y => y !== year));
                                      }
                                    }}
                                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-300">{year}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Catalogue Dropdown */}
                        <div className="relative z-50 dropdown-container">
                          <button 
                            onClick={() => toggleDropdown('catalogue')}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-700/90 hover:bg-gray-600/90 rounded-xl text-base font-medium text-white transition-all whitespace-nowrap shadow-md hover:shadow-lg"
                          >
                            Catalogue
                            <FaChevronDown className={`text-xs transition-transform ${openDropdown === 'catalogue' ? 'transform rotate-180' : ''}`} />
                          </button>
                          {openDropdown === 'catalogue' && (
                            <div className="absolute z-[9999] mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700">
                              {['messier', 'ngc', 'ic', 'barnard', 'sharpless'].map((catalogue) => (
                                <label key={catalogue} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedCatalogues.includes(catalogue as CatalogueType)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCatalogues([...selectedCatalogues, catalogue as CatalogueType]);
                                      } else {
                                        setSelectedCatalogues(selectedCatalogues.filter(c => c !== catalogue));
                                      }
                                    }}
                                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-300 capitalize">{catalogue}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative z-50 dropdown-container">
                          <button 
                            onClick={() => toggleDropdown('sort')}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-700/90 hover:bg-gray-600/90 rounded-xl text-base font-medium text-white transition-all whitespace-nowrap shadow-md hover:shadow-lg"
                          >
                            Sort
                            <FaChevronDown className={`text-xs transition-transform ${openDropdown === 'sort' ? 'transform rotate-180' : ''}`} />
                          </button>
                          {openDropdown === 'sort' && (
                            <div className="absolute z-[9999] mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700 right-0">
                              <button
                                onClick={() => {
                                  setSortBy('title-asc');
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'title-asc' ? 'text-blue-400' : 'text-gray-300'} hover:bg-gray-700`}
                              >
                                Title (A-Z)
                              </button>
                              <button
                                onClick={() => {
                                  setSortBy('title-desc');
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'title-desc' ? 'text-blue-400' : 'text-gray-300'} hover:bg-gray-700`}
                              >
                                Title (Z-A)
                              </button>
                              <button
                                onClick={() => {
                                  setSortBy('year-desc');
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'year-desc' ? 'text-blue-400' : 'text-gray-300'} hover:bg-gray-700`}
                              >
                                Year (Newest First)
                              </button>
                              <button
                                onClick={() => {
                                  setSortBy('year-asc');
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'year-asc' ? 'text-blue-400' : 'text-gray-300'} hover:bg-gray-700`}
                              >
                                Year (Oldest First)
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DSO Grid */}
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl px-4 relative z-10">
              {filteredDSO.map((dso) => (
                <div 
                  key={dso.id}
                  className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => openDSODetail(dso)}
                >
                  <div className="relative h-64 bg-gray-900">
                    <Image
                      src={dso.imageUrl}
                      alt={dso.title}
                      fill
                      className="object-cover opacity-90"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{dso.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {dso.shortDescription}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        );
      
      case 'timelapses':
        return (
          <div className="w-full py-8">
            {/* Featured Video Carousel */}
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
                
                {/* Carousel Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {timelapseVideos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentVideoIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to video ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Video Title Overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <h3 className="text-white font-semibold">{timelapseVideos[currentVideoIndex].title}</h3>
                </div>
              </div>
            </div>
            
            {/* Full Gallery Title */}
            <h2 className="text-3xl font-bold text-white mb-8 mt-12 text-center">Full Gallery</h2>
            
            {/* All Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
              {timelapseVideos.map((video, index) => (
                <div 
                  key={video.id} 
                  className="relative group cursor-pointer"
                  onClick={() => setCurrentVideoIndex(index)}
                >
                  <div className={`relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                    index === currentVideoIndex ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-white/50'
                  }`}>
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
      
      case 'normal':
      default:
        return (
          <div className="w-full py-12">
            <div className="w-full">
              <Masonry
                breakpointCols={{
                  default: 5,
                  1600: 4,
                  1200: 3,
                  800: 2,
                  500: 1
                }}
                className="flex w-full"
                columnClassName="masonry-column"
              >
                {astroPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group cursor-pointer overflow-hidden transition-all duration-300 mb-4 mx-1"
                    onClick={() => openLightbox(photo)}
                  >
                    <div className="relative w-full overflow-hidden rounded-lg">
                      <div 
                        className={`relative aspect-[4/3] bg-gray-800 transition-opacity duration-300 ${
                          imageLoadState[photo.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onLoad={() => handleImageLoad(photo.id)}
                          priority={photo.id <= 10} // Only preload first 10 images
                        />
                        {!imageLoadState[photo.id] && (
                          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <style jsx global>{`
        /* Hide navbar when modal is open */
        html.modal-open header {
          display: none !important;
        }
      `}</style>
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
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
              src={'src' in selectedImage ? selectedImage.src : selectedImage.imageUrl}
              alt={'alt' in selectedImage ? selectedImage.alt : selectedImage.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
      {/* Project Header */}
      <ProjectHeader />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0">
          <Image
            src="/img/Astro/astro_pano.jpg"
            alt="Astrophotography Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
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

      {/* Navigation Tabs */}
      <section className="w-full bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <GradientButton
              variant={currentView === 'normal' ? 'variant' : 'default'}
              className="w-full sm:w-auto min-w-[180px] text-md md:text-lg font-semibold px-6 py-3 mx-auto"
              onClick={() => setCurrentView('normal')}
            >
              Photos
            </GradientButton>
            <GradientButton
              variant={currentView === 'dso' ? 'variant' : 'default'}
              className="w-full sm:w-auto min-w-[180px] text-md md:text-lg font-semibold px-6 py-3 mx-auto"
              onClick={() => setCurrentView('dso')}
            >
              Deep Space Objects
            </GradientButton>
            <GradientButton
              variant={currentView === 'timelapses' ? 'variant' : 'default'}
              className="w-full sm:w-auto min-w-[180px] text-md md:text-lg font-semibold px-6 py-3 mx-auto"
              onClick={() => setCurrentView('timelapses')}
            >
              Timelapses
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Main Content */}

      <main className="relative z-10">
        <div className={currentView === 'normal' ? 'w-full' : 'container mx-auto px-4'}>
          {renderContent()}
        </div>
      </main>

      {/* DSO Detail Modal */}
      {selectedDSO && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm ${
            dsoImageOrientation === 'horizontal' ? 'p-12' : 'p-2'
          }`}
          onClick={closeDSODetail}
        >
          <div 
            className={`relative bg-gray-900/95 border border-gray-700 rounded-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden shadow-2xl ${
              dsoImageOrientation === 'horizontal' ? 'm-8' : ''
            }`}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeDSODetail}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/90 hover:bg-gray-700/90 transition-colors z-10"
              aria-label="Close"
            >
              <FaTimes className="h-6 w-6 text-white" />
            </button>
            
            <div className={`${
              dsoImageOrientation === 'horizontal' 
                ? 'flex flex-col flex-1' 
                : 'grid md:grid-cols-2'
            } gap-8 p-8 h-full overflow-y-auto`}>
              {/* Image Section */}
              <div className={`flex items-center justify-center ${
                dsoImageOrientation === 'horizontal' ? 'w-full min-h-[50vh]' : 'h-full'
              }`}>
                <div className={`relative w-full ${
                  dsoImageOrientation === 'horizontal' ? 'h-[50vh]' : 'h-full max-h-[75vh]'
                }`}>
                  <Image
                    src={selectedDSO.imageUrl}
                    alt={selectedDSO.title}
                    fill
                    className="object-contain"
                    style={{ 
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                    onLoad={handleDSOImageLoad}
                    priority
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
              </div>
              
              {/* Description Section */}
              <div className={`${dsoImageOrientation === 'vertical' ? 'flex flex-col justify-center' : 'pt-4 px-12'}`}>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedDSO.title}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full">
                    {selectedDSO.type}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{selectedDSO.date}</span>
                </div>
                
                <p className="text-gray-300 mb-4">{selectedDSO.fullDescription}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-32 text-gray-400">Telescope</span>
                    <span className="text-white">{selectedDSO.telescope}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-400">Exposure</span>
                    <span className="text-white">{selectedDSO.exposure}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-400">Location</span>
                    <span className="text-white">{selectedDSO.location}</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Processing Details</h3>
                  <p className="text-gray-400 text-sm">
                    This image was processed using PixInsight and Photoshop, with careful attention to color balance and noise reduction to bring out the faint details of this deep space object.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Styles for the Masonry grid */}
      <style jsx>{`
        .my-masonry-grid {
          display: flex;
          margin-left: -16px;
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 16px;
          background-clip: padding-box;
        }
      `}</style>
    </div>
  )
}

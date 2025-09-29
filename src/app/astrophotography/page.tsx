'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { FiSearch, FiX, FiPlay } from 'react-icons/fi';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { GradientButton } from '@/components/ui/gradient-button';
import Masonry from 'react-masonry-css';

type GalleryView = 'photos' | 'timelapses' | 'dso';

interface DSOImage {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'galaxy' | 'nebula' | 'star-cluster' | 'supernova' | 'other';
  imageUrl: string;
  telescope: string;
  exposure: string;
  location: string;
}

// Sample DSO data - replace with your actual data
const dsoImages: DSOImage[] = [
  {
    id: 'andromeda',
    title: 'Andromeda Galaxy (M31)',
    date: '2023-10-15',
    description: 'The Andromeda Galaxy, our nearest spiral galaxy neighbor, captured with a 200mm lens.',
    type: 'galaxy',
    imageUrl: '/img/astro/dso/andromeda.jpg',
    telescope: 'Canon EOS Ra',
    exposure: '30x120s',
    location: 'Dark Sky Site, CA'
  },
  {
    id: 'orion',
    title: 'Orion Nebula (M42)',
    date: '2023-12-20',
    description: 'The Great Orion Nebula, a stellar nursery where new stars are being born.',
    type: 'nebula',
    imageUrl: '/img/astro/dso/orion.jpg',
    telescope: 'William Optics RedCat 51',
    exposure: '40x60s',
    location: 'Joshua Tree, CA'
  },
  // Add more DSO objects as needed
];

// Sample timelapse data
const timelapseVideos = [
  { id: 1, title: 'Milky Way Over Mountains', date: '2023-07-15', duration: '0:45', thumbnail: '/img/astro/timelapses/milky-way.jpg' },
  { id: 2, title: 'Aurora Borealis', date: '2023-09-22', duration: '1:20', thumbnail: '/img/astro/timelapses/aurora.jpg' },
  // Add more timelapses as needed
];

// Sample astro photos
const astroPhotos = [
  { id: 1, title: 'Milky Way Arch', date: '2023-08-10', location: 'Yosemite, CA', imageUrl: '/img/astro/photos/milky-way-arch.jpg' },
  { id: 2, title: 'Lunar Eclipse', date: '2023-11-08', location: 'Los Angeles, CA', imageUrl: '/img/astro/photos/lunar-eclipse.jpg' },
  // Add more photos as needed
];

export default function AstrophotographyGallery() {
  const [currentView, setCurrentView] = useState<GalleryView>('dso');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDSO, setSelectedDSO] = useState<DSOImage | null>(null);

  // Filter DSO images based on search query
  const filteredDSO = useMemo(() => {
    if (!searchQuery.trim()) return dsoImages;
    const query = searchQuery.toLowerCase();
    return dsoImages.filter(dso => 
      dso.title.toLowerCase().includes(query) || 
      dso.description.toLowerCase().includes(query) ||
      dso.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const openDSODetail = (dso: DSOImage) => {
    setSelectedDSO(dso);
    document.body.style.overflow = 'hidden';
  };

  const closeDSODetail = () => {
    setSelectedDSO(null);
    document.body.style.overflow = 'unset';
  };

  // Render the appropriate content based on the current view
  const renderContent = () => {
    switch (currentView) {
      case 'dso':
        return (
          <div className="w-full px-4 py-8">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12 relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search deep space objects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="h-5 w-5 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* DSO Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDSO.map((dso) => (
                <div 
                  key={dso.id}
                  className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
                  onClick={() => openDSODetail(dso)}
                >
                  <div className="relative h-64 bg-gray-900">
                    <Image
                      src={dso.imageUrl}
                      alt={dso.title}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 p-6 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-xl font-bold text-white mb-1">{dso.title}</h3>
                      <p className="text-sm text-gray-300">{dso.date}</p>
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 rounded-full text-xs font-medium text-white">
                      {dso.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{dso.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{dso.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{dso.telescope}</span>
                      <span>{dso.exposure}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'timelapses':
        return (
          <div className="w-full px-4 py-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Astro Timelapses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {timelapseVideos.map((video) => (
                <div key={video.id} className="relative group">
                  <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <FiPlay className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                    <p className="text-sm text-gray-400">{video.date} • {video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'photos':
      default:
        return (
          <div className="w-full px-4 py-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Astro Photos</h2>
            <div className="px-4">
              <Masonry
                breakpointCols={{
                  default: 3,
                  1024: 2,
                  640: 1
                }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {astroPhotos.map((photo) => (
                  <div key={photo.id} className="group mb-8">
                    <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ display: 'block' }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <p className="text-white text-sm md:text-base font-semibold px-4 py-3 w-full text-center">
                          {photo.title}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">{photo.date} • {photo.location}</p>
                    </div>
                  </div>
                ))}
              </Masonry>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Project Header */}
      <ProjectHeader />

      {/* Hero Section */}
      <div className="relative w-full h-screen max-h-[90vh] min-h-[600px]">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/img/Astro/astro_pano.jpg"
            alt="Night Sky Panorama"
            fill
            className="object-cover w-full h-full"
            priority
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              width: '100%',
              height: '100%',
              margin: 0,
              padding: 0
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Astrophotography</h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 mb-8 max-w-3xl mx-auto">
              Exploring the cosmos through long exposure photography and deep space imaging.
              Capturing the beauty of distant galaxies, nebulae, and celestial events that are invisible to the naked eye.
            </p>
            
            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <GradientButton
                variant={currentView === 'photos' ? 'variant' : 'default'}
                className="px-6 py-3 text-sm md:text-base font-medium"
                onClick={() => setCurrentView('photos')}
              >
                Photos
              </GradientButton>
              <GradientButton
                variant={currentView === 'timelapses' ? 'variant' : 'default'}
                className="px-6 py-3 text-sm md:text-base font-medium"
                onClick={() => setCurrentView('timelapses')}
              >
                Timelapses
              </GradientButton>
              <GradientButton
                variant={currentView === 'dso' ? 'variant' : 'default'}
                className="px-6 py-3 text-sm md:text-base font-medium"
                onClick={() => setCurrentView('dso')}
              >
                Deep Space Objects
              </GradientButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 -mt-20">
        {renderContent()}
      </main>

      {/* DSO Detail Modal */}
      {selectedDSO && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={closeDSODetail}
        >
          <div 
            className="relative bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeDSODetail}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors z-10"
              aria-label="Close"
            >
              <FiX className="h-6 w-6 text-white" />
            </button>
            
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="relative h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={selectedDSO.imageUrl}
                  alt={selectedDSO.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedDSO.title}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full">
                    {selectedDSO.type}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{selectedDSO.date}</span>
                </div>
                
                <p className="text-gray-300 mb-6">{selectedDSO.description}</p>
                
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

'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';

// Import movie data
import movieData from '@/data/movieData.json' assert { type: 'json' };

// Type for the movie data structure
type MovieData = {
  metadata: {
    totalMovies: number;
    totalHours: number;
    lastUpdated: string;
    newMovies?: number;
    updatedMovies?: number;
  };
  movies: Movie[];
};

// This will be replaced with a proper API call in the future
const getMovies = async (): Promise<MovieData> => {
  const data = movieData as MovieData;
  
  // Create a map to ensure unique movies by title and year
  const uniqueMovies = new Map<string, Movie>();
  
  // Process each movie to ensure unique keys and fix Dune posters
  data.movies.forEach((movie, index) => {
    if (movie.myRating <= 0) {
      return; // Skip unrated movies
    }
    
    // Normalize title for better matching
    const normalizedTitle = movie.title.toLowerCase().trim();
    const year = movie.year || '';
    
    // Special handling for specific movies with problematic posters
    if (normalizedTitle.includes('dune')) {
      // Dune: Part Two (2024) - Using provided Amazon image
      if (normalizedTitle.includes('part two') || year === '2024' || movie.title === 'Dune: Part Two') {
        movie.posterUrl = 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_SX300.jpg';
        movie.year = '2024';
      } 
      // Dune (2021) - Using Amazon image
      else if (year === '2021' || normalizedTitle === 'dune' || (normalizedTitle.includes('dune') && !normalizedTitle.includes('part two'))) {
        movie.posterUrl = 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg';
        movie.year = movie.year || '2021';
      }
      // Original Dune (1984) - Using Amazon image
      else if (year === '1984' || (normalizedTitle === 'dune' && !year)) {
        movie.posterUrl = 'https://m.media-amazon.com/images/M/MV5BMDE2NjI0ZTktZGNhZi00Y2UxLWE5YzMtZDFjMTRkYTcyNjU5XkEyXkFqcGc@._V1_SX300.jpg';
        movie.year = '1984';
      }
    }
    // Guy Ritchie's The Covenant (2023)
    else if (normalizedTitle.includes('covenant') || movie.title.includes('Guy Ritchie')) {
      movie.posterUrl = 'https://m.media-amazon.com/images/M/MV5BZTg4YTVmZjUtMzBmYi00YjYwLThkM2QtYjUyYzQ2YjE2ZTAzXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_SX300.jpg';
      movie.year = '2023';
    }
    // SWAT: Firefight (2011)
    else if (normalizedTitle.includes('swat') && normalizedTitle.includes('firefight')) {
      movie.posterUrl = 'https://m.media-amazon.com/images/M/MV5BMTM0NDIxMzE0Ml5BMl5BanBnXkFtZTcwMDY2MzY0NA@@._V1_SX300.jpg';
      movie.year = '2011';
    }
    // The Divergent Series: Insurgent (2015)
    else if ((normalizedTitle.includes('divergent') && normalizedTitle.includes('insurgent')) || 
             movie.title === 'The Divergent Series: Insurgent') {
      movie.posterUrl = 'https://m.media-amazon.com/images/M/MV5BMTgxMDAzNzMyN15BMl5BanBnXkFtZTgwNzE4MDQ3MzE@._V1_SX300.jpg';
      movie.year = '2015';
    }
    // Divergent (2014) - Using provided Amazon image
    else if (normalizedTitle === 'divergent' || (normalizedTitle.includes('divergent') && !normalizedTitle.includes('insurgent'))) {
      movie.posterUrl = 'https://m.media-amazon.com/images/M/MV5BMTYxMzYwODE4OV5BMl5BanBnXkFtZTgwNDE5MzE2MDE@._V1_SX300.jpg';
      movie.year = '2014';
    }
    
    // Ensure we have a poster URL
    if (!movie.posterUrl || movie.posterUrl.includes('placeholder')) {
      movie.posterUrl = '/img/projects/movies/placeholder-movie.svg';
    }
    
    // Create a unique key using title and year
    const key = `${normalizedTitle}_${year}`;
    
    // Only keep the first occurrence of each movie
    if (!uniqueMovies.has(key)) {
      // Ensure we have a unique ID
      movie.id = `movie_${index}_${Date.now()}`;
      uniqueMovies.set(key, movie);
    }
  });
  
  // Convert back to array and sort by rating (highest first)
  const sortedMovies = Array.from(uniqueMovies.values()).sort((a, b) => b.myRating - a.myRating);
  
  return {
    ...data,
    movies: sortedMovies
  };
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  // State to control mobile overlay visibility
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);

  // Format the rating to 1 decimal place
  const formatRating = (rating: number | undefined) => {
    if (rating === undefined || rating === 0) return 'N/A';
    return rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
  };

  // Calculate if any of the additional scores are present
  const hasAdditionalScores = [
    movie.protagonistRating,
    movie.antagonistRating,
    movie.soundtrackRating,
    movie.setDesignRating,
    movie.plotRating,
    movie.endingRating
  ].some(score => score && score > 0);

  // Toggle mobile overlay
  const toggleMobileOverlay = (e: React.MouseEvent) => {
    // Only toggle on mobile (touch devices)
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      e.preventDefault();
      setShowMobileOverlay(!showMobileOverlay);
    }
  };

  // Function to render a score bar
  const renderScoreBar = (label: string, score: number | undefined) => {
    if (!score || score === 0) return null;
    
    return (
      <div className="mb-1">
        <div className="flex justify-between text-xs mb-0.5">
          <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{score.toFixed(1)}</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-500" 
            style={{ width: `${(score / 10) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col h-full group relative">
      {/* Image container with filled image and overlay */}
      <div 
        className="relative aspect-[2/3] w-full overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-pointer md:cursor-default"
        onClick={toggleMobileOverlay}
      >
        {movie.posterUrl && !movie.posterUrl.includes('placeholder') ? (
          <Image
            src={movie.posterUrl}
            alt={`${movie.title} (${movie.year || 'N/A'})`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 30vw, 22vw"
            priority={false}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/img/projects/movies/placeholder-movie.svg';
              target.onerror = null; // Prevent infinite loop
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <span className="text-gray-400 dark:text-gray-500 text-sm">No poster available</span>
          </div>
        )}
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded-md shadow-md">
          {formatRating(movie.myRating)}/10
        </div>

        {/* Score breakdown overlay - Desktop (hover) and Mobile (click) */}
        {hasAdditionalScores && (
          <div className={`
            absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent 
            transition-all duration-300 flex flex-col justify-end p-4
            ${showMobileOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            md:opacity-0 md:group-hover:opacity-100
          `}>
            <div className={`
              transform transition-transform duration-300
              ${showMobileOverlay ? 'translate-y-0' : 'translate-y-8 group-hover:translate-y-0'}
              md:translate-y-8 md:group-hover:translate-y-0
            `}>
              <h4 className="text-sm font-semibold text-white mb-2">SCORE BREAKDOWN</h4>
              <div className="space-y-2.5">
                {renderScoreBar('Protagonist', movie.protagonistRating)}
                {renderScoreBar('Antagonist', movie.antagonistRating)}
                {renderScoreBar('Soundtrack', movie.soundtrackRating)}
                {renderScoreBar('Set Design', movie.setDesignRating)}
                {renderScoreBar('Plot', movie.plotRating)}
                {renderScoreBar('Ending', movie.endingRating)}
              </div>
              {/* Close button for mobile */}
              <button 
                className="md:hidden absolute top-2 right-2 text-white/80 hover:text-white text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileOverlay(false);
                }}
                aria-label="Close scores"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Movie info - compact layout */}
      <div className="p-2.5 flex-1 flex flex-col">
        {/* Title and rating at the top */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {movie.title}
          </h3>
          <div className="bg-yellow-400 text-gray-900 font-extrabold px-2 py-1 rounded-md text-sm sm:text-base whitespace-nowrap flex-shrink-0 shadow-md transform transition-transform hover:scale-105">
            {movie.myRating.toFixed(1)}
            <span className="text-xs opacity-80 ml-0.5">/10</span>
          </div>
        </div>
        
        {/* Year below title */}
        {movie.releaseDate && (
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {new Date(movie.releaseDate).getFullYear()}
          </div>
        )}
        
        {/* Spacer to push ratings to bottom */}
        <div className="flex-1"></div>
        
        {/* Ratings at the bottom */}
        <div className="mt-2 flex justify-between items-center text-xs">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            <span className="text-orange-500 font-semibold">IMDb</span>
            <span className="ml-1 text-gray-700 dark:text-gray-300">
              {movie.imdbScore?.toFixed(1) || 'N/A'}
            </span>
          </div>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            <span className="text-red-500 font-semibold">RT</span>
            <span className="ml-1 text-gray-700 dark:text-gray-300">
              {movie.rottenTomatoesScore ? `${Math.round(movie.rottenTomatoesScore * 100)}%` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Film strip styles - defined outside component to avoid recreation
const filmStripStyles = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-220px * 10)) }
  }
  
  .film-strip {
    display: flex;
    width: calc(220px * 20);
    animation: scroll 80s linear infinite;
    will-change: transform;
  }
  
  .film-strip:hover {
    animation-play-state: paused;
  }
  
  .film-strip img {
    width: 200px;
    height: 300px;
    object-fit: cover;
    margin: 0 10px;
    border-radius: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    filter: grayscale(30%) brightness(0.7);
  }
  
  .film-strip img:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7);
    filter: grayscale(0%) brightness(1);
    z-index: 10;
  }

  .film-strip-container::before,
  .film-strip-container::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 2;
    background: linear-gradient(
      to right, 
      rgba(0, 0, 0, 0.8) 0%, 
      transparent 100%
    );
  }

  .film-strip-container::after {
    right: 0;
    left: auto;
    background: linear-gradient(
      to left, 
      rgba(0, 0, 0, 0.8) 0%, 
      transparent 100%
    );
  }

  @keyframes grain {
    0%, 100% { transform: translate(0, 0) }
    10% { transform: translate(-5%, -10%) }
    20% { transform: translate(-15%, 5%) }
    30% { transform: translate(7%, -25%) }
    40% { transform: translate(-5%, 25%) }
    50% { transform: translate(-15%, 10%) }
    60% { transform: translate(15%, 0%) }
    70% { transform: translate(0%, 15%) }
    80% { transform: translate(3%, 35%) }
    90% { transform: translate(-10%, 10%) }
  }

  .film-grain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 3;
    animation: grain 8s steps(10) infinite;
  }
`;

export default function MyMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load metrics state with proper typing
  const [metrics, setMetrics] = useState<{
    totalMovies: number;
    totalHours: number;
    lastUpdated?: string;
  }>({ 
    totalMovies: 0, 
    totalHours: 0 
  });

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // Filter movies based on search term
  const filteredMovies = useMemo(() => {
    if (!searchTerm) return movies;
    const term = searchTerm.toLowerCase();
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(term) ||
      (movie.year && movie.year.toString().includes(term))
    );
  }, [movies, searchTerm]);

  // Get unique movie posters for the film strip
  const moviePosters = useMemo(() => {
    const uniquePosters = new Set<string>();
    return movies
      .filter(movie => {
        if (!movie.posterUrl || 
            movie.posterUrl.includes('placeholder') || 
            uniquePosters.has(movie.posterUrl)) {
          return false;
        }
        uniquePosters.add(movie.posterUrl);
        return true;
      })
      .slice(0, 20);
  }, [movies]);

  // Fetch movies on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMovies();
        console.log('Fetched data:', data);
        
        if (data?.metadata) {
          setMetrics({
            totalMovies: data.metadata.totalMovies || data.movies.length,
            totalHours: data.metadata.totalHours || 0,
            lastUpdated: data.metadata.lastUpdated
          });
        } else {
          setMetrics({
            totalMovies: data.movies.length,
            totalHours: Math.round(data.movies.length * 2.1),
            lastUpdated: new Date().toISOString()
          });
        }
        
        setMovies(data.movies);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setMetrics(prev => ({
          ...prev,
          totalMovies: movies.length,
          totalHours: Math.round(movies.length * 2.1)
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [movies.length]); // Added movies.length to dependency array

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your movie collection...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading movie data</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Film strip styles are defined at the top of the file

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Film Strip */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-900">
        <style jsx>{filmStripStyles}</style>
        
        {/* Film strip container */}
        <div className="film-strip-container absolute inset-0 overflow-hidden">
          <div className="film-strip h-full flex items-center">
            {[...moviePosters, ...moviePosters].map((movie, i) => (
              <Image
                key={`${movie.id}-${i}`}
                src={movie.posterUrl}
                alt={movie.title}
                width={200}
                height={300}
                className="h-4/5 md:h-5/6 transition-all duration-300 hover:z-10 object-cover"
                loading="eager"
                priority={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/img/projects/movies/placeholder-movie.jpg';
                }}
              />
            ))}
          </div>
          <div className="film-grain"></div>
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-transparent to-gray-900/30 z-10"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-2 sm:px-4">
          {/* Metrics Row */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-2 sm:px-8 mb-4 md:mb-6 space-y-4 md:space-y-0">
            {/* Movies Count - Mobile First */}
            <div className="text-center w-32 sm:w-40 md:w-48 order-1 md:order-none">
              <div className="text-yellow-400 font-['Alfa_Slab_One'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none">
                {metrics?.totalMovies?.toLocaleString() || '0'}
              </div>
              <div className="text-white text-xs sm:text-sm uppercase tracking-wider mt-1 sm:mt-2">
                Movies
              </div>
            </div>
            
            {/* Title - Center on mobile, middle on desktop */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-['Alfa_Slab_One'] font-extrabold text-white text-center px-2 sm:px-8 order-first md:order-none w-full md:w-auto">
              Movie Masterclass
            </h1>
            
            {/* Hours - Mobile First */}
            <div className="text-center w-32 sm:w-40 md:w-48 order-2 md:order-none">
              <div className="text-yellow-400 font-['Alfa_Slab_One'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none">
                {metrics?.totalHours ? metrics.totalHours.toLocaleString(undefined, {maximumFractionDigits: 1}) : '0'}
              </div>
              <div className="text-white text-xs sm:text-sm uppercase tracking-wider mt-1 sm:mt-2">
                Hours
              </div>
            </div>
          </div>
          
          {/* Last Updated */}
          {metrics?.lastUpdated && (
            <div className="text-gray-300 text-sm mt-4">
              Last updated: {new Date(metrics.lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-30">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {/* Search Bar */}
            <div className="relative">
              {!searchTerm && (
                <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}
              <input
                type="text"
                className="block w-full pl-20 pr-16 py-2.5 border-2 border-gray-300 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-['Alfa_Slab_One'] tracking-wide"
                placeholder={searchTerm ? "" : "Search for a movie!"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  letterSpacing: '0.5px',
                  minHeight: '2.75rem',
                  paddingLeft: '1.5rem' // Additional left padding for text
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <style jsx global>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          html {
            scrollbar-width: none;  /* Firefox */
            -ms-overflow-style: none;  /* IE and Edge */
          }
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            display: none;  /* Chrome, Safari, Opera */
          }
        `}</style>

        {/* Adjustable height spacer - change h-16 to adjust height */}
        <div className="h-16"></div>
        
        <div className="mt-8">
          {filteredMovies.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm 
                  ? `Found ${filteredMovies.length} ${filteredMovies.length === 1 ? 'movie' : 'movies'} matching "${searchTerm}"`
                  : `Showing all ${metrics.totalMovies} movies`
                }
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm 
                  ? `No movies found matching "${searchTerm}"`
                  : 'No movies available.'
                }
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>← Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTransition, a } from "@react-spring/web";
import type { 
  LayoutType, 
  GalleryImage, 
  GridItem, 
  ImageGalleryScreensaverProps 
} from "./types";

// Cache for panorama detection results
const panoramaCache = new Map<string, boolean>();

// Import image paths
let imagePaths: string[] = [];
let panoramaPaths: string[] = [];

// Load image paths from JSON files
if (typeof window !== 'undefined') {
  try {
    // Using dynamic imports to avoid SSR issues
    import('@/data/galleryImages.json').then(module => {
      if (Array.isArray(module.default)) {
        imagePaths = module.default;
      }
    }).catch(error => {
      console.error('Failed to load gallery images:', error);
    });

    import('@/data/galleryPanos.json').then(module => {
      if (Array.isArray(module.default)) {
        panoramaPaths = module.default;
      }
    }).catch(error => {
      console.error('Failed to load panorama images:', error);
    });
  } catch (error) {
    console.error('Error loading image paths:', error);
  }
}

// Debounce helper
const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    timeout = setTimeout(() => func(...args), wait);
  };
};
const COLUMN_COUNT = 5; // Set to 5 columns for better image display
const GAP = 2; // 2px gap between items (reduced from 8px)

// Function to get random panoramas from the pre-generated list
const getRandomPanoramas = (count: number = 3): GalleryImage[] => {
  if (panoramaPaths.length === 0) {
    console.warn('No panorama images found in galleryPanos.json');
    return [];
  }

  // If we have fewer panoramas than requested, return all available
  if (panoramaPaths.length <= count) {
    console.log(`Using all ${panoramaPaths.length} available panoramas`);
    return panoramaPaths.map(src => ({
      id: `pano-${Math.random().toString(36).substr(2, 9)}`,
      src,
      width: 0, // These will be set when the image loads
      height: 0,
      isPanorama: true,
      alt: `Panorama ${src.split('/').pop()?.replace(/[_-]/g, ' ') || 'image'}`
    }));
  }

  // Get random unique indices
  const indices = new Set<number>();
  while (indices.size < count) {
    const index = Math.floor(Math.random() * panoramaPaths.length);
    indices.add(index);
  }

  // Create gallery image objects for the selected panoramas
  const selectedPanoramas = Array.from(indices).map(index => {
    const src = panoramaPaths[index];
    return {
      id: `pano-${Math.random().toString(36).substr(2, 9)}`,
      src,
      width: 0, // These will be set when the image loads
      height: 0,
      isPanorama: true,
      alt: `Panorama ${src.split('/').pop()?.replace(/[_-]/g, ' ') || 'image'}`
    };
  });

  console.log(`Selected ${selectedPanoramas.length} random panoramas`);
  return selectedPanoramas;
};

// Function to find panorama images from the pre-generated list
const findPanoramaImages = async (): Promise<GalleryImage[]> => {
  return getRandomPanoramas(3);
};

// getImageDimensions function removed as it's not used in the code

// Preload images and get their dimensions (unused but kept for future reference)
// const preloadImages = async (urls: string[]) => {
//   const validUrls = urls.filter(url => 
//     url && !url.includes('favicon') && !url.includes('apple-touch-icon')
//   );

//   const images = await Promise.all(
//     validUrls.map(async (src, index) => {
//       try {
//         const { width, height } = await getImageDimensions(src);
//         return {
//           id: `img-${index}`,
//           src,
//           width,
//           height,
//           isPanorama: isPanoramaImage(src)
//         } as GalleryImage;
//       } catch (error) {
//         console.error(`Error loading image ${src}:`, error);
//         return null;
//       }
//     })
//   );

//   return images.filter(Boolean) as GalleryImage[];
// };

// Custom hook to load images with retry logic
const useImageLoader = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const retryCount = useRef<Record<string, number>>({});
  const MAX_RETRIES = 3;

  const loadImage = useCallback((src: string, index: number): Promise<GalleryImage> => {
    return new Promise((resolve) => {
      const img = new Image();
      const retryKey = `${src}-${index}`;
      const currentRetry = retryCount.current[retryKey] || 0;
      let hasResolved = false; // Track if this image has already been resolved
      
      img.onload = () => {
        // Prevent multiple resolutions of the same image
        if (hasResolved) return;
        hasResolved = true;
        
        // We'll determine panorama status based on the pre-defined list
        const isPanorama = panoramaPaths.includes(src);
        
        resolve({
          id: `img-${index}-${Date.now()}`,
          src: src,
          originalSrc: src,
          width: img.width || 1,
          height: img.height || 1,
          isPanorama: isPanorama,
          lastRetry: Date.now(),
          retryCount: currentRetry,
          aspectRatio: img.width / img.height
        });
      };
      
      img.onerror = () => {
        // Prevent multiple error resolutions of the same image
        if (hasResolved) return;
        
        const retryDelay = Math.min(1000 * Math.pow(2, currentRetry), 15000); // Exponential backoff, max 15s
        
        if (currentRetry < MAX_RETRIES) {
          retryCount.current[retryKey] = currentRetry + 1;
          
          // Stagger retries with exponential backoff
          setTimeout(() => {
            loadImage(src, index).then(resolve);
          }, retryDelay);
        } else {
          hasResolved = true; // Mark as resolved to prevent multiple error callbacks
          
          // Only log to console in development for non-panorama images
          if (process.env.NODE_ENV === 'development' && !panoramaPaths.some(p => p === src)) {
            console.warn(`Failed to load image after ${MAX_RETRIES} attempts:`, src);
          }
          
          resolve({
            id: `img-${index}-error-${Date.now()}`,
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWVlZWUiLz48bGluZSB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIHN0cm9rZT0iI2RkZCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjEwMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMTAwIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
            originalSrc: src,
            width: 100,
            height: 100,
            isPanorama: false,
            isError: true,
            lastRetry: Date.now(),
            retryCount: currentRetry + 1
          });
        }
      };
      
      // Add a small delay before starting the load to prevent overwhelming the server
      setTimeout(() => {
        try {
          img.src = src;
        } catch (error) {
          console.error('Error setting image source:', error, src);
          // Retry with a delay if there's an error setting the source
          setTimeout(() => loadImage(src, index).then(resolve), 1000);
        }
      }, 50 * (index % 10)); // Stagger the start of image loading
    });
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        // Filter out invalid image paths
        const validImagePaths = imagePaths.filter(
          url => url && !url.includes('favicon') && !url.includes('apple-touch-icon')
        );
        
        setTotalImages(validImagePaths.length);
        setLoadedCount(0);
        
        // Track completed images to prevent duplicates
        const completedImages = new Set<string>();
        
        // Load all images in parallel with retry logic
        const loadPromises = validImagePaths.map((src, index) => 
          loadImage(src, index).then(img => {
            // Only count unique image loads
            if (!completedImages.has(src)) {
              completedImages.add(src);
              setLoadedCount(completedImages.size);
            }
            return img;
          })
        );
        
        const loadedImages = await Promise.all(loadPromises);
        setImages(loadedImages.filter(Boolean) as GalleryImage[]);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [loadImage]); // Removed imagePaths from dependencies as it's a module-level constant

  return { 
    images, 
    isLoading, 
    loadedCount, 
    totalImages 
  };
};
// Helper function to create a grid item
const createGridItem = (
  img: GalleryImage, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  column: number,
  _isPanorama: boolean // Prefix with underscore to indicate it's intentionally unused
): GridItem => {
  // Calculate scale to fill the container while maintaining aspect ratio
  const containerAspect = width / height;
  const imageAspect = img.width / img.height;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  if (containerAspect > imageAspect) {
    // Container is wider than image (relative to their heights)
    scale = width / (height * imageAspect);
    translateX = (width - height * imageAspect) / 2;
  } else {
    // Container is taller than image (relative to their widths)
    scale = height / (width / imageAspect);
    translateY = (height - width / imageAspect) / 2;
  }

  const gridItem: GridItem = {
    ...img,
    x,
    y,
    width,
    height,
    column,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
      transformOrigin: 'center center',
      willChange: 'transform',
      display: 'block'
    }
  };
  
  return gridItem;
};

// Handle full-panorama layout
const createFullPanoramaLayout = (
  panoramaImages: GalleryImage[],
  containerWidth: number,
  gap: number
): [number, GridItem[]] => {
  const items: GridItem[] = [];
  // Get the viewport height, fallback to 100vh if window is not available
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  // Calculate section height to fill the viewport with 3 equal sections
  const sectionHeight = Math.floor(viewportHeight / 3);
  
  // Take up to 3 unique images, don't duplicate
  const panoramaImagesToShow = panoramaImages.slice(0, 3);
  
  // If we don't have enough images, we'll have fewer than 3 sections
  if (panoramaImagesToShow.length === 0) {
    return [0, []]; // No images to show
  }
  
  // Add each panorama in a vertical stack
  panoramaImagesToShow.forEach((img, index) => {
    if (!img) return;
    
    // Create a new image object with a unique ID
    const uniqueImg = {
      ...img,
      id: `${img.id}-pano-${index}` // Append index to ensure unique ID
    };
    
    items.push(createGridItem(
      uniqueImg,
      0, // x - full width
      index * sectionHeight, // y - stack vertically
      containerWidth, // width - full width
      sectionHeight, // height - 1/3 of viewport
      0, // column - single column
      true // isPanorama
    ));
  });
  
  // Total height is viewport height (3 sections with no gaps between them)
  const containerHeight = viewportHeight;
  return [containerHeight, items];
};

// Handle panorama-middle layout
const createPanoramaMiddleLayout = (
  panorama: GalleryImage,
  regularImages: GalleryImage[],
  containerWidth: number,
  columnWidth: number,
  gap: number,
  effectiveColumns: number
): [number, GridItem[]] => {
  const items: GridItem[] = [];
  
  // Calculate viewport-based dimensions
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const sectionHeight = Math.floor(viewportHeight / 3);
  
  // 1. First row: Exactly 1/3 of viewport height
  const firstRowHeight = sectionHeight;
  const imgWidth = Math.floor((containerWidth - (effectiveColumns - 1) * gap) / effectiveColumns);
  
  // Only add first row if we have regular images
  const firstRowImages = regularImages.slice(0, effectiveColumns);
  const remainingImages = regularImages.slice(effectiveColumns);
  
  firstRowImages.forEach((img, index) => {
    // Create a modified image object with style for proper filling
    const styledImg = {
      ...img,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        display: 'block'
      }
    };
    
    items.push(createGridItem(
      styledImg,
      index * (imgWidth + gap), // x
      0, // y
      imgWidth, // width
      firstRowHeight, // height - exactly 1/3 of viewport
      index, // column
      false // isPanorama
    ));
  });
  
  // 2. Panorama: Full width below first row with height limited to 1/3 of viewport
  const panoramaY = firstRowHeight + gap;
  const maxPanoramaHeight = Math.floor(viewportHeight / 3);
  const panoramaAspectRatio = panorama.width / panorama.height;
  const panoramaHeight = Math.min(containerWidth / panoramaAspectRatio, maxPanoramaHeight);
  
  items.push(createGridItem(
    panorama,
    0, // x
    panoramaY, // y
    containerWidth, // width
    panoramaHeight, // height
    0, // column
    true // isPanorama
  ));
  
  // 3. Remaining images: Masonry layout below panorama with proper spacing
  const remainingColumnHeights = new Array(effectiveColumns).fill(panoramaY + panoramaHeight + gap);
  const remainingColumnWidth = (containerWidth - (effectiveColumns - 1) * gap) / effectiveColumns;
  
  remainingImages.forEach(img => {
    const targetCol = remainingColumnHeights.indexOf(Math.min(...remainingColumnHeights));
    const aspectRatio = img.width / img.height;
    const imgHeight = remainingColumnWidth / aspectRatio;
    
    items.push(createGridItem(
      img,
      targetCol * (remainingColumnWidth + gap), // x
      remainingColumnHeights[targetCol], // y
      remainingColumnWidth, // width
      imgHeight, // height
      targetCol, // column
      false // isPanorama
    ));
    
    remainingColumnHeights[targetCol] += imgHeight + gap;
  });
  
  const containerHeight = Math.max(...remainingColumnHeights, 0);
  return [containerHeight, items];
};

// Handle panorama-bottom layout (similar to top but positions panorama at the bottom)
const createPanoramaBottomLayout = (
  panorama: GalleryImage,
  regularImages: GalleryImage[],
  containerWidth: number,
  columnWidth: number,
  _gap: number, // Prefix with underscore to indicate it's intentionally unused
  effectiveColumns: number
): [number, GridItem[]] => {
  const items: GridItem[] = [];
  const panoramaHeight = columnWidth * 2; // Make panorama twice as tall as a regular column
  
  // Position regular images first (above the panorama)
  const y = 0; // Changed to const since it's never reassigned
  const columns: number[] = new Array(effectiveColumns).fill(0);
  
  // Distribute regular images in a grid above the panorama
  regularImages.forEach((img, index) => {
    const columnIndex = index % effectiveColumns;
    const x = columnIndex * (columnWidth + _gap);
    
    // Calculate height based on aspect ratio
    const aspectRatio = img.width && img.height ? img.width / img.height : 1;
    const height = columnWidth / aspectRatio;
    
    items.push(createGridItem(
      img,
      x,
      y + columns[columnIndex],
      columnWidth,
      height,
      columnIndex,
      false
    ));
    
    // Update column height
    columns[columnIndex] += height + _gap;
  });
  
  // Add the panorama at the bottom, spanning full width
  const panoramaY = Math.max(0, ...columns) + _gap;
  items.push(createGridItem(
    panorama,
    0,
    panoramaY,
    containerWidth,
    panoramaHeight,
    0,
    true
  ));
  
  // Calculate total height
  const totalHeight = panoramaY + panoramaHeight + _gap;
  
  return [totalHeight, items];
};

// Handle panorama-top layout
const createPanoramaTopLayout = (
  panorama: GalleryImage,
  regularImages: GalleryImage[],
  containerWidth: number,
  columnWidth: number,
  gap: number,
  effectiveColumns: number
): [number, GridItem[]] => {
  const items: GridItem[] = [];
  const columnHeights = new Array(effectiveColumns).fill(0);
  const panoramaAspectRatio = panorama.width / panorama.height;
  const panoramaHeight = Math.min(containerWidth / panoramaAspectRatio, containerWidth * 0.4);
  
  // Add panorama at the top
  items.push(createGridItem(
    panorama,
    0, // x
    0, // y
    containerWidth, // width
    panoramaHeight, // height
    0, // column
    true // isPanorama
  ));
  
  // Update column heights for remaining images
  columnHeights.fill(panoramaHeight + gap);
  
  // Add remaining images
  for (const img of regularImages) {
    const targetCol = columnHeights.indexOf(Math.min(...columnHeights));
    const aspectRatio = img.width / img.height;
    const imgHeight = columnWidth / aspectRatio;
    
    items.push(createGridItem(
      img,
      targetCol * (columnWidth + gap), // x
      columnHeights[targetCol], // y
      columnWidth, // width
      imgHeight, // height
      targetCol, // column
      false // isPanorama
    ));
    
    columnHeights[targetCol] += imgHeight + gap;
  }
  
  const containerHeight = Math.max(...columnHeights, 0);
  return [containerHeight, items];
};

// Handle standard masonry layout
const createMasonryLayout = (
  images: GalleryImage[],
  containerWidth: number,
  gap: number,
  effectiveColumns: number
): [number, GridItem[]] => {
  const items: GridItem[] = [];
  const columnHeights = new Array(effectiveColumns).fill(0);
  const columnWidth = (containerWidth - (effectiveColumns - 1) * gap) / effectiveColumns;
  
  for (const img of images) {
    const targetCol = columnHeights.indexOf(Math.min(...columnHeights));
    const aspectRatio = img.width / img.height;
    const imgHeight = columnWidth / aspectRatio;
    
    items.push(createGridItem(
      img,
      targetCol * (columnWidth + gap), // x
      columnHeights[targetCol], // y
      columnWidth, // width
      imgHeight, // height
      targetCol, // column
      img.isPanorama || false // isPanorama
    ));
    
    columnHeights[targetCol] += imgHeight + gap;
  }
  
  const containerHeight = Math.max(...columnHeights, 0);
  return [containerHeight, items];
};

// Main layout calculation function
const calculateLayout = (
  images: GalleryImage[], 
  containerWidth: number, 
  layoutType: LayoutType = 'masonry',
  columns: number = COLUMN_COUNT
): [number, GridItem[]] => {
  // Early return for empty state
  if (!images.length || !containerWidth) {
    return [0, []];
  }

  // Calculate the number of columns based on container width
  const effectiveColumns = Math.min(columns, Math.max(1, Math.floor(containerWidth / 300)));
  
  // Separate panorama and regular images
  const panoramaImages = images.filter(img => img.isPanorama);
  const regularImages = images.filter(img => !img.isPanorama);

  // Handle full-panorama layout
  if (layoutType === 'full-panorama' && panoramaImages.length > 0) {
    return createFullPanoramaLayout(panoramaImages, containerWidth, GAP);
  }

  // Handle panorama-top layout
  if (layoutType === 'panorama-top' && panoramaImages.length > 0) {
    const panorama = panoramaImages[Math.floor(Math.random() * panoramaImages.length)];
    const columnWidth = (containerWidth - (effectiveColumns - 1) * GAP) / effectiveColumns;
    return createPanoramaTopLayout(
      panorama,
      regularImages,
      containerWidth,
      columnWidth,
      GAP,
      effectiveColumns
    );
  }
  
  // Default to standard masonry layout
  return createMasonryLayout(images, containerWidth, GAP, effectiveColumns);
};

// Custom hook to calculate layout for the current set of images
const useCalculateLayout = (images: GalleryImage[], containerWidth: number, 
  layoutType: LayoutType, columns: number): [number, GridItem[]] => {
  const [layout, setLayout] = useState<[number, GridItem[]]>([0, []]);
  
  useEffect(() => {
    const calculateLayout = async () => {
      if (!images.length || !containerWidth) {
        setLayout([0, []]);
        return;
      }
      
      const effectiveColumns = Math.min(columns, COLUMN_COUNT);
      
      // Handle full panorama layout
      if (layoutType === 'full-panorama') {
        console.log('Looking for panorama images...');
        
        try {
          console.log('Searching for panorama images...');
          const panoramas = await findPanoramaImages();
          
          if (panoramas.length > 0) {
            console.log(`Using ${panoramas.length} panorama images`);
            setLayout(createFullPanoramaLayout(panoramas, containerWidth, GAP));
          } else {
            console.warn('No panorama images found, falling back to masonry layout');
            setLayout(createMasonryLayout(images, containerWidth, GAP, effectiveColumns));
          }
          return;
        } catch (error) {
          console.error('Error finding panorama images:', error);
          setLayout(createMasonryLayout(images, containerWidth, GAP, effectiveColumns));
          return;
        }
      }
      
      // Handle other layout types
      if (layoutType.startsWith('panorama-')) {
        const position = layoutType.split('-')[1] as 'top' | 'middle' | 'bottom';
        const panoramaImages = images.filter(img => img.isPanorama);
        
        if (panoramaImages.length > 0) {
          const panorama = panoramaImages[0];
          const regularImages = images.filter(img => !img.isPanorama);
          const columnWidth = (containerWidth - (effectiveColumns - 1) * GAP) / effectiveColumns;
          
          if (position === 'top') {
            setLayout(createPanoramaTopLayout(
              panorama,
              regularImages,
              containerWidth,
              columnWidth,
              GAP,
              effectiveColumns
            ));
            return;
          } else if (position === 'middle') {
            setLayout(createPanoramaMiddleLayout(
              panorama,
              regularImages,
              containerWidth,
              columnWidth,
              GAP,
              effectiveColumns
            ));
            return;
          } else if (position === 'bottom') {
            setLayout(createPanoramaBottomLayout(
              panorama,
              regularImages,
              containerWidth,
              columnWidth,
              GAP,
              effectiveColumns
            ));
            return;
          }
        }
      }
      
      // Default to standard masonry layout
      setLayout(createMasonryLayout(images, containerWidth, GAP, effectiveColumns));
    };
    
    calculateLayout().catch(console.error);
  }, [images, containerWidth, layoutType, columns]);
  
  return layout;
};

const ImageGalleryScreensaver = ({
  images = [],
  refreshInterval = 15000 // 15 seconds auto-advance interval
}: ImageGalleryScreensaverProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [layoutType, setLayoutType] = useState<LayoutType>('masonry');
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use COLUMN_COUNT as the default
  const [columns, setColumns] = useState(COLUMN_COUNT);
  const [currentImages, setCurrentImages] = useState<GalleryImage[]>(images || []);
  
  // Update current images when images prop changes - limit to 20 images
  useEffect(() => {
    if (images && images.length > 0) {
      // Shuffle and take first 20 images
      const shuffled = [...images].sort(() => Math.random() - 0.5).slice(0, 20);
      setCurrentImages(shuffled);
    }
  }, [images]);
  
  // Handle window resize with debounce
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    // Initial width
    updateWidth();
    
    // Debounced resize handler
    const handleResize = debounce(updateWidth, 100);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle window resize and update columns
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateLayout = () => {
      // Update container width
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      
      // Update number of columns based on viewport width, but respect COLUMN_COUNT
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width >= 1200) setColumns(COLUMN_COUNT);  // Show all columns on large screens
        else if (width >= 900) setColumns(4);         // 4 columns on medium screens
        else if (width >= 600) setColumns(3);         // 3 columns on small screens
        else if (width >= 400) setColumns(2);         // 2 columns on very small screens
        else setColumns(1);                           // 1 column on mobile
      }
    };

    // Initial update
    updateLayout();
    
    // Debounced resize handler
    const debouncedResize = debounce(updateLayout, 100);
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  // Shuffle array helper
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Get a new batch of 20 random images
  const getNewBatch = useCallback(() => {
    if (!images.length) return [];
    
    // If we have 20 or fewer images, just shuffle the ones we have
    if (images.length <= 20) {
      return shuffleArray([...images]);
    }
    
    // Otherwise, get 20 random unique images
    const availableImages = [...images];
    const newBatch: GalleryImage[] = [];
    
    while (newBatch.length < 20 && availableImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      newBatch.push(availableImages.splice(randomIndex, 1)[0]);
    }
    
    return newBatch;
  }, [images, shuffleArray]);

  // Refresh layout at intervals with smooth transition
  const refreshLayout = useCallback(() => {
    setCurrentImages(prevImages => {
      // Get a new batch of images
      const newBatch = getNewBatch();
      if (newBatch.length === 0) return prevImages;
      
      // Shuffle the new batch
      const shuffledBatch = shuffleArray(newBatch);
      
      // Cycle through all layout types
      const layouts: LayoutType[] = ['masonry', 'panorama-top', 'panorama-middle', 'full-panorama'];
      const currentIndex = layouts.indexOf(layoutType);
      const nextIndex = (currentIndex + 1) % layouts.length;
      setLayoutType(layouts[nextIndex]);
      
      return shuffledBatch;
    });
  }, [getNewBatch, layoutType, shuffleArray]);

  // Function to update the layout type
  const updateLayout = useCallback((newLayout: LayoutType) => {
    // Disable animations temporarily during layout change
    shouldAnimate.current = false;
    
    // Store the current scroll position to restore it later
    const scrollY = window.scrollY;
    
    // Update the layout type
    setLayoutType(prevLayout => {
      // If switching to a different layout type, force a re-render
      if (prevLayout !== newLayout) {
        // Force a re-layout by toggling the container width
        if (containerRef.current) {
          const newWidth = containerRef.current.clientWidth;
          setContainerWidth(0);
          setTimeout(() => {
            setContainerWidth(newWidth);
            // Re-enable animations after a short delay
            setTimeout(() => {
              shouldAnimate.current = true;
            }, 50);
          }, 10);
        }
      }
      return newLayout;
    });
    
    // Get a new batch of images for the new layout
    setCurrentImages(prevImages => {
      const newBatch = getNewBatch();
      return newBatch.length > 0 ? newBatch : prevImages;
    });
    
    // Restore scroll position after layout update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  }, [getNewBatch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle debug menu with Ctrl+Shift+D or Cmd+Shift+D
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setShowDebugMenu(prev => !prev);
        return;
      }

      // Only handle number keys if debug menu is open
      if (showDebugMenu && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const layoutMap: {[key: string]: LayoutType} = {
          '1': 'masonry',
          '2': 'panorama-top',
          '3': 'panorama-middle',
          '4': 'full-panorama'
        };
        const newLayout = layoutMap[e.key as keyof typeof layoutMap];
        if (newLayout) {
          updateLayout(newLayout);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDebugMenu, getNewBatch, updateLayout]);

  // Set up refresh interval (20 seconds) with proper cleanup
  useEffect(() => {
    // Only start the interval if we have images loaded and debug menu is closed
    if (images.length === 0 || showDebugMenu) return;
    
    // Initial layout - only if we don't have any images yet
    if (currentImages.length === 0) {
      const initialBatch = getNewBatch();
      if (initialBatch.length > 0) {
        setCurrentImages(initialBatch);
      }
    }
    
    // Set up the refresh interval
    const interval = setInterval(() => {
      if (!showDebugMenu) {  // Only refresh if debug menu is closed
        refreshLayout();
      }
    }, 20000); // 20 seconds
    
    return () => clearInterval(interval);
  }, [images.length, getNewBatch, refreshLayout, showDebugMenu, currentImages.length]);
  
  // Handle layout change from debug menu
  const handleLayoutChange = useCallback((newLayout: LayoutType) => {
    // Don't change anything if we're already on this layout
    if (newLayout === layoutType) return;
    
    // Update the layout type
    setLayoutType(newLayout);
    
    setCurrentImages(prevImages => {
      // For full-panorama, only keep panorama images and make sure we have exactly 3
      if (newLayout === 'full-panorama') {
        let panoramaImages = prevImages.filter(img => img.isPanorama);
        
        // If no panoramas in current set, get a new batch
        if (panoramaImages.length === 0) {
          panoramaImages = getNewBatch().filter(img => img.isPanorama);
        }
        
        // If still no panoramas, return current images to prevent empty state
        if (panoramaImages.length === 0) return prevImages;
        
        // Ensure we have exactly 3 panoramas (duplicate if needed)
        const result = [];
        for (let i = 0; i < 3; i++) {
          const sourceImg = panoramaImages[i % panoramaImages.length];
          result.push({
            ...sourceImg,
            id: `${sourceImg.id}-${i}` // Ensure unique IDs
          });
        }
        return result;
      }
      
      // For other layouts, only get new images if switching to a panorama layout
      const shouldGetNewBatch = newLayout.startsWith('panorama-');
      const newBatch = shouldGetNewBatch ? getNewBatch() : [...prevImages];
      if (newBatch.length === 0) return prevImages;
      
      // Force a re-layout by toggling the container width
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        setContainerWidth(0);
        setTimeout(() => setContainerWidth(newWidth), 10);
      }
      
      return newBatch;
    });
  }, [getNewBatch, layoutType]);

  // Debug menu component
  const DebugMenu = () => {
    // Toggle debug menu with a small delay to prevent immediate re-triggering
    const toggleDebugMenu = useCallback(() => {
      setShowDebugMenu(prev => !prev);
    }, []);

    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.85)',
        color: 'white',
        padding: '12px',
        borderRadius: '6px',
        zIndex: 1000,
        fontFamily: 'monospace',
        fontSize: '14px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontWeight: 'bold' }}>Debug Menu</div>
          <button 
            onClick={toggleDebugMenu}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              padding: '2px 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Close
          </button>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '8px' }}>Current Layout: <strong>
            {layoutType === 'full-panorama' 
              ? 'Full Pano' 
              : layoutType.replace('panorama-', '').charAt(0).toUpperCase() + 
                layoutType.replace('panorama-', '').slice(1)}
          </strong></div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px',
            marginBottom: '10px'
          }}>
            <button 
              onClick={() => handleLayoutChange('masonry')} 
              style={{ 
                padding: '6px 8px',
                background: layoutType === 'masonry' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left'
              }}
            >
              1: Masonry
            </button>
            <button 
              onClick={() => handleLayoutChange('panorama-top')} 
              style={{ 
                padding: '6px 8px',
                background: layoutType === 'panorama-top' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left'
              }}
            >
              2: Top
            </button>
            <button 
              onClick={() => handleLayoutChange('panorama-middle')} 
              style={{ 
                padding: '6px 8px',
                background: layoutType === 'panorama-middle' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left'
              }}
            >
              3: Middle
            </button>
            <button 
              onClick={() => handleLayoutChange('full-panorama')} 
              style={{ 
                padding: '6px 8px',
                background: layoutType === 'full-panorama' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              4: Full Pano
            </button>
          </div>
        </div>
        
        <div style={{
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.6)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '8px'
        }}>
          <div>Auto-refresh: <strong style={{ color: showDebugMenu ? '#f87171' : '#86efac' }}>
            {showDebugMenu ? 'Paused' : 'Active'}
          </strong></div>
          <div style={{ marginTop: '4px' }}>
            Toggle Menu: <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
          </div>
        </div>
      </div>
    );
  };

  // Memoize the grid items calculation
  const [gridContainerHeight, gridItems] = useCalculateLayout(
    currentImages,
    containerWidth,
    layoutType,
    columns
  );
  
  // Memoize the grid items to prevent unnecessary re-renders
  const gridItemsKey = useMemo(() => 
    gridItems.map(item => item.id).join(','),
    [gridItems]
  );
  
  const memoizedGridItems = useMemo(() => gridItems, [gridItemsKey, layoutType, containerWidth]);

  // Set up transitions with optimized performance
  const isPanoramaLayout = useMemo(() => 
    layoutType === 'full-panorama' || layoutType.startsWith('panorama-'),
    [layoutType]
  );
  
  const prevLayoutType = useRef<LayoutType>(layoutType);
  const shouldAnimate = useRef(true);
  
  // Intersection Observer for lazy loading
  const observer = useRef<IntersectionObserver | null>(null);
  const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());
  
  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              // Only set src if it's not already set
              if (img.src !== src) {
                img.src = src;
              }
              img.removeAttribute('data-src');
              observer.current?.unobserve(img);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.01
      }
    );
    
    // Clean up on unmount
    return () => {
      observer.current?.disconnect();
    };
  }, []);
  
  // Set up ref callback for images with proper TypeScript types and null src handling
  const setImageRef = useCallback((id: string | number, element: HTMLImageElement | null) => {
    if (!observer.current) return;
    
    const idStr = String(id);
    
    // Clean up any existing element with this id
    const existingElement = imageRefs.current.get(idStr);
    if (existingElement && existingElement !== element) {
      observer.current.unobserve(existingElement);
      imageRefs.current.delete(idStr);
    }
    
    // If element is null, we're done (cleanup was handled above)
    if (!element) return;
    
    // Only set up observer if we have a data-src attribute and no src
    if (element.dataset.src && !element.src) {
      // Add to our refs and observe
      imageRefs.current.set(idStr, element);
      observer.current.observe(element);
    }
  }, []);

  // Reset animation state when layout type changes
  useEffect(() => {
    shouldAnimate.current = true;
    return () => {
      shouldAnimate.current = false;
    };
  }, [layoutType]);
  
  const transitions = useTransition(memoizedGridItems, {
    keys: (item) => `${item.id}-${layoutType}`,
    from: { opacity: 0, transform: 'scale(0.98)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    update: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(1.02)' },
    config: {
      duration: shouldAnimate.current ? (isPanoramaLayout ? 400 : 600) : 0,
      easing: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    },
    trail: shouldAnimate.current ? (isPanoramaLayout ? 20 : 30) : 0,
    unique: true,
    reset: prevLayoutType.current !== layoutType,
    expires: false,
  });

  // Update previous layout type ref
  useEffect(() => {
    prevLayoutType.current = layoutType;
  }, [layoutType]);

  // Calculate viewport height for full-panorama layout
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const isFullPanorama = layoutType === 'full-panorama';
  
  return (
    <div className={`w-full h-screen bg-gray-900 ${isFullPanorama ? 'p-0' : 'p-4'} overflow-hidden`} style={{ overflowY: 'hidden' }}>
      {showDebugMenu && <DebugMenu />}
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{ 
          width: '100%',
          height: isFullPanorama ? '100%' : `${gridContainerHeight}px`,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {transitions((style, item, _, index) => {
          const isPanorama = item.isPanorama || isFullPanorama;
          const uniqueKey = isFullPanorama ? `${item.id}-${index}` : item.id;
          
          return (
            <a.div
              key={uniqueKey}
              className="absolute will-change-transform"
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                padding: isFullPanorama ? 0 : GAP / 2,
                zIndex: Math.max(0, Math.floor(item.y || 0)),
                ...style
              }}
            >
              <div 
                className={`relative w-full h-full overflow-hidden ${
                  isFullPanorama ? 'rounded-none' : 'rounded-sm hover:shadow-lg'
                } bg-gray-800`}
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: isFullPanorama ? 0 : '0.125rem',
                  position: 'relative'
                }}
              >
                <img
                  ref={(el) => setImageRef(item.id.toString(), el)}
                  data-src={item.src}
                  alt=""
                  style={{
                    width: item.style?.width || '100%',
                    height: item.style?.height || '100%',
                    objectFit: item.style?.objectFit as React.CSSProperties['objectFit'] || 'cover',
                    objectPosition: item.style?.objectPosition || 'center',
                    display: 'block',
                    transform: item.style?.transform,
                    transformOrigin: item.style?.transformOrigin,
                    willChange: item.style?.willChange as React.CSSProperties['willChange'],
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                    backgroundColor: '#f0f0f0' // Placeholder color
                  }}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = '1';
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    // Set error placeholder
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWVlZWUiLz48bGluZSB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIHN0cm9rZT0iI2RkZCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjEwMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMTAwIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg=';
                  }}
                />
              </div>
            </a.div>
          );
        })}
      </div>
    </div>
  );
};

// Main export component
const Screensaver = () => {
  const { images, isLoading, loadedCount, totalImages } = useImageLoader();
  const [progress, setProgress] = useState(0);

  // Update progress when loadedCount changes
  useEffect(() => {
    if (totalImages > 0) {
      const calculatedProgress = Math.min(Math.round((loadedCount / totalImages) * 100), 100);
      setProgress(calculatedProgress);
    }
  }, [loadedCount, totalImages]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
        <div className="w-full max-w-md">
          <div className="text-center text-gray-300 text-lg mb-4">
            Loading gallery... {progress}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-400 text-center">
            {totalImages > 0 ? (
              `Loading ${loadedCount} of ${totalImages} images`
            ) : (
              'Preparing to load images...'
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return <ImageGalleryScreensaver images={images} />;
};

export default Screensaver;

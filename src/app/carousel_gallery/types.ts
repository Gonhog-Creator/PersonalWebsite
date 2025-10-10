export interface GalleryImage {
  id: string | number;
  src: string;
  height: number;
  width: number;
  isPanorama: boolean;
  alt?: string;
  location?: string;
  originalSrc?: string;
  isError?: boolean;
  lastRetry?: number;
  retryCount?: number;
  aspectRatio?: number;
}

export interface GridItem extends GalleryImage {
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
  style: {
    width: string;
    height: string;
    objectFit: string;
    objectPosition: string;
    transform: string;
    transformOrigin: string;
    willChange: string;
    display: string;
  };
}

export type LayoutType = "masonry" | "panorama-top" | "panorama-middle" | "full-panorama";

export interface ImageGalleryScreensaverProps {
  images?: GalleryImage[];
  refreshInterval?: number;
}

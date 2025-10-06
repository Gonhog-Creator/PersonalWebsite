'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import allImages from '@/data/galleryImages.json';

const ASPECT_RATIOS = [
  { w: 1, h: 1 },    // Square
  { w: 4, h: 3 },    // Standard
  { w: 3, h: 4 },    // Portrait
  { w: 16, h: 9 },   // Wide
  { w: 3, h: 2 },    // Landscape
  { w: 2, h: 3 }     // Tall
];

export default function MasonryGallery() {
  const [images, setImages] = useState<Array<{src: string, width: number, height: number}>>([]);
  const masonryRef = useRef<HTMLDivElement>(null);
  const msnry = useRef<Masonry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialImages = allImages.slice(0, 40).map((src) => {
      const ratio = ASPECT_RATIOS[Math.floor(Math.random() * ASPECT_RATIOS.length)];
      return {
        src,
        width: ratio.w * 100,
        height: ratio.h * 100
      };
    });
    setImages(initialImages);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!masonryRef.current || isLoading) return;

    const imgLoad = imagesLoaded(masonryRef.current);

    const initMasonry = () => {
      if (!masonryRef.current) return;

      if (msnry.current) {
        msnry.current.destroy();
      }

      msnry.current = new Masonry(masonryRef.current, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 8,
        resize: true,
        initLayout: true,
        fitWidth: true,
        horizontalOrder: true
      });

      imagesLoaded(masonryRef.current).on('progress', () => {
        if (msnry.current) {
          msnry.current.layout?.();
        }
      });
    };

    imgLoad.on('always', initMasonry);
    window.addEventListener('resize', initMasonry);

    return () => {
      if (msnry.current) {
        msnry.current.destroy?.();
      }
      window.removeEventListener('resize', initMasonry);
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 p-4 overflow-hidden">
      <div
        ref={masonryRef}
        className="mx-auto w-full h-full"
      >
        <div
          className="grid-sizer"
          style={{ width: 'calc(20% - 8px)' }}
        />

        {images.map((img, index) => {
          const aspectRatio = (img.height / img.width) * 100;

          return (
            <div
              key={`${img.src}-${index}`}
              className="grid-item"
              style={{
                width: 'calc(20% - 8px)',
                margin: '0 4px 8px'
              }}
            >
              <div
                className="relative w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  paddingBottom: `${aspectRatio}%`,
                  height: 0
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  className="object-cover hover:opacity-90 transition-opacity duration-200"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33.33vw, 20vw"
                  priority={index < 10}
                />
              </div>
            </div>
          </div>
      <style jsx global>{`
        html, body, #__next {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          height: auto !important;
        }
        .grid-item {
          display: inline-block;
          vertical-align: top;
          transform: none !important;
          backface-visibility: hidden;
        }
        .grid-sizer {
          display: none;
        }
        @media (max-width: 1536px) {
          .grid-item {
          }
          .grid-sizer {
            width: calc(25% - 12px) !important;
          }
        }
        @media (max-width: 1024px) {
          .grid-item {
            width: calc(33.333% - 12px) !important;
          }
          .grid-sizer {
            width: calc(33.333% - 12px) !important;
          }
        }
        @media (max-width: 640px) {
          .grid-item {
            width: calc(50% - 12px) !important;
          }
          .grid-sizer {
            width: calc(50% - 12px) !important;
          }
        }
      </style>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { FaImage } from 'react-icons/fa';

interface GearPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Gear/setup photo with a graceful placeholder when the file hasn't been
 * added to /public/img/Astro/setup/ yet.
 */
export function GearPhoto({ src, alt, className = '' }: GearPhotoProps) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gray-800/60 border border-dashed border-gray-700 text-gray-500 ${className}`}
      >
        <FaImage size={28} />
        <span className="text-xs px-4 text-center">
          Drop a photo at <code className="text-gray-400">public{src}</code>
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setMissing(true)}
      className={`object-cover ${className}`}
    />
  );
}

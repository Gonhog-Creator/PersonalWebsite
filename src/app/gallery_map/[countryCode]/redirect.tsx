'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Map of country codes to their gallery paths
const countryToGalleryMap: { [key: string]: string } = {
  'us': '/galleries/united-states',
  'ar': '/galleries/argentina',
  'ch': '/galleries/switzerland',
  'de': '/galleries/germany',
  'fr': '/galleries/france',
  'gb': '/galleries/united-kingdom',
  'cr': '/galleries/costa-rica',
  'si': '/galleries/slovenia',
  'at': '/galleries/austria',
  'au': '/galleries/australia',
  'be': '/galleries/belgium',
  'gr': '/galleries/greece'
};

export default function CountryRedirect({ countryCode }: { countryCode: string }) {
  const router = useRouter();

  useEffect(() => {
    const galleryPath = countryToGalleryMap[countryCode.toLowerCase()];
    if (galleryPath) {
      router.replace(galleryPath);
    } else {
      // If no matching country code, redirect to 404
      router.replace('/404');
    }
  }, [countryCode, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to gallery...</h1>
        <p>If you are not redirected, please click the back button.</p>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Map of country codes to their gallery paths
const countryToGalleryMap: Record<string, string> = {
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

export default function CountryRedirectClient() {
  const router = useRouter();
  const params = useParams();
  const countryCode = params.countryCode as string;

  useEffect(() => {
    const galleryPath = countryToGalleryMap[countryCode.toLowerCase()];
    if (galleryPath) {
      router.replace(galleryPath);
    } else {
      // Redirect to a 404 page or home page if country code is not found
      router.replace('/');
    }
  }, [countryCode, router]);

  return null; // This component doesn't render anything
}

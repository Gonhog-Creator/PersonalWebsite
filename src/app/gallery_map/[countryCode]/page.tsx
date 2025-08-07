import { notFound, redirect } from 'next/navigation';

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

export default function CountryGalleryPage({ params }: { params: { countryCode: string } }) {
  const { countryCode } = params;
  const galleryPath = countryToGalleryMap[countryCode.toLowerCase()];
  
  if (!galleryPath) {
    notFound();
  }
  
  // Redirect to the appropriate gallery
  redirect(galleryPath);
}

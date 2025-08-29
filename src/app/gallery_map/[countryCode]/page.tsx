import CountryRedirectClient from './CountryRedirectClient';

// This function generates the static paths at build time
export async function generateStaticParams() {
  return [
    { countryCode: 'us' },
    { countryCode: 'ar' },
    { countryCode: 'ch' },
    { countryCode: 'de' },
    { countryCode: 'fr' },
    { countryCode: 'gb' },
    { countryCode: 'cr' },
    { countryCode: 'si' },
    { countryCode: 'at' },
    { countryCode: 'au' },
    { countryCode: 'be' },
    { countryCode: 'gr' }
  ];
}

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

export default function CountryRedirectPage() {
  return <CountryRedirectClient />;
}

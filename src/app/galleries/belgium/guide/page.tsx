import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { belgiumGuide } from '@/data/guides/belgium';

export const metadata: Metadata = pageMetadata({
  title: 'Belgium Travel Guide',
  description: 'Bruges, Ghent & Brussels — medieval towns, canals and beer.',
  path: '/galleries/belgium/guide',
  image: '/img/Belgium/belgium_panorama (4).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function BelgiumGuidePage() {
  const thumbnails = await getWikiThumbnails(
    belgiumGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={belgiumGuide} thumbnails={thumbnails} />;
}

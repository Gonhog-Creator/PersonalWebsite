import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { franceGuide } from '@/data/guides/france';

export const metadata: Metadata = pageMetadata({
  title: 'France Travel Guide',
  description: 'Paris & Strasbourg — museums, cathedrals and canals.',
  path: '/galleries/france/guide',
  image: '/img/France/france_panorama (6).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function FranceGuidePage() {
  const thumbnails = await getWikiThumbnails(
    franceGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={franceGuide} thumbnails={thumbnails} />;
}

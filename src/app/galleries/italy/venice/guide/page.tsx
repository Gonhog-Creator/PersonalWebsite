import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { veniceGuide } from '@/data/guides/italy-venice';

export const metadata: Metadata = pageMetadata({
  title: 'Venice Travel Guide',
  description: 'A canal-city walking guide — islands, bacari and glass.',
  path: '/galleries/italy/venice/guide',
  image: '/img/Italy/Venice/venice-panorama (1).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function VeniceGuidePage() {
  const thumbnails = await getWikiThumbnails(
    veniceGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={veniceGuide} thumbnails={thumbnails} />;
}

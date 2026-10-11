import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { costaRicaGuide } from '@/data/guides/costa-rica';

export const metadata: Metadata = pageMetadata({
  title: 'Costa Rica Travel Guide',
  description: 'Pacific coast, volcanoes & cloud forest — beaches, parks and wildlife.',
  path: '/galleries/costa-rica/guide',
  image: '/img/Costa Rica/panorama-costarica (17).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function CostaRicaGuidePage() {
  const thumbnails = await getWikiThumbnails(
    costaRicaGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={costaRicaGuide} thumbnails={thumbnails} />;
}

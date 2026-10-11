import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { padovaGuide } from '@/data/guides/italy-padova';

export const metadata: Metadata = pageMetadata({
  title: 'Padova Travel Guide',
  description: 'Giotto\'s masterpiece & the university quarter.',
  path: '/galleries/italy/padova/guide',
  image: '/img/Italy/Padova/padova-panorama-1.jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function PadovaGuidePage() {
  const thumbnails = await getWikiThumbnails(
    padovaGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={padovaGuide} thumbnails={thumbnails} />;
}

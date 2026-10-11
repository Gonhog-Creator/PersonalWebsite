import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { scotlandGuide } from '@/data/guides/scotland';

export const metadata: Metadata = pageMetadata({
  title: 'Scotland Travel Guide',
  description: 'Edinburgh, Stirling & the Highlands — castles and glens.',
  path: '/galleries/scotland/guide',
  image: '/img/Scotland/scotland_panorama (3).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function ScotlandGuidePage() {
  const thumbnails = await getWikiThumbnails(
    scotlandGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={scotlandGuide} thumbnails={thumbnails} />;
}

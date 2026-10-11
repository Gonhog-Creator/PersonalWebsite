import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { triesteGuide } from '@/data/guides/italy-trieste';

export const metadata: Metadata = pageMetadata({
  title: 'Trieste Travel Guide',
  description: 'Habsburg elegance on the Adriatic — cafés, castles and the karst.',
  path: '/galleries/italy/trieste/guide',
  image: '/img/Italy/Trieste/trieste-panorama (1).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function TriesteGuidePage() {
  const thumbnails = await getWikiThumbnails(
    triesteGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={triesteGuide} thumbnails={thumbnails} />;
}

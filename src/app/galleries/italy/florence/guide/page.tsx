import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { florenceGuide } from '@/data/guides/italy-florence';

export const metadata: Metadata = pageMetadata({
  title: 'Florence Travel Guide',
  description: 'Renaissance art, markets & the Chianti hills.',
  path: '/galleries/italy/florence/guide',
  image: '/img/Italy/Florence/florence-panorama (1).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function FlorenceGuidePage() {
  const thumbnails = await getWikiThumbnails(
    florenceGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={florenceGuide} thumbnails={thumbnails} />;
}

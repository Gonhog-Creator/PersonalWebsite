import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { bassanoGuide } from '@/data/guides/italy-bassano';

export const metadata: Metadata = pageMetadata({
  title: 'Bassano del Grappa Travel Guide',
  description: 'The wooden bridge town on the Brenta — grappa, castles and Monte Grappa.',
  path: '/galleries/italy/bassano-del-grappa/guide',
  image: '/img/Italy/Bassano/bassano-panorama (1).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function BassanoGuidePage() {
  const thumbnails = await getWikiThumbnails(
    bassanoGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={bassanoGuide} thumbnails={thumbnails} />;
}

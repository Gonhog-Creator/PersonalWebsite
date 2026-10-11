import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { austriaGuide } from '@/data/guides/austria';

export const metadata: Metadata = pageMetadata({
  title: 'Austria Travel Guide',
  description: 'Vienna, Salzburg & Hallstatt — imperial cities and the Salzkammergut lakes.',
  path: '/galleries/austria/guide',
  image: '/img/Austria/austria_panorama (22).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function AustriaGuidePage() {
  const thumbnails = await getWikiThumbnails(
    austriaGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={austriaGuide} thumbnails={thumbnails} />;
}

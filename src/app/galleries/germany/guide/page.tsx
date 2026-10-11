import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { germanyGuide } from '@/data/guides/germany';

export const metadata: Metadata = pageMetadata({
  title: 'Germany Travel Guide',
  description: 'Berlin, Munich & the Bavarian Alps — history, beer gardens and castles.',
  path: '/galleries/germany/guide',
  image: '/img/Germany/germany_panorama (2).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function GermanyGuidePage() {
  const thumbnails = await getWikiThumbnails(
    germanyGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={germanyGuide} thumbnails={thumbnails} />;
}

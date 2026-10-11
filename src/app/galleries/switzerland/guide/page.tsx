import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { switzerlandGuide } from '@/data/guides/switzerland';

export const metadata: Metadata = pageMetadata({
  title: 'Switzerland Travel Guide',
  description: 'Lucerne, the Alps & Zürich — peaks, lakes and chocolate.',
  path: '/galleries/switzerland/guide',
  image: '/img/Switzerland/switzerland_panorama (16).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function SwitzerlandGuidePage() {
  const thumbnails = await getWikiThumbnails(
    switzerlandGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={switzerlandGuide} thumbnails={thumbnails} />;
}

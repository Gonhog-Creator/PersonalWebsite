import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { norwayGuide } from '@/data/guides/norway';

export const metadata: Metadata = pageMetadata({
  title: 'Norway Travel Guide',
  description: 'Oslo, Bergen & the fjords — scenic rail, cruises and peaks.',
  path: '/galleries/norway/guide',
  image: '/img/Norway/norway-panorama (1).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function NorwayGuidePage() {
  const thumbnails = await getWikiThumbnails(
    norwayGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={norwayGuide} thumbnails={thumbnails} />;
}

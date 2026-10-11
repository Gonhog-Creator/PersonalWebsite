import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { sloveniaGuide } from '@/data/guides/slovenia';

export const metadata: Metadata = pageMetadata({
  title: 'Slovenia Travel Guide',
  description: 'Ljubljana & Lake Bled — castles, caves and alpine lakes.',
  path: '/galleries/slovenia/guide',
  image: '/img/Slovenia/slovenia_panorama (8).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function SloveniaGuidePage() {
  const thumbnails = await getWikiThumbnails(
    sloveniaGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={sloveniaGuide} thumbnails={thumbnails} />;
}

import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { finlandGuide } from '@/data/guides/finland';

export const metadata: Metadata = pageMetadata({
  title: 'Finland Travel Guide',
  description: 'A Helsinki city guide — fortress islands, design district and saunas.',
  path: '/galleries/finland/guide',
  image: '/img/Finland/finland-panorama (3).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function FinlandGuidePage() {
  const thumbnails = await getWikiThumbnails(
    finlandGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={finlandGuide} thumbnails={thumbnails} />;
}

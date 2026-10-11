import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { swedenGuide } from '@/data/guides/sweden';

export const metadata: Metadata = pageMetadata({
  title: 'Sweden Travel Guide',
  description: 'Stockholm & the archipelago — islands, museums and fika.',
  path: '/galleries/sweden/guide',
  image: '/img/Sweden/sweden-panorama (1).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function SwedenGuidePage() {
  const thumbnails = await getWikiThumbnails(
    swedenGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={swedenGuide} thumbnails={thumbnails} />;
}

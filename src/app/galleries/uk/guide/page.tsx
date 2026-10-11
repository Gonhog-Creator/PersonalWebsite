import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { ukGuide } from '@/data/guides/uk';

export const metadata: Metadata = pageMetadata({
  title: 'United Kingdom Travel Guide',
  description: 'A London city guide — royal sights, markets and pubs.',
  path: '/galleries/uk/guide',
  image: '/img/United Kingdom/united_kingdom_panorama (2).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function UkGuidePage() {
  const thumbnails = await getWikiThumbnails(
    ukGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={ukGuide} thumbnails={thumbnails} />;
}

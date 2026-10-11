import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { denmarkGuide } from '@/data/guides/denmark';

export const metadata: Metadata = pageMetadata({
  title: 'Denmark Travel Guide',
  description:
    'A Copenhagen travel guide: recommended sights, food spots, and a walking route — with map links for every place.',
  path: '/galleries/denmark/guide',
  image: '/img/Denmark/denmark-panorama (7).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function DenmarkGuidePage() {
  const thumbnails = await getWikiThumbnails(
    denmarkGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={denmarkGuide} thumbnails={thumbnails} />;
}

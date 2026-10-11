import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { uruguayGuide } from '@/data/guides/uruguay';

export const metadata: Metadata = pageMetadata({
  title: 'Uruguay Travel Guide',
  description: 'Montevideo & the Maldonado coast — colonial towns and beach villages.',
  path: '/galleries/uruguay/guide',
  image: '/img/Uruguay/uruguay_panorama (3).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function UruguayGuidePage() {
  const thumbnails = await getWikiThumbnails(
    uruguayGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={uruguayGuide} thumbnails={thumbnails} />;
}

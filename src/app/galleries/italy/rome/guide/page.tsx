import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { romeGuide } from '@/data/guides/italy-rome';

export const metadata: Metadata = pageMetadata({
  title: 'Rome Travel Guide',
  description: 'Ancient ruins & neighborhood trattorias.',
  path: '/galleries/italy/rome/guide',
  image: '/img/Italy/Rome/rome-panorama (1).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function RomeGuidePage() {
  const thumbnails = await getWikiThumbnails(
    romeGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={romeGuide} thumbnails={thumbnails} />;
}

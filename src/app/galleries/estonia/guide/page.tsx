import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { estoniaGuide } from '@/data/guides/estonia';

export const metadata: Metadata = pageMetadata({
  title: 'Estonia Travel Guide',
  description: 'A Tallinn old town guide — medieval walls, viewpoints and markets.',
  path: '/galleries/estonia/guide',
  image: '/img/Estonia/estonia-panorama (2).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function EstoniaGuidePage() {
  const thumbnails = await getWikiThumbnails(
    estoniaGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={estoniaGuide} thumbnails={thumbnails} />;
}

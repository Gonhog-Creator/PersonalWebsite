import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { argentinaGuide } from '@/data/guides/argentina';

export const metadata: Metadata = pageMetadata({
  title: 'Argentina Travel Guide',
  description: 'Buenos Aires, Patagonia & the far south — sights, hikes and map links.',
  path: '/galleries/argentina/guide',
  image: '/img/Argentina/argentina_panorama (10).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function ArgentinaGuidePage() {
  const thumbnails = await getWikiThumbnails(
    argentinaGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={argentinaGuide} thumbnails={thumbnails} />;
}

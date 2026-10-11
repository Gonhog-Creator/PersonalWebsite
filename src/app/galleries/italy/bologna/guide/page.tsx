import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { bolognaGuide } from '@/data/guides/italy-bologna';

export const metadata: Metadata = pageMetadata({
  title: 'Bologna Travel Guide',
  description: 'Porticoes, towers & Italy\'s food capital — markets and the university quarter.',
  path: '/galleries/italy/bologna/guide',
  image: '/img/Italy/Bologna/bologna-panorama(1).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function BolognaGuidePage() {
  const thumbnails = await getWikiThumbnails(
    bolognaGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={bolognaGuide} thumbnails={thumbnails} />;
}

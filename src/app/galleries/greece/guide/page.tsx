import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { greeceGuide } from '@/data/guides/greece';

export const metadata: Metadata = pageMetadata({
  title: 'Greece Travel Guide',
  description: 'Athens & the Dodecanese — ancient sites and island-hopping.',
  path: '/galleries/greece/guide',
  image: '/img/Greece/greece_panorama (5).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function GreeceGuidePage() {
  const thumbnails = await getWikiThumbnails(
    greeceGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={greeceGuide} thumbnails={thumbnails} />;
}

import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { czechRepublicGuide } from '@/data/guides/czech-republic';

export const metadata: Metadata = pageMetadata({
  title: 'Prague Travel Guide',
  description: 'A Prague city guide — castle, old town lanes and beer halls.',
  path: '/galleries/czech-republic/guide',
  image: '/img/Czech Republic/czech-republic-panorama (4).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function CzechRepublicGuidePage() {
  const thumbnails = await getWikiThumbnails(
    czechRepublicGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={czechRepublicGuide} thumbnails={thumbnails} />;
}

import type { Metadata, Viewport } from 'next';
import { pageMetadata } from '@/lib/og';
import { getWikiThumbnails } from '@/lib/wikiThumbs';
import { CountryGuideJournal } from '@/components/Galleries/CountryGuideJournal';
import { australiaGuide } from '@/data/guides/australia';

export const metadata: Metadata = pageMetadata({
  title: 'Australia Travel Guide',
  description: 'Sydney, Melbourne & the Queensland coast — reef, islands and city highlights.',
  path: '/galleries/australia/guide',
  image: '/img/Australia/panorama-australia (10).jpg',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
};

export default async function AustraliaGuidePage() {
  const thumbnails = await getWikiThumbnails(
    australiaGuide.places.map((p) => p.wikiTitle).filter((t): t is string => Boolean(t))
  );
  return <CountryGuideJournal data={australiaGuide} thumbnails={thumbnails} />;
}

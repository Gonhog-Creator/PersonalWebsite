import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Astrophotography',
  description: 'Exploring the cosmos through long exposure photography and deep space imaging.',
  path: '/astrophotography',
  image: '/img/Astro/astro_pano.jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Austria Gallery',
  description: 'Salt mines, mountains, ice caves, palaces, and more castles than you can count.',
  path: '/galleries/austria',
  image: '/img/Austria/austria_panorama (5).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

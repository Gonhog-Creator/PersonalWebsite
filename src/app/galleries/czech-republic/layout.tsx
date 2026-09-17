import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Czech Republic Gallery',
  description: 'Photography from the Czech Republic.',
  path: '/galleries/czech-republic',
  image: '/img/Czech Republic/czech-republic-panorama (4).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

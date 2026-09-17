import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'France Gallery',
  description: 'Photography from France.',
  path: '/galleries/france',
  image: '/img/France/france_panorama (3).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

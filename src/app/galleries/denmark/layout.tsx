import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Denmark Gallery',
  description: 'Photography from Denmark.',
  path: '/galleries/denmark',
  image: '/img/Denmark/denmark-panorama (7).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
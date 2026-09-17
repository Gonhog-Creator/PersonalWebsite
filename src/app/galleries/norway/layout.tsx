import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Norway Gallery',
  description: 'Photography from Norway.',
  path: '/galleries/norway',
  image: '/img/Norway/norway-panorama (5).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
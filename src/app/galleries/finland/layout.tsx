import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Finland Gallery',
  description: 'Photography from Finland.',
  path: '/galleries/finland',
  image: '/img/Finland/finland-panorama (1).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
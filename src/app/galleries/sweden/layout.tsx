import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Sweden Gallery',
  description: 'Photography from Sweden.',
  path: '/galleries/sweden',
  image: '/img/Sweden/sweden-panorama (1).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
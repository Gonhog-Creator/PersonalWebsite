import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Estonia Gallery',
  description: 'Photography from Estonia.',
  path: '/galleries/estonia',
  image: '/img/Estonia/estonia-panorama (2).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
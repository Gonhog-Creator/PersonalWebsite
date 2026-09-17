import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Rome Gallery',
  description: 'Photography from Rome, Italy.',
  path: '/galleries/italy/rome',
  image: '/img/Italy/Rome/rome-panorama (2).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

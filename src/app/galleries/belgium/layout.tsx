import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Belgium Gallery',
  description: 'Belgium offers a fascinating blend of history, culture, and world-renowned cuisine.',
  path: '/galleries/belgium',
  image: '/img/Belgium/belgium_panorama (8).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

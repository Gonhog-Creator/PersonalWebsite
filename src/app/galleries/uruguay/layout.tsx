import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Uruguay Gallery',
  description: 'Photography from Uruguay.',
  path: '/galleries/uruguay',
  image: '/img/Uruguay/uruguay_panorama (3).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

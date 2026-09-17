import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'United Kingdom Gallery',
  description: 'From the vibrant streets and historic landmarks of London to the timeless legacy of Shakespeare.',
  path: '/galleries/uk',
  image: '/img/United Kingdom/united_kingdom_panorama (2).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

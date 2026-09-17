import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Slovenia Gallery',
  description: 'Vintgar Gorge hikes and scenic bike rides through lush landscapes.',
  path: '/galleries/slovenia',
  image: '/img/Slovenia/slovenia_panorama (4).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Scotland Gallery',
  description: "Backpacking through Scotland's rain-soaked landscapes and the historic charm of St Andrews.",
  path: '/galleries/scotland',
  image: '/img/Scotland/scotland_panorama (1).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Carousel Gallery',
  description: 'A fullscreen rotating carousel of my photography.',
  path: '/carousel_gallery',
  image: '/img/USA/panorama-USA-1.JPG',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

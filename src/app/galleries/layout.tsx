import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';
import { GallerySpacer } from '@/components/Galleries/GallerySpacer';

export const metadata: Metadata = pageMetadata({
  title: 'Photo Galleries',
  description: 'Travel photography from around the world.',
  path: '/galleries',
  image: '/img/USA/panorama-USA-1.JPG',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Spacer matching the fixed header height so page heroes sit below it (hidden on /guide pages) */}
      <GallerySpacer />
      {children}
    </>
  );
}

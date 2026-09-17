import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Photo Galleries',
  description: 'Travel photography from around the world.',
  path: '/galleries',
  image: '/img/USA/panorama-USA-1.JPG',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

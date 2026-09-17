import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Delta V Ballistics',
  description: 'Ballistic armor certification and international testing.',
  path: '/projects/deltav-ballistics',
  image: '/img/deltavcoverimage.jpg',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

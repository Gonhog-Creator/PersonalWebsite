import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Costa Rica Gallery',
  description: 'Immense jungle, vibrant culture, and beautiful coastlines.',
  path: '/galleries/costa-rica',
  image: '/img/Costa Rica/panorama-costarica (7).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Switzerland Gallery',
  description: 'Towering peaks and alpine charm in Grindelwald, where majestic mountains meet serene valleys.',
  path: '/galleries/switzerland',
  image: '/img/Switzerland/switzerland_panorama (17).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'My Best Photos',
  description: 'A collection of my favorite photographs.',
  path: '/galleries/bests',
  image: '/img/Best/Panoramas/panoramas (42).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

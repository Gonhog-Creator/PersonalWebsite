import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Argentina Gallery',
  description: 'Photography from Argentina.',
  path: '/galleries/argentina',
  image: '/img/Argentina/argentina_panorama (3).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Bologna Gallery',
  description: 'Photography from Bologna, Italy.',
  path: '/galleries/italy/bologna',
  image: '/img/Italy/Bologna/bologna-panorama(6).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

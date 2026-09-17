import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Trieste Gallery',
  description: 'Photography from Trieste, Italy.',
  path: '/galleries/italy/trieste',
  image: '/img/Italy/Trieste/trieste-panorama (9).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

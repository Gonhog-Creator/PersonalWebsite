import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Bassano Del Grappa Gallery',
  description: 'Photography from Bassano del Grappa, Italy.',
  path: '/galleries/italy/bassano-del-grappa',
  image: '/img/Italy/Bassano/bassano-panorama (2).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Padova Gallery',
  description: 'Photography from Padova, Italy.',
  path: '/galleries/italy/padova',
  image: '/img/Italy/Padova/padova-panorama-1.jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

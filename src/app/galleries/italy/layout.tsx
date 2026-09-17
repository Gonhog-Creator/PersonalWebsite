import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Italy Gallery',
  description: 'Photography from Italy.',
  path: '/galleries/italy',
  image: '/img/Italy/Venice/venice-panorama (7).jpg',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

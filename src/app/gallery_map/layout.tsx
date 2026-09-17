import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Gallery Map',
  description: 'An interactive world map of my travel photography.',
  path: '/gallery_map',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

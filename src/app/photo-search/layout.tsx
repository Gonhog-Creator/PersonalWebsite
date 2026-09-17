import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Photo Search',
  description: 'Search my photo collection.',
  path: '/photo-search',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

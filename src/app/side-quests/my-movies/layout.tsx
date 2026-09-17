import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Movie Masterclass',
  description: 'A running log of the movies I watch.',
  path: '/side-quests/my-movies',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

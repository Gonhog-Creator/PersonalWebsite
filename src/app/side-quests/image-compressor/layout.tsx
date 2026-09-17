import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Image Compressor',
  description: 'Compress images locally in your browser.',
  path: '/side-quests/image-compressor',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

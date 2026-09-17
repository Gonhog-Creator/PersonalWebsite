import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Fractals',
  description: 'Interactive fractal and chaos theory visualizations.',
  path: '/projects/fractals',
  image: '/img/projects/fractals/fractalcover.jpg',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

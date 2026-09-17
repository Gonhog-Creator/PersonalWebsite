import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Wolfspeed',
  description: 'Process Engineering Intern & Co-op at Wolfspeed, Durham NC.',
  path: '/projects/wolfspeed',
  image: '/img/Wolfspeed/cleanroom (1).jpg',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'NC State Liquid Rocketry Lab',
  description: 'Liquid rocketry research and development at NC State.',
  path: '/side-quests/ncsu-rocketry',
  image: '/img/projects/RDE/RDRE Main Background.jpg',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

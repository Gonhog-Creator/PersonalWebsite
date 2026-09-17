import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Evolution Sim Devblog',
  description:
    'Devblog for Evolution Sim, a simulator where neural network creatures evolve over generations.',
  path: '/side-quests/evolution-sim',
});

export default function EvolutionSimLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

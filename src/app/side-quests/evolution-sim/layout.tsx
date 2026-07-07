import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Evolution Sim | Devblog',
  description:
    'Devblog for Evolution Sim, a simulator where neural network creatures evolve over generations.',
};

export default function EvolutionSimLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

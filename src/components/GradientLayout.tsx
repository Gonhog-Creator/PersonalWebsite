'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import the GradientStyles component with no SSR
const GradientStyles = dynamic(
  () => import('./GradientStyles'),
  { ssr: false }
);

export default function GradientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GradientStyles />
      <div className="gradient-animated">
        {children}
      </div>
    </>
  );
}

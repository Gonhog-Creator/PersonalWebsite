'use client';

import React, { Suspense } from 'react';
import { FractalExplorer } from '@/components/fractals/explorer/FractalExplorer';

export default function ExplorePage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <FractalExplorer />
    </Suspense>
  );
}

'use client';

import { usePathname } from 'next/navigation';

// Spacer matching the fixed header height so gallery heroes sit below it.
// Guide pages use the light journal layout and don't want the dark band.
export function GallerySpacer() {
  const pathname = usePathname();
  if (pathname?.endsWith('/guide')) return null;
  return <div className="h-36 bg-gray-900" aria-hidden="true" />;
}

'use client';

import Link from 'next/link';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';

export default function PhotoSearch() {
  return (
    <div className="min-h-screen bg-gray-900">
      <ProjectHeader />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Photo Search</h1>
        <p className="text-gray-400 text-lg mb-8">Page building is in progress, check back later</p>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

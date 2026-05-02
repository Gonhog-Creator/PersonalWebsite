'use client';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Loading Estonia Gallery...',
  description: 'Loading Estonia photo gallery with medieval charm and digital innovation.',
};

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Estonia Gallery</h1>
        <p className="text-gray-600 dark:text-gray-400">Preparing medieval charm and Baltic beauty...</p>
        <div className="mt-8">
          <div className="inline-block animate-pulse rounded bg-gray-200 dark:bg-gray-700 h-2 w-32 mx-1"></div>
        </div>
      </div>
    </div>
  );
}

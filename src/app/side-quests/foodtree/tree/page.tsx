'use client';

import { FoodTree3D } from '../components/FoodTree3D';
import { useRouter } from 'next/navigation';

export default function FoodTreePage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen">
      {/* Close button */}
      <button 
        onClick={() => router.push('/side-quests/foodtree')}
        className="absolute top-4 left-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        aria-label="Close"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
      
      {/* 3D Tree */}
      <div className="w-full h-full">
        <FoodTree3D />
      </div>
    </div>
  );
}

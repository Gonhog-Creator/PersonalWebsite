export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="relative h-[70vh] w-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="h-12 bg-gray-300 rounded-full w-3/4 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 rounded-full w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-16">
        {/* Button Skeletons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-gray-200 aspect-[4/3] rounded-lg animate-pulse"
              style={{
                animationDelay: `${i * 0.05}s`,
                animationDuration: '1.5s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

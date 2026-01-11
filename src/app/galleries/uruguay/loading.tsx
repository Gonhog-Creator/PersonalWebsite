export default function Loading() {
  // Create an array of 12 skeleton items
  const skeletonItems = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="relative h-[70vh] w-full bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto mb-8"></div>
            <div className="h-10 bg-blue-600 rounded-md w-40 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Gallery Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap -ml-4">
            {skeletonItems.map((item) => (
              <div key={item} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8">
                <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[4/3] animate-pulse"></div>
                <div className="mt-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Food Tree - Version Updates',
  description: 'Version history and updates for the Food Tree Project',
};

const updates = [
  {
    version: '1.1.1',
    date: 'November 20, 2025',
    title: 'Update Page',
    type: 'enhancement',
    changes: [
      'Added Update Page for Food Tree Project',
      'Minor Fixes'
    ]
  },
  {
    version: '1.1.0',
    date: 'November 20, 2025',
    title: 'Improved Data Management',
    type: 'enhancement',
    changes: [
      'Standardized submission data structure',
      'Enhanced data validation and cleanup',
      'Improved error handling and user feedback',
      'Updated Admin Page for cleanliness'
      'Reorganized Ingredient submission typed to Animal, Plant, Other, and Processed',
      'Animal submission now offers Animal Product vs Source Animal'
    ]
  },
  {
    version: '1.0.0',
    date: 'November 10, 2025',
    title: 'Initial Release',
    type: 'launch',
    changes: [
      'Basic food tree visualization',
      'Ingredient submission system',
      'Main Page Creation',
      'Tile Added to Side Quests'
    ]
  }
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'launch':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'enhancement':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'fix':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export default function VersionUpdates() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <Link 
            href="/side-quests/foodtree" 
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors mb-8"
          >
            ← Back to Food Tree
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Version Updates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stay updated with the latest features, improvements, and fixes for the Food Tree Project.
          </p>
        </div>

        <div className="w-full">
          {updates.map((update, index) => (
            <div key={update.version} className="w-full">
              {index > 0 && <div className="h-16 w-full" />}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md w-full">
                <div className="p-6 sm:p-8">
                  <div className="px-4 sm:px-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="mb-2">
                        <span className="text-lg font-mono font-medium text-gray-700 dark:text-gray-300">
                          v{update.version}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {update.date}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                      {update.title}
                    </h2>
                    
                    <div className="space-y-4">
                      {update.changes.map((change, i) => (
                        <div key={i} className="flex items-start">
                          <span className="text-gray-500 dark:text-gray-400 mr-3 mt-1">-</span>
                          <span className="text-gray-700 dark:text-gray-300">{change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Have questions or feedback?{' '}
            <a 
              href="mailto:josemaria.barbeito@icloud.com"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

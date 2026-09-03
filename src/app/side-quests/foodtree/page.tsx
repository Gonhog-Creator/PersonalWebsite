'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CubeIcon } from '@heroicons/react/24/outline';
import { SubmissionProvider, useSubmissions } from './contexts/SubmissionContext';
import { getLatestUpdate } from './utils/updates';
import { SilverBorderButton } from '@/components/ui/SilverBorderButton';
import { AddIngredientForm } from './components/AddIngredientForm';
import { AddDishForm } from './components/AddDishForm';
import { SubmissionQueue } from './components/SubmissionQueue';
import { SuccessMessage } from './components/SuccessMessage';

const FoodTreePage = () => {
  return (
    <SubmissionProvider>
      <FoodTreeContent />
    </SubmissionProvider>
  );
};

type TabId = 'explore' | 'add-ingredient' | 'add-dish' | 'my-submissions';

const FoodTreeContent = () => {
  const [activeTab, setActiveTab] = useState<TabId>('explore');
  const { success, setSuccess } = useSubmissions();

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/#sideprojects"
          className="inline-flex items-center px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-all hover:shadow-lg border border-gray-700"
        >
          ← Back to Projects
        </Link>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto flex justify-center mt-8">
          <div className="text-center w-full">
            <motion.div
              className="mb-12 flex flex-col items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Food Taxonomy
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-gray-300 sm:mt-4">
                Discover and contribute to my growing database of ingredients and their culinary connections
              </p>
            </motion.div>
          </div>
        </div>

        <div className="w-full flex justify-center mb-16">
          <nav className="flex flex-wrap justify-center gap-8" aria-label="Tabs">
            {[
              { id: 'explore', name: 'Explore', icon: '🌳' },
              { id: 'add-ingredient', name: 'Add Ingredient', icon: '➕' },
              { id: 'add-dish', name: 'Add Dish', icon: '🍽️' },
              { id: 'my-submissions', name: 'My Submissions', icon: '📋' },
            ].map((tab) => (
              <SilverBorderButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center justify-center space-x-4 text-base font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-900/30 text-indigo-200'
                    : 'text-gray-300 hover:bg-gray-800/50'
                }`}
                width="200px"
                height="50px"
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline text-lg">{tab.name}</span>
              </SilverBorderButton>
            ))}
          </nav>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          key={activeTab}
          className="w-full flex flex-col items-center"
        >
          {activeTab === 'explore' && (
            <div className="w-full p-6 md:p-8 flex justify-center">
              <div className="w-full max-w-3xl text-center">
                <div className="w-full h-96 bg-gray-700 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 z-0" />
                  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-5xl mb-4">🌐</div>
                    <h3 className="text-xl font-semibold text-white mb-4">3D Food Tree Explorer</h3>
                    <p className="text-gray-300 mb-6">Navigate through an interactive 3D visualization of all ingredients and dishes</p>
                    <a
                      href="/side-quests/foodtree/tree"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/side-quests/foodtree/tree';
                      }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 relative z-20 no-underline"
                    >
                      <CubeIcon className="h-5 w-5" />
                      Launch 3D Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add-ingredient' && (
            <div className="w-full p-6 md:p-8 flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Add New Ingredient</h2>
                  <p className="text-gray-300 mb-6">
                    Contribute to our growing database of ingredients. All submissions are reviewed before being added.
                  </p>
                </div>
                <div className="w-full bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <AddIngredientForm />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add-dish' && (
            <div className="w-full p-6 md:p-8 flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Add New Dish</h2>
                  <p className="text-gray-300 mb-6">
                    Submit a dish with its ingredients and cooking details. All submissions are reviewed before being added.
                  </p>
                </div>
                <div className="w-full bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <AddDishForm />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-submissions' && (
            <div className="w-full p-6 md:p-8 flex justify-center">
              <div className="w-full max-w-4xl">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-white">My Submissions</h2>
                  <p className="text-gray-300">Track the status of your contributions</p>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <SubmissionQueue />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400">
            Have suggestions or found a bug?{' '}
            <a
              href="mailto:josemaria.barbeito@icloud.com"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Let me know!
            </a>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            <Link
              href="/side-quests/foodtree/updates"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Version {getLatestUpdate().version}
            </Link>
            {' '}· Last updated {getLatestUpdate().date.split(',')[0]}
          </p>
        </div>
      </div>

      {success && (
        <SuccessMessage
          message={success.message}
          itemName={success.itemName}
          onDismiss={() => setSuccess(null)}
        />
      )}
    </>
  );
};

export default FoodTreePage;

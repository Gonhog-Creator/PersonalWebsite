'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { FormInput } from './FormInput';
import { useSubmissions } from '../contexts/SubmissionContext';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-submit';
import IngredientSearch from './IngredientSearch';

const PREPARATION_METHODS = [
  'chopped',
  'diced',
  'sliced',
  'minced',
  'grated',
  'crushed',
  'mashed',
  'blended',
  'juiced',
  'peeled',
  'cored',
  'pitted',
  'toasted',
  'roasted',
  'steamed',
  'boiled',
  'deep fried',
  'pan-fried',
  'baked',
  'grilled',
  'pressed',
  'separated',
  'mixed',
  'whisked'
] as const;

const ingredientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  source: z.enum(['grown', 'gathered', 'prepared']),
  preparationMethod: z.enum([...PREPARATION_METHODS]).optional(),
  parentIngredients: z.array(z.string()).optional(),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

export function AddIngredientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentIngredients, setParentIngredients] = useState<string[]>(['']);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [userName, setUserName] = useLocalStorage<string>('foodtree-username', '');
  const { addSubmission } = useSubmissions();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      source: 'grown',
      nutritionalInfo: {},
    },
  });

  const source = watch('source');

  const handleAddIngredient = () => {
    if (parentIngredients.filter(Boolean).length < 3) {
      setParentIngredients(prev => [...prev, '']);
    }
  };

  const handleIngredientSelect = (ingredient: string, index: number) => {
    const newIngredients = [...parentIngredients];
    newIngredients[index] = ingredient;
    setParentIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...parentIngredients];
    newIngredients.splice(index, 1);
    setParentIngredients(newIngredients.length ? newIngredients : ['']);
  };

  const onSubmit = async (data: IngredientFormData) => {
    try {
      if (!userName) {
        toast.error('Please enter your name');
        return;
      }
      
      setDuplicateError(null);
      setIsSubmitting(true);
      
      await addSubmission('ingredient', {
        ...data,
        parentIngredients: parentIngredients.filter(Boolean),
        submittedBy: userName
      });
      
      reset();
      setParentIngredients(['']);
      toast.success('Ingredient submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        setDuplicateError(error.message);
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to submit ingredient');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter your name"
          required
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your name will be saved locally and included with your submission.
        </p>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ingredient Name <span className="text-red-500">*</span>
        </label>
        <div className="w-full">
          <FormInput
            hideLabel={true}
            {...register('name')}
            error={errors.name}
            placeholder="e.g., Garlic, Olive Oil, Chopped Onion"
            required
            className="text-center text-lg w-full"
          />
        </div>
      </div>
      
      <div className="h-8"></div> {/* Spacer */}
      
      {/* Source Section */}
      <div>
        <label className="block text-2xl font-medium text-center text-gray-700 dark:text-gray-300 mb-3">
          Source
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {[
            { value: 'grown', label: ' Grown' },
            { value: 'gathered', label: ' Gathered' },
            { value: 'prepared', label: ' Prepared' },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                value={option.value}
                className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                {...register('source')}
              />
              <span className="ml-2 text-2xl text-center text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.source && (
          <p className="mt-1 text-2xl text-center text-red-600 dark:text-red-400">
            {errors.source.message}
          </p>
        )}
      </div>

      {source === 'prepared' && (
        <div className="pt-4">
          <div className="space-y-8">
            <div>
              <div className="h-4"></div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preparation Method
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4 justify-items-center">
                {PREPARATION_METHODS.map((method) => (
                  <label key={method} className="flex items-center">
                    <input
                      type="radio"
                      value={method}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      {...register('preparationMethod')}
                    />
                    <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.preparationMethod && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-center">
                  {errors.preparationMethod.message}
                </p>
              )}
            </div>
            <div className="h-4"></div>
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                Parent Ingredients
              </label>
              <div className="w-full flex justify-center">
                <div className="space-y-4 w-full max-w-md">
                  {/* Display selected parent ingredients */}
                  {parentIngredients.filter(Boolean).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {parentIngredients.filter(Boolean).map((ingredient, index) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          <span className="mr-2">{ingredient}</span>
                          <button
                            type="button"
                            onClick={() => removeIngredient(parentIngredients.indexOf(ingredient))}
                            className="text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
                            aria-label="Remove ingredient"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search box for adding new parent ingredients */}
                  {parentIngredients.filter(Boolean).length < 3 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-grow">
                        <IngredientSearch
                          onSelect={(ingredient) => {
                            const filteredIngredients = parentIngredients.filter(Boolean);
                            if (filteredIngredients.length >= 3) {
                              toast.error('Maximum of 3 parent ingredients allowed');
                              return;
                            }
                            const newIngredients = [...parentIngredients];
                            const emptyIndex = newIngredients.findIndex(i => !i);
                            if (emptyIndex >= 0) {
                              newIngredients[emptyIndex] = ingredient;
                            } else {
                              newIngredients.push(ingredient);
                            }
                            // Only add a new empty slot if we're under the limit
                            if (filteredIngredients.length < 2) {
                              setParentIngredients([...newIngredients, '']);
                            } else {
                              setParentIngredients(newIngredients);
                            }
                          }}
                          selectedIngredients={parentIngredients.filter(Boolean)}
                          placeholder={
                            parentIngredients.filter(Boolean).length === 0 
                              ? "Search for a parent ingredient..." 
                              : "Add another parent ingredient..."
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="h-16"></div> {/* Spacer */}
      
      {/* Submit Button */}
      <div className="flex justify-center pb-8">
        <div className="space-y-2">
          <InteractiveHoverButton 
            type="submit" 
            className="w-64 text-lg" 
            disabled={isSubmitting}
            text={isSubmitting ? 'Submitting...' : 'Submit'}
          />
          {duplicateError && (
            <div className="text-center text-sm text-red-600 dark:text-red-400 transition-opacity duration-300">
              {duplicateError}
            </div>
          )}
        </div>
      </div>
      <div className="h-4"></div>
    </form>
  );
}

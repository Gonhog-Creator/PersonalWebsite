'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { containsProfanity } from '@/lib/profanityFilter';
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

// Custom validation for profanity
const validateNoProfanity = (value: string, fieldName: string) => {
  if (value && containsProfanity(value)) {
    return `${fieldName} contains inappropriate language`;
  }
  return true;
};

const ingredientSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .refine(val => !containsProfanity(val), {
      message: 'Name contains inappropriate language',
    }),
  source: z.enum(['plant', 'animal', 'other', 'prepared']),
  animalType: z.string()
    .optional()
    .refine(val => !val || !containsProfanity(val), {
      message: 'Animal type contains inappropriate language',
    }),
  isSourceAnimal: z.boolean().default(false),
  preparationMethod: z.enum([...PREPARATION_METHODS])
    .optional()
    .refine(val => !val || !containsProfanity(val), {
      message: 'Preparation method contains inappropriate language',
    }),
  parentIngredients: z.array(
    z.string().refine(val => !containsProfanity(val), {
      message: 'Ingredient contains inappropriate language',
    })
  ).optional(),
}).superRefine((data, ctx) => {
  // Only validate animalType if source is 'animal' and not a source animal
  if (data.source === 'animal' && !data.isSourceAnimal && (!data.animalType || data.animalType.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a Source Animal',
      path: ['animalType']
    });
  }
  
  // Only validate parentIngredients if source is 'prepared'
  if (data.source === 'prepared' && (!data.parentIngredients || !data.parentIngredients.some(ing => ing.trim() !== ''))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one parent ingredient is required for prepared items',
      path: ['parentIngredients']
    });
  }
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

export function AddIngredientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentIngredients, setParentIngredients] = useState<string[]>(['']);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [userName, setUserName] = useLocalStorage<string>('foodtree-username', '');
  const [animalProducts, setAnimalProducts] = useState<Array<{name: string, isSource: boolean}>>([]);
  const { addSubmission } = useSubmissions();
  
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      source: 'plant',
      isSourceAnimal: false, // Default to Animal Product (false)
    },
  });

  const source = watch('source');
  const isSourceAnimal = watch('isSourceAnimal');
  
  // Fetch source animals when source is 'animal'
  useEffect(() => {
    const fetchSourceAnimals = async () => {
      if (source === 'animal') {
        try {
          // Fetch all ingredients and filter for source animals
          const response = await fetch('/api/foodtree/ingredients');
          if (!response.ok) {
            throw new Error('Failed to fetch ingredients');
          }
          
          const ingredients = await response.json();
          
          // Filter for source animals (where source is 'animal' and isSourceAnimal is true)
          const sourceAnimals = ingredients.filter((ingredient: any) => 
            (ingredient.source === 'animal' || ingredient.foodType === 'animal') && 
            ingredient.isSourceAnimal === true
          );
          
          setAnimalProducts(sourceAnimals.map((animal: any) => ({
            id: animal.id,
            name: animal.name,
            isSource: true
          })));
          
        } catch (error) {
          console.error('Error fetching source animals:', error);
          toast.error('Failed to load animal types');
          setAnimalProducts([]);
        }
      } else {
        setAnimalProducts([]);
      }
    };
    
    fetchSourceAnimals();
  }, [source]);

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

  useEffect(() => {
    const validIngredients = parentIngredients.filter(ing => ing && ing.trim() !== '');
    setValue('parentIngredients', validIngredients, { shouldValidate: true });
  }, [parentIngredients, setValue]);

  const onError = (errors: any) => {
    console.error('Form validation errors:', errors);
    
    // Check for name field error which could be profanity-related
    if (errors.name?.message?.includes('inappropriate language')) {
      toast.error('Ingredient not submitted due to inappropriate language');
    } else {
      toast.error('Please fix the form errors before submitting');
    }
  };

  const onSubmit = async (data: IngredientFormData) => {
    console.log('Form submission started', { data });
    
    // Check for profanity in the name
    if (containsProfanity(data.name)) {
      toast.error('Ingredient not submitted due to inappropriate language');
      return;
    }

    try {
      console.log('Starting form submission', { data, parentIngredients });
      // Filter out any empty parent ingredients
      const validParentIngredients = parentIngredients.filter(ing => ing && ing.trim() !== '');
      console.log('Filtered parent ingredients:', validParentIngredients);
      
      // Validate parent ingredients for prepared items
      if (data.source === 'prepared') {
        console.log('Validating prepared item with parent ingredients:', validParentIngredients);
        if (validParentIngredients.length === 0) {
          console.log('Validation failed: No parent ingredients selected');
          toast.error('Please select at least one parent ingredient');
          return;
        }
        if (!data.preparationMethod) {
          console.log('Validation failed: No preparation method selected');
          toast.error('Please select a preparation method');
          return;
        }
      }

      // Prepare submission data
      const submissionData: any = {
        name: data.name.trim(),
        source: data.source,
        submittedBy: userName || 'Anonymous',
        timestamp: new Date().toISOString(),
      };
      
      // Add type-specific fields
      if (data.source === 'prepared') {
        submissionData.parentIngredients = validParentIngredients;
        submissionData.preparationMethod = data.preparationMethod;
      } else if (data.source === 'animal') {
        submissionData.isSourceAnimal = data.isSourceAnimal;
        if (!data.isSourceAnimal && data.animalType) {
          submissionData.animalType = data.animalType;
          submissionData.parentIngredients = [data.animalType];
        }
      } else if (data.source === 'prepared') {
        submissionData.preparationMethod = data.preparationMethod;
        submissionData.parentIngredients = parentIngredients.filter(Boolean);
      }

      console.log('Prepared submission data:', submissionData);
      
      try {
        console.log('Calling addSubmission with type: ingredient');
        const result = await addSubmission('ingredient', submissionData);
        console.log('addSubmission result:', result);
        
        // Show success message
        toast.success('Ingredient submitted successfully!');
      } catch (error) {
        console.error('Error in addSubmission:', error);
        throw error; // Re-throw to be caught by the outer catch block
      }
      
      // Reset form
      reset({
        name: '',
        source: 'plant',
        animalType: undefined,
        isSourceAnimal: false,
        preparationMethod: undefined,
        parentIngredients: [],
      });
      setParentIngredients(['']);
      
    } catch (error) {
      console.error('Error submitting ingredient:', error);
      if (error instanceof Error) {
        // Handle the specific error message from the server
        if (error.message.includes('Ingredient "') && error.message.includes('" already exists')) {
          // Extract the ingredient name from the error message
          const ingredientName = error.message.match(/Ingredient \"([^\"]+)\"/)?.[1] || 'This item';
          toast.error(`${ingredientName} already exists in the database.`);
        } else if (error.message.includes('duplicate') || error.message.includes('already exists')) {
          // Fallback for any other duplicate/conflict errors
          toast.error('This item already exists in the database.');
        } else {
          // Generic error for all other cases
          toast.error('Failed to submit. Please try again.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (values: any) => {
    // 1. Check for missing name
    if (!values.name?.trim()) {
      toast.error('Please enter a name for the ingredient');
      return false;
    }
    
    // 2. Validate based on source type
    if (values.source === 'animal' && !values.isSourceAnimal) {
      if (!values.animalType?.trim()) {
        toast.error('Please select a Source Animal');
        return false;
      }
    } 
    
    // 3. Validate prepared items
    if (values.source === 'prepared') {
      const validIngredients = parentIngredients.filter(ing => ing?.trim());
      if (validIngredients.length === 0) {
        toast.error('Please add at least one parent ingredient');
        return false;
      }
      if (!values.preparationMethod) {
        toast.error('Please select a preparation method');
        return false;
      }
    }
    
    return true;
  };

  const checkForDuplicates = async (ingredientName: string) => {
    if (!ingredientName) return;
    
    try {
      const response = await fetch(`/api/foodtree/ingredients?search=${encodeURIComponent(ingredientName.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error checking for duplicates:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        // Don't block submission if there's an error checking for duplicates
        return;
      }
      
      const result = await response.json();
      
      // Check if any ingredient name matches (case insensitive)
      const normalizedInput = ingredientName.trim().toLowerCase();
      const duplicate = result.some((item: any) => 
        item.name && item.name.trim().toLowerCase() === normalizedInput
      );
      
      if (duplicate) {
        throw new Error(`"${ingredientName}" already exists in the database.`);
      }
    } catch (error) {
      console.error('Error in checkForDuplicates:', error);
      // Only re-throw if it's our duplicate error
      if (error instanceof Error && error.message.includes('already exists')) {
        throw error;
      }
      // For other errors, log but don't block submission
      console.log('Non-blocking error during duplicate check, continuing with submission');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Already submitting, ignoring');
      return;
    }
    
    setIsSubmitting(true);
    setDuplicateError(null);
    
    try {
      // Get current form values
      const formValues = getValues();
      const ingredientName = formValues.name?.trim();
      
      // 1. Basic validation (name, required fields)
      if (!validateForm(formValues)) {
        return;
      }
      
      // 2. Check for duplicates
      await checkForDuplicates(ingredientName);
      
      // 3. Ensure parentIngredients are up to date
      const validIngredients = parentIngredients.filter(ing => ing?.trim());
      if (formValues.source === 'prepared' && validIngredients.length === 0) {
        toast.error('Please add at least one parent ingredient');
        return;
      }
      setValue('parentIngredients', validIngredients, { shouldValidate: true });
      
      // 4. If we get here, all validations passed - submit the form
      console.log('All validations passed, submitting form');
      await handleSubmit(onSubmit)(e);
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof Error) {
        if (error.message.includes('duplicate') || error.message.includes('already exists')) {
          toast.error(error.message);
        } else if (!error.message.includes('User aborted a request')) {
          toast.error('An error occurred. Please try again.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
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
        <div className="flex flex-col items-center gap-4">
          {/* First row with Plant, Animal, Other */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'plant', label: ' 🌱 Plant' },
              { value: 'animal', label: ' 🐄 Animal' },
              { value: 'other', label: ' 🧂 Other' },
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
          
          {/* Second row with Prepared centered */}
          <div className="flex justify-center w-full">
            <label className="flex items-center">
              <input
                type="radio"
                value="prepared"
                className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                {...register('source')}
              />
              <span className="ml-2 text-2xl text-center text-gray-700 dark:text-gray-300">
                🍳 Prepared
              </span>
            </label>
          </div>

          {/* Animal Type Selection - Only show when source is 'animal' */}
          {watch('source') === 'animal' && (
            <div className="w-full mt-4">
              <div className="text-center gap-4">
              </div>
              <div className="flex justify-center gap-4">
                <div className={`flex-1 max-w-md p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                  !isSourceAnimal ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}>
                  <label className="flex items-center justify-center cursor-pointer">
                    <input
                      type="radio"
                      value="product"
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      checked={!isSourceAnimal}
                      onChange={() => {
                        // Only validate if source is 'animal'
                        const shouldValidate = source === 'animal';
                        setValue('isSourceAnimal', false, { shouldValidate });
                        if (shouldValidate) {
                          trigger('animalType');
                        }
                      }}
                    />
                    <span className="ml-2 text-lg">Animal Product</span>
                  </label>
                </div>
                <div className={`flex-1 max-w-md p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                  isSourceAnimal ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}>
                  <label className="flex items-center justify-center cursor-pointer">
                    <input
                      type="radio"
                      value="source"
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      checked={isSourceAnimal}
                      onChange={() => {
                        // Only validate if source is 'animal'
                        const shouldValidate = source === 'animal';
                        setValue('isSourceAnimal', true, { shouldValidate });
                        setValue('animalType', undefined, { shouldValidate });
                        if (shouldValidate) {
                          trigger('animalType');
                        }
                      }}
                    />
                    <span className="ml-2 text-lg">Source Animal</span>
                  </label>
                </div>
              </div>
            <div className="h-4"></div> {/* Spacer */}
              {source === 'animal' && !isSourceAnimal && (
                <div className="mt-6">
                  <div className="text-center mb-4">
                    <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Source Animal
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {animalProducts.length > 0 ? (
                      <div className="flex flex-col items-center gap-2">
                        {animalProducts.map((animal) => (
                          <label 
                            key={animal.id} 
                            className="w-full max-w-md flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              value={animal.name}
                              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              {...register('animalType', { required: 'Please select a source animal' })}
                            />
                            <span className="ml-3 text-gray-900 dark:text-gray-100">
                              {animal.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No source animals found. Please add a source animal first.
                      </p>
                    )}
                  </div>
                  
                  {/* Error message removed from here to prevent duplicate messages */}
                </div>
              )}
            </div>
          )}
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
              <div className="text-center mb-4">
                <label className="block text-2xl font-medium text-gray-700 dark:text-gray-300">
                  Preparation Method
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
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
              <div className="text-center mb-4">
                <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                  Parent Ingredients <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select 1-3 parent ingredients
                </p>
              </div>
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
        <div className="space-y-2 w-full max-w-xs">
          <InteractiveHoverButton 
            type="submit"
            className={cn(
              'w-full py-4 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full transition-all duration-200',
              isSubmitting && 'cursor-not-allowed opacity-80'
            )}
            text={isSubmitting ? 'Submitting...' : 'Submit Ingredient'}
            disabled={isSubmitting}
            onClick={(e) => {
              console.log('Submit button clicked', { 
                event: e, 
                isSubmitting,
                formData: watch(),
                parentIngredients
              });
            }}
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

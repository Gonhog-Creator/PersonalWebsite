'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'react-hot-toast';
import { containsProfanity } from '@/lib/profanityFilter';
import { FormInput } from './FormInput';
import { useSubmissions } from '../contexts/SubmissionContext';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-submit';
import IngredientSearch from './IngredientSearch';

const PREPARATION_METHODS = [
  'chopped', 'diced', 'sliced', 'minced', 'grated', 'crushed',
  'mashed', 'blended', 'juiced', 'peeled', 'cored', 'pitted',
  'toasted', 'roasted', 'steamed', 'boiled', 'deep fried',
  'pan-fried', 'baked', 'grilled', 'pressed', 'separated',
  'mixed', 'whisked',
] as const;

export function AddIngredientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [source, setSource] = useState<'plant' | 'animal' | 'other' | 'prepared'>('plant');
  const [isSourceAnimal, setIsSourceAnimal] = useState(false);
  const [animalType, setAnimalType] = useState('');
  const [preparationMethod, setPreparationMethod] = useState('');
  const [parentIngredients, setParentIngredients] = useState<string[]>([]);
  const [userName, setUserName] = useLocalStorage<string>('foodtree-username', '');
  const [animalProducts, setAnimalProducts] = useState<Array<{ id?: string; name: string }>>([]);
  const { addSubmission } = useSubmissions();

  // Fetch source animals when source is 'animal'
  useEffect(() => {
    if (source !== 'animal') {
      setAnimalProducts([]);
      return;
    }
    const fetchSourceAnimals = async () => {
      try {
        const response = await fetch('/api/foodtree/ingredients');
        if (!response.ok) return;
        const ingredients = await response.json();
        const sourceAnimals = ingredients.filter((ing: { source: string; is_source_animal: boolean }) =>
          ing.source === 'animal' && ing.is_source_animal === true
        );
        setAnimalProducts(sourceAnimals.map((a: { id: string; name: string }) => ({ id: a.id, name: a.name })));
      } catch {
        setAnimalProducts([]);
      }
    };
    fetchSourceAnimals();
  }, [source]);

  const handleAddParent = (ingredient: string) => {
    if (parentIngredients.length >= 5) {
      toast.error('Maximum of 5 parent ingredients allowed');
      return;
    }
    if (!parentIngredients.includes(ingredient)) {
      setParentIngredients([...parentIngredients, ingredient]);
    }
  };

  const handleRemoveParent = (ingredient: string) => {
    setParentIngredients(parentIngredients.filter(i => i !== ingredient));
  };

  const resetForm = () => {
    setName('');
    setSource('plant');
    setIsSourceAnimal(false);
    setAnimalType('');
    setPreparationMethod('');
    setParentIngredients([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!name.trim()) {
      toast.error('Please enter an ingredient name');
      return;
    }
    if (containsProfanity(name)) {
      toast.error('Ingredient not submitted due to inappropriate language');
      return;
    }
    if (source === 'animal' && !isSourceAnimal && !animalType) {
      toast.error('Please select a source animal');
      return;
    }
    if (source === 'prepared') {
      if (parentIngredients.length === 0) {
        toast.error('Please add at least one parent ingredient');
        return;
      }
      if (!preparationMethod) {
        toast.error('Please select a preparation method');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const submissionData: Record<string, unknown> = {
        name: name.trim(),
        source: source === 'prepared' ? 'other' : source,
        submittedBy: userName || 'Anonymous',
      };

      if (source === 'prepared') {
        submissionData.parentIngredients = parentIngredients;
        submissionData.preparationMethod = preparationMethod;
      } else if (source === 'animal') {
        submissionData.isSourceAnimal = isSourceAnimal;
        if (!isSourceAnimal && animalType) {
          submissionData.animalType = animalType;
          submissionData.parentIngredients = [animalType];
        }
      }

      await addSubmission('ingredient', submissionData as { name: string; [key: string]: unknown });
      toast.success('Ingredient submitted successfully!');
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit';
      if (message.includes('already exists')) {
        toast.error(message);
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourceOptions = [
    { value: 'plant', label: '🌱 Plant' },
    { value: 'animal', label: '🐄 Animal' },
    { value: 'other', label: '🧂 Other' },
    { value: 'prepared', label: '🍳 Prepared' },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Name */}
      <div>
        <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter your name"
          required
        />
        <p className="mt-1 text-sm text-gray-400">Saved locally and included with your submission.</p>
      </div>

      {/* Ingredient Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Ingredient Name <span className="text-red-500">*</span>
        </label>
        <FormInput
          hideLabel
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Garlic, Olive Oil, Chopped Onion"
          required
          className="text-center text-lg w-full"
        />
      </div>

      <div className="h-4" />

      {/* Source Selection */}
      <div>
        <label className="block text-2xl font-medium text-center text-gray-300 mb-3">
          Source <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-3 gap-4">
            {sourceOptions.slice(0, 3).map(option => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value={option.value}
                  checked={source === option.value}
                  onChange={() => setSource(option.value)}
                  className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-600"
                />
                <span className="ml-2 text-2xl text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="prepared"
                checked={source === 'prepared'}
                onChange={() => setSource('prepared')}
                className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-600"
              />
              <span className="ml-2 text-2xl text-gray-300">🍳 Prepared</span>
            </label>
          </div>

          {/* Animal type selection */}
          {source === 'animal' && (
            <div className="w-full mt-4">
              <div className="flex justify-center gap-4">
                <label className={`flex items-center gap-2 p-4 rounded-lg cursor-pointer transition-colors ${!isSourceAnimal ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                  <input
                    type="radio"
                    checked={!isSourceAnimal}
                    onChange={() => setIsSourceAnimal(false)}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-lg text-gray-200">Animal Product</span>
                </label>
                <label className={`flex items-center gap-2 p-4 rounded-lg cursor-pointer transition-colors ${isSourceAnimal ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                  <input
                    type="radio"
                    checked={isSourceAnimal}
                    onChange={() => { setIsSourceAnimal(true); setAnimalType(''); }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-lg text-gray-200">Source Animal</span>
                </label>
              </div>

              {!isSourceAnimal && (
                <div className="mt-6">
                  <label className="block text-xl font-medium text-gray-300 mb-2 text-center">
                    Select Source Animal <span className="text-red-500">*</span>
                  </label>
                  <div className="max-h-60 overflow-y-auto">
                    {animalProducts.length > 0 ? (
                      <div className="flex flex-col items-center gap-2">
                        {animalProducts.map(animal => (
                          <label
                            key={animal.id}
                            className={`w-full max-w-md flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-800 ${animalType === animal.name ? 'bg-gray-800' : ''}`}
                          >
                            <input
                              type="radio"
                              value={animal.name}
                              checked={animalType === animal.name}
                              onChange={() => setAnimalType(animal.name)}
                              className="h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-3 text-gray-100">{animal.name}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No source animals found. Please add a source animal first.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prepared ingredient fields */}
      {source === 'prepared' && (
        <div className="pt-4 space-y-8">
          <div>
            <label className="block text-2xl font-medium text-gray-300 mb-4 text-center">
              Preparation Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4 justify-items-center">
              {PREPARATION_METHODS.map(method => (
                <label key={method} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={method}
                    checked={preparationMethod === method}
                    onChange={() => setPreparationMethod(method)}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-600"
                  />
                  <span className="ml-2 text-lg text-gray-300">
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-medium text-gray-300 text-center mb-1">
              Parent Ingredients <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-400 text-center mb-4">Select 1-5 parent ingredients</p>

            {parentIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {parentIngredients.map(ingredient => (
                  <div key={ingredient} className="flex items-center bg-gray-700 px-3 py-1 rounded-full text-sm">
                    <span className="mr-2 text-gray-200">{ingredient}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParent(ingredient)}
                      className="text-gray-400 hover:text-red-400"
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

            {parentIngredients.length < 5 && (
              <div className="flex justify-center">
                <IngredientSearch
                  onSelect={handleAddParent}
                  selectedIngredients={parentIngredients}
                  placeholder={parentIngredients.length === 0 ? 'Search for a parent ingredient...' : 'Add another parent ingredient...'}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-8" />

      {/* Submit */}
      <div className="flex justify-center pb-8">
        <InteractiveHoverButton
          type="submit"
          className={`w-full max-w-xs py-4 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full transition-all duration-200 ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
          text={isSubmitting ? 'Submitting...' : 'Submit Ingredient'}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}

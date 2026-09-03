'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'react-hot-toast';
import { containsProfanity } from '@/lib/profanityFilter';
import { useSubmissions } from '../contexts/SubmissionContext';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-submit';
import IngredientSearch from './IngredientSearch';

const COOKING_METHODS = [
  'cooked', 'steamed', 'boiled', 'toasted', 'grilled', 'smoked',
  'oil-fried', 'air-fried', 'raw', 'mixed', 'blended', 'shredded', 'baked',
] as const;

interface SelectedIngredient {
  name: string;
  amount?: string;
}

export function AddDishForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [cookingMethod, setCookingMethod] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [tags, setTags] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useLocalStorage<string>('foodtree-username', '');
  const { addSubmission } = useSubmissions();

  const handleAddIngredient = (ingredient: string) => {
    if (selectedIngredients.some(i => i.name === ingredient)) {
      toast.error('Ingredient already added');
      return;
    }
    setSelectedIngredients([...selectedIngredients, { name: ingredient }]);
  };

  const handleRemoveIngredient = (name: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.name !== name));
  };

  const handleAmountChange = (name: string, amount: string) => {
    setSelectedIngredients(prev =>
      prev.map(i => i.name === name ? { ...i, amount } : i)
    );
  };

  const resetForm = () => {
    setName('');
    setCookingMethod('');
    setSelectedIngredients([]);
    setTags('');
    setServingSize('');
    setCookingTime('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      toast.error('Please enter a dish name');
      return;
    }
    if (containsProfanity(name)) {
      toast.error('Dish not submitted due to inappropriate language');
      return;
    }
    if (selectedIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        name: name.trim(),
        cookingMethod: cookingMethod || undefined,
        ingredients: selectedIngredients,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        servingSize: servingSize || undefined,
        cookingTime: cookingTime ? parseInt(cookingTime, 10) : undefined,
        description: description || undefined,
        submittedBy: userName || 'Anonymous',
      };

      await addSubmission('dish', submissionData);
      toast.success('Dish submitted successfully!');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Name */}
      <div>
        <label htmlFor="dishUserName" className="block text-sm font-medium text-gray-300 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="dishUserName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Dish Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Dish Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg"
          placeholder="e.g., Garlic Bread, Caesar Salad"
          required
        />
      </div>

      {/* Cooking Method */}
      <div>
        <label className="block text-xl font-medium text-gray-300 mb-3 text-center">
          Cooking Method
        </label>
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {COOKING_METHODS.map(method => (
            <label key={method} className="flex items-center cursor-pointer">
              <input
                type="radio"
                value={method}
                checked={cookingMethod === method}
                onChange={() => setCookingMethod(method)}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-600"
              />
              <span className="ml-2 text-lg text-gray-300">
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <h3 className="text-xl font-medium text-gray-300 text-center mb-1">
          Ingredients <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-400 text-center mb-4">Search and add ingredients for this dish</p>

        {selectedIngredients.length > 0 && (
          <div className="space-y-2 mb-4">
            {selectedIngredients.map(ing => (
              <div key={ing.name} className="flex items-center gap-2 bg-gray-700/50 p-3 rounded-lg">
                <span className="text-gray-200 flex-grow">{ing.name}</span>
                <input
                  type="text"
                  value={ing.amount || ''}
                  onChange={(e) => handleAmountChange(ing.name, e.target.value)}
                  className="w-32 px-2 py-1 text-sm border border-gray-600 rounded bg-gray-800 text-white focus:ring-indigo-500"
                  placeholder="amount"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ing.name)}
                  className="text-gray-400 hover:text-red-400"
                  aria-label="Remove ingredient"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <IngredientSearch
            onSelect={handleAddIngredient}
            selectedIngredients={selectedIngredients.map(i => i.name)}
            placeholder="Search for an ingredient..."
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags <span className="text-gray-500">(optional, comma-separated)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., breakfast, spicy, vegan"
        />
      </div>

      {/* Serving Size & Cooking Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Serving Size <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 4 servings"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cooking Time (min) <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 30"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Brief description of the dish..."
        />
      </div>

      <div className="h-4" />

      {/* Submit */}
      <div className="flex justify-center pb-8">
        <InteractiveHoverButton
          type="submit"
          className={`w-full max-w-xs py-4 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full transition-all duration-200 ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
          text={isSubmitting ? 'Submitting...' : 'Submit Dish'}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}

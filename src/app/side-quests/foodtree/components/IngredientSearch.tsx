'use client';

import { useState, useEffect } from 'react'; // Removed unused useRef import
import Select from 'react-select';

interface IngredientOption {
  value: string;
  label: string;
}

interface IngredientSearchProps {
  onSelect: (ingredient: string) => void;
  selectedIngredients: string[];
  placeholder?: string;
}

export default function IngredientSearch({ onSelect, selectedIngredients, placeholder = 'Search ingredients...' }: IngredientSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<IngredientOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch ingredients from the API when input changes
  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }
    
    // Using window.setTimeout to avoid NodeJS.Timeout type issues
    const timerId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        console.log('Fetching ingredients with search term:', inputValue);
        
        const response = await fetch(`/api/foodtree/ingredients?search=${encodeURIComponent(inputValue)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received ingredients:', data);
        
        interface IngredientResponse {
          name: string;
          [key: string]: unknown;
        }
        
        const filteredOptions = data
          .filter((ingredient: IngredientResponse) => !selectedIngredients.includes(ingredient.name))
          .map((ingredient: IngredientResponse) => ({
            value: ingredient.name,  // Use the name as the value
            label: ingredient.name   // Display the name in the UI
          }));
          
        console.log('Filtered options:', filteredOptions);
        setOptions(filteredOptions);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    // Cleanup the timeout when the component unmounts or dependencies change
    return () => clearTimeout(timerId);
  }, [inputValue, selectedIngredients]);

  const handleChange = (selectedOption: IngredientOption | null) => {
    if (selectedOption) {
      onSelect(selectedOption.value);
      // Clear the input value after selection
      setInputValue('');
      setOptions([]);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <Select
          className="react-select-container text-gray-900"
          classNamePrefix="select"
          isLoading={isLoading}
          isClearable
          isSearchable
          options={options}
          onInputChange={(value) => setInputValue(value)}
          onChange={handleChange}
          placeholder={placeholder}
          value={null}
          inputValue={inputValue}
          onKeyDown={(e) => {
            // Prevent form submission when pressing Enter in the search box
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }}
          noOptionsMessage={({ inputValue }) => {
            if (inputValue.length < 2) {
              return 'Type at least 2 characters to search';
            }
            if (isLoading) {
              return 'Searching...';
            }
            return 'No matching ingredients found';
          }}
          loadingMessage={() => 'Searching...'}
          key={`search-${selectedIngredients.length}`}
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: '44px',
              borderColor: state.isFocused ? '#4f46e5' : '#e5e7eb',
              '&:hover': {
                borderColor: state.isFocused ? '#4f46e5' : '#9ca3af',
              },
              boxShadow: state.isFocused ? '0 0 0 1px #4f46e5' : 'none',
              '&:hover': {
                boxShadow: state.isFocused ? '0 0 0 1px #4f46e5' : 'none',
              },
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              marginTop: '4px',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
              color: '#111827',
              '&:active': {
                backgroundColor: '#e5e7eb',
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: '#9ca3af',
            }),
          }}
          // Prevent form submission when clicking on the dropdown
          onMenuOpen={() => {
            const form = document.querySelector('form');
            if (form) {
              form.setAttribute('data-no-validate', 'true');
            }
          }}
          onMenuClose={() => {
            const form = document.querySelector('form');
            if (form) {
              form.removeAttribute('data-no-validate');
            }
          }}
          // Add data attributes to help with testing
          data-testid="ingredient-search"
          // Fix for the content script error
          components={{
            DropdownIndicator: null,
            IndicatorSeparator: null,
          }}
          // Add custom filter to ensure search works properly
          filterOption={null}
        />
      </div>
      {inputValue.length > 2 && options.length === 0 && !isLoading && (
        <p className="mt-2 text-sm text-gray-500">
          No ingredients found matching &quot;{inputValue}&quot;. Try a different search term.
        </p>
      )}
    </div>
  );
}

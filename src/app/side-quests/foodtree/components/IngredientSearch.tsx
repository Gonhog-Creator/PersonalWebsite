'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }

    const timerId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/foodtree/ingredients?search=${encodeURIComponent(inputValue)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const filteredOptions = data
          .filter((ingredient: { name: string }) => !selectedIngredients.includes(ingredient.name))
          .map((ingredient: { name: string }) => ({
            value: ingredient.name,
            label: ingredient.name,
          }));

        setOptions(filteredOptions);
      } catch {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [inputValue, selectedIngredients]);

  const handleChange = (selectedOption: IngredientOption | null) => {
    if (selectedOption) {
      onSelect(selectedOption.value);
      setInputValue('');
      setOptions([]);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <Select
          className="react-select-container"
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
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }}
          noOptionsMessage={({ inputValue }) => {
            if (inputValue.length < 2) return 'Type at least 2 characters to search';
            if (isLoading) return 'Searching...';
            return 'No matching ingredients found';
          }}
          loadingMessage={() => 'Searching...'}
          key={`search-${selectedIngredients.length}`}
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: '44px',
              backgroundColor: '#374151',
              borderColor: state.isFocused ? '#6366f1' : '#4b5563',
              boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
              '&:hover': {
                borderColor: state.isFocused ? '#6366f1' : '#6b7280',
              },
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              marginTop: '4px',
              borderRadius: '0.375rem',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? '#374151' : '#1f2937',
              color: '#e5e7eb',
              '&:active': {
                backgroundColor: '#4b5563',
              },
            }),
            singleValue: (base) => ({
              ...base,
              color: '#e5e7eb',
            }),
            input: (base) => ({
              ...base,
              color: '#e5e7eb',
            }),
            placeholder: (base) => ({
              ...base,
              color: '#9ca3af',
            }),
            clearIndicator: (base) => ({
              ...base,
              color: '#9ca3af',
              '&:hover': { color: '#e5e7eb' },
            }),
          }}
          components={{
            DropdownIndicator: null,
            IndicatorSeparator: null,
          }}
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

import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: FieldError;
  description?: string;
  hideLabel?: boolean;
  className?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, description, className = '', hideLabel = false, ...props }, ref) => {
    // Extract the props we need, excluding hideLabel
    const inputProps = { ...props };
    
    return (
      <div className="mb-4">
        {!hideLabel && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          } ${className}`}
          {...inputProps}
        />
        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

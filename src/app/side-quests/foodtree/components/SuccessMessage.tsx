'use client';

import { useEffect } from 'react';

type SuccessMessageProps = {
  message: string;
  itemName: string;
  onDismiss: () => void;
};

export function SuccessMessage({ message, itemName, onDismiss }: SuccessMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      <div className="flex items-center">
        <span className="font-bold">{itemName}</span>
        <span className="ml-1">{message}</span>
        <button 
          onClick={onDismiss}
          className="ml-4 text-green-700 hover:text-green-900"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

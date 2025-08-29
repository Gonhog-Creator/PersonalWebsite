import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Class names to be combined
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a human-readable format
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * @param str - Input string
 * @param length - Maximum length before truncation
 * @param ending - Custom ending (defaults to '...')
 * @returns Truncated string with ending if necessary
 */
export function truncate(str: string, length: number, ending: string = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length - ending.length) + ending;
}

/**
 * Generates a unique ID
 * @returns A unique ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounce function to limit the rate at which a function can fire
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Checks if the current device is a mobile device
 * @returns Boolean indicating if the device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = (text: string): Promise<void> => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  
  try {
    document.execCommand('copy');
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  } finally {
    document.body.removeChild(textarea);
  }
};

/**
 * Formats a number with commas as thousands separators
 * @param num - Number to format
 * @returns Formatted string with commas
 */
export function formatNumberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Converts a string to kebab-case
 * @param str - Input string
 * @returns kebab-cased string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Sleep for a specified duration
 * @param ms - Time to sleep in milliseconds
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random integer between min and max
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX | (string & {});

interface RGBValues {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Lightens or darkens a color
 * @param color - Color to adjust
 * @param amount - Amount to adjust (-1 to 1)
 * @returns Adjusted color
 */
/**
 * Parses a color string into RGB values
 */
function parseColor(color: string): RGBValues | null {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const bigint = parseInt(hex, 16);
    if (isNaN(bigint)) return null;
    
    if (hex.length === 3) {
      // Handle shorthand hex (#RGB)
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    } else if (hex.length === 6) {
      // Handle full hex (RRGGBB)
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    } else if (hex.length === 8) {
      // Handle hex with alpha (RRGGBBAA)
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const a = parseInt(hex.substring(6, 8), 16) / 255;
      return { r, g, b, a };
    }
  }
  
  // Handle rgb/rgba colors
  const rgbMatch = color.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+)\s*)?\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : undefined;
    
    if (a !== undefined) {
      return { r, g, b, a };
    }
    return { r, g, b };
  }
  
  // Handle named colors (basic support)
  const ctx = document.createElement('canvas').getContext('2d');
  if (ctx) {
    ctx.fillStyle = color;
    const rgba = ctx.fillStyle;
    if (rgba !== 'rgba(0, 0, 0, 0)') {
      return parseColor(rgba);
    }
  }
  
  return null;
}

export function adjustColor(color: Color, amount: number): string {
  if (typeof color !== 'string') {
    console.warn('Invalid color type provided to adjustColor');
    return typeof color === 'string' ? color : '#000000';
  }

  try {
    const rgb = parseColor(color);
    if (!rgb) return color;

    // Adjust color components
    const adjust = (value: number) => {
      const newValue = value + Math.round(amount * 255);
      return Math.min(255, Math.max(0, newValue));
    };

    const r = adjust(rgb.r);
    const g = adjust(rgb.g);
    const b = adjust(rgb.b);

    // Preserve alpha if it exists
    if (rgb.a !== undefined) {
      return `rgba(${r}, ${g}, ${b}, ${rgb.a})`;
    }
    
    return `rgb(${r}, ${g}, ${b})`;
  } catch (e) {
    console.error('Error adjusting color:', e);
    return color;
  }
}

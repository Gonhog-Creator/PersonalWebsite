import { format, isValid } from 'date-fns';

/**
 * Safely formats a date string, number, or Date object into a formatted string.
 * @param dateValue - The date to format. Can be a Date object, timestamp (number), or date string.
 * @param formatStr - The format string to use (using date-fns format tokens).
 * @returns Formatted date string, 'N/A' for undefined/null, or 'Invalid date' if the date is invalid.
 * @example
 * safeFormatDate('2023-01-01', 'yyyy-MM-dd') // Returns '2023-01-01'
 * safeFormatDate(1672531200000, 'PPpp') // Returns formatted date from timestamp
 * safeFormatDate(undefined, 'yyyy-MM-dd') // Returns 'N/A'
 */
export const safeFormatDate = (dateValue: string | number | Date | null | undefined, formatStr: string): string => {
  if (dateValue === null || dateValue === undefined) {
    return 'N/A';
  }

  if (typeof formatStr !== 'string' || !formatStr.trim()) {
    console.warn('Invalid format string provided to safeFormatDate');
    return 'Invalid format';
  }

  try {
    let date: Date;

    if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'number') {
      // Handle numeric timestamps (milliseconds since epoch)
      date = new Date(dateValue);
    } else if (typeof dateValue === 'string') {
      // Try parsing the date string
      const parsedDate = new Date(dateValue);
      date = isNaN(parsedDate.getTime()) ? new Date(dateValue) : parsedDate;
    } else {
      return 'Invalid date';
    }

    if (!isValid(date)) {
      return 'Invalid date';
    }

    return format(date, formatStr);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error formatting date:', error, { dateValue, formatStr });
    }
    return 'Invalid date';
  }
};

export const normalizeName = (name: string): string => {
  if (!name) return name;
  return name.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
};

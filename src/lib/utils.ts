import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to normalize dates to YYYY-MM-DD format
export const normalizeDate = (dateString: string): string => {
  try {
    // Try to parse the date string and format it consistently
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If parsing fails, try to extract date parts manually
      const parts = dateString.split(/[-/]/);
      if (parts.length >= 3) {
        const year = parts[0].padStart(4, '20'); // Assume 20xx if year is short
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Failed to normalize date:', dateString, error);
    return dateString; // Return original if all parsing fails
  }
};

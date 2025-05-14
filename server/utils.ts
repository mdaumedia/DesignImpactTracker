import { randomUUID } from 'crypto';

/**
 * Generate a unique ID
 * @returns A unique string ID
 */
export function generateId(): string {
  return randomUUID();
}

/**
 * Format a date in ISO format
 * @param date The date to format
 * @returns The formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Calculate the difference in days between two dates
 * @param start The start date
 * @param end The end date
 * @returns The number of days between the dates
 */
export function daysBetween(start: Date, end: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((end.getTime() - start.getTime()) / millisecondsPerDay));
}

/**
 * Format a number as a percentage
 * @param value The value to format
 * @param decimals The number of decimal places
 * @returns The formatted percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Safely parse JSON or return null
 * @param value The string to parse
 * @returns The parsed JSON or null
 */
export function safeParseJson(value: string): any {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

/**
 * Check if an object is empty
 * @param obj The object to check
 * @returns True if the object is empty
 */
export function isEmptyObject(obj: any): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Deep merge two objects
 * @param target The target object
 * @param source The source object
 * @returns The merged object
 */
export function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Check if a value is an object
 * @param item The item to check
 * @returns True if the item is an object
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Safely access a nested property in an object
 * @param obj The object to access
 * @param path The path to the property
 * @param defaultValue The default value if the property doesn't exist
 * @returns The property value or the default value
 */
export function getNestedProperty(obj: any, path: string, defaultValue: any = null): any {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current === undefined ? defaultValue : current;
}

/**
 * Chunk an array into smaller arrays
 * @param array The array to chunk
 * @param size The size of each chunk
 * @returns An array of chunks
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
}

/**
 * Retry a function multiple times with exponential backoff
 * @param fn The function to retry
 * @param options The retry options
 * @returns The result of the function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  { retries = 3, backoff = 300, maxBackoff = 10000 }: { retries?: number; backoff?: number; maxBackoff?: number } = {}
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    const delay = Math.min(backoff, maxBackoff);
    await sleep(delay);
    
    return retry(fn, {
      retries: retries - 1,
      backoff: backoff * 2,
      maxBackoff
    });
  }
}

/**
 * Sleep for a specified number of milliseconds
 * @param ms The number of milliseconds to sleep
 * @returns A promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
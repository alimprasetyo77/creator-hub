import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkProperty = (property: any) => {
  if (property instanceof File) {
    if (property.size !== 0) return true;
  }

  if (typeof property === 'string') {
    if (property !== '') return true;
  }

  if (typeof property === 'boolean') {
    return true;
  }

  if (typeof property === 'number') {
    return true;
  }

  return false;
};

export const convertToIDR = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
    value * 16500
  );

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

export const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export function getDiffSeconds(startTime: string, endTime: string) {
  const start = new Date(startTime) as unknown as number;
  const end = new Date(endTime) as unknown as number;

  return Math.max(0, Math.floor((end - start) / 1000));
}

export function getPaginationPages(currentPage: number, totalPages: number): (number | '...')[] {
  const pages: (number | '...')[] = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push('...');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('...');
  }

  pages.push(totalPages);

  return pages;
}

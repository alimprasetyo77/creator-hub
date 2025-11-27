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

/**
 * Convert USD to IDR safely (avoid float errors)
 * @param usd amount in USD
 * @param rate exchange rate (example: 15500)
 */
export function usdToIdr(usd: number, rate = 16500): number {
  // hindari float → ubah ke integer (cent)
  const usdInCents = Math.round(usd * 100);

  // hasil = cent × rate / 100
  const idr = Math.round((usdInCents * rate) / 100);

  return idr; // hasil integer siap kirim ke Midtrans
}

export function getDiffSeconds(startTime: string, endTime: string) {
  const start = new Date(startTime) as unknown as number;
  const end = new Date(endTime) as unknown as number;

  return Math.max(0, Math.floor((end - start) / 1000));
}

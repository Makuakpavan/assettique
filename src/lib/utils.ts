import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return `₦${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `₦${(num / 1000000).toFixed(0)}M`;
  }
  if (num >= 1000) {
    return `₦${(num / 1000).toFixed(0)}K`;
  }
  return `₦${num}`;
}

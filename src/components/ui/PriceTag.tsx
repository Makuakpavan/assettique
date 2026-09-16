'use client';

import { formatPrice } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  className?: string;
}

export function PriceTag({ price, className }: PriceTagProps) {
  return (
    <span className={`text-gold-400 font-semibold tracking-tight ${className}`}>
      {formatPrice(price)}
    </span>
  );
}

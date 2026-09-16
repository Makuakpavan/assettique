'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface BadgeProps {
  status: 'verified' | 'pending' | 'unverified';
  className?: string;
}

export function VerificationBadge({ status, className }: BadgeProps) {
  if (status !== 'verified') return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-gold-500/10 text-gold-400 border border-gold-500/20',
        className
      )}
    >
      <CheckCircle2 className="w-3 h-3" />
      VERIFIED
    </span>
  );
}

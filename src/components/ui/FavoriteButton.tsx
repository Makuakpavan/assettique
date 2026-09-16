'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
}

export function FavoriteButton({ isFavorite, onToggle, className }: FavoriteButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'p-2.5 rounded-full backdrop-blur-md transition-colors',
        isFavorite
          ? 'bg-gold-500/20 text-gold-400'
          : 'bg-black/40 text-white/70 hover:text-white hover:bg-black/60',
        className
      )}
    >
      <motion.div
        animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn('w-5 h-5', isFavorite && 'fill-current')}
        />
      </motion.div>
    </motion.button>
  );
}

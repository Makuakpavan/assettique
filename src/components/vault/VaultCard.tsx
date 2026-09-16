'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Lock } from 'lucide-react';
import { VaultItem } from '@/types';

interface VaultCardProps {
  item: VaultItem;
  onRequestAccess: () => void;
  index?: number;
}

export function VaultCard({ item, onRequestAccess, index = 0 }: VaultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="luxury-card group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-luxury-black/80 text-gold-400 border border-gold-500/30 backdrop-blur-md">
            <Lock className="w-3 h-3" />
            PRIVATE LISTING
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-gold-400 text-sm font-medium tracking-wider">PRICE ON REQUEST</p>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-luxury-ivory font-medium text-lg mb-2">{item.title}</h3>
        <p className="flex items-center gap-1 text-xs text-luxury-muted mb-3">
          <MapPin className="w-3 h-3" /> {item.location}
        </p>
        <p className="text-sm text-luxury-muted line-clamp-2 mb-4">{item.description}</p>
        <button
          onClick={onRequestAccess}
          className="w-full py-2.5 rounded-lg border border-gold-500/50 text-gold-400 text-sm font-medium hover:bg-gold-500/10 transition-colors"
        >
          REQUEST ACCESS
        </button>
      </div>
    </motion.div>
  );
}

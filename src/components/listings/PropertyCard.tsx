'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Maximize } from 'lucide-react';
import { Property } from '@/types';
import { VerificationBadge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { PriceTag } from '@/components/ui/PriceTag';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index?: number;
}

export function PropertyCard({ property, isFavorite, onToggleFavorite, index = 0 }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/property/${property.id}`}>
        <div className="luxury-card group cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Favorite */}
            <div className="absolute top-3 right-3">
              <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
            </div>

            {/* Verification */}
            <div className="absolute top-3 left-3">
              <VerificationBadge status={property.verificationStatus} />
            </div>

            {/* Price */}
            <div className="absolute bottom-3 left-3 right-3">
              <PriceTag price={property.price} className="text-lg" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-luxury-ivory font-medium text-base mb-2 group-hover:text-gold-400 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-luxury-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {property.location}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="w-3 h-3" />
                {property.landSize}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-luxury-dark text-luxury-muted border border-luxury-border">
                {property.propertyType}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-luxury-dark text-luxury-muted border border-luxury-border">
                {property.titleType}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

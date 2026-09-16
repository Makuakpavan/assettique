'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Gauge, Calendar } from 'lucide-react';
import { Vehicle } from '@/types';
import { VerificationBadge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { PriceTag } from '@/components/ui/PriceTag';
import { formatPrice } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index?: number;
}

export function VehicleCard({ vehicle, isFavorite, onToggleFavorite, index = 0 }: VehicleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/automotive/${vehicle.id}`}>
        <div className="luxury-card group cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={vehicle.images[0]}
              alt={vehicle.title}
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
              <VerificationBadge status={vehicle.verificationStatus} />
            </div>

            {/* Price */}
            <div className="absolute bottom-3 left-3 right-3">
              <PriceTag price={vehicle.price} className="text-lg" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-luxury-ivory font-medium text-base mb-2 group-hover:text-gold-400 transition-colors">
              {vehicle.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-luxury-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {vehicle.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {vehicle.year}
              </span>
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                {vehicle.mileage}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

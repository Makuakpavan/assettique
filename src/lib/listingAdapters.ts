import type { Property, Vehicle, Seller } from '@/types';

/** A listing as returned by /api/listings/[id] (price already in naira). */
export interface ApiListing {
  id: string;
  title: string;
  description: string;
  type: 'vehicle' | 'property';
  price: number;
  location: string;
  category: string | null;
  specs: Record<string, unknown> | null;
  images: string[];
  seller: { id: string; name: string; rating: number; verified: boolean };
}

const PLACEHOLDER_IMAGE = '/placeholder.svg';

// Reads a spec as text; unknown specs become '' so pages can hide them.
function spec(listing: ApiListing, key: string): string {
  const value = listing.specs?.[key];
  return value === undefined || value === null ? '' : String(value);
}

function toSeller(listing: ApiListing): Seller {
  return {
    id: listing.seller.id,
    name: listing.seller.name,
    type: 'private',
    verified: listing.seller.verified,
    rating: listing.seller.rating,
    location: listing.location,
    totalListings: 0,
  };
}

// Database listings haven't been through document verification yet,
// so they are always 'pending' (no VERIFIED badge, no verification ticks).
export function toProperty(listing: ApiListing): Property {
  return {
    id: listing.id,
    title: listing.title,
    location: listing.location,
    price: listing.price,
    landSize: spec(listing, 'landSize'),
    propertyType: spec(listing, 'propertyType'),
    titleType: spec(listing, 'titleType'),
    roadAccess: spec(listing, 'roadAccess'),
    utilities: spec(listing, 'utilities'),
    zoning: spec(listing, 'zoning'),
    developmentPotential: spec(listing, 'developmentPotential'),
    category: listing.category ?? spec(listing, 'propertyType'),
    images: listing.images.length ? listing.images : [PLACEHOLDER_IMAGE],
    verificationStatus: 'pending',
    seller: toSeller(listing),
    description: listing.description,
    featured: false,
  };
}

export function toVehicle(listing: ApiListing): Vehicle {
  return {
    id: listing.id,
    title: listing.title,
    year: Number(spec(listing, 'year')) || 0,
    mileage: spec(listing, 'mileage'),
    engine: spec(listing, 'engine'),
    transmission: spec(listing, 'transmission'),
    fuel: spec(listing, 'fuel'),
    drive: spec(listing, 'drive'),
    exterior: spec(listing, 'exterior'),
    interior: spec(listing, 'interior'),
    location: listing.location,
    price: listing.price,
    category: listing.category ?? '',
    images: listing.images.length ? listing.images : [PLACEHOLDER_IMAGE],
    verificationStatus: 'pending',
    seller: toSeller(listing),
    description: listing.description,
    vin: spec(listing, 'vin') || undefined,
    condition: spec(listing, 'condition'),
    bodyType: listing.category ?? '',
    featured: false,
  };
}

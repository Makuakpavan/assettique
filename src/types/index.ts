export interface Vehicle {
  id: string;
  title: string;
  year: number;
  mileage: string;
  engine: string;
  transmission: string;
  fuel: string;
  drive: string;
  exterior: string;
  interior: string;
  location: string;
  price: number;
  category: string;
  images: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  seller: Seller;
  description: string;
  vin?: string;
  condition: string;
  bodyType: string;
  featured: boolean;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  landSize: string;
  propertyType: string;
  titleType: string;
  roadAccess: string;
  utilities: string;
  zoning: string;
  developmentPotential: string;
  category: string;
  images: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  seller: Seller;
  description: string;
  featured: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface Seller {
  id: string;
  name: string;
  type: 'dealer' | 'private' | 'agent';
  verified: boolean;
  rating: number;
  location: string;
  image?: string;
  totalListings: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'buyer' | 'seller';
  verified: boolean;
  avatar?: string;
  savedVehicles: string[];
  savedProperties: string[];
  inquiries: Inquiry[];
  offers: Offer[];
  viewings: Viewing[];
}

export interface Inquiry {
  id: string;
  assetId: string;
  assetType: 'vehicle' | 'property';
  message: string;
  status: 'pending' | 'replied' | 'closed';
  date: string;
}

export interface Offer {
  id: string;
  assetId: string;
  assetType: 'vehicle' | 'property';
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  counterAmount?: number;
  date: string;
}

export interface Viewing {
  id: string;
  assetId: string;
  assetType: 'vehicle' | 'property';
  date: string;
  time: string;
  location: string;
  guests: number;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  assetId?: string;
  assetType?: 'vehicle' | 'property';
}

export interface VaultItem {
  id: string;
  title: string;
  type: 'vehicle' | 'property';
  category: string;
  location: string;
  price?: number;
  priceOnRequest: boolean;
  image: string;
  description: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  location: string;
  sortBy: string;
}

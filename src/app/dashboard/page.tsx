'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Bell, Bookmark, Eye, Heart, MapPin, Phone, Plus, Save, UserCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { vehicles } from '@/data/vehicles';
import { properties } from '@/data/properties';

const FAVORITES_STORAGE_KEY = 'assettique:favorites';

function readStoredFavoriteIds() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function getSavedDashboardItems(savedIds: string[]) {
  const assetMap = new Map<string, ListingRow>();

  for (const vehicle of vehicles) {
    assetMap.set(vehicle.id, {
      id: vehicle.id,
      title: vehicle.title,
      description: vehicle.description,
      type: 'vehicle',
      location: vehicle.location,
      price: vehicle.price,
      status: 'saved',
      images: vehicle.images,
    });
  }

  for (const property of properties) {
    assetMap.set(property.id, {
      id: property.id,
      title: property.title,
      description: property.description,
      type: 'property',
      location: property.location,
      price: property.price,
      status: 'saved',
      images: property.images,
    });
  }

  return savedIds
    .map((id) => assetMap.get(id))
    .filter((item): item is ListingRow => Boolean(item));
}

type ListingRow = {
  id: string;
  title: string;
  description?: string;
  type?: string;
  location?: string;
  price?: number;
  status?: string;
  images?: string[];
};

type ProfileForm = {
  name: string;
  phone: string;
  location: string;
  avatar: string;
};

const emptyProfile: ProfileForm = {
  name: '',
  phone: '',
  location: '',
  avatar: '',
};

export default function DashboardPage() {
  const { user } = useUser();
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState<ProfileForm>(emptyProfile);
  const [profileMessage, setProfileMessage] = useState<string>('');
  const [listingForm, setListingForm] = useState({
    title: '',
    type: 'vehicle',
    location: '',
    price: '',
    description: '',
    imageUrl: '',
  });
  const [listingMessage, setListingMessage] = useState<string>('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingListing, setSavingListing] = useState(false);
  const [savedListings, setSavedListings] = useState<ListingRow[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, sold: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'TOTAL' | 'PUBLISHED' | 'DRAFT' | 'SOLD' | 'SAVED'>('TOTAL');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const displayName =
    typeof user?.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : typeof user?.user_metadata?.name === 'string' && user.user_metadata.name.trim()
        ? user.user_metadata.name.trim()
        : user?.email || 'Your account';

  const safeProfile = {
    name: typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '',
    phone: typeof user?.user_metadata?.phone === 'string' ? user.user_metadata.phone : '',
    location: typeof user?.user_metadata?.location === 'string' ? user.user_metadata.location : '',
    avatar: typeof user?.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : '',
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: safeProfile.name || displayName,
        phone: safeProfile.phone,
        location: safeProfile.location,
        avatar: safeProfile.avatar,
      });
    }
  }, [user, displayName]);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      if (!user) {
        if (active) {
          setStats({ total: 0, published: 0, draft: 0, sold: 0 });
          setStatsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/api/listings/stats');
        if (!response.ok) throw new Error('Could not load listing stats');
        const data = await response.json();
        if (active) {
          setStats({
            total: Number(data.total ?? 0),
            published: Number(data.published ?? 0),
            draft: Number(data.draft ?? 0),
            sold: Number(data.sold ?? 0),
          });
        }
      } catch {
        if (active) {
          setStats({ total: 0, published: 0, draft: 0, sold: 0 });
        }
      } finally {
        if (active) setStatsLoading(false);
      }
    };

    const loadListings = async () => {
      if (!user) {
        if (active) setListings([]);
        if (active) setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/listings?mine=1');
        if (!response.ok) throw new Error('Could not load listings');
        const data = await response.json();
        if (active) setListings(Array.isArray(data.listings) ? data.listings : []);
      } catch {
        if (active) setListings([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    const loadSavedListings = async () => {
      const localSavedIds = readStoredFavoriteIds();
      const fallbackSaved = getSavedDashboardItems(localSavedIds);
      if (active) setSavedListings(fallbackSaved);

      if (!user) {
        if (active) setSavedLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          if (active) setSavedListings(fallbackSaved);
          return;
        }

        const data = await response.json();
        const apiSaved = Array.isArray(data.favorites) ? data.favorites : [];
        const merged = new Map<string, ListingRow>();

        for (const item of [...fallbackSaved, ...apiSaved]) {
          if (item?.id) merged.set(item.id, { ...item, status: item.status || 'saved' });
        }

        if (active) setSavedListings(Array.from(merged.values()));
      } catch {
        if (active) setSavedListings(fallbackSaved);
      } finally {
        if (active) setSavedLoading(false);
      }
    };

    void loadStats();
    void loadListings();
    void loadSavedListings();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const savedCount = savedListings.length;
  const savedIds = new Set(savedListings.map((item) => item.id));

  const statsCards = [
    { icon: Bookmark, label: 'Total listings', value: statsLoading ? '…' : stats.total, color: 'text-gold-400', status: 'TOTAL' as const },
    { icon: Eye, label: 'Published', value: statsLoading ? '…' : stats.published, color: 'text-emerald-400', status: 'PUBLISHED' as const },
    { icon: Heart, label: 'Saved', value: savedLoading ? '…' : savedCount, color: 'text-rose-400', status: 'SAVED' as const },
    { icon: Bell, label: 'Sold', value: statsLoading ? '…' : stats.sold, color: 'text-blue-400', status: 'SOLD' as const },
  ];

  const filteredListings = selectedStatus === 'TOTAL'
    ? listings
    : selectedStatus === 'SAVED'
      ? listings.filter((listing) => savedIds.has(listing.id))
      : listings.filter((listing) => (listing.status ?? 'DRAFT').toUpperCase() === selectedStatus);

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        location: profileForm.location.trim(),
        avatar_url: profileForm.avatar.trim(),
      },
    });

    setProfileMessage(error ? error.message : 'Profile saved.');
    setSavingProfile(false);
  };

  const refreshDashboardData = async () => {
    try {
      const [listingsResponse, statsResponse] = await Promise.all([
        fetch('/api/listings?mine=1'),
        fetch('/api/listings/stats'),
      ]);

      const listingsData = listingsResponse.ok ? await listingsResponse.json() : { listings: [] };
      const statsData = statsResponse.ok ? await statsResponse.json() : { total: 0, published: 0, draft: 0, sold: 0 };

      setListings(Array.isArray(listingsData.listings) ? listingsData.listings : []);
      setStats({
        total: Number(statsData.total ?? 0),
        published: Number(statsData.published ?? 0),
        draft: Number(statsData.draft ?? 0),
        sold: Number(statsData.sold ?? 0),
      });
    } catch {
      setListings([]);
      setStats({ total: 0, published: 0, draft: 0, sold: 0 });
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setListingForm((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddListing = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSavingListing(true);
    setListingMessage('');

    const payload = {
      title: listingForm.title.trim(),
      description: listingForm.description.trim(),
      type: listingForm.type,
      price: Number(listingForm.price),
      location: listingForm.location.trim(),
      images: listingForm.imageUrl.trim() ? [listingForm.imageUrl.trim()] : [],
      publish: true,
    };

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not add listing.');
      setListingForm({ title: '', type: 'vehicle', location: '', price: '', description: '', imageUrl: '' });
      setListingMessage('Listing added successfully.');
      await refreshDashboardData();
    } catch (error) {
      setListingMessage(error instanceof Error ? error.message : 'Could not add listing.');
    } finally {
      setSavingListing(false);
    }
  };

  const handleListingAction = async (id: string, status: 'DRAFT' | 'PUBLISHED' | 'SOLD') => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not update listing status.');
      await refreshDashboardData();
    } catch (error) {
      console.error('Error updating listing status:', error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteListing = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not delete listing.');
      await refreshDashboardData();
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <PageLayout>
      <section className="section-padding pt-12 pb-8 bg-luxury-dark/20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center overflow-hidden">
              {profileForm.avatar ? (
                <Image src={profileForm.avatar} alt={displayName} width={56} height={56} className="object-cover" />
              ) : (
                <UserCircle className="w-8 h-8 text-gold-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-luxury-muted">Welcome back,</p>
              <h1 className="text-2xl font-light">{displayName}</h1>
              {user?.email ? <p className="text-xs text-luxury-muted">{user.email}</p> : null}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-padding py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsCards.map((stat, i) => {
            const isActive = selectedStatus === stat.status;

            return (
              <motion.button
                key={stat.label}
                type="button"
                onClick={() => setSelectedStatus(stat.status)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                aria-pressed={isActive}
                className={`p-5 rounded-2xl border text-left transition-colors ${
                  isActive
                    ? 'bg-gold-500/10 border-gold-500/40 shadow-[0_0_0_1px_rgba(251,191,36,0.25)]'
                    : 'bg-luxury-card border-luxury-border hover:border-gold-500/35'
                }`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-luxury-muted mt-1">{stat.label}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="section-padding py-8 pb-24 space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleSaveProfile} className="bg-luxury-card border border-luxury-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Edit profile</h2>
              <button type="submit" disabled={savingProfile} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                <Save className="w-4 h-4" /> {savingProfile ? 'Saving...' : 'Save'}
              </button>
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Name</label>
              <input value={profileForm.name} onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your name" className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" />
                <input value={profileForm.phone} onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+234 800 000 0000" className="w-full bg-luxury-dark border border-luxury-border rounded-xl pl-10 pr-4 py-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" />
                <input value={profileForm.location} onChange={(e) => setProfileForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="City, country" className="w-full bg-luxury-dark border border-luxury-border rounded-xl pl-10 pr-4 py-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Avatar URL</label>
              <input value={profileForm.avatar} onChange={(e) => setProfileForm((prev) => ({ ...prev, avatar: e.target.value }))} placeholder="https://..." className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm" />
            </div>
            {profileMessage ? <p className="text-sm text-luxury-muted">{profileMessage}</p> : null}
          </form>

          <form onSubmit={handleAddListing} className="bg-luxury-card border border-luxury-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Add listing</h2>
              <button type="submit" disabled={savingListing} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                <Plus className="w-4 h-4" /> {savingListing ? 'Adding...' : 'Add'}
              </button>
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Title</label>
              <input value={listingForm.title} onChange={(e) => setListingForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="2025 Mercedes-Benz G63" className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-luxury-muted mb-1 block">Type</label>
                <select value={listingForm.type} onChange={(e) => setListingForm((prev) => ({ ...prev, type: e.target.value }))} className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm">
                  <option value="vehicle">Vehicle</option>
                  <option value="property">Property</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-luxury-muted mb-1 block">Price (NGN)</label>
                <input type="number" value={listingForm.price} onChange={(e) => setListingForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="25000000" className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm" required />
              </div>
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Location</label>
              <input value={listingForm.location} onChange={(e) => setListingForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Lagos, Nigeria" className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm" required />
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Description</label>
              <textarea value={listingForm.description} onChange={(e) => setListingForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Short description of the asset" className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm min-h-[100px]" />
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gold-500/20 file:px-3 file:py-2 file:text-gold-300 file:font-medium"
              />
              <p className="text-[11px] text-luxury-muted mt-2">Upload a property or automotive photo for this listing.</p>
            </div>

            {listingForm.imageUrl ? (
              <div className="overflow-hidden rounded-xl border border-luxury-border bg-luxury-dark">
                <div className="relative aspect-[16/10]">
                  <Image src={listingForm.imageUrl} alt="Listing preview" fill className="object-cover" />
                </div>
              </div>
            ) : null}

            {listingMessage ? <p className="text-sm text-luxury-muted">{listingMessage}</p> : null}
          </form>
        </div>

        <div className="bg-luxury-card border border-luxury-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Saved</h2>
          </div>
          {savedLoading ? (
            <p className="text-luxury-muted text-sm">Loading saved items…</p>
          ) : savedListings.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-10 h-10 text-luxury-muted/30 mx-auto mb-3" />
              <p className="text-lg text-luxury-muted">You haven't saved anything yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {savedListings.map((listing) => (
                <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-luxury-dark rounded-2xl border border-luxury-border overflow-hidden">
                  <Link href={listing.type === 'vehicle' ? `/automotive/${listing.id}` : `/property/${listing.id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {listing.images && listing.images[0] ? (
                        <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-luxury-card flex items-center justify-center text-luxury-muted text-sm">No image</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-medium text-lg">{listing.title}</h3>
                      <span className="text-[10px] uppercase tracking-wider text-gold-400">Saved</span>
                    </div>
                    <p className="text-sm text-luxury-muted mb-3">{listing.location || 'Location not set'}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gold-400 font-medium">{typeof listing.price === 'number' ? formatPrice(listing.price) : 'Price not set'}</p>
                      <Link href={listing.type === 'vehicle' ? `/automotive/${listing.id}` : `/property/${listing.id}`} className="text-sm text-gold-400 hover:underline inline-flex items-center gap-1">
                        View <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-luxury-card border border-luxury-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-xl font-medium">
              {selectedStatus === 'TOTAL'
                ? 'My listings'
                : selectedStatus === 'SAVED'
                  ? 'Saved listings'
                  : `${selectedStatus.charAt(0)}${selectedStatus.slice(1).toLowerCase()} listings`}
            </h2>
            <div className="flex items-center gap-2">
              {selectedStatus !== 'TOTAL' ? (
                <button
                  type="button"
                  onClick={() => setSelectedStatus('TOTAL')}
                  className="text-sm text-gold-400 hover:underline"
                >
                  Show all
                </button>
              ) : null}
              <Link href="/dashboard" className="text-sm text-gold-400 hover:underline inline-flex items-center gap-1">Refresh <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
          {loading ? (
            <p className="text-luxury-muted text-sm">Loading your listings…</p>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-10 h-10 text-luxury-muted/30 mx-auto mb-3" />
              <p className="text-lg text-luxury-muted">
                {selectedStatus === 'TOTAL'
                  ? 'No listings yet.'
                  : selectedStatus === 'SAVED'
                    ? 'No saved listings yet.'
                    : `No ${selectedStatus.toLowerCase()} listings yet.`}
              </p>
              {selectedStatus === 'TOTAL' ? (
                <p className="text-sm text-luxury-muted/70 mt-2">Add your first asset to get started.</p>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredListings.map((listing) => (
                <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-luxury-dark rounded-2xl border border-luxury-border overflow-hidden">
                  <Link href={listing.type === 'vehicle' ? `/automotive/${listing.id}` : `/property/${listing.id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {listing.images && listing.images[0] ? (
                        <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-luxury-card flex items-center justify-center text-luxury-muted text-sm">No image</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-medium text-lg">{listing.title}</h3>
                      <span className="text-[10px] uppercase tracking-wider text-gold-400">{String(listing.status || 'DRAFT').toLowerCase()}</span>
                    </div>
                    <p className="text-sm text-luxury-muted mb-3">{listing.location || 'Location not set'}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gold-400 font-medium">{typeof listing.price === 'number' ? formatPrice(listing.price) : 'Price not set'}</p>
                      <Link href={listing.type === 'vehicle' ? `/automotive/${listing.id}` : `/property/${listing.id}`} className="text-sm text-gold-400 hover:underline inline-flex items-center gap-1">
                        View <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void handleListingAction(listing.id, listing.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
                        disabled={actionLoading[listing.id]}
                        className="btn-secondary text-xs px-2 py-1.5 disabled:opacity-60"
                      >
                        {listing.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleListingAction(listing.id, 'SOLD')}
                        disabled={actionLoading[listing.id]}
                        className="btn-secondary text-xs px-2 py-1.5 disabled:opacity-60"
                      >
                        Mark sold
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteListing(listing.id)}
                        disabled={actionLoading[listing.id]}
                        className="text-xs px-2 py-1.5 rounded-xl border border-red-500/50 text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

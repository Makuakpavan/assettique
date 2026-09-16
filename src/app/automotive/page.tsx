'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { VehicleCard } from '@/components/listings/VehicleCard';
import { vehicles, vehicleCategories } from '@/data/vehicles';
import { useFavorites } from '@/hooks/useFavorites';

export default function AutomotivePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000000]);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
      const matchesSearch = !searchQuery || 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = v.price >= priceRange[0] && v.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [activeCategory, searchQuery, priceRange]);

  return (
    <PageLayout>
      {/* Header */}
      <section className="section-padding pt-12 pb-8 bg-luxury-dark/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-3">Showroom</p>
          <h1 className="text-4xl md:text-6xl font-light mb-4">DISCOVER AUTOMOTIVE</h1>
          <p className="text-luxury-muted text-lg max-w-xl">
            Exceptional vehicles. Verified sellers. Extraordinary ownership.
          </p>
        </motion.div>
      </section>

      {/* Filters Bar */}
      <section className="section-padding py-4 border-b border-luxury-border/50 sticky top-16 lg:top-20 bg-luxury-black/95 backdrop-blur-xl z-30">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
            {vehicleCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-gold-500 text-luxury-black font-semibold'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-ivory border border-luxury-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles..."
                className="w-full lg:w-64 bg-luxury-card border border-luxury-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-colors ${showFilters ? 'bg-gold-500/20 border-gold-500/50 text-gold-400' : 'bg-luxury-card border-luxury-border hover:border-gold-500/50'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex rounded-xl bg-luxury-card border border-luxury-border overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-gold-500/20 text-gold-400' : 'text-luxury-muted'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-gold-500/20 text-gold-400' : 'text-luxury-muted'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 pt-4 border-t border-luxury-border/50 overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-luxury-muted mb-2 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="500000000"
                    step="10000000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="flex-1 accent-gold-500"
                  />
                  <span className="text-xs text-gold-400 whitespace-nowrap">
                    ₦{(priceRange[1] / 1000000).toFixed(0)}M
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Results Count */}
      <section className="section-padding py-4">
        <p className="text-sm text-luxury-muted">
          Showing <span className="text-luxury-ivory font-medium">{filteredVehicles.length}</span> vehicles
          {activeCategory !== 'All' && ` in ${activeCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </section>

      {/* Grid */}
      <section className="section-padding pb-24">
        {filteredVehicles.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl'
          }`}>
            {filteredVehicles.map((vehicle, i) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorite={isFavorite(vehicle.id)}
                onToggleFavorite={() => toggleFavorite(vehicle.id)}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-luxury-muted mb-4">NO VEHICLES MATCHED YOUR SEARCH</p>
            <p className="text-sm text-luxury-muted/60 mb-6">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); setPriceRange([0, 500000000]); }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </PageLayout>
  );
}

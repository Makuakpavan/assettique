'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Car, Home, SlidersHorizontal } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { VehicleCard } from '@/components/listings/VehicleCard';
import { PropertyCard } from '@/components/listings/PropertyCard';
import { vehicles } from '@/data/vehicles';
import { properties } from '@/data/properties';
import { useFavorites } from '@/hooks/useFavorites';

type SearchTab = 'all' | 'automotive' | 'property';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filteredVehicles = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return vehicles.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.engine.toLowerCase().includes(q) ||
      v.transmission.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredProperties = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return properties.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.propertyType.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.zoning.toLowerCase().includes(q)
    );
  }, [query]);

  const showVehicles = activeTab === 'all' || activeTab === 'automotive';
  const showProperties = activeTab === 'all' || activeTab === 'property';
  const hasResults = filteredVehicles.length > 0 || filteredProperties.length > 0;

  return (
    <PageLayout>
      {/* Header */}
      <section className="section-padding pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-3">Universal Search</p>
          <h1 className="text-4xl md:text-5xl font-light mb-6">SEARCH ASSETS</h1>

          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vehicles, properties, brands, locations or keywords..."
              className="w-full bg-luxury-card border border-luxury-border rounded-2xl pl-14 pr-12 py-4 text-luxury-ivory placeholder:text-luxury-muted/60 focus:outline-none focus:border-gold-500/50 transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4 text-luxury-muted" />
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Tabs */}
      {query && (
        <section className="section-padding pb-4">
          <div className="flex gap-2">
            {([
              { key: 'all' as SearchTab, label: 'All Results', count: filteredVehicles.length + filteredProperties.length },
              { key: 'automotive' as SearchTab, label: 'Automotive', count: filteredVehicles.length },
              { key: 'property' as SearchTab, label: 'Property', count: filteredProperties.length },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-gold-500 text-luxury-black font-semibold'
                    : 'bg-luxury-card text-luxury-muted border border-luxury-border hover:text-luxury-ivory'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      <section className="section-padding pb-24">
        {!query ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-luxury-muted/30 mx-auto mb-4" />
            <p className="text-xl text-luxury-muted mb-2">START YOUR SEARCH</p>
            <p className="text-sm text-luxury-muted/60 max-w-md mx-auto">
              Search for luxury vehicles, prime land, specific locations, or brands. 
              Try "Range Rover Lagos" or "5 acres Abuja"
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Mercedes G63', 'Banana Island', 'Lagos', 'Abuja', 'SUV', 'Waterfront'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1.5 rounded-lg bg-luxury-card border border-luxury-border text-xs text-luxury-muted hover:text-luxury-ivory hover:border-gold-500/30 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-20">
            <p className="text-xl text-luxury-muted mb-2">NOTHING MATCHED YOUR SEARCH</p>
            <p className="text-sm text-luxury-muted/60 mb-6">Try adjusting your search terms</p>
            <button onClick={() => setQuery('')} className="btn-secondary">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {showVehicles && filteredVehicles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Car className="w-5 h-5 text-gold-400" />
                  <h2 className="text-xl font-medium">Automotive Results</h2>
                  <span className="text-sm text-luxury-muted">({filteredVehicles.length})</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              </div>
            )}

            {showProperties && filteredProperties.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Home className="w-5 h-5 text-gold-400" />
                  <h2 className="text-xl font-medium">Property Results</h2>
                  <span className="text-sm text-luxury-muted">({filteredProperties.length})</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.map((property, i) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isFavorite={isFavorite(property.id)}
                      onToggleFavorite={() => toggleFavorite(property.id)}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </PageLayout>
  );
}

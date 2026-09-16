'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Eye, Clock, Search, ArrowRight, Bookmark, Bell } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { vehicles } from '@/data/vehicles';
import { properties } from '@/data/properties';
import { useFavorites } from '@/hooks/useFavorites';
import { formatPrice } from '@/lib/utils';

type TabType = 'saved' | 'inquiries' | 'offers' | 'viewings';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const savedVehicles = vehicles.filter(v => isFavorite(v.id));
  const savedProperties = properties.filter(p => isFavorite(p.id));

  const stats = [
    { icon: Heart, label: 'Saved', value: favorites.size, color: 'text-rose-400' },
    { icon: MessageSquare, label: 'Inquiries', value: 4, color: 'text-blue-400' },
    { icon: Bookmark, label: 'Offers', value: 2, color: 'text-gold-400' },
    { icon: Eye, label: 'Viewings', value: 3, color: 'text-emerald-400' },
  ];

  const tabs = [
    { key: 'saved' as TabType, label: 'Saved Assets', icon: Heart },
    { key: 'inquiries' as TabType, label: 'Inquiries', icon: MessageSquare },
    { key: 'offers' as TabType, label: 'Offers', icon: Bookmark },
    { key: 'viewings' as TabType, label: 'Viewings', icon: Eye },
  ];

  const mockInquiries = [
    { id: 'i1', asset: '2025 Mercedes-AMG G63', type: 'vehicle', status: 'Under Review', date: '2 days ago' },
    { id: 'i2', asset: '5 Acres — Airport Road', type: 'property', status: 'Seller Replied', date: '1 week ago' },
    { id: 'i3', asset: 'Porsche 911 Turbo S', type: 'vehicle', status: 'Under Review', date: '3 days ago' },
    { id: 'i4', asset: '10 Acres — Eko Atlantic', type: 'property', status: 'New', date: 'Just now' },
  ];

  const mockOffers = [
    { id: 'o1', asset: '2025 Mercedes-AMG G63', amount: 250000000, status: 'Pending', date: '2 days ago' },
    { id: 'o2', asset: '5 Acres — Airport Road', amount: 280000000, status: 'Countered', date: '1 week ago' },
  ];

  const mockViewings = [
    { id: 'v1', asset: '2025 Mercedes-AMG G63', date: 'Aug 28, 2024', time: '10:00 AM', status: 'Scheduled' },
    { id: 'v2', asset: '5 Acres — Airport Road', date: 'Aug 30, 2024', time: '2:00 PM', status: 'Scheduled' },
    { id: 'v3', asset: 'Range Rover Autobiography', date: 'Aug 25, 2024', time: '11:00 AM', status: 'Completed' },
  ];

  return (
    <PageLayout>
      {/* Header */}
      <section className="section-padding pt-12 pb-8 bg-luxury-dark/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <span className="text-gold-400 font-bold">E</span>
            </div>
            <div>
              <p className="text-sm text-luxury-muted">Welcome back,</p>
              <h1 className="text-2xl font-light">Emeka Okafor</h1>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <Bell className="w-3 h-3" /> Verified Buyer
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="section-padding py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-luxury-card rounded-2xl border border-luxury-border"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-luxury-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="section-padding py-4 border-b border-luxury-border/50">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-gold-500 text-luxury-black font-semibold'
                  : 'bg-luxury-card text-luxury-muted border border-luxury-border hover:text-luxury-ivory'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="section-padding py-8 pb-24">
        {activeTab === 'saved' && (
          <div>
            {favorites.size === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-12 h-12 text-luxury-muted/30 mx-auto mb-4" />
                <p className="text-xl text-luxury-muted mb-2">NO SAVED ASSETS</p>
                <p className="text-sm text-luxury-muted/60 mb-6">Your next acquisition could be here.</p>
                <Link href="/automotive" className="btn-primary inline-flex items-center gap-2">
                  Explore Assets <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {savedVehicles.length > 0 && (
                  <div>
                    <h3 className="text-sm text-luxury-muted uppercase tracking-wider mb-4">Saved Vehicles</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedVehicles.map((vehicle, i) => (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Link href={`/automotive/${vehicle.id}`}>
                            <div className="luxury-card group">
                              <div className="relative aspect-[4/3] overflow-hidden">
                                <Image src={vehicle.images[0]} alt={vehicle.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                              </div>
                              <div className="p-4">
                                <h4 className="font-medium group-hover:text-gold-400 transition-colors">{vehicle.title}</h4>
                                <p className="text-gold-400 text-sm mt-1">{formatPrice(vehicle.price)}</p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {savedProperties.length > 0 && (
                  <div>
                    <h3 className="text-sm text-luxury-muted uppercase tracking-wider mb-4">Saved Properties</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedProperties.map((property, i) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Link href={`/property/${property.id}`}>
                            <div className="luxury-card group">
                              <div className="relative aspect-[16/10] overflow-hidden">
                                <Image src={property.images[0]} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                              </div>
                              <div className="p-4">
                                <h4 className="font-medium group-hover:text-gold-400 transition-colors">{property.title}</h4>
                                <p className="text-gold-400 text-sm mt-1">{formatPrice(property.price)}</p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="space-y-3 max-w-3xl">
            {mockInquiries.map((inquiry, i) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-luxury-card rounded-xl border border-luxury-border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    inquiry.type === 'vehicle' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {inquiry.type === 'vehicle' ? <Clock className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{inquiry.asset}</p>
                    <p className="text-xs text-luxury-muted mt-0.5">{inquiry.date}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  inquiry.status === 'Seller Replied' ? 'bg-emerald-500/10 text-emerald-400' :
                  inquiry.status === 'Under Review' ? 'bg-gold-500/10 text-gold-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {inquiry.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-3 max-w-3xl">
            {mockOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-luxury-card rounded-xl border border-luxury-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">{offer.asset}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    offer.status === 'Countered' ? 'bg-rose-500/10 text-rose-400' : 'bg-gold-500/10 text-gold-400'
                  }`}>
                    {offer.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-luxury-muted">Your offer: <span className="text-gold-400 font-medium">{formatPrice(offer.amount)}</span></p>
                  <div className="flex items-center gap-3">
                      <p className="text-xs text-luxury-muted">{offer.date}</p>
                      <a href="/transaction" className="text-xs text-gold-400 hover:underline">View Transaction →</a>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'viewings' && (
          <div className="space-y-3 max-w-3xl">
            {mockViewings.map((viewing, i) => (
              <motion.div
                key={viewing.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-luxury-card rounded-xl border border-luxury-border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{viewing.asset}</p>
                    <p className="text-xs text-luxury-muted mt-0.5">{viewing.date} at {viewing.time}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  viewing.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {viewing.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}

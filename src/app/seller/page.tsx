'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Eye, MessageSquare, Bookmark, Star, CheckCircle2, BarChart3, Settings, Shield } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { vehicles } from '@/data/vehicles';
import { properties } from '@/data/properties';
import { formatPrice } from '@/lib/utils';

type SellerTab = 'overview' | 'listings' | 'messages' | 'offers' | 'analytics';

export default function SellerPage() {
  const [activeTab, setActiveTab] = useState<SellerTab>('overview');

  const allListings = [...vehicles.slice(0, 6), ...properties.slice(0, 4)];

  const stats = [
    { label: 'Total Listings', value: 32, icon: BarChart3, change: '+4 this month' },
    { label: 'Active', value: 12, icon: Eye, change: 'Currently live' },
    { label: 'Sold', value: 8, icon: CheckCircle2, change: 'This year' },
    { label: 'Rating', value: '4.8', icon: Star, change: 'From 24 reviews' },
  ];

  const tabs = [
    { key: 'overview' as SellerTab, label: 'Overview', icon: BarChart3 },
    { key: 'listings' as SellerTab, label: 'Listings', icon: Eye },
    { key: 'messages' as SellerTab, label: 'Messages', icon: MessageSquare },
    { key: 'offers' as SellerTab, label: 'Offers', icon: Bookmark },
    { key: 'analytics' as SellerTab, label: 'Analytics', icon: TrendingUp },
  ];

  const mockMessages = [
    { id: 'm1', from: 'Emeka Okafor', asset: '2025 Mercedes-AMG G63', preview: 'Is the vehicle still available?', time: '2h ago', unread: true },
    { id: 'm2', from: 'Chioma Nwosu', asset: '5 Acres — Airport Road', preview: 'Can we schedule a site visit?', time: '5h ago', unread: true },
    { id: 'm3', from: 'David Adeyemi', asset: 'Range Rover Autobiography', preview: 'Thank you for the information.', time: '1d ago', unread: false },
  ];

  const mockOffers = [
    { id: 'o1', buyer: 'Emeka Okafor', asset: '2025 Mercedes-AMG G63', amount: 250000000, original: 280000000, status: 'pending' },
    { id: 'o2', buyer: 'Chioma Nwosu', asset: '5 Acres — Airport Road', amount: 280000000, original: 300000000, status: 'pending' },
    { id: 'o3', buyer: 'David Adeyemi', asset: 'Porsche 911 Turbo S', amount: 170000000, original: 185000000, status: 'accepted' },
  ];

  return (
    <PageLayout>
      {/* Header */}
      <section className="section-padding pt-12 pb-8 bg-luxury-dark/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <span className="text-gold-400 font-bold text-xl">J</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-light">John AutoHub</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Verified Dealer
                </span>
              </div>
              <p className="text-sm text-luxury-muted">Lagos, Nigeria • 32 Total Listings</p>
            </div>
          </div>
          <Link href="/seller/create" className="btn-primary inline-flex items-center gap-2 self-start">
            <Plus className="w-4 h-4" /> ADD NEW LISTING
          </Link>
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
              <stat.icon className="w-5 h-5 text-gold-400 mb-3" />
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-luxury-muted mt-1">{stat.label}</p>
              <p className="text-xs text-emerald-400 mt-1">{stat.change}</p>
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

      {/* Content */}
      <section className="section-padding py-8 pb-24">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Recent Listings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Listings</h3>
                <button onClick={() => setActiveTab('listings')} className="text-gold-400 text-sm hover:underline">View All</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allListings.slice(0, 4).map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="luxury-card"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30">Active</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gold-400 mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-3 max-w-3xl">
                {[
                  { action: 'New inquiry', detail: 'Emeka Okafor on Mercedes-AMG G63', time: '2 hours ago', icon: MessageSquare },
                  { action: 'Offer received', detail: '₦250M offer on Mercedes-AMG G63', time: '5 hours ago', icon: Bookmark },
                  { action: 'Viewing scheduled', detail: 'Porsche 911 Turbo S — Aug 28', time: '1 day ago', icon: Eye },
                  { action: 'Listing viewed', detail: 'Range Rover Autobiography — 45 views', time: '2 days ago', icon: TrendingUp },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-luxury-card rounded-xl border border-luxury-border">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-luxury-muted truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-luxury-muted flex-shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allListings.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="luxury-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30">Active</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-luxury-muted mt-1">{item.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-gold-400 font-medium">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-1 text-xs text-luxury-muted">
                      <Eye className="w-3 h-3" /> 124
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-3 max-w-3xl">
            {mockMessages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-xl border flex items-center gap-4 cursor-pointer hover:border-gold-500/30 transition-colors ${
                  msg.unread ? 'bg-luxury-card border-luxury-border' : 'bg-luxury-dark/50 border-luxury-border/50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-400 font-bold text-sm">{msg.from[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{msg.from}</p>
                    {msg.unread && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                  </div>
                  <p className="text-xs text-gold-400 mt-0.5">{msg.asset}</p>
                  <p className="text-xs text-luxury-muted mt-1 truncate">{msg.preview}</p>
                </div>
                <span className="text-xs text-luxury-muted flex-shrink-0">{msg.time}</span>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-4 max-w-3xl">
            {mockOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-luxury-card rounded-xl border border-luxury-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-luxury-muted">Offer from <span className="text-luxury-ivory">{offer.buyer}</span></p>
                    <p className="text-xs text-gold-400 mt-1">{offer.asset}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    offer.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gold-500/10 text-gold-400'
                  }`}>
                    {offer.status === 'pending' ? 'Pending' : 'Accepted'}
                  </span>
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <p className="text-xs text-luxury-muted">Listed Price</p>
                    <p className="text-sm font-medium">{formatPrice(offer.original)}</p>
                  </div>
                  <div className="text-luxury-muted">→</div>
                  <div>
                    <p className="text-xs text-luxury-muted">Offer</p>
                    <p className="text-sm font-medium text-gold-400">{formatPrice(offer.amount)}</p>
                  </div>
                  <div className="text-xs text-rose-400">
                    -{Math.round((1 - offer.amount / offer.original) * 100)}%
                  </div>
                </div>
                {offer.status === 'pending' && (
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                      ACCEPT
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/20 transition-colors">
                      DECLINE
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-medium hover:bg-gold-500/20 transition-colors">
                      COUNTER
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Views', value: '2,847', change: '+12%' },
                { label: 'Inquiries', value: '156', change: '+8%' },
                { label: 'Conversion Rate', value: '5.2%', change: '+1.3%' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-luxury-card rounded-2xl border border-luxury-border text-center"
                >
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-luxury-muted mt-1">{stat.label}</p>
                  <p className="text-xs text-emerald-400 mt-1">{stat.change} this month</p>
                </motion.div>
              ))}
            </div>
            <div className="p-8 bg-luxury-card rounded-2xl border border-luxury-border text-center">
              <BarChart3 className="w-12 h-12 text-luxury-muted/30 mx-auto mb-4" />
              <p className="text-luxury-muted">Detailed analytics dashboard coming soon</p>
            </div>
          </div>
        )}
      </section>
    </PageLayout>
  );
}

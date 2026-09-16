'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Shield, Lock, Headphones, Eye, CheckCircle2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { IntroAnimation } from '@/components/animations/IntroAnimation';
import { VehicleCard } from '@/components/listings/VehicleCard';
import { PropertyCard } from '@/components/listings/PropertyCard';
import { vehicles } from '@/data/vehicles';
import { properties } from '@/data/properties';
import { useFavorites } from '@/hooks/useFavorites';

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenIntro = sessionStorage.getItem('assettique-intro');
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    }
  }, []);

  const handleIntroComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('assettique-intro', 'true');
    }
    setShowIntro(false);
  };

  const featuredVehicles = vehicles.filter(v => v.featured).slice(0, 4);
  const featuredProperties = properties.filter(p => p.featured).slice(0, 4);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <PageLayout>
        {/* Hero Section */}
        <section className="relative min-h-[92vh] flex items-center section-padding overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
              alt="Luxury lifestyle"
              fill
              className="object-cover opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/50" />
          </div>

          <div className="relative z-10 max-w-3xl pt-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-gold-400 text-sm tracking-[0.4em] uppercase mb-6"
            >
              Discover. Verify. Acquire.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95]"
            >
              FIND WHAT'S
              <br />
              <span className="gold-gradient-text font-medium">WORTH OWNING.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-lg md:text-xl text-luxury-muted max-w-lg leading-relaxed"
            >
              Luxury automobiles. Premium landed property. 
              <span className="text-luxury-ivory"> Verified opportunities.</span>
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10"
            >
              <div className="relative max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
                <input
                  type="text"
                  placeholder="Search vehicles, properties, locations or keywords..."
                  className="w-full bg-luxury-card/60 backdrop-blur-xl border border-luxury-border rounded-2xl pl-14 pr-36 py-5 text-luxury-ivory placeholder:text-luxury-muted/60 focus:outline-none focus:border-gold-500/40 transition-all"
                />
                <Link
                  href="/search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gold-500 text-luxury-black rounded-xl text-sm font-semibold hover:bg-gold-400 transition-colors"
                >
                  Search
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-14 flex gap-10"
            >
              {[
                { value: '2,500+', label: 'Premium Listings' },
                { value: '850+', label: 'Verified Sellers' },
                { value: '12K+', label: 'Happy Clients' },
                { value: '7', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-semibold text-gold-400">{stat.value}</div>
                  <div className="text-xs text-luxury-muted mt-1 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              {[
                { icon: CheckCircle2, text: 'Verified Listings' },
                { icon: Lock, text: 'Secure Transactions' },
                { icon: Shield, text: 'Private & Confidential' },
                { icon: Headphones, text: 'Expert Support' },
              ].map((badge) => (
                <span key={badge.text} className="flex items-center gap-2 text-xs text-luxury-muted">
                  <badge.icon className="w-3.5 h-3.5 text-gold-400" />
                  {badge.text}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="section-padding py-24">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-3">
              What are you looking for?
            </p>
            <h2 className="text-3xl md:text-4xl font-light">Choose a category to get started</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link href="/automotive">
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden group cursor-pointer border border-luxury-border"
              >
                <Image
                  src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80"
                  alt="Automotive"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-2">Category</p>
                  <h3 className="text-3xl md:text-4xl font-light mb-3">AUTOMOTIVE</h3>
                  <p className="text-sm text-luxury-muted mb-5 max-w-sm">
                    Exceptional vehicles. Verified sellers. Extraordinary ownership.
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium group-hover:gap-3 transition-all">
                    Explore Automotive <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            </Link>

            <Link href="/property">
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden group cursor-pointer border border-luxury-border"
              >
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
                  alt="Property"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-2">Category</p>
                  <h3 className="text-3xl md:text-4xl font-light mb-3">LANDED PROPERTY</h3>
                  <p className="text-sm text-luxury-muted mb-5 max-w-sm">
                    Prime locations. Verified assets. Opportunities worth owning.
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium group-hover:gap-3 transition-all">
                    Explore Property <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="section-padding py-24 bg-luxury-dark/30">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-2">Curated Selection</p>
              <h2 className="text-3xl md:text-4xl font-light">Featured Vehicles</h2>
            </div>
            <Link href="/automotive" className="text-gold-400 text-sm flex items-center gap-1 hover:gap-2 transition-all hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle, i) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorite={isFavorite(vehicle.id)}
                onToggleFavorite={() => toggleFavorite(vehicle.id)}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* Featured Properties */}
        <section className="section-padding py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-2">Prime Locations</p>
              <h2 className="text-3xl md:text-4xl font-light">Featured Properties</h2>
            </div>
            <Link href="/property" className="text-gold-400 text-sm flex items-center gap-1 hover:gap-2 transition-all hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={isFavorite(property.id)}
                onToggleFavorite={() => toggleFavorite(property.id)}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="section-padding py-24 bg-luxury-dark/30">
          <div className="text-center mb-20">
            <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-3">Why ASSETTIQUE</p>
            <h2 className="text-3xl md:text-5xl font-light mb-6">BUY WITH CONFIDENCE.</h2>
            <p className="text-luxury-muted max-w-2xl mx-auto leading-relaxed">
              Every asset on our platform undergoes rigorous verification. 
              Your trust is the foundation of everything we do.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Shield, title: 'Verified Assets', desc: 'Every eligible listing passes a rigorous verification process' },
              { icon: Eye, title: 'Verified Sellers', desc: 'Seller identity and business information fully verified' },
              { icon: Lock, title: 'Secure Transactions', desc: 'End-to-end secure payment and transaction workflows' },
              { icon: Headphones, title: 'Private & Confidential', desc: 'Sensitive buyer and seller information protected' },
              { icon: CheckCircle2, title: 'Expert Support', desc: 'Dedicated assistance for high-value transactions' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/5 border border-gold-500/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-gold-500/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-medium mb-2 text-luxury-ivory">{feature.title}</h3>
                <p className="text-sm text-luxury-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding py-24">
          <div className="relative rounded-3xl overflow-hidden border border-luxury-border">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
                alt="Luxury estate"
                fill
                className="object-cover opacity-20"
              />
            </div>
            <div className="relative z-10 py-20 px-8 text-center">
              <h2 className="text-3xl md:text-5xl font-light mb-4">OWN EXTRAORDINARY.</h2>
              <p className="text-luxury-muted max-w-lg mx-auto mb-8">
                Join Africa's most exclusive marketplace for luxury assets. 
                Verified. Trusted. Exceptional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/automotive" className="btn-primary inline-flex items-center justify-center gap-2">
                  Explore Vehicles
                </Link>
                <Link href="/property" className="btn-secondary inline-flex items-center justify-center gap-2">
                  Explore Property
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}

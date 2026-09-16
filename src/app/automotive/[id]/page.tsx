'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Gauge, Fuel, Settings, Palette, CheckCircle2, Heart, MessageCircle, Eye, ArrowLeft, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { VerificationBadge } from '@/components/ui/Badge';
import { PriceTag } from '@/components/ui/PriceTag';
import { Modal } from '@/components/ui/Modal';
import { vehicles } from '@/data/vehicles';
import { formatPrice } from '@/lib/utils';
import { useApiListing } from '@/hooks/useApiListing';
import { toVehicle } from '@/lib/listingAdapters';
import Loading from '@/app/loading';

export default function VehicleDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const sampleVehicle = vehicles.find(v => v.id === id);
  const { listing, status } = useApiListing(id, 'vehicle', !sampleVehicle);
  const [activeImage, setActiveImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sample listing, or one loaded from the database
  const vehicle = sampleVehicle ?? (listing ? toVehicle(listing) : null);

  if (!vehicle) {
    if (status === 'not-found') notFound();
    if (status === 'error') throw new Error('Could not load this vehicle. Please try again.');
    return <Loading />;
  }

  const specs = [
    { label: 'Year', value: vehicle.year, icon: Calendar },
    { label: 'Mileage', value: vehicle.mileage, icon: Gauge },
    { label: 'Engine', value: vehicle.engine, icon: Settings },
    { label: 'Transmission', value: vehicle.transmission, icon: Settings },
    { label: 'Fuel', value: vehicle.fuel, icon: Fuel },
    { label: 'Drive', value: vehicle.drive, icon: Settings },
    { label: 'Exterior', value: vehicle.exterior, icon: Palette },
    { label: 'Interior', value: vehicle.interior, icon: Palette },
  ].filter((spec) => spec.value);

  const verificationItems = vehicle.verificationStatus !== 'verified' ? [] : [
    'VIN Verified',
    'Ownership Verified',
    'Mileage Verified',
    'Inspection Completed',
    'Documentation Reviewed',
  ];

  const handleSubmitOffer = () => {
    setOfferSubmitted(true);
    setTimeout(() => {
      setShowOfferModal(false);
      setOfferSubmitted(false);
      setOfferAmount('');
      setOfferMessage('');
    }, 2000);
  };

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <section className="section-padding pt-6 pb-2">
        <Link href="/automotive" className="inline-flex items-center gap-2 text-sm text-luxury-muted hover:text-gold-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Automotive
        </Link>
      </section>

      {/* Gallery */}
      <section className="section-padding py-4">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group"
               onClick={() => setShowGallery(true)}>
            <Image
              src={vehicle.images[activeImage]}
              alt={vehicle.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-xs">
              {activeImage + 1} / {vehicle.images.length}
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {vehicle.images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                  activeImage === i ? 'border-gold-500' : 'border-transparent hover:border-luxury-border'
                }`}
              >
                <Image src={img} alt={`${vehicle.title} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        {/* Mobile thumbnails */}
        <div className="flex gap-2 mt-4 lg:hidden overflow-x-auto">
          {vehicle.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                activeImage === i ? 'border-gold-500' : 'border-transparent'
              }`}
            >
              <Image src={img} alt={`${vehicle.title} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="section-padding py-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <VerificationBadge status={vehicle.verificationStatus} className="mb-3" />
                  <h1 className="text-3xl md:text-4xl font-light">{vehicle.title}</h1>
                  <div className="flex items-center gap-2 text-luxury-muted mt-2">
                    <MapPin className="w-4 h-4" />
                    {vehicle.location}
                  </div>
                </div>
                <PriceTag price={vehicle.price} className="text-2xl md:text-3xl whitespace-nowrap" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setShowOfferModal(true)}
                className="btn-primary"
              >
                MAKE AN OFFER
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Eye className="w-4 h-4" /> BOOK VIEWING
              </button>
              <button 
                onClick={() => setSaved(!saved)}
                className={`btn-secondary flex items-center gap-2 ${saved ? 'text-gold-400 border-gold-500/50' : ''}`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} /> {saved ? 'SAVED' : 'SAVE'}
              </button>
            </div>

            {/* Overview */}
            <div className="p-6 bg-luxury-card rounded-2xl border border-luxury-border">
              <h2 className="text-xl font-medium mb-4">Vehicle Overview</h2>
              <p className="text-luxury-muted leading-relaxed">{vehicle.description}</p>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-medium mb-5">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="p-4 bg-luxury-card rounded-xl border border-luxury-border hover:border-gold-500/20 transition-colors">
                    <spec.icon className="w-5 h-5 text-gold-400 mb-3" />
                    <p className="text-xs text-luxury-muted mb-1">{spec.label}</p>
                    <p className="text-sm font-medium text-luxury-ivory">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Report */}
            <div>
              <h2 className="text-xl font-medium mb-5">Verification Report</h2>
              <div className="space-y-2">
                {verificationItems.length === 0 && (
                  <div className="flex items-center gap-3 p-4 bg-luxury-card/50 rounded-xl border border-luxury-border/50">
                    <FileText className="w-5 h-5 text-gold-400 flex-shrink-0" />
                    <span className="text-sm text-luxury-muted">Documents submitted — verification pending</span>
                  </div>
                )}
                {verificationItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-luxury-card/50 rounded-xl border border-luxury-border/50"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Card */}
            <div className="p-6 bg-luxury-card rounded-2xl border border-luxury-border">
              <p className="text-xs text-luxury-muted uppercase tracking-wider mb-4">Seller</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <span className="text-gold-400 font-bold text-lg">{vehicle.seller.name[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-luxury-ivory">{vehicle.seller.name}</p>
                  <p className="text-sm text-luxury-muted capitalize">{vehicle.seller.type} Seller</p>
                </div>
              </div>
              {vehicle.seller.verified && (
                <div className="flex items-center gap-2 mb-4 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Seller
                </div>
              )}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex text-gold-400 text-sm">
                  {'★'.repeat(Math.floor(vehicle.seller.rating))}
                </div>
                <span className="text-sm text-luxury-muted">{vehicle.seller.rating} rating</span>
              </div>
              <button className="w-full btn-secondary flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> CHAT WITH SELLER
              </button>
            </div>

            {/* Price Card */}
            <div className="p-6 bg-luxury-card rounded-2xl border border-luxury-border">
              <p className="text-xs text-luxury-muted uppercase tracking-wider mb-3">Price</p>
              <PriceTag price={vehicle.price} className="text-3xl" />
              <p className="text-xs text-luxury-muted mt-2">Negotiable</p>
              <div className="mt-5 space-y-3">
                <button 
                  onClick={() => setShowOfferModal(true)}
                  className="w-full btn-primary"
                >
                  MAKE AN OFFER
                </button>
                <button className="w-full btn-secondary flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" /> BOOK PRIVATE VIEWING
                </button>
              </div>
            </div>

            {/* Similar Vehicles */}
            <div className="p-6 bg-luxury-card rounded-2xl border border-luxury-border">
              <p className="text-xs text-luxury-muted uppercase tracking-wider mb-4">Similar Vehicles</p>
              <div className="space-y-3">
                {vehicles.filter(v => v.id !== vehicle.id && v.category === vehicle.category).slice(0, 3).map(v => (
                  <Link key={v.id} href={`/automotive/${v.id}`} className="flex gap-3 group">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={v.images[0]} alt={v.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-gold-400 transition-colors line-clamp-1">{v.title}</p>
                      <p className="text-xs text-gold-400 mt-0.5">{formatPrice(v.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setShowGallery(false)}
          >
            <button 
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveImage(Math.max(0, activeImage - 1)); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveImage(Math.min(vehicle.images.length - 1, activeImage + 1)); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-5xl aspect-video mx-8" onClick={(e) => e.stopPropagation()}>
              <Image
                src={vehicle.images[activeImage]}
                alt={vehicle.title}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <Modal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        title={offerSubmitted ? '' : 'Make an Offer'}
      >
        {offerSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Offer Submitted</h3>
            <p className="text-sm text-luxury-muted">The seller will review your offer shortly.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-luxury-muted mb-1">Current Price</p>
              <p className="text-2xl font-semibold text-gold-400">{formatPrice(vehicle.price)}</p>
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-2 block">Your Offer</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted">₦</span>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-luxury-dark border border-luxury-border rounded-xl pl-10 pr-4 py-3 text-luxury-ivory focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-2 block">Message (Optional)</label>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Add a message to the seller..."
                rows={3}
                className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-luxury-ivory focus:outline-none focus:border-gold-500/50 resize-none"
              />
            </div>
            <button 
              onClick={handleSubmitOffer}
              disabled={!offerAmount}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SUBMIT OFFER
            </button>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}

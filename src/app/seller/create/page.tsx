'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Car, Home, Camera, FileText, Tag, Shield, Eye, Upload, CheckCircle2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { formatPrice } from '@/lib/utils';

const steps = [
  { id: 1, label: 'Select Asset', icon: Car },
  { id: 2, label: 'Basic Info', icon: Tag },
  { id: 3, label: 'Photos', icon: Camera },
  { id: 4, label: 'Documents', icon: FileText },
  { id: 5, label: 'Pricing', icon: Tag },
  { id: 6, label: 'Verification', icon: Shield },
  { id: 7, label: 'Preview', icon: Eye },
  { id: 8, label: 'Publish', icon: CheckCircle2 },
];

type FormState = {
  make: string; model: string; year: string; mileage: string; condition: string; vin: string;
  title: string; location: string; landSize: string; propertyType: string; titleType: string;
  description: string; price: string; negotiable: string; imageUrl: string; images: string[];
};

const initialForm: FormState = {
  make: '', model: '', year: '', mileage: '', condition: 'New', vin: '',
  title: '', location: '', landSize: '', propertyType: 'Residential', titleType: 'C of O',
  description: '', price: '', negotiable: 'Yes', imageUrl: '', images: [],
};

export default function CreateListingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assetType, setAssetType] = useState<'vehicle' | 'property' | null>(null);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  // Connects an input to one field of the form
  const bind = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const listingTitle =
    assetType === 'vehicle'
      ? [form.year, form.make, form.model].map((s) => s.trim()).filter(Boolean).join(' ')
      : form.title.trim();
  const priceNaira = Number(form.price);
  const detailPath = assetType === 'vehicle' ? 'automotive' : 'property';

  // Returns what's missing on a step, or null if the step is complete
  const stepError = (step: number): string | null => {
    if (step === 1 && !assetType) return "Choose what you're listing.";
    if (step === 2) {
      if (assetType === 'vehicle' && (!form.make.trim() || !form.model.trim() || !form.year.trim()))
        return 'Make, model and year are required.';
      if (assetType === 'property' && !form.title.trim()) return 'Property title is required.';
      if (!form.location.trim()) return 'Location is required.';
    }
    if (step === 5 && !(priceNaira > 0)) return 'Enter an asking price in naira.';
    return null;
  };

  const nextStep = () => {
    const problem = stepError(currentStep);
    setError(problem);
    if (!problem) setCurrentStep(s => Math.min(8, s + 1));
  };
  const prevStep = () => {
    setError(null);
    setCurrentStep(s => Math.max(1, s - 1));
  };

  const addImage = () => {
    const url = form.imageUrl.trim();
    if (!/^https:\/\/\S+$/i.test(url)) return setError('Image links must start with https://');
    if (form.images.length >= 20) return setError('You can add up to 20 photos.');
    setError(null);
    setForm((f) => ({ ...f, images: [...f.images, url], imageUrl: '' }));
  };

  const removeImage = (index: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));

  const resetForm = () => {
    setPublished(false);
    setCurrentStep(1);
    setAssetType(null);
    setForm(initialForm);
    setCreatedId(null);
    setError(null);
  };

  const handlePublish = async () => {
    setSubmitting(true);
    setError(null);

    const rawSpecs =
      assetType === 'vehicle'
        ? { make: form.make, model: form.model, year: form.year, mileage: form.mileage,
            condition: form.condition, vin: form.vin, negotiable: form.negotiable }
        : { landSize: form.landSize, propertyType: form.propertyType,
            titleType: form.titleType, negotiable: form.negotiable };
    // Drop empty fields so detail pages don't show blank rows
    const specs = Object.fromEntries(
      Object.entries(rawSpecs).map(([k, v]) => [k, v.trim()]).filter(([, v]) => v)
    );

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: listingTitle,
          description: form.description.trim(),
          type: assetType,
          price: priceNaira, // naira — the API converts to kobo
          location: form.location.trim(),
          category: assetType === 'property' ? form.propertyType : undefined,
          specs,
          images: form.images,
          publish: true,
        }),
      });
      if (res.status === 401) {
        throw new Error('Your session has expired. Sign in again in a new tab (/login), then come back and press Publish — your details are still here.');
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not publish your listing.');
      setCreatedId(data.id);
      setPublished(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not publish your listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="section-padding py-8 pb-24 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-2">Seller Portal</p>
          <h1 className="text-3xl md:text-4xl font-light">CREATE LISTING</h1>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  currentStep > step.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  currentStep === step.id ? 'bg-gold-500 text-luxury-black' :
                  'bg-luxury-card text-luxury-muted border border-luxury-border'
                }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-colors ${
                    currentStep > step.id ? 'bg-emerald-500/30' : 'bg-luxury-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-luxury-muted uppercase tracking-wider">
            {steps.map(s => (
              <span key={s.id} className={currentStep === s.id ? 'text-gold-400' : ''}>{s.label}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {published ? (
            <motion.div
              key="published"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Listing Published!</h2>
              <p className="text-luxury-muted mb-8">Your asset is now live and visible to qualified buyers.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={resetForm} className="btn-secondary">Create Another</button>
                {createdId && (
                  <a href={`/${detailPath}/${createdId}`} className="btn-secondary">View Listing</a>
                )}
                <a href="/seller" className="btn-primary">Go to Dashboard</a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-luxury-card rounded-2xl border border-luxury-border p-8"
            >
              {/* Step 1: Select Asset */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-medium mb-6">What are you listing?</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setAssetType('vehicle')}
                      className={`p-8 rounded-xl border-2 transition-all text-center ${
                        assetType === 'vehicle' ? 'border-gold-500 bg-gold-500/5' : 'border-luxury-border hover:border-gold-500/30'
                      }`}
                    >
                      <Car className="w-10 h-10 mx-auto mb-4 text-gold-400" />
                      <h3 className="font-medium mb-1">Automotive</h3>
                      <p className="text-xs text-luxury-muted">Cars, SUVs, Exotics, Classics</p>
                    </button>
                    <button
                      onClick={() => setAssetType('property')}
                      className={`p-8 rounded-xl border-2 transition-all text-center ${
                        assetType === 'property' ? 'border-gold-500 bg-gold-500/5' : 'border-luxury-border hover:border-gold-500/30'
                      }`}
                    >
                      <Home className="w-10 h-10 mx-auto mb-4 text-gold-400" />
                      <h3 className="font-medium mb-1">Landed Property</h3>
                      <p className="text-xs text-luxury-muted">Land, Estates, Commercial</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Info */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium mb-4">Basic Information</h2>
                  {assetType === 'vehicle' ? (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Make</label>
                          <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="e.g. Mercedes-Benz" {...bind('make')} />
                        </div>
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Model</label>
                          <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="e.g. G63 AMG" {...bind('model')} />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Year</label>
                          <input type="number" min={1900} max={2100} className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="2025" {...bind('year')} />
                        </div>
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Mileage</label>
                          <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="e.g. 1,200 km" {...bind('mileage')} />
                        </div>
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Condition</label>
                          <select className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory" {...bind('condition')}>
                            <option>New</option><option>Used</option><option>Certified Pre-Owned</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-luxury-muted mb-1 block">VIN</label>
                        <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="Vehicle Identification Number" {...bind('vin')} />
                      </div>
                      <div>
                        <label className="text-sm text-luxury-muted mb-1 block">Location</label>
                        <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="City, Country" {...bind('location')} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm text-luxury-muted mb-1 block">Property Title</label>
                        <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="e.g. 5 Acres — Airport Road" {...bind('title')} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Location</label>
                          <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="City, Country" {...bind('location')} />
                        </div>
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Land Size</label>
                          <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="e.g. 5 Acres" {...bind('landSize')} />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Property Type</label>
                          <select className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory" {...bind('propertyType')}>
                            <option>Residential</option><option>Commercial</option><option>Estate Land</option><option>Waterfront</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-luxury-muted mb-1 block">Title Type</label>
                          <select className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory" {...bind('titleType')}>
                            <option>C of O</option><option>Governor's Consent</option><option>R of O</option><option>Freehold</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Description</label>
                    <textarea rows={4} className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 resize-none" placeholder="Describe your asset..." {...bind('description')} />
                  </div>
                </div>
              )}

              {/* Step 3: Photos */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-medium mb-4">Photos & Video</h2>
                  <div className="border-2 border-dashed border-luxury-border rounded-2xl p-8 text-center">
                    <Camera className="w-10 h-10 text-luxury-muted mx-auto mb-4" />
                    <p className="text-sm text-luxury-muted mb-2">Direct photo uploads are coming soon</p>
                    <p className="text-xs text-luxury-muted/60">For now, paste links to your photos (https://…). Max 20 photos.</p>
                    <div className="mt-5 flex gap-2 max-w-lg mx-auto">
                      <input
                        type="url"
                        placeholder="https://…/photo.jpg"
                        className="flex-1 min-w-0 bg-luxury-dark border border-luxury-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500/50"
                        {...bind('imageUrl')}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                      />
                      <button onClick={addImage} className="px-4 py-2 rounded-lg bg-luxury-dark border border-luxury-border text-sm hover:border-gold-500/30 transition-colors whitespace-nowrap">
                        <Upload className="w-4 h-4 inline mr-2" /> Add Photo
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-4 gap-3">
                    {form.images.map((url, i) => (
                      <div key={`${url}-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-luxury-dark border border-luxury-border group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          aria-label={`Remove photo ${i + 1}`}
                          className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/70 text-xs opacity-80 hover:opacity-100"
                        >
                          ✕
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-gold-400">COVER</span>
                        )}
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - form.images.length) }, (_, i) => (
                      <div key={`empty-${i}`} className="aspect-square rounded-xl bg-luxury-dark border border-luxury-border flex items-center justify-center">
                        <span className="text-xs text-luxury-muted/40">Photo {form.images.length + i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium mb-4">Documentation</h2>
                  {assetType === 'vehicle' ? (
                    <>
                      {['Vehicle Registration', 'Insurance Certificate', 'Service History', 'Inspection Report'].map(doc => (
                        <div key={doc} className="flex items-center justify-between p-4 bg-luxury-dark rounded-xl border border-luxury-border">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gold-400" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <button className="px-3 py-1.5 rounded-lg bg-luxury-card border border-luxury-border text-xs hover:border-gold-500/30 transition-colors">
                            <Upload className="w-3 h-3 inline mr-1" /> Upload
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {['Title Document', 'Survey Plan', 'Deed of Assignment', 'Location Verification'].map(doc => (
                        <div key={doc} className="flex items-center justify-between p-4 bg-luxury-dark rounded-xl border border-luxury-border">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gold-400" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <button className="px-3 py-1.5 rounded-lg bg-luxury-card border border-luxury-border text-xs hover:border-gold-500/30 transition-colors">
                            <Upload className="w-3 h-3 inline mr-1" /> Upload
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Step 5: Pricing */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium mb-4">Pricing</h2>
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Asking Price (₦)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted">₦</span>
                      <input type="number" min={1} className="w-full bg-luxury-dark border border-luxury-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="e.g. 280000000" {...bind('price')} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-luxury-muted mb-1 block">Negotiable?</label>
                      <select className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory" {...bind('negotiable')}>
                        <option>Yes</option><option>No</option><option>Price on Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-luxury-muted mb-1 block">Currency</label>
                      <select className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory">
                        <option>NGN (₦)</option><option disabled>USD ($) — coming soon</option><option disabled>GBP (£) — coming soon</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Verification */}
              {currentStep === 6 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium mb-4">Verification</h2>
                  <p className="text-sm text-luxury-muted mb-4">Complete verification to increase buyer trust and listing visibility.</p>
                  {[
                    { label: 'Identity Verification', desc: 'Government-issued ID required', done: true },
                    { label: 'Asset Ownership Proof', desc: 'Documents proving you own this asset', done: false },
                    { label: 'Address Verification', desc: 'Utility bill or bank statement', done: false },
                    { label: 'Phone Verification', desc: 'SMS code confirmation', done: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-luxury-dark rounded-xl border border-luxury-border">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-500/20' : 'bg-luxury-card border border-luxury-border'}`}>
                          {item.done ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-xs text-luxury-muted">{i + 1}</span>}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-luxury-muted">{item.desc}</p>
                        </div>
                      </div>
                      <button className={`px-3 py-1.5 rounded-lg text-xs ${item.done ? 'text-emerald-400' : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'}`}>
                        {item.done ? 'Verified' : 'Verify'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 7: Preview */}
              {currentStep === 7 && (
                <div>
                  <h2 className="text-xl font-medium mb-4">Preview</h2>
                  <div className="bg-luxury-dark rounded-xl border border-luxury-border p-6">
                    <div className="relative aspect-video rounded-xl bg-luxury-card border border-luxury-border mb-4 flex items-center justify-center overflow-hidden">
                      {form.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.images[0]} alt={listingTitle} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-8 h-8 text-luxury-muted/30" />
                      )}
                    </div>
                    <h3 className="text-lg font-medium mb-1">{listingTitle || 'Untitled listing'}</h3>
                    <p className="text-sm text-luxury-muted mb-3">
                      {(assetType === 'vehicle'
                        ? [form.location, form.mileage, form.condition]
                        : [form.location, form.landSize, form.titleType]
                      ).map((s) => s.trim()).filter(Boolean).join(' • ')}
                    </p>
                    <p className="text-xl text-gold-400 font-semibold">{priceNaira > 0 ? formatPrice(priceNaira) : '—'}</p>
                    {form.description.trim() && (
                      <p className="text-sm text-luxury-muted mt-3 whitespace-pre-line">{form.description.trim()}</p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 rounded-full bg-luxury-card text-luxury-muted text-xs border border-luxury-border">PENDING VERIFICATION</span>
                      <span className="px-2 py-1 rounded-full bg-luxury-card text-luxury-muted text-xs border border-luxury-border">
                        {form.negotiable === 'Yes' ? 'Negotiable' : form.negotiable === 'No' ? 'Fixed Price' : 'Price on Request'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Publish */}
              {currentStep === 8 && (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                  <h2 className="text-xl font-medium mb-2">Ready to Publish?</h2>
                  <p className="text-sm text-luxury-muted mb-8 max-w-md mx-auto">
                    Your listing goes live as soon as you publish. Our team will then review your
                    documents — verified listings get 3x more views.
                  </p>
                  <div className="space-y-3 max-w-sm mx-auto text-left mb-8">
                    {["Listing will be visible to all buyers", "You'll receive inquiry notifications", 'Offers can be managed from your dashboard', 'Listing can be edited anytime'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-luxury-muted">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <button onClick={handlePublish} disabled={submitting} className="btn-primary px-12 disabled:opacity-50">
                    {submitting ? 'PUBLISHING…' : 'PUBLISH LISTING'}
                  </button>
                </div>
              )}

              {error && (
                <p role="alert" className="mt-6 text-sm text-rose-400 text-center">{error}</p>
              )}

              {/* Navigation */}
              {currentStep < 8 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-luxury-border/50">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-luxury-border text-sm hover:border-gold-500/30 transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-luxury-black text-sm font-medium hover:bg-gold-400 transition-colors"
                  >
                    {currentStep === 7 ? 'Continue' : 'Next'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

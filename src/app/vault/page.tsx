'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Eye } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { VaultCard } from '@/components/vault/VaultCard';
import { Modal } from '@/components/ui/Modal';
import { vaultItems } from '@/data/vault';

export default function VaultPage() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interest: '',
    budget: '',
    location: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleRequestAccess = (itemId: string) => {
    setSelectedItem(itemId);
    setShowRequestModal(true);
    setSubmitted(false);
    setFormData({ fullName: '', email: '', phone: '', interest: '', budget: '', location: '' });
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setSubmitted(false);
    }, 2500);
  };

  const item = vaultItems.find(i => i.id === selectedItem);

  return (
    <PageLayout>
      {/* Header */}
      <section className="section-padding pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-gold-400" />
          </div>
          <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-3">Exclusive Access</p>
          <h1 className="text-4xl md:text-6xl font-light mb-4">THE VAULT</h1>
          <p className="text-luxury-muted text-lg max-w-xl mx-auto">
            Private opportunities for qualified buyers. Off-market vehicles, ultra-luxury cars, 
            large estates, and confidential property opportunities.
          </p>
        </motion.div>
      </section>

      {/* Trust indicators */}
      <section className="section-padding pb-12">
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { icon: Shield, label: 'NDA Protected', desc: 'All inquiries are confidential' },
            { icon: Eye, label: 'Qualified Buyers Only', desc: 'Verified financial capacity' },
            { icon: Lock, label: 'Off-Market', desc: 'Not publicly listed elsewhere' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-gold-400" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-luxury-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vaultItems.map((item, i) => (
            <VaultCard
              key={item.id}
              item={item}
              onRequestAccess={() => handleRequestAccess(item.id)}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Request Access Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title={submitted ? '' : 'Request Access'}
      >
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Request Received</h3>
            <p className="text-sm text-luxury-muted">
              Our team will review your application and contact you within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {item && (
              <div className="p-3 bg-luxury-dark rounded-xl border border-luxury-border mb-4">
                <p className="text-xs text-luxury-muted">Requesting access for:</p>
                <p className="text-sm font-medium text-gold-400">{item.title}</p>
              </div>
            )}
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500/50"
                placeholder="Your full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-luxury-muted mb-1 block">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500/50"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-luxury-muted mb-1 block">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500/50"
                  placeholder="+234..."
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-luxury-muted mb-1 block">Interest</label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory"
              >
                <option value="">Select interest...</option>
                <option value="purchase">Direct Purchase</option>
                <option value="investment">Investment</option>
                <option value="development">Development</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-luxury-muted mb-1 block">Budget Range</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory"
                >
                  <option value="">Select...</option>
                  <option value="100m-500m">₦100M - ₦500M</option>
                  <option value="500m-1b">₦500M - ₦1B</option>
                  <option value="1b+">₦1B+</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-luxury-muted mb-1 block">Preferred Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500/50"
                  placeholder="City, Country"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!formData.fullName || !formData.email}
              className="w-full btn-primary disabled:opacity-50 mt-2"
            >
              SUBMIT REQUEST
            </button>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}

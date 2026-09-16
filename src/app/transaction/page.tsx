'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ArrowRight, FileText, CreditCard, Key, Shield, MessageSquare } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { formatPrice } from '@/lib/utils';

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  icon: React.ElementType;
}

const transactionSteps: TimelineStep[] = [
  { id: '1', label: 'Offer Submitted', description: 'Your offer of ₦250,000,000 was submitted', status: 'completed', date: 'Aug 20, 2024', icon: FileText },
  { id: '2', label: 'Seller Accepted', description: 'The seller has accepted your offer', status: 'completed', date: 'Aug 21, 2024', icon: CheckCircle2 },
  { id: '3', label: 'Verification', description: 'Asset documentation being verified', status: 'current', date: 'In Progress', icon: Shield },
  { id: '4', label: 'Inspection', description: 'Schedule your private viewing', status: 'pending', icon: Clock },
  { id: '5', label: 'Payment', description: 'Secure escrow payment', status: 'pending', icon: CreditCard },
  { id: '6', label: 'Documentation', description: 'Transfer of ownership documents', status: 'pending', icon: FileText },
  { id: '7', label: 'Transfer', description: 'Asset handover to buyer', status: 'pending', icon: ArrowRight },
  { id: '8', label: 'Completed', description: 'Transaction successfully completed', status: 'pending', icon: Key },
];

export default function TransactionPage() {
  const [activeStep, setActiveStep] = useState('3');

  return (
    <PageLayout>
      <div className="section-padding py-8 pb-24 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-2">Transaction #TXN-2024-0892</p>
          <h1 className="text-3xl md:text-4xl font-light mb-2">TRANSACTION STATUS</h1>
          <p className="text-luxury-muted">2025 Mercedes-AMG G63 • {formatPrice(280000000)}</p>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Completed', value: '2', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'In Progress', value: '1', color: 'text-gold-400', bg: 'bg-gold-500/10' },
            { label: 'Pending', value: '5', color: 'text-luxury-muted', bg: 'bg-luxury-card' },
            { label: 'Total Steps', value: '8', color: 'text-luxury-ivory', bg: 'bg-luxury-card' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border border-luxury-border ${stat.bg}`}
            >
              <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-luxury-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-luxury-card rounded-2xl border border-luxury-border p-8">
          <h2 className="text-lg font-medium mb-8">Transaction Timeline</h2>
          <div className="space-y-0">
            {transactionSteps.map((step, i) => {
              const isLast = i === transactionSteps.length - 1;
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-5"
                  onClick={() => setActiveStep(step.id)}
                >
                  {/* Line */}
                  {!isLast && (
                    <div className={`absolute left-5 top-10 w-px h-full ${
                      step.status === 'completed' ? 'bg-emerald-500/30' : 'bg-luxury-border'
                    }`} />
                  )}

                  {/* Icon */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                    step.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                    step.status === 'current' ? 'bg-gold-500/20 border-gold-500 text-gold-400' :
                    'bg-luxury-dark border-luxury-border text-luxury-muted'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className={`pb-8 flex-1 ${activeStep === step.id ? '' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-medium ${step.status === 'pending' ? 'text-luxury-muted' : 'text-luxury-ivory'}`}>
                          {step.label}
                        </h3>
                        <p className="text-sm text-luxury-muted mt-1">{step.description}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-4 ${
                        step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        step.status === 'current' ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' :
                        'bg-luxury-dark text-luxury-muted border border-luxury-border'
                      }`}>
                        {step.status === 'completed' ? 'Done' : step.status === 'current' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                    {step.date && (
                      <p className="text-xs text-luxury-muted/60 mt-2">{step.date}</p>
                    )}

                    {/* Action buttons for current step */}
                    {step.status === 'current' && (
                      <div className="mt-4 flex gap-3">
                        <button className="px-4 py-2 rounded-lg bg-gold-500 text-luxury-black text-xs font-medium hover:bg-gold-400 transition-colors">
                          Complete Verification
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-luxury-dark border border-luxury-border text-xs hover:border-gold-500/30 transition-colors flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Contact Support
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-luxury-card rounded-2xl border border-luxury-border">
            <h3 className="text-sm font-medium mb-4">Transaction Details</h3>
            <div className="space-y-3">
              {[
                { label: 'Transaction ID', value: 'TXN-2024-0892' },
                { label: 'Asset', value: '2025 Mercedes-AMG G63' },
                { label: 'Listed Price', value: formatPrice(280000000) },
                { label: 'Offer Price', value: formatPrice(250000000) },
                { label: 'Date Started', value: 'Aug 20, 2024' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-luxury-muted">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-luxury-card rounded-2xl border border-luxury-border">
            <h3 className="text-sm font-medium mb-4">Parties</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <span className="text-gold-400 font-bold text-sm">E</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Emeka Okafor (Buyer)</p>
                  <p className="text-xs text-luxury-muted">Verified Buyer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium">AutoHub Nigeria (Seller)</p>
                  <p className="text-xs text-luxury-muted">Verified Dealer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

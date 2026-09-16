'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, User, Mail, Building2, FileText, Eye, CheckCircle2, Shield, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

const verifySteps = [
  { id: 1, label: 'Identity', icon: User, desc: 'Government-issued ID' },
  { id: 2, label: 'Contact', icon: Mail, desc: 'Phone & email verification' },
  { id: 3, label: 'Business', icon: Building2, desc: 'Company information' },
  { id: 4, label: 'Documents', icon: FileText, desc: 'Upload required docs' },
  { id: 5, label: 'Review', icon: Eye, desc: 'Review your details' },
  { id: 6, label: 'Approval', icon: CheckCircle2, desc: 'Await verification' },
];

export default function SellerVerifyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState<number[]>([1, 2]);
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => {
    if (currentStep < 6) {
      setCompleted(prev => Array.from(new Set([...prev, currentStep])));
      setCurrentStep(s => s + 1);
    }
  };
  const prevStep = () => setCurrentStep(s => Math.max(1, s - 1));

  const handleSubmit = () => {
    setCompleted(prev => Array.from(new Set([...prev, 6])));
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <div className="section-padding py-8 pb-24 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-4">
            <Shield className="w-3 h-3" /> Seller Verification
          </div>
          <h1 className="text-3xl md:text-4xl font-light">BECOME A VERIFIED SELLER</h1>
          <p className="text-luxury-muted mt-2">Complete verification to unlock premium features and build buyer trust.</p>
        </div>

        {/* Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {verifySteps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    completed.includes(step.id) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    currentStep === step.id ? 'bg-gold-500 text-luxury-black' :
                    'bg-luxury-card text-luxury-muted border border-luxury-border'
                  }`}
                >
                  {completed.includes(step.id) ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </button>
                {i < verifySteps.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${completed.includes(step.id + 1) || completed.includes(step.id) ? 'bg-emerald-500/30' : 'bg-luxury-border'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {verifySteps.map(s => (
              <div key={s.id} className="text-center w-10">
                <span className={`text-[9px] uppercase tracking-wider ${currentStep === s.id ? 'text-gold-400' : 'text-luxury-muted'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-luxury-card rounded-2xl border border-luxury-border"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Verification Submitted</h2>
              <p className="text-luxury-muted mb-2">Your application is under review.</p>
              <p className="text-sm text-luxury-muted/60 mb-8">You'll receive a decision within 2-3 business days.</p>
              <div className="flex gap-4 justify-center">
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
              {/* Step 1: Identity */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium">Identity Verification</h2>
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Full Name (as on ID)</label>
                    <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="John Doe" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-luxury-muted mb-1 block">ID Type</label>
                      <select className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory">
                        <option>International Passport</option><option>National ID</option><option>Driver's License</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-luxury-muted mb-1 block">ID Number</label>
                      <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="A12345678" />
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-luxury-border rounded-xl p-8 text-center hover:border-gold-500/30 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-luxury-muted mx-auto mb-2" />
                    <p className="text-xs text-luxury-muted">Upload a clear photo of your ID</p>
                  </div>
                </div>
              )}

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium">Contact Verification</h2>
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Email Address</label>
                    <input type="email" className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Phone Number</label>
                    <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="+234 800 000 0000" />
                  </div>
                  <div className="p-4 bg-luxury-dark rounded-xl border border-luxury-border">
                    <p className="text-sm text-luxury-muted">We'll send a verification code to confirm your contact details.</p>
                    <button className="mt-3 px-4 py-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium">
                      Send Verification Code
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Business */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium">Business Information</h2>
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Business Type</label>
                    <select className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 text-luxury-ivory">
                      <option>Registered Company</option><option>Sole Proprietor</option><option>Individual Seller</option><option>Real Estate Agency</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Business Name</label>
                    <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="Your business name" />
                  </div>
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Registration Number (CAC)</label>
                    <input className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50" placeholder="RC 123456" />
                  </div>
                  <div>
                    <label className="text-sm text-luxury-muted mb-1 block">Business Address</label>
                    <textarea rows={2} className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 resize-none" placeholder="Full business address" />
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium">Document Upload</h2>
                  {[
                    { label: 'Business Registration Certificate', required: true },
                    { label: 'Tax Identification Number (TIN)', required: true },
                    { label: 'Bank Statement (last 3 months)', required: false },
                    { label: 'Professional License (if applicable)', required: false },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-luxury-dark rounded-xl border border-luxury-border">
                      <div>
                        <p className="text-sm font-medium">{doc.label}</p>
                        <p className="text-xs text-luxury-muted">{doc.required ? 'Required' : 'Optional'}</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-luxury-card border border-luxury-border text-xs hover:border-gold-500/30 transition-colors">
                        <Upload className="w-3 h-3 inline mr-1" /> Upload
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-medium">Review Your Details</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Full Name', value: 'John AutoHub' },
                      { label: 'ID Type', value: 'International Passport' },
                      { label: 'Email', value: 'john@autohub.ng' },
                      { label: 'Phone', value: '+234 803 456 7890' },
                      { label: 'Business', value: 'AutoHub Nigeria Ltd' },
                      { label: 'Business Type', value: 'Registered Company' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between p-3 bg-luxury-dark rounded-xl border border-luxury-border">
                        <span className="text-sm text-luxury-muted">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gold-500/5 rounded-xl border border-gold-500/20">
                    <p className="text-xs text-gold-400">
                      By submitting, you confirm all information is accurate and agree to our verification terms.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 6: Approval */}
              {currentStep === 6 && (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                  <h2 className="text-xl font-medium mb-2">Submit for Approval</h2>
                  <p className="text-sm text-luxury-muted mb-8 max-w-md mx-auto">
                    Our verification team will review your application. This typically takes 2-3 business days.
                  </p>
                  <div className="space-y-3 max-w-sm mx-auto text-left mb-8">
                    {['Identity documents reviewed', 'Contact details verified', 'Business registration checked', 'Background verification completed'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-luxury-muted">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSubmit} className="btn-primary px-12">
                    SUBMIT FOR APPROVAL
                  </button>
                </div>
              )}

              {/* Nav */}
              {currentStep < 6 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-luxury-border/50">
                  <button onClick={prevStep} disabled={currentStep === 1}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-luxury-border text-sm hover:border-gold-500/30 transition-colors disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={nextStep}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-luxury-black text-sm font-medium hover:bg-gold-400 transition-colors">
                    Next <ChevronRight className="w-4 h-4" />
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

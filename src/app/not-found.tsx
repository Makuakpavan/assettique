'use client';

import { motion } from 'framer-motion';
import { SearchX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-luxury-card border border-luxury-border flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-10 h-10 text-luxury-muted" />
        </div>
        <h1 className="text-6xl font-light text-gold-400 mb-2">404</h1>
        <h2 className="text-2xl font-light mb-3">Page Not Found</h2>
        <p className="text-luxury-muted mb-8">
          The asset or page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-luxury-black rounded-xl text-sm font-medium hover:bg-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </div>
        <h1 className="text-3xl font-light mb-3">Something Went Wrong</h1>
        <p className="text-luxury-muted mb-2">
          We couldn't load this page. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-luxury-muted/50 mb-8 font-mono">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-luxury-black rounded-xl text-sm font-medium hover:bg-gold-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-luxury-card border border-luxury-border rounded-xl text-sm hover:border-gold-500/30 transition-colors"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

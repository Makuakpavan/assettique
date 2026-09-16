'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="relative w-16 h-16 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-2 border-luxury-border border-t-gold-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gold-400 font-bold text-lg">A</span>
          </div>
        </div>
        <p className="text-sm text-luxury-muted tracking-wider">LOADING...</p>
      </motion.div>
    </div>
  );
}

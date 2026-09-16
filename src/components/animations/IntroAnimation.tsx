'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [scene, setScene] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setTimeout(onComplete, 500);
      return;
    }

    const scenes = [2000, 4000, 6000, 8000, 10000, 12000];
    const timers = scenes.map((delay, index) =>
      setTimeout(() => setScene(index + 1), delay)
    );

    const completeTimer = setTimeout(onComplete, 13500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete, shouldReduceMotion]);

  const handleSkip = () => {
    setSkipped(true);
    onComplete();
  };

  if (skipped) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-[100] bg-luxury-black flex items-center justify-center"
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-xs text-luxury-muted hover:text-luxury-ivory transition-colors z-10"
        >
          Skip Intro
        </button>

        {/* Scene 1: Darkness */}
        <AnimatePresence mode="wait">
          {scene === 0 && (
            <motion.div
              key="scene1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="text-center px-4"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="text-lg md:text-2xl font-light tracking-[0.3em] text-luxury-ivory/90"
              >
                NOT EVERYTHING
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="text-lg md:text-2xl font-light tracking-[0.3em] text-luxury-ivory/90 mt-2"
              >
                WORTH OWNING
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.9 }}
                className="text-lg md:text-2xl font-light tracking-[0.3em] text-luxury-ivory/90 mt-2"
              >
                IS ORDINARY.
              </motion.p>
            </motion.div>
          )}

          {/* Scene 2: Automotive */}
          {scene === 1 && (
            <motion.div
              key="scene2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative z-10 text-center">
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '1em' }}
                  animate={{ opacity: 1, letterSpacing: '0.5em' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="text-3xl md:text-5xl font-light tracking-widest text-luxury-ivory"
                >
                  POWER.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '1em' }}
                  animate={{ opacity: 1, letterSpacing: '0.5em' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="text-3xl md:text-5xl font-light tracking-widest text-luxury-ivory mt-2"
                >
                  PRECISION.
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Scene 3: Property */}
          {scene === 2 && (
            <motion.div
              key="scene3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative z-10 text-center">
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '1em' }}
                  animate={{ opacity: 1, letterSpacing: '0.5em' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="text-3xl md:text-5xl font-light tracking-widest text-luxury-ivory"
                >
                  POSSIBILITY.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '1em' }}
                  animate={{ opacity: 1, letterSpacing: '0.5em' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="text-3xl md:text-5xl font-light tracking-widest text-luxury-ivory mt-2"
                >
                  LEGACY.
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Scene 4: Categories */}
          {scene === 3 && (
            <motion.div
              key="scene4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 1 }}
                className="text-2xl md:text-4xl font-light tracking-[0.3em] text-luxury-ivory/80"
              >
                AUTOMOTIVE
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-6xl font-light text-gold-400 my-4"
              >
                &
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-2xl md:text-4xl font-light tracking-[0.3em] text-luxury-ivory/80"
              >
                LANDED PROPERTY
              </motion.p>
            </motion.div>
          )}

          {/* Scene 5: Logo Reveal */}
          {scene === 4 && (
            <motion.div
              key="scene5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-gold-500 flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-gold-400 font-bold text-3xl md:text-4xl">A</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-3xl md:text-5xl font-semibold tracking-[0.4em] text-luxury-ivory"
              >
                ASSETTIQUE
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-sm md:text-base tracking-[0.5em] text-gold-400 mt-4"
              >
                DISCOVER. VERIFY. ACQUIRE.
              </motion.p>
            </motion.div>
          )}

          {/* Scene 6: Enter */}
          {scene === 5 && (
            <motion.div
              key="scene6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-xl md:text-2xl font-light tracking-[0.3em] text-luxury-ivory/90 mb-8"
              >
                ENTER EXPERIENCE
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="w-48 h-px bg-gold-400 mx-auto origin-left"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

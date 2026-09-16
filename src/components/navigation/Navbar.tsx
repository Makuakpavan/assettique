'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Bell, User, Sparkles, LogOut } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/automotive', label: 'Automotive' },
  { href: '/property', label: 'Property' },
  { href: '/vault', label: 'The Vault' },
  { href: '/ai-match', label: 'AI Match', icon: Sparkles },
  { href: '/search', label: 'Search' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, loading: userLoading } = useUser();

  const handleSignOut = async () => {
    setIsOpen(false);
    await createClient().auth.signOut();
    // Full page load so no signed-in pages linger in the client-side cache
    window.location.assign('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-40 bg-luxury-black/80 backdrop-blur-xl border-b border-luxury-border/50"
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-gold-500 flex items-center justify-center">
                <span className="text-gold-400 font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold tracking-wider text-luxury-ivory hidden sm:block">
                ASSETTIQUE
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-luxury-muted hover:text-luxury-ivory transition-colors relative group flex items-center gap-1.5"
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 text-gold-400" />}
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Search className="w-5 h-5 text-luxury-muted" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative hidden sm:block">
                <Bell className="w-5 h-5 text-luxury-muted" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
              </button>
              {!userLoading && (user ? (
                <>
                  <Link
                    href="/dashboard"
                    aria-label="My dashboard"
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors hidden sm:block"
                  >
                    <User className="w-5 h-5 text-luxury-muted" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    aria-label="Sign out"
                    title="Sign out"
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors hidden sm:block"
                  >
                    <LogOut className="w-5 h-5 text-luxury-muted" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:block px-3 py-2 rounded-lg text-sm text-luxury-muted hover:text-luxury-ivory hover:bg-white/5 transition-colors"
                >
                  Sign in
                </Link>
              ))}
              <Link
                href="/seller"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gold-500 text-luxury-black rounded-lg text-sm font-medium hover:bg-gold-400 transition-colors"
              >
                SELL AN ASSET
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-luxury-border/50 overflow-hidden"
            >
              <div className="section-padding py-4">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
                  <input
                    type="text"
                    placeholder="Search vehicles, properties, locations or keywords..."
                    className="w-full bg-luxury-dark border border-luxury-border rounded-xl pl-12 pr-4 py-3 text-sm text-luxury-ivory placeholder:text-luxury-muted focus:outline-none focus:border-gold-500/50 transition-colors"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-luxury-black lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-semibold tracking-wider">ASSETTIQUE</span>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-light text-luxury-ivory hover:text-gold-400 transition-colors flex items-center gap-2"
                    >
                      {link.icon && <link.icon className="w-5 h-5 text-gold-400" />}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center py-4 bg-luxury-card border border-luxury-border rounded-xl font-medium"
                    >
                      My Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-center py-4 bg-luxury-card border border-luxury-border rounded-xl font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-4 bg-luxury-card border border-luxury-border rounded-xl font-medium"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/seller"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-4 bg-gold-500 text-luxury-black rounded-xl font-medium"
                >
                  SELL AN ASSET
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

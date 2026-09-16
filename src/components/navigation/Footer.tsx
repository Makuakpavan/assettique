'use client';

import Link from 'next/link';
import { Shield, Lock, Headphones, Eye } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'About Us', href: '#' },
    { label: 'How It Works', href: '#' },
    { label: 'Verification', href: '#' },
    { label: 'Pricing', href: '#' },
  ],
  categories: [
    { label: 'Luxury Vehicles', href: '/automotive' },
    { label: 'Landed Property', href: '/property' },
    { label: 'The Vault', href: '/vault' },
    { label: 'New Arrivals', href: '/search' },
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-luxury-border/50 bg-luxury-dark">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-gold-500 flex items-center justify-center">
                <span className="text-gold-400 font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold tracking-wider">ASSETTIQUE</span>
            </div>
            <p className="text-luxury-muted text-sm leading-relaxed max-w-sm mb-6">
              Africa's premier marketplace for luxury automobiles and landed property. 
              Discover. Verify. Acquire.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs text-luxury-muted">
                <Shield className="w-4 h-4 text-gold-400" />
                Verified
              </div>
              <div className="flex items-center gap-2 text-xs text-luxury-muted">
                <Lock className="w-4 h-4 text-gold-400" />
                Secure
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-luxury-ivory">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-luxury-muted hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-luxury-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-luxury-muted">
            &copy; {new Date().getFullYear()} ASSETTIQUE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-luxury-muted flex items-center gap-1">
              <Eye className="w-3 h-3" /> SSL Encrypted
            </span>
            <span className="text-xs text-luxury-muted flex items-center gap-1">
              <Headphones className="w-3 h-3" /> 24/7 Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

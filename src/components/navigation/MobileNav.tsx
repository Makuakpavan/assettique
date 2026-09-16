'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sparkles, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/ai-match', label: 'AI', icon: Sparkles },
  { href: '/dashboard', label: 'Inquiries', icon: MessageSquare },
  { href: '/dashboard', label: 'Profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-luxury-black/95 backdrop-blur-xl border-t border-luxury-border/50 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                isActive ? 'text-gold-400' : 'text-luxury-muted'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

'use client';

import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { MobileNav } from '@/components/navigation/MobileNav';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-20 min-h-screen">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}

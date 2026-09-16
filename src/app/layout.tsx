import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ASSETTIQUE | Discover. Verify. Acquire.',
  description: "Africa's premier marketplace for luxury automobiles and landed property. Verified assets for high-value buyers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-luxury-black text-luxury-ivory">
        {children}
      </body>
    </html>
  );
}

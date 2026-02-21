import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/shared/ThemeRegistry';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Corrugated Packaging Strength Calculator',
  description: 'Professional tool for calculating Burst Strength (BST), Ring Crush Test (RCT), Edge Crush Test (ECT), and Box Compression Test (BCT) of corrugated packaging materials. Designed for precision and efficiency in manufacturing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
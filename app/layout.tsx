import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/shared/ThemeRegistry';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BoxMetric | The Complete Corrugated Performance Suite',
  description: 'Precision analysis for corrugated board manufacturing. Calculate BST, ECT, BCT, and Box Weight instantly with industry-standard accuracy and McKee formula integration.',
  keywords: 'corrugated board, BST calculator, ECT, BCT, McKee formula, packaging engineering, board strength, box weight calculator',
  authors: [{ name: 'BoxMetric' }],
  openGraph: {
    title: 'BoxMetric | The Complete Corrugated Performance Suite',
    description: 'Precision analysis for corrugated board manufacturing.',
    url: 'https://box-metrix.vercel.app',
    siteName: 'BoxMetric',
    locale: 'en_US',
    type: 'website',
  },
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
            <Analytics />
          </main>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
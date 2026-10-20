import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://geminiwatermarkremover.pro'),
  title: {
    default: 'Gemini Watermark Remover Pro | Free Online Image & Video Cleaner',
    template: '%s | Gemini Watermark Remover Pro'
  },
  description:
    'Free online Gemini & Veo watermark remover for images and videos. 100% browser-local processing with zero server uploads. Uses mathematically exact Reverse Alpha Blending for lossless pixel restoration.',
  keywords: [
    'Gemini watermark remover',
    'Gemini image watermark remover',
    'Gemini video watermark remover',
    'Remove Gemini watermark from image',
    'Remove Gemini watermark from video',
    'Veo video watermark remover',
    'Reverse alpha blending',
    'Lossless watermark removal',
    'Client side image cleaner'
  ],
  authors: [{ name: 'Gemini Watermark Remover Engineering Team' }],
  creator: 'GeminiWatermarkRemover Pro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://geminiwatermarkremover.pro',
    siteName: 'Gemini Watermark Remover Pro',
    title: 'Gemini Watermark Remover Pro | Free Lossless Image & Video Cleaner',
    description:
      'Remove Gemini and Veo watermarks losslessly in your browser. Reverse alpha blending, zero server uploads, 100% private and free.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gemini Watermark Remover Pro Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gemini Watermark Remover Pro | Free Online Image & Video Cleaner',
    description: 'Lossless Reverse Alpha Blending watermark removal for Gemini images & Veo videos. 100% private, runs in-browser.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} font-sans scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Gemini Watermark Remover Pro',
              alternateName: ['Gemini Image Watermark Remover', 'Gemini Video Watermark Remover', 'Veo Watermark Remover'],
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Web Browser',
              url: 'https://geminiwatermarkremover.pro',
              description:
                'Free client-side tool for removing visible watermarks from Google Gemini images and Veo videos using mathematically exact Reverse Alpha Blending.',
              isAccessibleForFree: true,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              featureList: [
                '100% Client-Side In-Browser Processing',
                'Reverse Alpha Blending Non-Destructive Restoration',
                'Video Watermark Removal with Audio Synchronization',
                'Batch Processing and ZIP Export',
                'Automatic Dimension and Anchor Catalog Search'
              ]
            })
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

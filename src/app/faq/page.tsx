import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FAQSection from '../../components/FAQSection';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions & Technical Help | Gemini Watermark Remover',
  description:
    'Comprehensive answers to frequently asked questions about Gemini & Veo watermark removal, browser-local privacy, Reverse Alpha Blending math, and SynthID.',
  alternates: {
    canonical: 'https://geminiwatermarkremover.pro/faq'
  }
};

export default function FAQPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <FAQSection />

        <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Have a question or edge-case not covered here?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            We are continuously refining our auto-detection catalog. Reach out through our contact page or open an issue on GitHub.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

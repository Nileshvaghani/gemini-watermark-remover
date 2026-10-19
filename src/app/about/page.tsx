import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Shield, Cpu, ExternalLink, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Gemini Watermark Remover Pro | Open Source & Client-Side Mission',
  description:
    'Learn about our mission, technical architecture, and commitment to 100% browser-local, mathematical watermark removal for Gemini and Veo creators.',
  alternates: {
    canonical: 'https://geminiwatermarkremover.pro/about'
  }
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200 dark:border-violet-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission &amp; Ethics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            About GeminiWatermarkRemover Pro
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            We are dedicated to building high-performance, mathematically exact web utilities that respect creator privacy and make AI workflows clean and accessible.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/80 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Absolute Privacy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We reject the surveillance cloud model. All computation is executed locally inside your browser via Web Workers. No photos or video frames ever touch our servers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Mathematical Truth</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We do not use black-box generative inpainting to hallucinate pixels. We use algebraic Reverse Alpha Blending to restore the original pixel values underlying the transparent mark.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Open Source</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Free forever under the permissive MIT license. No subscriptions, no ads blocking the workspace, no artificial export limitations.
            </p>
          </div>
        </div>

        {/* Technical Architecture Overview */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Architecture &amp; Verification
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Our technology stack is built on modern web standards:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li><strong>Next.js 14 App Router:</strong> Ultra-fast static routing with zero runtime bloat.</li>
            <li><strong>HTML5 Canvas 2D &amp; Typed Arrays:</strong> High-speed direct memory pixel manipulation via <code>Uint8ClampedArray</code>.</li>
            <li><strong>WebCodecs &amp; Web Audio API:</strong> Frame-accurate decoding and soundtrack preservation for Google Veo and Gemini videos.</li>
            <li><strong>JSZip:</strong> Multi-threaded client-side ZIP packaging for batch exports.</li>
          </ul>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">Trademark Disclaimer</span>
          <p>
            Google Gemini, Google Veo, and DeepMind are registered trademarks of Google LLC.
            GeminiWatermarkRemover Pro is an independent, community-driven open-source utility and is not affiliated with, endorsed by, or sponsored by Google LLC.
          </p>
        </div>
      </div>
    </div>
  );
}

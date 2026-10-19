import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import ImageRemoverWorkbench from '../../components/ImageRemoverWorkbench';

export const metadata: Metadata = {
  title: 'Gemini Image Watermark Remover Online | Free & Lossless',
  description:
    'Dedicated online studio to remove visible watermarks and logos from Google Gemini-generated images. Uses Reverse Alpha Blending with zero quality loss. 100% browser-local.',
  alternates: {
    canonical: 'https://geminiwatermarkremover.pro/image-watermark-remover'
  }
};

export default function ImageWatermarkRemoverPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 font-bold border border-violet-200 dark:border-violet-800">
              Dedicated Studio
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Uploads</span>
            </span>
          </div>
        </div>

        {/* Page Title & Intro */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Gemini Image Watermark Remover
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Drag and drop single or multiple Gemini images. Our client-side engine automatically detects
            watermark dimensions (36px, 48px, 96px) and applies Reverse Alpha Blending to restore original pixels losslessly.
          </p>
        </div>

        {/* Studio Workbench */}
        <div className="pt-2">
          <ImageRemoverWorkbench />
        </div>

        {/* Helpful Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-violet-500" />
              <span>Supported Dimensions</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Supports official 0.5k, 1k, 2k, and 4k Gemini formats (1:1, 16:9, 9:16, 4:3, 3:2, 21:9) and custom aspect ratios.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Batch Parallel Queues</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload dozens of images simultaneously. Web Workers process files in parallel without freezing your browser tab.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Lossless Reverse Alpha</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mathematical pixel inversion avoids the blurry patches, smudges, and hallucinations typical of AI inpainting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

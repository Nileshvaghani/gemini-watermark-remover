import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Gemini Watermark Remover Pro',
  description:
    'Terms of service and open source license guidelines for GeminiWatermarkRemover Pro.',
  alternates: {
    canonical: 'https://geminiwatermarkremover.pro/terms'
  }
};

export default function TermsPage() {
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

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200 dark:border-violet-800">
            <FileText className="w-3.5 h-3.5" />
            <span>Open Source License</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last Updated: October 19, 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using GeminiWatermarkRemover Pro, you agree to comply with and be bound by these Terms of Service. If you do not agree, do not use the application.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Permitted Use &amp; Intellectual Property
          </h2>
          <p>
            GeminiWatermarkRemover Pro is provided under the permissive MIT Open Source License. You are permitted to use this application for personal and commercial media restoration, provided that:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>You own the media or possess authorized rights to process and clean it.</li>
            <li>You comply with all applicable copyright, attribution, and generative AI disclosure laws in your jurisdiction.</li>
            <li>You do not use the software for fraudulent or deceptive purposes.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Disclaimer of Warranties
          </h2>
          <p className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Third-Party Trademarks
          </h2>
          <p>
            Google Gemini, Veo, and DeepMind are registered trademarks of Google LLC. This tool is an independent open-source research and engineering project and is not affiliated with or endorsed by Google LLC.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Heart, Terminal, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                GeminiWatermark<span className="text-violet-400">Pro</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An open-source, 100% client-side utility built for creative professionals.
              Restores pixels under Google Gemini and Veo watermarks using mathematically exact
              Reverse Alpha Blending. No AI hallucinations, zero server uploads.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero Server Uploads Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Watermark Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/image-watermark-remover" className="hover:text-white transition-colors">
                  Image Watermark Remover
                </Link>
              </li>
              <li>
                <Link href="/video-watermark-remover" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Video Remover</span>
                  <span className="text-[10px] bg-violet-950 text-violet-300 px-1.5 py-0.5 rounded font-semibold">Veo</span>
                </Link>
              </li>
              <li>
                <Link href="/image-watermark-remover" className="hover:text-white transition-colors">
                  Batch Multi-File Cleaner
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Interactive Algorithm Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational & Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Resources &amp; SEO
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Reverse Alpha Blending Math
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Technical Blog &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/blog/synthid-vs-visible-watermarks" className="hover:text-white transition-colors">
                  SynthID vs Visible Watermarks
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About &amp; Privacy Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Legal &amp; Trust
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Feedback
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/GargantuaX/gemini-watermark-remover"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            &copy; 2026 GeminiWatermarkRemover Pro. MIT Licensed Open Source.
            All processing occurs strictly on your local browser instance.
          </p>
          <p className="text-slate-500 text-[11px] max-w-md text-center md:text-right">
            Disclaimer: Gemini, Veo, and Google are registered trademarks of Google LLC.
            This open-source tool is an independent utility and is not affiliated with or endorsed by Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}

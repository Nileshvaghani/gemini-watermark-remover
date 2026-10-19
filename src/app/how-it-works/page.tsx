import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  ArrowLeft, 
  Check, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Code2, 
  FileCode,
  ArrowRight
} from 'lucide-react';
import HowItWorksSection from '../../components/HowItWorksSection';

export const metadata: Metadata = {
  title: 'How It Works: Mathematical Reverse Alpha Blending Engine',
  description:
    'Comprehensive technical explanation of Reverse Alpha Blending algorithm, watermark dimensions catalog, and browser-local video decoding pipeline.',
  alternates: {
    canonical: 'https://geminiwatermarkremover.pro/how-it-works'
  }
};

export default function HowItWorksPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200 dark:border-violet-800">
            <Calculator className="w-3.5 h-3.5" />
            <span>Architecture &amp; Algorithm</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How Reverse Alpha Blending Restores Watermarked Pixels
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            A comprehensive technical breakdown of our non-destructive watermark restoration pipeline,
            the discrete Gemini dimension catalog, and our client-side Web Worker architecture.
          </p>
        </div>

        {/* Embedded How It Works Section */}
        <HowItWorksSection />

        {/* Technical Deep Dive: The Code Implementation */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Code2 className="w-7 h-7 text-violet-500" />
            <span>The Core Restoration Algorithm in JavaScript</span>
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The core loop operates directly over the <code>ImageData.data</code> array (a <code>Uint8ClampedArray</code>).
            Because the watermark overlay is pure white ($Logo = 255$), the red, green, and blue color channels can be calculated independently in a single contiguous memory pass:
          </p>

          <div className="p-6 rounded-3xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs overflow-x-auto shadow-2xl">
            <pre>{`// Pixel-Exact Reverse Alpha Blending Loop
function removeWatermark(imageData, bounds, alphaMap, alphaGain = 1.0) {
  const { data, width: imgW } = imageData;
  const { x, y, width: wmW, height: wmH } = bounds;
  const LOGO_VAL = 255; // White watermark overlay

  for (let wy = 0; wy < wmH; wy++) {
    const py = y + wy;
    for (let wx = 0; wx < wmW; wx++) {
      const px = x + wx;
      const alphaIdx = wy * wmW + wx;
      
      // Calculate effective alpha with user gain multiplier
      let alpha = alphaMap[alphaIdx] * alphaGain;
      
      // Noise floor threshold: preserve untouched background
      if (alpha <= 0.012) continue;
      
      // Division guard to avoid extreme noise amplification
      if (alpha > 0.96) alpha = 0.96;
      
      const pixelIdx = (py * imgW + px) * 4;
      const oneMinusAlpha = 1.0 - alpha;
      
      // Algebraic Reverse Solve: Original = (Watermarked - alpha * 255) / (1 - alpha)
      const r = (data[pixelIdx]     - alpha * LOGO_VAL) / oneMinusAlpha;
      const g = (data[pixelIdx + 1] - alpha * LOGO_VAL) / oneMinusAlpha;
      const b = (data[pixelIdx + 2] - alpha * LOGO_VAL) / oneMinusAlpha;
      
      // 8-bit integer clamping [0, 255]
      data[pixelIdx]     = Math.min(255, Math.max(0, Math.round(r)));
      data[pixelIdx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      data[pixelIdx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
  }
}`}</pre>
          </div>
        </div>

        {/* Gemini Catalog Table */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Layers className="w-7 h-7 text-indigo-500" />
            <span>Official Gemini Resolution Tiers</span>
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Google Gemini does not emit arbitrary aspect ratios. It adheres to discrete resolution tiers, each paired with specific watermark dimensions and margins:
          </p>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-4">Resolution Tier</th>
                  <th className="p-4">Sample Dimensions</th>
                  <th className="p-4">Watermark Size</th>
                  <th className="p-4">Margins (Right / Bottom)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-950 font-medium">
                <tr>
                  <td className="p-4 font-bold text-violet-600 dark:text-violet-400">0.5k Compact</td>
                  <td className="p-4 font-mono">512&times;512, 688&times;384, 424&times;632</td>
                  <td className="p-4">48 &times; 48 px</td>
                  <td className="p-4">32px right, 32px bottom</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">1k Standard</td>
                  <td className="p-4 font-mono">1024&times;1024, 1376&times;768, 896&times;1200</td>
                  <td className="p-4">96 &times; 96 px or 48 &times; 48 px</td>
                  <td className="p-4">64px or 32px margins</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-cyan-600 dark:text-cyan-400">2k High-Res</td>
                  <td className="p-4 font-mono">2048&times;2048, 2752&times;1536, 1792&times;2400</td>
                  <td className="p-4">96 &times; 96 px</td>
                  <td className="p-4">64px or 192px (new-margin)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">4k Ultra</td>
                  <td className="p-4 font-mono">4096&times;4096, 5504&times;3072</td>
                  <td className="p-4">96 &times; 96 px</td>
                  <td className="p-4">64px margins</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA to Open Studio */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to test it on your Gemini media?
          </h2>
          <p className="text-violet-100 text-sm sm:text-base max-w-xl mx-auto">
            Experience real-time Reverse Alpha Blending in our dedicated image and video studios. Zero registration required.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/image-watermark-remover"
              className="px-6 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm shadow-md hover:bg-violet-50 transition-colors"
            >
              Open Image Studio
            </Link>
            <Link
              href="/video-watermark-remover"
              className="px-6 py-3 rounded-xl bg-violet-900/60 hover:bg-violet-900/80 text-white font-bold text-sm border border-violet-400/30 transition-colors"
            >
              Open Video Studio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

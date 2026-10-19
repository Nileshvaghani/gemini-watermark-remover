import React from 'react';
import { Calculator, Sparkles, Cpu, Check, X, ShieldCheck } from 'lucide-react';

export default function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200/60 dark:border-violet-800/60">
            <Calculator className="w-3.5 h-3.5" />
            <span>Mathematical Restoration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Reverse Alpha Blending Works
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike traditional watermark removers that use generative AI to guess and repaint missing areas,
            our engine uses mathematical inversion to cleanly extract and subtract the semi-transparent logo overlay.
          </p>
        </div>

        {/* Math Equation Formula Card */}
        <div className="mt-12 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Step 1: Forward Compositing */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
                1. How Gemini Adds the Watermark
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Google blends a pure white logo (L = 255) over the original image with opacity &alpha;:
              </p>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 font-bold text-center">
                {'I_watermarked = α × 255 + (1 - α) × I_original'}
              </div>
            </div>

            {/* Step 2: Reverse Solve */}
            <div className="space-y-3 p-5 rounded-2xl bg-violet-500/10 border border-violet-500/20">
              <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider block">
                2. Our Exact Algebraic Solution
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                We algebraically rearrange the equation to solve for the hidden original pixel:
              </p>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/60 font-bold text-center">
                {'I_original = (I_watermarked - α × 255) / (1 - α)'}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-500" />
              <span>Evaluated in parallel across red, green, and blue color channels inside Web Workers.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Noise floor thresholds prevent color blowout and division singularities.</span>
            </div>
          </div>
        </div>

        {/* Comparison Matrix: Reverse Alpha vs AI Inpainting */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-6">
            Reverse Alpha Blending vs. Generative AI Inpainting
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Our Method */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-violet-500/80 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <span>Reverse Alpha Blending (Our Tool)</span>
                </h4>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                  Recommended
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero Hallucinations:</strong> Restores real underlying texture instead of generating fake patterns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Blazing Fast:</strong> Takes under 20 milliseconds per image on modern hardware.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>100% Client-Side:</strong> Runs entirely in your browser using native Canvas &amp; Web Workers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Lossless Fidelity:</strong> Sharp lines, text, and foliage beneath the mark remain unblurred.</span>
                </li>
              </ul>
            </div>

            {/* AI Inpainting */}
            <div className="p-6 rounded-3xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span>Traditional Generative Inpainting</span>
                </h4>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Heuristic
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Smudges &amp; Hallucinations:</strong> Blurs or replaces details with AI guesswork.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Slow &amp; Expensive:</strong> Requires GPU servers or large 50MB+ neural model downloads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Privacy Risks:</strong> Often requires uploading your media to remote commercial clouds.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

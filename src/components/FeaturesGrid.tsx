import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Video, 
  Layers, 
  Compass, 
  Lock, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Reverse Alpha Blending',
      desc: 'Mathematically exact pixel restoration. No AI guessing, no blurring, and zero generative artifacts.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: '100% Client-Side Privacy',
      desc: 'All processing runs in browser memory using Web Workers. Your private photos and videos never leave your machine.'
    },
    {
      icon: <Video className="w-6 h-6 text-indigo-500" />,
      title: 'Veo Video Watermark Cleaner',
      desc: 'Frame-by-frame processing for Gemini and Veo video clips (MP4/WebM) with synchronized audio preservation.'
    },
    {
      icon: <Layers className="w-6 h-6 text-violet-500" />,
      title: 'Bulk Processing & ZIP Export',
      desc: 'Queue multiple Gemini files simultaneously and export all cleaned results in a single compressed ZIP package.'
    },
    {
      icon: <Compass className="w-6 h-6 text-cyan-500" />,
      title: 'Automatic Dimension Catalog',
      desc: 'Auto-detects 0.5k, 1k, 2k, and 4k resolution tiers, matching the exact margin and size parameters used by Gemini.'
    },
    {
      icon: <Lock className="w-6 h-6 text-rose-500" />,
      title: 'SynthID Transparency',
      desc: 'Honest technical claims: our tool removes visible semi-transparent logo overlays without claiming to alter invisible digital provenance.'
    }
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Speed &amp; Integrity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Pixel-Perfect Restoration
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Everything you need to process Gemini-generated images and videos with high fidelity and zero subscriptions.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:border-violet-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

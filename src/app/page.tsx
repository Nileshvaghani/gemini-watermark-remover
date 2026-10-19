'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  ShieldCheck, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Layers,
  Cpu,
  Lock
} from 'lucide-react';
import ImageRemoverWorkbench from '../components/ImageRemoverWorkbench';
import VideoRemoverWorkbench from '../components/VideoRemoverWorkbench';
import HowItWorksSection from '../components/HowItWorksSection';
import FeaturesGrid from '../components/FeaturesGrid';
import FAQSection from '../components/FAQSection';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { SAMPLE_FIXTURES } from '../lib/watermark/testFixtures';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [demoUrl, setDemoUrl] = useState<string>('');

  React.useEffect(() => {
    setDemoUrl(SAMPLE_FIXTURES[0].createDataUrl());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-500/15 via-indigo-500/15 to-cyan-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200/60 dark:border-violet-800/60 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free • Lossless • 100% In-Browser</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Gemini Image &amp; Video{' '}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Watermark Remover
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Process eligible Gemini-generated images and videos with an easy-to-use browser-based tool.
              Recovers original pixels using exact <strong>Reverse Alpha Blending</strong>.
              Zero server uploads, zero quality loss.
            </p>

            {/* Dual Switcher Tabs */}
            <div className="pt-2 flex justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('image')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'image'
                      ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-md scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Remove Image Watermark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'video'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Remove Video Watermark (Veo)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Workbench Container */}
          <div className="mt-10 max-w-5xl mx-auto">
            {activeTab === 'image' ? (
              <ImageRemoverWorkbench />
            ) : (
              <VideoRemoverWorkbench />
            )}
          </div>
        </div>
      </section>

      {/* Live Interactive Before & After Showcase */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-200/60 dark:border-cyan-800/60">
                <Zap className="w-3.5 h-3.5" />
                <span>Live Interactive Demo</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                See Mathematical Pixel Restoration in Action
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Drag the slider across the demo image below. Notice how the semi-transparent star watermark is completely erased without smudging the delicate background light gradients or altering image resolution.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Subpixel-exact reverse alpha subtraction</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Preserves original photographic textures &amp; fine lines</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero pixel hallucination or generative smearing</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 group"
                >
                  <span>Learn how the mathematics works</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Slider Showcase */}
            <div className="p-3 sm:p-4 rounded-3xl bg-slate-900/5 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 shadow-2xl">
              {demoUrl ? (
                <BeforeAfterSlider
                  beforeUrl={demoUrl}
                  afterUrl={demoUrl}
                  beforeLabel="Watermarked Image"
                  afterLabel="Cleaned Result"
                />
              ) : (
                <div className="w-full aspect-square sm:aspect-[4/3] rounded-2xl bg-slate-900 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Privacy Guarantee Banner */}
      <section className="py-16 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto text-emerald-400">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your Files Never Leave Your Browser
          </h2>

          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Unlike other online watermark removers that upload your private media to third-party cloud servers,
            our application processes every pixel locally on your computer’s processor using HTML5 Canvas &amp; WebCodecs.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Remote Storage</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Hardware-Accelerated Web Workers</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Layers className="w-4 h-4 text-violet-400" />
              <span>Batch Parallel Processing</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}

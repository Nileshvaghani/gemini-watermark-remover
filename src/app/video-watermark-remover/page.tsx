import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Video, Music, Sliders, Film } from 'lucide-react';
import VideoRemoverWorkbench from '../../components/VideoRemoverWorkbench';

export const metadata: Metadata = {
  title: 'Gemini & Veo Video Watermark Remover Online | Free MP4 & WebM Cleaner',
  description:
    'Dedicated online studio to remove visible watermarks from Google Gemini and Veo video clips. Frame-by-frame browser processing with synchronized audio preservation.',
  alternates: {
    canonical: 'https://geminiwatermarkremover.pro/video-watermark-remover'
  }
};

export default function VideoWatermarkRemoverPage() {
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
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
              Veo Video Studio
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% In-Browser</span>
            </span>
          </div>
        </div>

        {/* Page Title & Intro */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Video className="w-5 h-5" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Gemini &amp; Veo Video Watermark Remover
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Clean visible watermarks from Google Gemini and Veo video clips. Processes each frame locally using
            browser-native Canvas and WebCodecs while capturing and preserving the original audio track.
          </p>
        </div>

        {/* Studio Workbench */}
        <div className="pt-2">
          <VideoRemoverWorkbench />
        </div>

        {/* Video Best Practices Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-indigo-500" />
              <span>Frame-by-Frame Temporal Consistency</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every frame is decoded and restored sequentially with identical alpha parameters to avoid flickering or smearing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-emerald-500" />
              <span>Full Audio Track Preservation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The Web Audio API captures and remixes soundtrack audio directly into the recorded output stream.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-500" />
              <span>Recommended File Limits</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              For peak browser performance, we recommend clips under 100MB and durations under 30 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

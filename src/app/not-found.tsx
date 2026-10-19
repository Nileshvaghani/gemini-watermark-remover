import React from 'react';
import Link from 'next/link';
import { Sparkles, Home, ArrowRight, Image as ImageIcon, Video } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-slate-900 dark:text-white">404</span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for does not exist or has been moved. Use the quick links below to jump back into the studio.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            href="/"
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/image-watermark-remover"
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Watermark Studio</span>
          </Link>

          <Link
            href="/video-watermark-remover"
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Video Watermark Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

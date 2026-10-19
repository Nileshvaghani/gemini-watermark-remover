'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  HelpCircle, 
  BookOpen, 
  Info, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-200 bg-clip-text text-transparent">
                  GeminiWatermark
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/60">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Browser-Local Image &amp; Video Cleaner
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/')
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-violet-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onMouseEnter={() => setToolsDropdownOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all outline-none"
              >
                <span>Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div 
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                  className="absolute left-0 top-full pt-2 w-64 z-50"
                >
                  <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/50 flex flex-col gap-1">
                    <Link
                      href="/image-watermark-remover"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/60 flex items-center justify-center text-violet-600 dark:text-violet-300 group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Image Remover
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Reverse alpha pixel restoration
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/video-watermark-remover"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-300 group-hover:scale-105 transition-transform">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>Video Remover</span>
                          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.2 rounded">
                            Veo
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Frame-by-frame with audio sync
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/image-watermark-remover"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/image-watermark-remover')
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-violet-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              Image Studio
            </Link>

            <Link
              href="/video-watermark-remover"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/video-watermark-remover')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              Video Studio
            </Link>

            <Link
              href="/how-it-works"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/how-it-works')
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-violet-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              How It Works
            </Link>

            <Link
              href="/faq"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/faq')
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-violet-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              FAQ
            </Link>

            <Link
              href="/blog"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/blog')
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-violet-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Local Processing</span>
            </div>

            <Link
              href="/image-watermark-remover"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 shadow-md shadow-indigo-500/25 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Free</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Home
          </Link>
          <Link
            href="/image-watermark-remover"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40"
          >
            <ImageIcon className="w-5 h-5" />
            <span>Image Watermark Remover</span>
          </Link>
          <Link
            href="/video-watermark-remover"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
          >
            <Video className="w-5 h-5" />
            <span>Video Watermark Remover</span>
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <BookOpen className="w-5 h-5 text-slate-400" />
            <span>How It Works (Algorithm)</span>
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <span>FAQ &amp; Troubleshooting</span>
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <BookOpen className="w-5 h-5 text-slate-400" />
            <span>Educational Blog</span>
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <Info className="w-5 h-5 text-slate-400" />
            <span>About &amp; Privacy Architecture</span>
          </Link>
        </div>
      )}
    </header>
  );
}

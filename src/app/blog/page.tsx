import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '../../lib/blogData';

export const metadata: Metadata = {
  title: 'Blog & Technical Guides: Gemini Watermark Restoration & AI Provenance',
  description:
    'Educational articles on Reverse Alpha Blending, SynthID invisible watermarks, Veo video processing, and browser-local media engineering.',
  alternates: {
    canonical: 'https://geminiwatermarkremover.pro/blog'
  }
};

export default function BlogIndexPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200 dark:border-violet-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Educational Blog &amp; Guides
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            In-depth engineering research on computer graphics, Reverse Alpha Blending, Google DeepMind SynthID, and privacy-first web architecture.
          </p>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:border-violet-500/60 hover:shadow-2xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/60">
                    {post.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{post.date}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

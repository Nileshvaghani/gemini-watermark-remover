import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, User, Calendar, BookOpen, Share2 } from 'lucide-react';
import { BLOG_POSTS, getBlogPost } from '../../../lib/blogData';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | Gemini Watermark Remover Pro`,
    description: post.excerpt,
    alternates: {
      canonical: `https://geminiwatermarkremover.pro/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author]
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog Articles</span>
        </Link>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-b border-slate-200 dark:border-slate-800 pb-6">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-violet-500" />
              <span>{post.author}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
          <div className="whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Article Footer & Action */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Try Gemini Watermark Remover
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Experience lossless Reverse Alpha Blending live in your browser right now.
            </p>
          </div>
          <Link
            href="/image-watermark-remover"
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            Launch Free Studio
          </Link>
        </div>
      </div>
    </article>
  );
}

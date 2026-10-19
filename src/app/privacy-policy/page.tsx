import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy: 100% Client-Side Zero Retention Guarantee',
  description:
    'Our verified privacy policy. Learn why GeminiWatermarkRemover Pro never uploads, logs, or stores your photos and videos.',
  alternates: {
    canonical: 'https://geminiwatermarkremover.pro/privacy-policy'
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Upload Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last Updated: October 19, 2026
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 space-y-2">
            <h3 className="font-bold text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Lock className="w-5 h-5 text-emerald-500" />
              <span>Summary: Your Media Never Leaves Your Computer</span>
            </h3>
            <p className="text-xs sm:text-sm">
              All image decoding, Reverse Alpha Blending calculation, video frame processing, and ZIP file export run strictly within your local browser sandbox. We operate zero cloud media processing pipelines.
            </p>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            1. What Data We Process
          </h2>
          <p>
            When you select or drag media files into GeminiWatermarkRemover Pro:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Images &amp; Video Streams:</strong> Processed exclusively in transient browser RAM using HTML5 <code>CanvasRenderingContext2D</code>, <code>ImageData</code>, and WebCodecs. Files are never transmitted over HTTP/HTTPS to any server.</li>
            <li><strong>File Metadata:</strong> Dimensions, file names, and durations are inspected locally for watermark detection and are never saved to external databases.</li>
            <li><strong>Ephemeral Object URLs:</strong> Any <code>blob:</code> URLs generated for UI previews are revoked upon export or session closure.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            2. Web Analytics &amp; Cookies
          </h2>
          <p>
            We do not use tracking cookies that identify individual visitors or build cross-site tracking profiles. We do not log, inspect, or retain the content of images or video files uploaded to the workspace.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            3. Independent Verification
          </h2>
          <p>
            You can verify our privacy assertions at any time:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Open your browser Developer Tools (<kbd className="font-mono px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">F12</kbd> or <kbd className="font-mono px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Cmd+Option+I</kbd>).</li>
            <li>Select the <strong>Network</strong> tab.</li>
            <li>Upload a test image or video.</li>
            <li>Observe that <strong>no POST, PUT, or payload requests</strong> are sent to any remote API endpoint.</li>
          </ol>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">
            4. User Responsibility
          </h2>
          <p>
            Users are solely responsible for ensuring they possess the right to modify the media they process and for respecting applicable terms of service, platform rules, and intellectual property laws.
          </p>
        </div>
      </div>
    </div>
  );
}

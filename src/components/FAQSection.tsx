'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ_DATA = [
  {
    q: 'Is this Gemini watermark remover completely free?',
    a: 'Yes. It is 100% free with no sign-ups, subscriptions, watermarked exports, or hidden paywalls. It runs under the permissive MIT open-source license.'
  },
  {
    q: 'Are my images or videos uploaded to any external server?',
    a: 'No. Every single byte is processed strictly inside your local browser memory using HTML5 Canvas, WebCodecs, and Web Workers. You can verify this anytime by inspecting your browser Network tab—zero image or video payloads leave your device.'
  },
  {
    q: 'How does Reverse Alpha Blending work vs AI inpainting?',
    a: 'AI inpainting cuts out the watermark region and prompts a neural network to hallucinate new pixels, creating blurry or distorted textures. Reverse Alpha Blending solves the forward compositing formula algebraically to extract and subtract the semi-transparent logo overlay, recovering the original pixels losslessly.'
  },
  {
    q: 'Does this tool remove Google\'s invisible SynthID provenance watermark?',
    a: 'No. Google DeepMind\'s SynthID embeds imperceptible mathematical signals across latent frequencies. This tool is designed exclusively for removing visible watermark logos (the semi-transparent star overlay). We believe in honest technical communication—visible watermark removal and invisible cryptographic provenance are completely different mechanisms.'
  },
  {
    q: 'Can it remove watermarks from Gemini and Veo videos?',
    a: 'Yes. Our dedicated Video Watermark Remover decodes the video frame-by-frame, applies Reverse Alpha Blending on each frame, captures the audio stream via Web Audio API, and re-encodes the clean output into MP4 or WebM.'
  },
  {
    q: 'Can I bulk remove watermarks from multiple images?',
    a: 'Yes. Simply drag multiple images into the upload area or select multiple files. The queue will process them in parallel and allow you to download individual files or export the entire batch as a single ZIP archive.'
  },
  {
    q: 'What should I do if the watermark is slightly visible after removal?',
    a: 'Heavy JPEG or WebP compression can distort alpha values. Simply expand the "Fine-Tune Watermark" panel and adjust the Alpha Gain slider (e.g. increase from 1.0x to 1.15x) or enable subpixel corner auto-alignment.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200/60 dark:border-violet-800/60">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Clear, honest answers about privacy, browser-local processing, and technical capabilities.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-violet-600 dark:text-violet-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-4 animate-in fade-in duration-150">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

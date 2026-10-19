'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Upload, 
  Sparkles, 
  Download, 
  Archive, 
  Trash2, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Layers, 
  FileImage, 
  RefreshCw, 
  Eye, 
  AlertCircle, 
  Loader2, 
  FileText,
  Check,
  FileType
} from 'lucide-react';
import { processImageSource, ProcessResult } from '../lib/watermark/imageProcessor';
import { detectWatermarkConfig, WatermarkConfig } from '../lib/watermark/catalog';
import { SAMPLE_FIXTURES } from '../lib/watermark/testFixtures';
import { createZipArchive, downloadProcessedImage } from '../lib/watermark/zipExporter';
import { 
  convertProcessedImage, 
  getSanitizedDownloadFilename,
  ExportFormat, 
  SUPPORTED_FORMATS 
} from '../lib/watermark/formatConverter';
import BeforeAfterSlider from './BeforeAfterSlider';

interface QueueItem {
  id: string;
  name: string;
  file?: File;
  originalUrl: string;
  result?: ProcessResult;
  status: 'uploaded' | 'processing' | 'done' | 'error' | 'unsupported';
  errorMessage?: string;
  width?: number;
  height?: number;
  detectedConfig?: WatermarkConfig;
}

interface PreparedDownload {
  url: string;
  filename: string;
  blob: Blob;
  sizeBytes: number;
}

export default function ImageRemoverWorkbench() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [alphaGain, setAlphaGain] = useState(1.0);
  const [autoAlign, setAutoAlign] = useState(false);
  const [customSize, setCustomSize] = useState<number | 'auto'>('auto');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [zipProgress, setZipProgress] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<'cleaned' | 'comparison'>('comparison');

  // Multi-format export states
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [exportQuality, setExportQuality] = useState<number>(92);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [preparedDownload, setPreparedDownload] = useState<PreparedDownload | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process a queue item
  const processQueueItem = useCallback(async (item: QueueItem, gain: number = alphaGain) => {
    setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing', errorMessage: undefined } : q));
    setConversionError(null);

    try {
      const source = item.file || item.originalUrl;
      const options = {
        alphaGain: gain,
        autoAlign,
        customBounds: customSize !== 'auto' ? {
          x: 0,
          y: 0,
          width: customSize,
          height: customSize
        } : undefined
      };

      const result = await processImageSource(source, options);

      if (result.pixelsRestored === 0) {
        setQueue(prev => prev.map(q => q.id === item.id ? {
          ...q,
          status: 'unsupported',
          errorMessage: 'No watermark pixels were detected in this image. Ensure this is an authentic Gemini image with the logo in the bottom-right corner.'
        } : q));
        return;
      }

      setQueue(prev => prev.map(q => q.id === item.id ? {
        ...q,
        status: 'done',
        result,
        width: result.width,
        height: result.height,
        detectedConfig: result.detectedConfig
      } : q));

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#6366f1', '#38bdf8']
      });
    } catch (err) {
      setQueue(prev => prev.map(q => q.id === item.id ? {
        ...q,
        status: 'error',
        errorMessage: err instanceof Error ? err.message : 'Watermark removal failed'
      } : q));
    }
  }, [alphaGain, autoAlign, customSize]);

  // Handle file addition (Step 1 & Step 5: Idle -> Image Uploaded, do NOT auto-process)
  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems: QueueItem[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => {
        const originalUrl = URL.createObjectURL(f);
        const item: QueueItem = {
          id: Math.random().toString(36).substring(7),
          name: f.name,
          file: f,
          originalUrl,
          status: 'uploaded'
        };

        // Measure image dimensions and predict config
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          const config = detectWatermarkConfig(w, h);
          setQueue(prev => prev.map(q => q.id === item.id ? {
            ...q,
            width: w,
            height: h,
            detectedConfig: config
          } : q));
        };
        img.src = originalUrl;

        return item;
      });

    if (newItems.length === 0) return;

    setQueue(prev => [...prev, ...newItems]);
    if (!selectedItemId) {
      setSelectedItemId(newItems[0].id);
    }
  }, [selectedItemId]);

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        addFiles(e.clipboardData.files);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addFiles]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      queue.forEach(item => {
        if (item.file && item.originalUrl) {
          URL.revokeObjectURL(item.originalUrl);
        }
        if (item.result?.cleanedUrl) {
          URL.revokeObjectURL(item.result.cleanedUrl);
        }
      });
    };
  }, [queue]);

  // Load a built-in test sample
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_FIXTURES.find(s => s.id === sampleId) || SAMPLE_FIXTURES[0];
    const dataUrl = sample.createDataUrl();
    const config = detectWatermarkConfig(sample.width, sample.height);
    const item: QueueItem = {
      id: Math.random().toString(36).substring(7),
      name: `${sample.title}.png`,
      originalUrl: dataUrl,
      status: 'uploaded',
      width: sample.width,
      height: sample.height,
      detectedConfig: config
    };

    setQueue(prev => [item, ...prev]);
    setSelectedItemId(item.id);
  };

  const selectedItem = queue.find(q => q.id === selectedItemId) || queue[0];

  // Download converted image in user-selected format
  const handleDownloadSingle = async (
    item: QueueItem,
    format: ExportFormat = exportFormat,
    qualityPercent: number = exportQuality
  ) => {
    if (!item.result || !item.result.cleanedBlob || item.result.cleanedBlob.size === 0) {
      throw new Error('No processed image is available to download.');
    }

    setIsConverting(true);
    setConversionProgress(15);
    setConversionError(null);
    setDownloadSuccessMsg(null);

    try {
      const converted = await convertProcessedImage(
        item.result.cleanedBlob,
        format,
        {
          quality: qualityPercent / 100,
          onProgress: p => setConversionProgress(p)
        },
        item.name
      );

      downloadProcessedImage(converted.blob, converted.filename);

      setDownloadSuccessMsg(
        `Downloaded ${converted.filename} (${(converted.sizeBytes / 1024).toFixed(1)} KB)`
      );
      setTimeout(() => setDownloadSuccessMsg(null), 5000);
    } catch (err) {
      setConversionError(
        err instanceof Error ? err.message : `Failed to convert and download image as ${format.toUpperCase()}`
      );
    } finally {
      setIsConverting(false);
      setConversionProgress(0);
    }
  };

  // Proactively prepare the converted output so the download button is a direct native <a> anchor tag
  useEffect(() => {
    if (!selectedItem || selectedItem.status !== 'done' || !selectedItem.result?.cleanedBlob) {
      setPreparedDownload(null);
      return;
    }

    let isCurrent = true;
    setIsConverting(true);
    setConversionError(null);

    convertProcessedImage(
      selectedItem.result.cleanedBlob,
      exportFormat,
      {
        quality: exportQuality / 100,
        onProgress: p => {
          if (isCurrent) setConversionProgress(p);
        }
      },
      selectedItem.name
    ).then(converted => {
      if (!isCurrent) return;
      const url = URL.createObjectURL(converted.blob);
      setPreparedDownload(prev => {
        if (prev?.url) {
          URL.revokeObjectURL(prev.url);
        }
        return {
          url,
          filename: converted.filename,
          blob: converted.blob,
          sizeBytes: converted.sizeBytes
        };
      });
      setIsConverting(false);
      setConversionProgress(0);
    }).catch(err => {
      if (!isCurrent) return;
      setConversionError(err instanceof Error ? err.message : 'Failed to prepare download format');
      setIsConverting(false);
      setConversionProgress(0);
    });

    return () => {
      isCurrent = false;
    };
  }, [
    selectedItem?.id,
    selectedItem?.status,
    selectedItem?.result?.cleanedBlob,
    exportFormat,
    exportQuality,
    selectedItem?.name
  ]);

  // Clean up prepared download URL on unmount
  useEffect(() => {
    return () => {
      if (preparedDownload?.url) {
        URL.revokeObjectURL(preparedDownload.url);
      }
    };
  }, [preparedDownload]);

  // Batch ZIP download in selected format
  const handleDownloadAllZip = async () => {
    const doneItems = queue.filter(q => q.result && q.result.cleanedBlob);
    if (doneItems.length === 0) return;

    setZipProgress(0);
    setIsConverting(true);
    setConversionError(null);

    try {
      const batchList = await Promise.all(
        doneItems.map(async (q, idx) => {
          const converted = await convertProcessedImage(
            q.result!.cleanedBlob,
            exportFormat,
            { quality: exportQuality / 100 },
            q.name
          );
          setZipProgress(Math.round(((idx + 1) / doneItems.length) * 50));
          return {
            name: converted.filename,
            blob: converted.blob
          };
        })
      );

      const zipBlob = await createZipArchive(batchList, percent => {
        setZipProgress(50 + Math.round(percent * 0.5));
      });

      downloadProcessedImage(zipBlob, `gemini_cleaned_images_${exportFormat}.zip`);
    } catch (err) {
      setConversionError(err instanceof Error ? err.message : 'Batch ZIP export failed');
    } finally {
      setZipProgress(null);
      setIsConverting(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setQueue(prev => {
      const target = prev.find(q => q.id === id);
      if (target) {
        if (target.file && target.originalUrl) {
          URL.revokeObjectURL(target.originalUrl);
        }
        if (target.result?.cleanedUrl) {
          URL.revokeObjectURL(target.result.cleanedUrl);
        }
      }
      const filtered = prev.filter(q => q.id !== id);
      if (selectedItemId === id) {
        setSelectedItemId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  const handleReprocessWithNewGain = () => {
    if (selectedItem) {
      processQueueItem(selectedItem, alphaGain);
    }
  };

  const activeFormatDetails = SUPPORTED_FORMATS.find(f => f.id === exportFormat) || SUPPORTED_FORMATS[0];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Upload Zone & Quick Sample Triggers */}
      <div
        id="upload-image-dropzone"
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-3xl p-8 sm:p-12 border-2 border-dashed transition-all duration-300 text-center flex flex-col items-center justify-center gap-4 ${
          isDraggingOver
            ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl shadow-slate-900/5'
        }`}
      >
        <input
          ref={fileInputRef}
          id="upload-image-input"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              addFiles(e.target.files);
            }
          }}
        />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Drag &amp; drop Gemini images here, or click to browse
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supports PNG, JPG, and WebP up to 50MB. Paste directly from clipboard (<kbd className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs">Ctrl+V</kbd>).
          </p>
        </div>

        {/* Quick Sample Trigger */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="pt-2 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            No image ready? Try a sample:
          </span>
          <button
            type="button"
            id="sample-1k-square-btn"
            onClick={() => handleLoadSample('sample-1k-square')}
            className="px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-950/80 hover:bg-violet-200 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-300 font-semibold text-xs border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer"
          >
            Gemini 1:1 Pro (1024px)
          </button>
          <button
            type="button"
            id="sample-16-9-landscape-btn"
            onClick={() => handleLoadSample('sample-16-9-landscape')}
            className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
          >
            Gemini 16:9 Landscape
          </button>
          <button
            type="button"
            id="sample-05k-compact-btn"
            onClick={() => handleLoadSample('sample-05k-compact')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            Gemini 0.5k Preview
          </button>
        </div>
      </div>

      {/* Main Interactive Studio View */}
      {selectedItem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left/Center: Visual Comparison Studio */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <FileImage className="w-5 h-5 text-violet-500 shrink-0" />
                  <span className="font-bold text-base text-slate-900 dark:text-white truncate">
                    {selectedItem.name}
                  </span>
                  {selectedItem.width && selectedItem.height && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {selectedItem.width}&times;{selectedItem.height}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      showAdvanced
                        ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Fine-Tune Watermark</span>
                  </button>

                  {/* Primary Download Button in header if ready */}
                  {selectedItem.status === 'done' && selectedItem.result && (
                    preparedDownload && !isConverting ? (
                      <a
                        id="download-image-header-btn"
                        href={preparedDownload.url}
                        download={preparedDownload.filename}
                        onClick={() => {
                          setDownloadSuccessMsg(
                            `Downloaded ${preparedDownload.filename} (${(preparedDownload.sizeBytes / 1024).toFixed(1)} KB)`
                          );
                          setTimeout(() => setDownloadSuccessMsg(null), 5000);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer no-underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download {exportFormat.toUpperCase()}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        id="download-image-header-btn"
                        disabled={true}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600/70 text-white font-bold text-xs cursor-wait"
                      >
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Preparing {exportFormat.toUpperCase()}...</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Advanced Fine-Tuning Drawer */}
              {showAdvanced && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Watermark Restoration Tuning
                    </span>
                    <button
                      type="button"
                      onClick={handleReprocessWithNewGain}
                      disabled={selectedItem.status === 'processing'}
                      className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Re-Apply Math</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Alpha Gain Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          Alpha Gain Strength:
                        </span>
                        <span className="font-mono font-bold text-violet-600 dark:text-violet-400">
                          {alphaGain.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.8"
                        step="0.05"
                        value={alphaGain}
                        onChange={(e) => setAlphaGain(parseFloat(e.target.value))}
                        className="w-full accent-violet-600 cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-400">
                        Adjusts strength of the Reverse Alpha Blending map if JPEG compression altered watermark contrast.
                      </p>
                    </div>

                    {/* Auto-Align Search */}
                    <div className="space-y-1.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Subpixel Anchor Snap:
                        </span>
                        <input
                          type="checkbox"
                          checked={autoAlign}
                          onChange={(e) => setAutoAlign(e.target.checked)}
                          className="rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Evaluates micro-alignment (±4px) against Gemini star contour.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: UI Display States */}

              {/* State 1: Image Uploaded (Original preview with prominent 'Remove Watermark' button) */}
              {selectedItem.status === 'uploaded' && (
                <div className="space-y-4">
                  <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-2 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedItem.originalUrl}
                      alt="Original uploaded preview with watermark"
                      className="max-h-[520px] w-auto max-w-full object-contain mx-auto rounded-xl"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-violet-400" />
                      <span>Original Preview (Watermark Visible)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-transparent border border-violet-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Ready to remove watermark
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {selectedItem.detectedConfig?.description || 'Gemini watermark detected in bottom-right corner.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      id="remove-watermark-btn"
                      onClick={() => processQueueItem(selectedItem)}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-violet-200" />
                      <span>Remove Watermark</span>
                    </button>
                  </div>
                </div>
              )}

              {/* State 2: Processing ("Removing Watermark..." with real loading indicator) */}
              {selectedItem.status === 'processing' && (
                <div className="w-full min-h-[380px] aspect-square sm:aspect-[4/3] rounded-2xl bg-slate-900 flex flex-col items-center justify-center gap-4 text-white p-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-violet-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-extrabold text-lg text-white">Removing Watermark...</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Executing calibrated Reverse Alpha Blending loop and reconstructing background pixels.
                    </p>
                  </div>
                  <button
                    disabled
                    className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs flex items-center gap-2 cursor-not-allowed"
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Image...</span>
                  </button>
                </div>
              )}

              {/* State 3: Success / Done (Processed image preview + Multi-format selector + Working Download button) */}
              {selectedItem.status === 'done' && selectedItem.result && (
                <div className="space-y-4">
                  {/* View Mode Switcher */}
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Watermark successfully removed!</span>
                    </span>

                    <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        id="preview-mode-cleaned-btn"
                        onClick={() => setPreviewMode('cleaned')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          previewMode === 'cleaned'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Cleaned Output
                      </button>
                      <button
                        type="button"
                        id="preview-mode-comparison-btn"
                        onClick={() => setPreviewMode('comparison')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          previewMode === 'comparison'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Before / After Slider
                      </button>
                    </div>
                  </div>

                  {previewMode === 'comparison' ? (
                    <BeforeAfterSlider
                      beforeUrl={selectedItem.result.originalUrl}
                      afterUrl={selectedItem.result.cleanedUrl}
                      beforeLabel="Original (Watermark)"
                      afterLabel="Cleaned (Restored)"
                    />
                  ) : (
                    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedItem.result.cleanedUrl}
                        alt="Processed Cleaned Image preview"
                        className="max-h-[520px] w-auto max-w-full object-contain mx-auto rounded-xl"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Watermark Removed (Lossless)</span>
                      </div>
                    </div>
                  )}

                  {/* Multi-Format Selector & Download Control Studio */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <FileType className="w-4 h-4 text-violet-500" />
                          <span>Download Format &amp; Quality</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Select your desired image or document export format:
                        </p>
                      </div>

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-semibold">
                        {selectedItem.result.width} &times; {selectedItem.result.height} px
                      </span>
                    </div>

                    {/* Format Selector Pills (PNG, WebP, JPEG, JPG, PDF) */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {SUPPORTED_FORMATS.map((fmt) => {
                        const isSelected = exportFormat === fmt.id;
                        return (
                          <button
                            key={fmt.id}
                            type="button"
                            id={`format-selector-${fmt.id}`}
                            onClick={() => {
                              setExportFormat(fmt.id);
                              setConversionError(null);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/25 ring-2 ring-violet-500/30 scale-[1.02]'
                                : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-sm tracking-wide">
                                {fmt.label}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}>
                                {fmt.badge}
                              </span>
                            </div>

                            <span className={`text-[11px] leading-tight ${
                              isSelected ? 'text-violet-100' : 'text-slate-400'
                            }`}>
                              .{fmt.extension}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quality Controls for WebP / JPEG / JPG */}
                    {activeFormatDetails.supportsQuality ? (
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {activeFormatDetails.label} Compression Quality:
                          </span>
                          <span className="font-mono font-bold text-violet-600 dark:text-violet-400">
                            {exportQuality}%
                          </span>
                        </div>
                        <input
                          type="range"
                          id="quality-slider-input"
                          min="50"
                          max="100"
                          step="1"
                          value={exportQuality}
                          onChange={(e) => setExportQuality(parseInt(e.target.value, 10))}
                          className="w-full accent-violet-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Smaller Size (50%)</span>
                          <span>Balanced (92%)</span>
                          <span>Max Quality (100%)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200/50 dark:border-violet-800/50 text-xs text-violet-800 dark:text-violet-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                        <span>
                          {exportFormat === 'png' 
                            ? 'PNG uses 100% lossless compression preserving all reconstructed background pixels and transparency.'
                            : 'PDF embeds the image in a print-ready vector container with exact 1:1 pixel aspect ratio.'
                          }
                        </span>
                      </div>
                    )}

                    {/* Conversion Error Alert */}
                    {conversionError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{conversionError}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadSingle(selectedItem, exportFormat, exportQuality)}
                          className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* Download Success Banner */}
                    {downloadSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{downloadSuccessMsg}</span>
                      </div>
                    )}

                    {/* Primary Action Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activeFormatDetails.description}
                      </p>

                      {preparedDownload && !isConverting ? (
                        <a
                          id="download-image-btn"
                          href={preparedDownload.url}
                          download={preparedDownload.filename}
                          onClick={() => {
                            setDownloadSuccessMsg(
                              `Downloaded ${preparedDownload.filename} (${(preparedDownload.sizeBytes / 1024).toFixed(1)} KB)`
                            );
                            setTimeout(() => setDownloadSuccessMsg(null), 5000);
                          }}
                          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer no-underline text-center"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download {exportFormat.toUpperCase()}</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          id="download-image-btn"
                          disabled={isConverting}
                          onClick={() => handleDownloadSingle(selectedItem, exportFormat, exportQuality)}
                          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600/80 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-wait"
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Converting to {exportFormat.toUpperCase()} ({conversionProgress}%)...</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* State 4: Error State (Useful message + Retry button) */}
              {selectedItem.status === 'error' && (
                <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-center space-y-4">
                  <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
                  <div>
                    <p className="font-extrabold text-base text-rose-600 dark:text-rose-400">Processing Failed</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                      {selectedItem.errorMessage || 'An unexpected error occurred while processing the image.'}
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      type="button"
                      id="retry-removal-btn"
                      onClick={() => processQueueItem(selectedItem)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/20 active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Removal</span>
                    </button>
                  </div>
                </div>
              )}

              {/* State 5: Unsupported Watermark State */}
              {selectedItem.status === 'unsupported' && (
                <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-center space-y-4">
                  <AlertCircle className="w-10 h-10 mx-auto text-amber-500" />
                  <div>
                    <p className="font-extrabold text-base text-amber-700 dark:text-amber-300">Unsupported Watermark</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                      {selectedItem.errorMessage || 'This image could not be processed reliably. Standard Gemini watermarks reside in the bottom-right corner with known margins.'}
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Fine-Tune Margins</span>
                    </button>
                    <button
                      type="button"
                      id="retry-removal-btn"
                      onClick={() => processQueueItem(selectedItem)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-md shadow-amber-600/20 active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Removal</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Technical Restoration Metrics */}
              {selectedItem.result && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Resolution</span>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {selectedItem.result.width} &times; {selectedItem.result.height}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Watermark Size</span>
                    <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
                      {selectedItem.result.watermarkBounds.width} &times; {selectedItem.result.watermarkBounds.height} px
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Processing Time</span>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedItem.result.processingTimeMs} ms
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Restoration Method</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      Reverse Alpha Blending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Queue & Batch Actions */}
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Image Queue ({queue.length})
                  </h4>
                </div>

                {queue.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDownloadAllZip}
                    disabled={zipProgress !== null || queue.filter(q => q.status === 'done').length === 0}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>{zipProgress !== null ? `${zipProgress}%` : `ZIP (${exportFormat.toUpperCase()})`}</span>
                  </button>
                )}
              </div>

              {/* Queue List */}
              <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      item.id === selectedItemId
                        ? 'border-violet-500 bg-violet-50/80 dark:bg-violet-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.result?.cleanedUrl || item.originalUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-800"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate max-w-[130px]">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          {item.status === 'uploaded' && (
                            <span className="text-violet-500 font-medium">Ready</span>
                          )}
                          {item.status === 'done' && (
                            <span className="text-emerald-500 font-medium flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Cleaned
                            </span>
                          )}
                          {item.status === 'processing' && (
                            <span className="text-violet-500 animate-pulse font-medium flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                            </span>
                          )}
                          {item.status === 'error' && (
                            <span className="text-rose-500 font-medium">Failed</span>
                          )}
                          {item.status === 'unsupported' && (
                            <span className="text-amber-500 font-medium">Unsupported</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {item.status === 'uploaded' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(item.id);
                            processQueueItem(item);
                          }}
                          className="px-2 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          title="Remove watermark"
                        >
                          Remove
                        </button>
                      )}
                      {item.status === 'done' && item.result && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSingle(item, exportFormat, exportQuality);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
                          title={`Download as ${exportFormat.toUpperCase()}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Batch Actions Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  {queue.filter(q => q.status === 'done').length} of {queue.length} processed
                </span>
                <button
                  type="button"
                  onClick={() => setQueue([])}
                  className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  Clear Queue
                </button>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Browser-Local Guarantee
              </span>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                Your images are processed directly inside your browser using mathematical reverse alpha blending on canvas. No files or metadata leave your computer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

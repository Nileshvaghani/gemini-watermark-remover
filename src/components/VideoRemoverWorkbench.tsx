'use client';

import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  X,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { VideoProcessingPipeline, VideoMetadata, VideoProgress, VideoProcessResult } from '../lib/watermark/videoProcessor';
import { downloadBlob } from '../lib/watermark/zipExporter';

export default function VideoRemoverWorkbench() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [result, setResult] = useState<VideoProcessResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alphaGain, setAlphaGain] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const pipelineRef = useRef<VideoProcessingPipeline | null>(null);

  // Load a video file
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      setErrorMsg('Please upload a valid MP4, WebM, or MOV video file.');
      return;
    }

    setErrorMsg(null);
    setResult(null);
    setProgress(null);
    setVideoFile(file);

    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    try {
      const pipeline = new VideoProcessingPipeline();
      const meta = await pipeline.extractMetadata(file);
      setMetadata(meta);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to extract video metadata');
    }
  };

  // Generate synthetic sample video for demonstration
  const handleLoadSampleVideo = async () => {
    setErrorMsg(null);
    setResult(null);
    setProgress(null);

    // Create a 5-second 1280x720 synthetic canvas video with an animated background and Gemini watermark
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.start();

    // Render 60 frames (2 seconds sample demo)
    for (let f = 0; f < 60; f++) {
      const t = f / 30;
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5 + Math.sin(t * 3) * 0.2, '#4338ca');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      // Moving graphic
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(300 + Math.sin(t * 4) * 200, 360, 80, 0, Math.PI * 2);
      ctx.fill();

      // Video title text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('Gemini Veo Video Sample', 80, 120);
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Frame ${f + 1} / 60 • Local Browser Stream`, 80, 160);

      // Watermark in bottom right (96x96 @ 64px margins)
      const wmSize = 96;
      const wx = 1280 - 64 - wmSize;
      const wy = 720 - 64 - wmSize;

      // Draw 4-pointed sparkle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.moveTo(wx + wmSize / 2, wy);
      ctx.quadraticCurveTo(wx + wmSize / 2, wy + wmSize / 2, wx + wmSize, wy + wmSize / 2);
      ctx.quadraticCurveTo(wx + wmSize / 2, wy + wmSize / 2, wx + wmSize / 2, wy + wmSize);
      ctx.quadraticCurveTo(wx + wmSize / 2, wy + wmSize / 2, wx, wy + wmSize / 2);
      ctx.quadraticCurveTo(wx + wmSize / 2, wy + wmSize / 2, wx + wmSize / 2, wy);
      ctx.fill();

      await new Promise(r => setTimeout(r, 20));
    }

    recorder.stop();
    const sampleBlob = await new Promise<Blob>(resolve => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
    });

    const sampleFile = new File([sampleBlob], 'gemini_veo_sample_video.webm', { type: 'video/webm' });
    handleFileChange(sampleFile);
  };

  // Start processing video
  const handleStartProcessing = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setResult(null);

    const pipeline = new VideoProcessingPipeline();
    pipelineRef.current = pipeline;

    try {
      const res = await pipeline.processVideo(videoFile, {
        alphaGain,
        onProgress: setProgress
      });

      setResult(res);
      setIsProcessing(false);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#818cf8', '#38bdf8']
      });
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err instanceof Error ? err.message : 'Video processing failed');
    }
  };

  const handleCancelProcessing = () => {
    if (pipelineRef.current) {
      pipelineRef.current.cancel();
      pipelineRef.current = null;
    }
    setIsProcessing(false);
    setProgress(null);
  };

  const togglePlay = () => {
    if (!videoPlayerRef.current) return;
    if (isPlaying) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Upload & Sample Section */}
      {!videoUrl && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer rounded-3xl p-8 sm:p-14 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl text-center flex flex-col items-center justify-center gap-4 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/mov"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
            <Video className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Upload Gemini or Veo Video Clip
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Supports MP4, WebM, and MOV clips up to 100MB. Processed frame-by-frame entirely inside your browser.
            </p>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="pt-2">
            <button
              type="button"
              onClick={handleLoadSampleVideo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Load 2-Second Demo Video</span>
            </button>
          </div>
        </div>
      )}

      {/* Video Workspace View */}
      {videoUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Video Player & Visual Region */}
          <div className="lg:col-span-2 p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <Video className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {videoFile?.name || 'video_clip.mp4'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setVideoFile(null);
                  setVideoUrl(null);
                  setMetadata(null);
                  setResult(null);
                  setProgress(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Change video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Preview Player with Watermark Overlay Guide */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-inner">
              <video
                ref={videoPlayerRef}
                src={result?.outputUrl || videoUrl}
                playsInline
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls
              />

              {/* Bounding box guide overlay if not completed yet */}
              {!result && (
                <div className="pointer-events-none absolute bottom-4 right-4 border-2 border-dashed border-violet-400 bg-violet-500/20 rounded-lg p-2 text-[10px] text-white font-mono flex items-center gap-1 shadow-lg backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-violet-300 animate-spin" />
                  <span>Target Watermark Region</span>
                </div>
              )}
            </div>

            {/* Processing Progress Panel */}
            {isProcessing && progress && (
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-indigo-800 dark:text-indigo-300 capitalize flex items-center gap-1.5">
                    <Clock className="w-4 h-4 animate-spin text-indigo-500" />
                    <span>{progress.status}...</span>
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {progress.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-150 rounded-full"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Frame {progress.currentFrame} of {progress.totalFrames}</span>
                  <span>
                    Elapsed: {progress.elapsedSeconds}s • Est: {progress.estimatedRemainingSeconds}s remaining
                  </span>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCancelProcessing}
                    className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold transition-colors"
                  >
                    Cancel Processing
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Result Banner */}
            {result && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Video Restored Losslessly!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Finished in {(result.processingTimeMs / 1000).toFixed(1)}s with synchronized audio.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => downloadBlob(result.outputBlob, `cleaned_${metadata?.fileName || 'video.mp4'}`)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cleaned Video</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Action & Metadata Panel */}
          <div className="flex flex-col gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span>Video Specifications</span>
              </h4>

              {metadata && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400">Resolution:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {metadata.width} &times; {metadata.height}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {metadata.duration.toFixed(1)} seconds
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400">File Size:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {(metadata.fileSize / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Audio Track:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Preserved
                    </span>
                  </div>
                </div>
              )}

              {/* Tuning Slider */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">Alpha Inversion Gain:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{alphaGain.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={alphaGain}
                  disabled={isProcessing}
                  onChange={(e) => setAlphaGain(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Action Button */}
              {!result && (
                <button
                  type="button"
                  onClick={handleStartProcessing}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Video...' : 'Start Frame-by-Frame Cleaning'}</span>
                </button>
              )}

              {result && (
                <button
                  type="button"
                  onClick={handleStartProcessing}
                  className="w-full py-3 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Process with New Settings</span>
                </button>
              )}
            </div>

            {/* Privacy Card */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Browser-native WebCodecs &amp; Canvas decode your video memory locally without sending any frames to a remote server.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

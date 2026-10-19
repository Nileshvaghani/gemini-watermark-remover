/**
 * Core Video Watermark Removal Engine
 * Performs frame-by-frame decoding, reverse alpha blending on the watermark region,
 * audio track preservation via Web Audio API, and high-quality video re-encoding.
 */

import { detectWatermarkConfig, calculateWatermarkBounds, WatermarkConfig } from './catalog';
import { getCalibratedAlphaMap } from './alphaGenerator';
import { removeWatermarkFromImageData } from './imageProcessor';

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fileSize: number;
  fileName: string;
  mimeType: string;
}

export interface VideoProgress {
  currentFrame: number;
  totalFrames: number;
  percentage: number;
  elapsedSeconds: number;
  estimatedRemainingSeconds: number;
  status: 'initializing' | 'decoding' | 'processing' | 'encoding' | 'completed' | 'cancelled' | 'error';
  errorMessage?: string;
}

export interface VideoProcessResult {
  outputBlob: Blob;
  outputUrl: string;
  metadata: VideoMetadata;
  durationSeconds: number;
  processingTimeMs: number;
}

export class VideoProcessingPipeline {
  private abortController: AbortController | null = null;

  /**
   * Reads video file metadata without full processing.
   */
  public async extractMetadata(file: File | Blob): Promise<VideoMetadata> {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const url = URL.createObjectURL(file);
    video.src = url;

    return new Promise((resolve, reject) => {
      video.onloadedmetadata = () => {
        const meta: VideoMetadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          fileSize: file.size,
          fileName: file instanceof File ? file.name : 'video.mp4',
          mimeType: file.type || 'video/mp4'
        };
        URL.revokeObjectURL(url);
        resolve(meta);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Unable to decode video metadata. The format may not be supported by this browser.'));
      };
    });
  }

  /**
   * Processes a video file frame-by-frame, removing the Gemini watermark while preserving audio.
   */
  public async processVideo(
    file: File | Blob,
    options: {
      alphaGain?: number;
      customBounds?: { x: number; y: number; width: number; height: number };
      fps?: number;
      onProgress?: (progress: VideoProgress) => void;
    } = {}
  ): Promise<VideoProcessResult> {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    const startTime = performance.now();
    const meta = await this.extractMetadata(file);
    const videoUrl = URL.createObjectURL(file);

    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = false;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error('Failed to load video stream'));
    });

    const width = meta.width;
    const height = meta.height;
    const fps = options.fps || 30;
    const totalFrames = Math.max(1, Math.round(meta.duration * fps));

    // Determine watermark location and load alpha map
    const detectedConfig: WatermarkConfig = detectWatermarkConfig(width, height);
    const bounds = options.customBounds || calculateWatermarkBounds(width, height, detectedConfig);
    const alphaMap = getCalibratedAlphaMap(bounds.width, bounds.height);
    const alphaGain = options.alphaGain ?? 1.0;

    // Create rendering canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }

    // Setup Audio Capture
    let audioStreamTrack: MediaStreamTrack | null = null;
    let audioCtx: AudioContext | null = null;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
      const sourceNode = audioCtx.createMediaElementSource(video);
      const destinationNode = audioCtx.createMediaStreamDestination();
      sourceNode.connect(destinationNode);
      sourceNode.connect(audioCtx.destination); // Also send to output if audible
      audioStreamTrack = destinationNode.stream.getAudioTracks()[0] || null;
    } catch {
      // Audio capture fallback: some browsers restrict createMediaElementSource or file has no audio
      audioStreamTrack = null;
    }

    // Capture Canvas Stream for recording
    const canvasStream = canvas.captureStream(fps);
    if (audioStreamTrack) {
      canvasStream.addTrack(audioStreamTrack);
    }

    // Supported recording mime type
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/mp4'
    ];
    let selectedMimeType = '';
    for (const mt of mimeTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mt)) {
        selectedMimeType = mt;
        break;
      }
    }
    if (!selectedMimeType) {
      selectedMimeType = 'video/webm';
    }

    const recordedChunks: Blob[] = [];
    const recorder = new MediaRecorder(canvasStream, {
      mimeType: selectedMimeType,
      videoBitsPerSecond: 8_000_000 // 8 Mbps high quality
    });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    recorder.start(100); // 100ms chunk slices

    // Step through video frame-by-frame
    const frameInterval = 1 / fps;
    let currentFrame = 0;

    options.onProgress?.({
      currentFrame: 0,
      totalFrames,
      percentage: 0,
      elapsedSeconds: 0,
      estimatedRemainingSeconds: 0,
      status: 'processing'
    });

    try {
      for (let t = 0; t < meta.duration; t += frameInterval) {
        if (signal.aborted) {
          recorder.stop();
          throw new Error('Video processing cancelled by user');
        }

        // Seek video to timestamp
        video.currentTime = t;
        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked);
        });

        // Draw frame to canvas
        ctx.drawImage(video, 0, 0, width, height);

        // Extract watermark bounding box image data
        const frameCrop = ctx.getImageData(bounds.x, bounds.y, bounds.width, bounds.height);

        // Apply reverse alpha blending on the bounding box
        removeWatermarkFromImageData(
          frameCrop,
          { x: 0, y: 0, width: bounds.width, height: bounds.height },
          alphaMap,
          alphaGain
        );

        // Paint restored pixels back into frame
        ctx.putImageData(frameCrop, bounds.x, bounds.y);

        currentFrame++;
        const elapsed = (performance.now() - startTime) / 1000;
        const progressFrac = currentFrame / totalFrames;
        const estimatedRemaining = progressFrac > 0.05 ? ((elapsed / progressFrac) - elapsed) : 0;

        options.onProgress?.({
          currentFrame,
          totalFrames,
          percentage: Math.min(99, Math.round(progressFrac * 100)),
          elapsedSeconds: Math.round(elapsed),
          estimatedRemainingSeconds: Math.round(estimatedRemaining),
          status: 'processing'
        });
      }

      // Finish recording
      options.onProgress?.({
        currentFrame: totalFrames,
        totalFrames,
        percentage: 100,
        elapsedSeconds: Math.round((performance.now() - startTime) / 1000),
        estimatedRemainingSeconds: 0,
        status: 'encoding'
      });

      const outputBlob = await new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const finalBlob = new Blob(recordedChunks, { type: selectedMimeType });
          resolve(finalBlob);
        };
        recorder.stop();
      });

      // Cleanup
      URL.revokeObjectURL(videoUrl);
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }

      const outputUrl = URL.createObjectURL(outputBlob);
      const processingTimeMs = Math.round(performance.now() - startTime);

      options.onProgress?.({
        currentFrame: totalFrames,
        totalFrames,
        percentage: 100,
        elapsedSeconds: Math.round(processingTimeMs / 1000),
        estimatedRemainingSeconds: 0,
        status: 'completed'
      });

      return {
        outputBlob,
        outputUrl,
        metadata: meta,
        durationSeconds: meta.duration,
        processingTimeMs
      };
    } catch (err) {
      URL.revokeObjectURL(videoUrl);
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }
      throw err;
    }
  }

  public cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

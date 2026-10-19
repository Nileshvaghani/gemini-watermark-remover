/**
 * Core Image Watermark Removal Engine
 * Implements mathematically exact Reverse Alpha Blending, automatic anchor alignment,
 * and high-fidelity pixel restoration without hallucination or blur.
 */

import { detectWatermarkConfig, calculateWatermarkBounds, WatermarkConfig } from './catalog';
import { getCalibratedAlphaMap } from './alphaGenerator';

export interface ProcessOptions {
  alphaGain?: number;          // Alpha multiplier (0.5 to 2.0, default 1.0)
  autoAlign?: boolean;          // Search local region for optimal subpixel correlation
  customBounds?: { x: number; y: number; width: number; height: number };
  outputFormat?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
}

export interface ProcessResult {
  cleanedBlob: Blob;
  cleanedUrl: string;
  originalUrl: string;
  width: number;
  height: number;
  watermarkBounds: { x: number; y: number; width: number; height: number };
  detectedConfig: WatermarkConfig;
  processingTimeMs: number;
  pixelsRestored: number;
}

/**
 * Searches a small bounding box area around the nominal watermark position
 * to detect the exact peak star alignment.
 */
function findOptimalWatermarkAnchor(
  data: Uint8ClampedArray,
  imgWidth: number,
  imgHeight: number,
  nominalX: number,
  nominalY: number,
  wmWidth: number,
  wmHeight: number,
  alphaMap: Float32Array
): { x: number; y: number } {
  // Constrain search to a tight subpixel jitter around the catalog nominal anchor
  const searchRadius = 4;
  const minX = Math.max(0, nominalX - searchRadius);
  const maxX = Math.min(imgWidth - wmWidth, nominalX + searchRadius);
  const minY = Math.max(0, nominalY - searchRadius);
  const maxY = Math.min(imgHeight - wmHeight, nominalY + searchRadius);

  let bestScore = -Infinity;
  let bestX = nominalX;
  let bestY = nominalY;

  for (let candY = minY; candY <= maxY; candY++) {
    for (let candX = minX; candX <= maxX; candX++) {
      let score = 0;
      let count = 0;

      // Correlate against the high-alpha core of the star map
      for (let wy = 0; wy < wmHeight; wy += 2) {
        for (let wx = 0; wx < wmWidth; wx += 2) {
          const a = alphaMap[wy * wmWidth + wx];
          if (a > 0.25) {
            const idx = ((candY + wy) * imgWidth + (candX + wx)) * 4;
            const lum = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
            score += lum * a;
            count++;
          }
        }
      }

      const normScore = count > 0 ? score / count : 0;
      if (normScore > bestScore) {
        bestScore = normScore;
        bestX = candX;
        bestY = candY;
      }
    }
  }

  return { x: bestX, y: bestY };
}

/**
 * Executes the core Reverse Alpha Blending pixel transformation loop on ImageData.
 */
export function removeWatermarkFromImageData(
  imageData: ImageData,
  bounds: { x: number; y: number; width: number; height: number },
  alphaMap: Float32Array,
  alphaGain: number = 1.0
): number {
  const { data, width: imgW, height: imgH } = imageData;
  const { x: startX, y: startY, width: wmW, height: wmH } = bounds;
  const logoValue = 255; // White watermark overlay
  let restoredCount = 0;

  for (let wy = 0; wy < wmH; wy++) {
    const iy = startY + wy;
    if (iy < 0 || iy >= imgH) continue;

    for (let wx = 0; wx < wmW; wx++) {
      const ix = startX + wx;
      if (ix < 0 || ix >= imgW) continue;

      const alphaIdx = wy * wmW + wx;
      let alpha = alphaMap[alphaIdx] * alphaGain;

      // Noise floor threshold: below 0.002, no modification needed
      if (alpha <= 0.002) continue;

      // Singularity guard: prevent division-by-zero or excessive noise amplification
      if (alpha > 0.99) {
        alpha = 0.99;
      }

      const pixelIdx = (iy * imgW + ix) * 4;
      const oneMinusAlpha = 1.0 - alpha;

      // Reverse alpha blending: Original = (Watermarked - alpha * Logo) / (1 - alpha)
      const r = (data[pixelIdx] - alpha * logoValue) / oneMinusAlpha;
      const g = (data[pixelIdx + 1] - alpha * logoValue) / oneMinusAlpha;
      const b = (data[pixelIdx + 2] - alpha * logoValue) / oneMinusAlpha;

      // 8-bit clamping to valid RGB range [0, 255]
      data[pixelIdx] = Math.min(255, Math.max(0, Math.round(r)));
      data[pixelIdx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      data[pixelIdx + 2] = Math.min(255, Math.max(0, Math.round(b)));

      restoredCount++;
    }
  }

  return restoredCount;
}

/**
 * High-level image processing function that handles full decoding,
 * watermark detection, mathematical restoration, and export.
 */
export async function processImageSource(
  imageSource: Blob | File | string,
  options: ProcessOptions = {}
): Promise<ProcessResult> {
  const startTime = performance.now();

  // Create image object
  const img = new Image();
  img.crossOrigin = 'anonymous';

  let srcUrl: string;
  if (typeof imageSource === 'string') {
    srcUrl = imageSource;
  } else {
    srcUrl = URL.createObjectURL(imageSource);
  }

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image source'));
    img.src = srcUrl;
  });

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  // Create canvas for pixel manipulation
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);

  // Determine watermark location and parameters
  const detectedConfig = detectWatermarkConfig(width, height);
  let bounds = options.customBounds || calculateWatermarkBounds(width, height, detectedConfig);

  // Calibrate alpha map for these dimensions
  const alphaMap = getCalibratedAlphaMap(bounds.width, bounds.height);

  // Optional auto-alignment search
  if (options.autoAlign && !options.customBounds) {
    const optimal = findOptimalWatermarkAnchor(
      imageData.data,
      width,
      height,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      alphaMap
    );
    bounds = { ...bounds, x: optimal.x, y: optimal.y };
  }

  // Execute reverse alpha blending
  const pixelsRestored = removeWatermarkFromImageData(
    imageData,
    bounds,
    alphaMap,
    options.alphaGain ?? 1.0
  );

  // Put cleaned pixels back onto canvas
  ctx.putImageData(imageData, 0, 0);

  // Export cleaned result as Blob
  const outputFormat = options.outputFormat || 'image/png';
  const quality = options.quality ?? 0.95;

  const cleanedBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to export canvas to Blob'));
      },
      outputFormat,
      quality
    );
  });

  const cleanedUrl = URL.createObjectURL(cleanedBlob);
  const processingTimeMs = Math.round(performance.now() - startTime);

  return {
    cleanedBlob,
    cleanedUrl,
    originalUrl: srcUrl,
    width,
    height,
    watermarkBounds: bounds,
    detectedConfig,
    processingTimeMs,
    pixelsRestored
  };
}

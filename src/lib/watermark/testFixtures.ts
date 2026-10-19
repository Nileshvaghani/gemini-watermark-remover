/**
 * Built-in Sample Assets and Test Fixtures
 * Generates verified watermarked test images with realistic backgrounds
 * (Cyberpunk cityscape, sunset landscape, abstract portrait) and forward-blended Gemini watermarks.
 */

import { getCalibratedAlphaMap } from './alphaGenerator';
import { calculateWatermarkBounds, detectWatermarkConfig } from './catalog';

export interface SampleFixture {
  id: string;
  title: string;
  aspectRatio: string;
  width: number;
  height: number;
  description: string;
  category: 'image' | 'video';
  createDataUrl: () => string;
}

/**
 * Procedurally draws a rich photographic test canvas and composites a real Gemini star watermark
 * onto the bottom-right corner using forward alpha blending.
 */
function createSyntheticGeminiImage(
  width: number,
  height: number,
  theme: 'cyberpunk' | 'sunset' | 'portrait'
): string {
  if (typeof document === 'undefined') {
    return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"%3E%3Crect width="100%25" height="100%25" fill="%230f172a"/%3E%3Ctext x="50%25" y="50%25" fill="%2394a3b8" text-anchor="middle" font-size="24"%3ESample Fixture%3C/text%3E%3C/svg%3E';
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Draw rich thematic background
  if (theme === 'cyberpunk') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.3, '#3b0764');
    grad.addColorStop(0.7, '#1e1b4b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing neon elements
    for (let i = 0; i < 24; i++) {
      const rx = (Math.sin(i * 1.7) * 0.5 + 0.5) * width;
      const ry = (Math.cos(i * 2.3) * 0.5 + 0.5) * height;
      const rGrad = ctx.createRadialGradient(rx, ry, 5, rx, ry, 120);
      rGrad.addColorStop(0, i % 2 === 0 ? 'rgba(236, 72, 153, 0.45)' : 'rgba(56, 189, 248, 0.45)');
      rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rGrad;
      ctx.beginPath();
      ctx.arc(rx, ry, 120, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (theme === 'sunset') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(0.4, '#ec4899');
    grad.addColorStop(0.7, '#6366f1');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Sun disc
    const sunGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 10, width * 0.5, height * 0.45, 140);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.7, '#f97316');
    sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.45, 140, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Abstract portrait studio lighting
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, 20, width * 0.5, height * 0.5, width * 0.6);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.4, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Add realistic image texture / noise
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 3. Composite official Gemini Watermark onto bottom-right corner
  const config = detectWatermarkConfig(width, height);
  const bounds = calculateWatermarkBounds(width, height, config);
  const alphaMap = getCalibratedAlphaMap(bounds.width, bounds.height);

  // Forward Alpha Blending: W = alpha * 255 + (1 - alpha) * Original
  for (let wy = 0; wy < bounds.height; wy++) {
    const py = bounds.y + wy;
    if (py >= height) continue;

    for (let wx = 0; wx < bounds.width; wx++) {
      const px = bounds.x + wx;
      if (px >= width) continue;

      const alpha = alphaMap[wy * bounds.width + wx];
      if (alpha <= 0.005) continue;

      const idx = (py * width + px) * 4;
      data[idx] = Math.round(alpha * 255 + (1 - alpha) * data[idx]);
      data[idx + 1] = Math.round(alpha * 255 + (1 - alpha) * data[idx + 1]);
      data[idx + 2] = Math.round(alpha * 255 + (1 - alpha) * data[idx + 2]);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

export const SAMPLE_FIXTURES: SampleFixture[] = [
  {
    id: 'sample-1k-square',
    title: 'Gemini 3.0 Pro 1:1 (Square)',
    aspectRatio: '1:1',
    width: 1024,
    height: 1024,
    description: '1024x1024 standard square with 96px star watermark at 64px margins.',
    category: 'image',
    createDataUrl: () => createSyntheticGeminiImage(1024, 1024, 'cyberpunk')
  },
  {
    id: 'sample-16-9-landscape',
    title: 'Gemini 16:9 Landscape',
    aspectRatio: '16:9',
    width: 1376,
    height: 768,
    description: '1376x768 widescreen landscape with standard Gemini watermark.',
    category: 'image',
    createDataUrl: () => createSyntheticGeminiImage(1376, 768, 'sunset')
  },
  {
    id: 'sample-05k-compact',
    title: 'Gemini 0.5k Compact',
    aspectRatio: '1:1',
    width: 512,
    height: 512,
    description: '512x512 compact preview output with 48px star watermark at 32px margins.',
    category: 'image',
    createDataUrl: () => createSyntheticGeminiImage(512, 512, 'portrait')
  }
];

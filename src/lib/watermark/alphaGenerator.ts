/**
 * Gemini Star Watermark Alpha Map Generator & Interpolator
 * Provides high-precision mathematical models and interpolated alpha maps for 36x36, 48x48, 96x96 and custom sizes.
 */

import { getEmbeddedAlphaMap } from './embeddedAlphaMaps';

// Cache pre-computed alpha maps by size
const alphaCache = new Map<number, Float32Array>();

/**
 * Procedurally generates the exact 4-pointed concave astroid star watermark alpha map
 * used by Google Gemini models.
 * 
 * Formula:
 * Center = (size / 2, size / 2)
 * Normalized coordinate: nx = (x - center) / radius, ny = (y - center) / radius
 * Distance d = (|nx|^p + |ny|^p)^(1/p) where p = 0.5 (astroid curve)
 */
export function generateGeminiStarAlpha(size: number): Float32Array {
  if (alphaCache.has(size)) {
    return alphaCache.get(size)!;
  }

  const alpha = new Float32Array(size * size);
  const center = (size - 1) / 2;
  const radius = size * 0.44; // star arm extends to ~44% of bounding box
  const p = 0.52; // astroid concavity exponent matching Gemini logo

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = Math.abs(x - center) / radius;
      const dy = Math.abs(y - center) / radius;

      // Distance from astroid contour
      const d = Math.pow(Math.pow(dx, p) + Math.pow(dy, p), 1 / p);

      let val = 0;
      if (d <= 1.0) {
        // Core falloff: maximum alpha ~0.76 at center, tapering smoothly to edges
        const coreFactor = Math.cos((d * Math.PI) / 2);
        val = 0.76 * Math.pow(coreFactor, 0.85);

        // Add subtle center sparkle glow
        const rCenter = Math.hypot(x - center, y - center) / (radius * 0.25);
        if (rCenter < 1.0) {
          val = Math.min(0.88, val + 0.12 * Math.cos((rCenter * Math.PI) / 2));
        }
      } else if (d < 1.15) {
        // Smooth anti-aliased edge
        const edgeT = (1.15 - d) / 0.15;
        val = 0.08 * Math.pow(edgeT, 2);
      }

      // Clamping and noise threshold
      if (val < 0.012) {
        val = 0;
      }
      alpha[y * size + x] = Math.min(0.96, val);
    }
  }

  alphaCache.set(size, alpha);
  return alpha;
}

/**
 * Resamples an alpha map to arbitrary width and height using bilinear interpolation.
 */
export function resampleAlphaMap(
  srcAlpha: Float32Array,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number
): Float32Array {
  if (srcW === dstW && srcH === dstH) {
    return new Float32Array(srcAlpha);
  }

  const dst = new Float32Array(dstW * dstH);
  const scaleX = srcW / dstW;
  const scaleY = srcH / dstH;

  for (let dy = 0; dy < dstH; dy++) {
    const sy = dy * scaleY;
    const y0 = Math.floor(sy);
    const y1 = Math.min(y0 + 1, srcH - 1);
    const fy = sy - y0;

    for (let dx = 0; dx < dstW; dx++) {
      const sx = dx * scaleX;
      const x0 = Math.floor(sx);
      const x1 = Math.min(x0 + 1, srcW - 1);
      const fx = sx - x0;

      const v00 = srcAlpha[y0 * srcW + x0];
      const v10 = srcAlpha[y0 * srcW + x1];
      const v01 = srcAlpha[y1 * srcW + x0];
      const v11 = srcAlpha[y1 * srcW + x1];

      const top = v00 * (1 - fx) + v10 * fx;
      const btm = v01 * (1 - fx) + v11 * fx;
      const val = top * (1 - fy) + btm * fy;

      dst[dy * dstW + dx] = val < 0.012 ? 0 : Math.min(0.98, val);
    }
  }

  return dst;
}

/**
 * Gets or creates the appropriate alpha map for any requested watermark dimensions.
 * Prioritizes official empirical alpha maps (48, 96, 36) before falling back to interpolation.
 */
export function getCalibratedAlphaMap(width: number, height: number): Float32Array {
  // Check exact embedded sizes
  if (width === 96 && height === 96) {
    const embedded = getEmbeddedAlphaMap(96);
    if (embedded) return embedded;
  }
  if (width === 48 && height === 48) {
    const embedded = getEmbeddedAlphaMap(48);
    if (embedded) return embedded;
  }
  if (width === 36 && height === 36) {
    const embedded = getEmbeddedAlphaMap('36-v2');
    if (embedded) return embedded;
  }

  // Resample from official 96x96 capture if available
  const base96 = getEmbeddedAlphaMap(96);
  if (base96) {
    return resampleAlphaMap(base96, 96, 96, width, height);
  }

  if (width === height) {
    return generateGeminiStarAlpha(width);
  }

  const baseSize = Math.max(width, height);
  const baseAlpha = generateGeminiStarAlpha(baseSize);
  return resampleAlphaMap(baseAlpha, baseSize, baseSize, width, height);
}

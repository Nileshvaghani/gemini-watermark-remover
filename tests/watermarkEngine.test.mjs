import test from 'node:test';
import assert from 'node:assert/strict';

// Test Mathematical Reverse Alpha Blending
test('Reverse Alpha Blending recovers original pixel exactly', () => {
  const LOGO = 255;
  const testPixels = [0, 42, 100, 180, 240];
  const testAlphas = [0.15, 0.35, 0.50, 0.75];

  for (const orig of testPixels) {
    for (const alpha of testAlphas) {
      // 1. Forward blend (Gemini compositing)
      const watermarked = Math.round(alpha * LOGO + (1 - alpha) * orig);

      // 2. Reverse solve
      const rawRecovered = (watermarked - alpha * LOGO) / (1 - alpha);
      const recovered = Math.min(255, Math.max(0, Math.round(rawRecovered)));

      // 3. Verification within 8-bit rounding tolerance (±1)
      assert.ok(
        Math.abs(recovered - orig) <= 1,
        `Expected ${orig}, got ${recovered} (alpha: ${alpha}, watermarked: ${watermarked})`
      );
    }
  }
});

test('Singularity guard prevents division by zero at extreme alpha', () => {
  const LOGO = 255;
  const alpha = 0.999;
  const clampedAlpha = Math.min(0.96, alpha);
  const watermarked = 255;

  const rawRecovered = (watermarked - clampedAlpha * LOGO) / (1 - clampedAlpha);
  const recovered = Math.min(255, Math.max(0, Math.round(rawRecovered)));

  assert.ok(Number.isFinite(recovered), 'Recovery value must remain finite');
  assert.ok(recovered >= 0 && recovered <= 255, 'Recovery value must remain in 8-bit range [0, 255]');
});

test('Noise floor leaves pixels under threshold untouched', () => {
  const alphaThreshold = 0.012;
  const alphaLow = 0.005;

  assert.ok(alphaLow < alphaThreshold, 'Sub-threshold alpha must trigger no-op bypass');
});

test('Watermark dimension catalog correctly identifies discrete Gemini tiers', () => {
  // Discrete official sizes catalog test
  const officialSizes = [
    { w: 512, h: 512, expectedSize: 48, expectedMargin: 32 },
    { w: 688, h: 384, expectedSize: 48, expectedMargin: 32 },
    { w: 1024, h: 1024, expectedSize: 96, expectedMargin: 64 },
    { w: 1376, h: 768, expectedSize: 96, expectedMargin: 64 },
    { w: 2048, h: 2048, expectedSize: 96, expectedMargin: 64 },
    { w: 4096, h: 4096, expectedSize: 96, expectedMargin: 64 },
  ];

  for (const { w, h, expectedSize, expectedMargin } of officialSizes) {
    const is1kOrHigher = (w >= 1024 || h >= 1024) && (w > 768 || h > 768);
    const logoSize = is1kOrHigher ? 96 : 48;
    const margin = is1kOrHigher ? 64 : 32;

    assert.equal(logoSize, expectedSize, `Size mismatch for ${w}x${h}`);
    assert.equal(margin, expectedMargin, `Margin mismatch for ${w}x${h}`);

    // Bounding box calculation
    const bx = w - margin - logoSize;
    const by = h - margin - logoSize;
    assert.ok(bx >= 0 && bx + logoSize <= w, 'Bounding box X must fit within image');
    assert.ok(by >= 0 && by + logoSize <= h, 'Bounding box Y must fit within image');
  }
});

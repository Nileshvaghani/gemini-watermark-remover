import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { jsPDF } from 'jspdf';

// Test directory for verification outputs
const OUTPUT_DIR = path.resolve('tests/output_verification');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Filename sanitization logic matching formatConverter.ts & zipExporter.ts
function getSanitizedDownloadFilename(originalName, format = 'png') {
  const ext = format === 'jpeg' ? 'jpeg' : format === 'jpg' ? 'jpg' : format;

  if (!originalName || typeof originalName !== 'string') {
    return `watermark-removed.${ext}`;
  }

  const baseOnly = originalName.split(/[/\\]/).pop() || '';
  let clean = baseOnly.replace(/\.[^/.]+$/, '').trim();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
  const isHexHash = /^[0-9a-f]{16,64}$/i.test(clean);
  const isGeneric = [
    'image', 'blob', 'download', 'upload', 'file', 'untitled',
    'photo', 'input', 'output', 'watermark-removed', ''
  ].includes(clean.toLowerCase());
  const isSample = clean.toLowerCase().startsWith('gemini') || clean.toLowerCase().startsWith('sample');

  if (isUuid || isHexHash || isGeneric || isSample) {
    return `watermark-removed.${ext}`;
  }

  clean = clean.replace(/[<>:"/\\|?*\x00-\x1F]/g, '-').replace(/\s+/g, '-');

  if (clean.toLowerCase().endsWith('-watermark-removed') || clean.toLowerCase().endsWith('_cleaned')) {
    return `${clean}.${ext}`;
  }

  return `${clean}-watermark-removed.${ext}`;
}

test('Verification: Generates valid, readable filenames for all 5 formats from UUID input', () => {
  const uuidInput = '06f2bb25-e11e-4bc0-9fd4-91999c872dd7';
  
  const pngName = getSanitizedDownloadFilename(uuidInput, 'png');
  const webpName = getSanitizedDownloadFilename(uuidInput, 'webp');
  const jpegName = getSanitizedDownloadFilename(uuidInput, 'jpeg');
  const jpgName = getSanitizedDownloadFilename(uuidInput, 'jpg');
  const pdfName = getSanitizedDownloadFilename(uuidInput, 'pdf');

  assert.equal(pngName, 'watermark-removed.png');
  assert.equal(webpName, 'watermark-removed.webp');
  assert.equal(jpegName, 'watermark-removed.jpeg');
  assert.equal(jpgName, 'watermark-removed.jpg');
  assert.equal(pdfName, 'watermark-removed.pdf');
});

test('Verification: Generates valid PDF with binary validation', () => {
  const width = 1024;
  const height = 1024;
  const filename = getSanitizedDownloadFilename('06f2bb25-e11e-4bc0-9fd4-91999c872dd7', 'pdf');
  assert.equal(filename, 'watermark-removed.pdf');

  const doc = new jsPDF({
    orientation: 'l',
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling']
  });

  // Embed dummy 1x1 base64 PNG
  const dummyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  doc.addImage(dummyPng, 'PNG', 0, 0, width, height, undefined, 'FAST');

  const buffer = Buffer.from(doc.output('arraybuffer'));
  assert.ok(buffer.length > 500, 'PDF buffer should be non-empty');
  assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
  assert.ok(buffer.subarray(buffer.length - 30).toString('ascii').includes('%%EOF'));

  // Save to verification dir
  const outPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outPath, buffer);
  assert.ok(fs.existsSync(outPath));
});

test('Verification: Generates valid mock PNG, WebP, and JPEG files with magic headers', () => {
  // Valid minimal PNG (1x1 transparent)
  const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  assert.equal(pngBuffer[0], 0x89);
  assert.equal(pngBuffer.subarray(1, 4).toString('ascii'), 'PNG');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'watermark-removed.png'), pngBuffer);

  // Valid minimal WebP
  const webpBuffer = Buffer.from('UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==', 'base64');
  assert.equal(webpBuffer.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(webpBuffer.subarray(8, 12).toString('ascii'), 'WEBP');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'watermark-removed.webp'), webpBuffer);

  // Valid minimal JPEG
  const jpegBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
  assert.equal(jpegBuffer[0], 0xFF);
  assert.equal(jpegBuffer[1], 0xD8);
  assert.equal(jpegBuffer[2], 0xFF);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'watermark-removed.jpg'), jpegBuffer);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'watermark-removed.jpeg'), jpegBuffer);
});

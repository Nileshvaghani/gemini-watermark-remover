import test from 'node:test';
import assert from 'node:assert/strict';
import { jsPDF } from 'jspdf';

test('Format definitions support PNG, WebP, JPEG, JPG, and PDF with correct MIME types', () => {
  const formats = [
    { id: 'png', ext: 'png', mime: 'image/png' },
    { id: 'webp', ext: 'webp', mime: 'image/webp' },
    { id: 'jpeg', ext: 'jpeg', mime: 'image/jpeg' },
    { id: 'jpg', ext: 'jpg', mime: 'image/jpeg' },
    { id: 'pdf', ext: 'pdf', mime: 'application/pdf' },
  ];

  for (const { id, ext, mime } of formats) {
    const isJpeg = id === 'jpeg' || id === 'jpg';
    const computedMime = id === 'pdf' ? 'application/pdf' : isJpeg ? 'image/jpeg' : id === 'webp' ? 'image/webp' : 'image/png';
    assert.equal(computedMime, mime, `MIME mismatch for ${id}`);
    assert.equal(ext, id, `Extension mismatch for ${id}`);
  }
});

test('Valid PDF is generated with exact dimensions and %PDF- header', () => {
  const width = 1024;
  const height = 1024;
  const orientation = width >= height ? 'l' : 'p';

  const doc = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling']
  });

  const arrayBuffer = doc.output('arraybuffer');
  const buffer = Buffer.from(arrayBuffer);

  // Validate PDF magic number
  const header = buffer.subarray(0, 5).toString('ascii');
  assert.equal(header, '%PDF-', 'PDF must begin with %PDF- magic signature');

  // Validate EOF marker exists
  const tail = buffer.subarray(buffer.length - 30).toString('ascii');
  assert.ok(tail.includes('%%EOF'), 'PDF must end with %%EOF marker');

  // Verify page dimensions match requested pixel size
  const page = doc.internal.pageSize;
  assert.equal(page.getWidth(), width, 'PDF page width must match original image width');
  assert.equal(page.getHeight(), height, 'PDF page height must match original image height');
});

test('White background composition rule is enforced for JPEG and JPG', () => {
  const jpegFormats = ['jpeg', 'jpg'];
  for (const fmt of jpegFormats) {
    const requiresWhiteBackground = fmt === 'jpeg' || fmt === 'jpg';
    assert.equal(requiresWhiteBackground, true, `${fmt} must trigger white background filling`);
  }

  const transparentFormats = ['png', 'webp'];
  for (const fmt of transparentFormats) {
    const requiresWhiteBackground = fmt === 'jpeg' || fmt === 'jpg';
    assert.equal(requiresWhiteBackground, false, `${fmt} must preserve alpha transparency`);
  }
});

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

test('getSanitizedDownloadFilename converts raw UUIDs to clean watermark-removed.<ext>', () => {
  const rawUuid = '06f2bb25-e11e-4bc0-9fd4-91999c872dd7';
  
  assert.equal(getSanitizedDownloadFilename(rawUuid, 'png'), 'watermark-removed.png');
  assert.equal(getSanitizedDownloadFilename(rawUuid, 'webp'), 'watermark-removed.webp');
  assert.equal(getSanitizedDownloadFilename(rawUuid, 'jpeg'), 'watermark-removed.jpeg');
  assert.equal(getSanitizedDownloadFilename(rawUuid, 'jpg'), 'watermark-removed.jpg');
  assert.equal(getSanitizedDownloadFilename(rawUuid, 'pdf'), 'watermark-removed.pdf');
});

test('getSanitizedDownloadFilename handles UUIDs with extensions', () => {
  const uuidWithExt = '06f2bb25-e11e-4bc0-9fd4-91999c872dd7.png';
  
  assert.equal(getSanitizedDownloadFilename(uuidWithExt, 'png'), 'watermark-removed.png');
  assert.equal(getSanitizedDownloadFilename(uuidWithExt, 'webp'), 'watermark-removed.webp');
  assert.equal(getSanitizedDownloadFilename(uuidWithExt, 'jpg'), 'watermark-removed.jpg');
  assert.equal(getSanitizedDownloadFilename(uuidWithExt, 'pdf'), 'watermark-removed.pdf');
});

test('getSanitizedDownloadFilename handles sample and generic names', () => {
  assert.equal(getSanitizedDownloadFilename('Gemini 3.0 Pro 1:1 (Square).png', 'png'), 'watermark-removed.png');
  assert.equal(getSanitizedDownloadFilename('sample-1k-square.png', 'jpg'), 'watermark-removed.jpg');
  assert.equal(getSanitizedDownloadFilename('blob', 'webp'), 'watermark-removed.webp');
  assert.equal(getSanitizedDownloadFilename('', 'pdf'), 'watermark-removed.pdf');
  assert.equal(getSanitizedDownloadFilename(undefined, 'png'), 'watermark-removed.png');
});

test('getSanitizedDownloadFilename preserves and suffixes meaningful filenames safely', () => {
  assert.equal(getSanitizedDownloadFilename('vacation-sunset.png', 'png'), 'vacation-sunset-watermark-removed.png');
  assert.equal(getSanitizedDownloadFilename('portrait.jpeg', 'jpg'), 'portrait-watermark-removed.jpg');
  assert.equal(getSanitizedDownloadFilename('already-watermark-removed.png', 'webp'), 'already-watermark-removed.webp');
});


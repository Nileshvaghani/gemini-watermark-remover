/**
 * Multi-Format Image Exporter & Converter
 * Supports converting processed images to PNG, WebP, JPEG, JPG, and PDF.
 * Preserves exact dimensions, aspect ratio, transparent pixels for PNG/WebP,
 * and composites a solid white background for JPEG/JPG.
 */

import { jsPDF } from 'jspdf';

export type ExportFormat = 'png' | 'webp' | 'jpeg' | 'jpg' | 'pdf';

export interface FormatDetails {
  id: ExportFormat;
  label: string;
  extension: string;
  mimeType: string;
  supportsQuality: boolean;
  description: string;
  badge: string;
}

export const SUPPORTED_FORMATS: FormatDetails[] = [
  {
    id: 'png',
    label: 'PNG',
    extension: 'png',
    mimeType: 'image/png',
    supportsQuality: false,
    description: 'Lossless compression with transparency support',
    badge: 'Lossless'
  },
  {
    id: 'webp',
    label: 'WebP',
    extension: 'webp',
    mimeType: 'image/webp',
    supportsQuality: true,
    description: 'Next-gen web format with smaller file sizes',
    badge: 'Small Size'
  },
  {
    id: 'jpeg',
    label: 'JPEG',
    extension: 'jpeg',
    mimeType: 'image/jpeg',
    supportsQuality: true,
    description: 'Standard photographic format with white background',
    badge: 'Universal'
  },
  {
    id: 'jpg',
    label: 'JPG',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    supportsQuality: true,
    description: 'Universal 3-letter extension format with white background',
    badge: 'Standard'
  },
  {
    id: 'pdf',
    label: 'PDF',
    extension: 'pdf',
    mimeType: 'application/pdf',
    supportsQuality: false,
    description: 'Print-ready vector wrapper preserving 1:1 dimensions & aspect ratio',
    badge: 'Document'
  }
];

export interface ConvertOptions {
  quality?: number; // 0.1 to 1.0 (default: 0.92)
  onProgress?: (progress: number) => void;
}

export interface ConvertedOutput {
  blob: Blob;
  mimeType: string;
  extension: string;
  filename: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Generates a clean, readable, valid download filename with correct extension.
 * Converts UUIDs, hashes, and generic names to 'watermark-removed.<ext>',
 * ensuring filenames such as watermark-removed.png, watermark-removed.webp,
 * watermark-removed.jpg, and watermark-removed.pdf.
 */
export function getSanitizedDownloadFilename(
  originalName?: string,
  format: ExportFormat = 'png'
): string {
  const ext = format === 'jpeg' ? 'jpeg' : format === 'jpg' ? 'jpg' : format;

  if (!originalName || typeof originalName !== 'string') {
    return `watermark-removed.${ext}`;
  }

  // Strip path and file extension
  const baseOnly = originalName.split(/[/\\]/).pop() || '';
  let clean = baseOnly.replace(/\.[^/.]+$/, '').trim();

  // Test for UUIDs (e.g. 06f2bb25-e11e-4bc0-9fd4-91999c872dd7)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
  // Test for hex hashes (e.g. MD5/SHA)
  const isHexHash = /^[0-9a-f]{16,64}$/i.test(clean);
  // Generic / fallback names
  const isGeneric = [
    'image', 'blob', 'download', 'upload', 'file', 'untitled',
    'photo', 'input', 'output', 'watermark-removed', ''
  ].includes(clean.toLowerCase());
  // Built-in sample test images
  const isSample = clean.toLowerCase().startsWith('gemini') || clean.toLowerCase().startsWith('sample');

  if (isUuid || isHexHash || isGeneric || isSample) {
    return `watermark-removed.${ext}`;
  }

  // Strip any illegal filesystem characters (< > : " / \ | ? * and control chars)
  clean = clean.replace(/[<>:"/\\|?*\x00-\x1F]/g, '-').replace(/\s+/g, '-');

  // If already ends with watermark-removed or cleaned, avoid repeating
  if (clean.toLowerCase().endsWith('-watermark-removed') || clean.toLowerCase().endsWith('_cleaned')) {
    return `${clean}.${ext}`;
  }

  return `${clean}-watermark-removed.${ext}`;
}

/**
 * Converts a processed image Blob or URL into the target export format.
 */
export async function convertProcessedImage(
  source: Blob | File | string,
  format: ExportFormat,
  options: ConvertOptions = {},
  baseFilename: string = 'watermark-removed'
): Promise<ConvertedOutput> {
  const quality = options.quality ?? 0.92;
  const filename = getSanitizedDownloadFilename(baseFilename, format);

  options.onProgress?.(15);

  // 1. Load image into an Image element
  const img = new Image();
  img.crossOrigin = 'anonymous';

  let objectUrl: string | null = null;
  if (typeof source === 'string') {
    img.src = source;
  } else {
    objectUrl = URL.createObjectURL(source);
    img.src = objectUrl;
  }

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image for format conversion'));
  });

  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  options.onProgress?.(45);

  // 2. Prepare canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 3. Handle background & draw
  // For JPEG/JPG: composite over pure white background
  if (format === 'jpeg' || format === 'jpg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0);

  options.onProgress?.(70);

  // 4. Generate output blob based on format
  let blob: Blob;
  let mimeType: string;
  let extension: string;

  if (format === 'pdf') {
    mimeType = 'application/pdf';
    extension = 'pdf';

    const orientation = width >= height ? 'l' : 'p';
    const doc = new jsPDF({
      orientation,
      unit: 'px',
      format: [width, height],
      hotfixes: ['px_scaling']
    });

    // Use lossless PNG data URL to embed in PDF
    const pngDataUrl = canvas.toDataURL('image/png');
    doc.addImage(pngDataUrl, 'PNG', 0, 0, width, height, undefined, 'FAST');
    blob = doc.output('blob');
  } else {
    const isJpeg = format === 'jpeg' || format === 'jpg';
    mimeType = isJpeg ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    extension = format; // 'png' | 'webp' | 'jpeg' | 'jpg'

    const exportQuality = (format === 'webp' || isJpeg) ? quality : undefined;

    blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        b => {
          if (b) resolve(b);
          else reject(new Error(`Failed to convert image to ${format.toUpperCase()}`));
        },
        mimeType,
        exportQuality
      );
    });
  }

  options.onProgress?.(100);

  return {
    blob,
    mimeType,
    extension,
    filename,
    width,
    height,
    sizeBytes: blob.size
  };
}

/**
 * Creates a valid PDF from an existing PNG or JPEG data array/buffer.
 */
export function createPdfFromImageDataUrl(
  dataUrl: string,
  width: number,
  height: number,
  imageFormat: 'PNG' | 'JPEG' = 'PNG'
): Blob {
  const orientation = width >= height ? 'l' : 'p';
  const doc = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling']
  });

  doc.addImage(dataUrl, imageFormat, 0, 0, width, height, undefined, 'FAST');
  return doc.output('blob');
}

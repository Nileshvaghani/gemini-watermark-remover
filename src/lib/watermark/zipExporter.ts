/**
 * Batch Export Manager using JSZip
 * Bundles multiple processed images and videos into a single downloadable ZIP archive.
 */

import JSZip from 'jszip';

export interface BatchItem {
  name: string;
  blob: Blob;
}

export async function createZipArchive(
  items: BatchItem[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  items.forEach((item, index) => {
    // Deduplicate names if multiple files have identical filenames
    const cleanName = item.name.replace(/\.[^/.]+$/, '');
    const ext = item.name.split('.').pop() || 'png';
    const finalName = `${cleanName}_cleaned_${index + 1}.${ext}`;
    zip.file(finalName, item.blob);
  });

  return await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    },
    metadata => {
      onProgress?.(Math.round(metadata.percent));
    }
  );
}

export function downloadProcessedImage(
  processedBlob: Blob,
  filename = 'watermark-removed.png'
): void {
  if (!processedBlob || processedBlob.size === 0) {
    throw new Error('No processed image is available to download.');
  }

  let safeFilename = (filename || '').trim();

  // Determine fallback extension based on blob MIME type
  let inferredExt = 'png';
  if (processedBlob.type === 'application/pdf') {
    inferredExt = 'pdf';
  } else if (processedBlob.type === 'image/webp') {
    inferredExt = 'webp';
  } else if (processedBlob.type === 'image/jpeg') {
    inferredExt = 'jpg';
  } else if (processedBlob.type === 'video/mp4') {
    inferredExt = 'mp4';
  } else if (processedBlob.type === 'video/webm') {
    inferredExt = 'webm';
  } else if (processedBlob.type === 'application/zip') {
    inferredExt = 'zip';
  }

  // Check if filename is empty, a UUID, or missing an extension
  const baseOnly = safeFilename.split(/[/\\]/).pop() || '';
  const cleanBase = baseOnly.replace(/\.[^/.]+$/, '').trim();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = uuidRegex.test(cleanBase) || uuidRegex.test(safeFilename);
  const hasExt = /\.[a-z0-9]{2,5}$/i.test(safeFilename);

  if (!safeFilename || isUuid) {
    safeFilename = `watermark-removed.${inferredExt}`;
  } else if (!hasExt) {
    safeFilename = `${safeFilename}.${inferredExt}`;
  }

  // Explicitly ensure MIME type aligns with filename extension
  const ext = safeFilename.split('.').pop()?.toLowerCase() || inferredExt;
  let targetMime = processedBlob.type;
  if (ext === 'pdf') {
    targetMime = 'application/pdf';
  } else if (ext === 'webp') {
    targetMime = 'image/webp';
  } else if (ext === 'jpeg' || ext === 'jpg') {
    targetMime = 'image/jpeg';
  } else if (ext === 'png') {
    targetMime = 'image/png';
  }

  // Ensure blob instance has the explicit target MIME type
  const typedBlob = processedBlob.type === targetMime
    ? processedBlob
    : new Blob([processedBlob], { type: targetMime });

  const url = URL.createObjectURL(typedBlob);
  const link = document.createElement('a');

  // Position offscreen rather than display:none so Edge/Chromium treats it as active DOM
  link.style.position = 'fixed';
  link.style.top = '-9999px';
  link.style.left = '-9999px';
  link.style.opacity = '0';
  link.style.pointerEvents = 'none';

  link.setAttribute('href', url);
  link.setAttribute('download', safeFilename);
  link.download = safeFilename;

  document.body.appendChild(link);

  // Trigger download with synthetic MouseEvent which Chromium strictly parses with download attr
  try {
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );
  } catch {
    link.click();
  }

  // CRITICAL FIX: Do NOT call link.remove() or URL.revokeObjectURL(url) synchronously!
  // In Chromium/Edge, removing the anchor immediately before the download starts causes
  // the browser to discard the download attribute and default to the Blob URL's UUID.
  // Delay cleanup to allow browser download manager to initiate and read filename headers.
  setTimeout(() => {
    try {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      URL.revokeObjectURL(url);
    } catch {
      // Ignore cleanup error if already removed
    }
  }, 60000);
}

export function downloadBlob(blob: Blob, filename: string): void {
  downloadProcessedImage(blob, filename);
}

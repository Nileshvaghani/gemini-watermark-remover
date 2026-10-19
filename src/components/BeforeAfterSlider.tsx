'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move, SplitSquareVertical } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Original Watermark',
  afterLabel = 'Restored Lossless',
  className = ''
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(Math.max(2, Math.min(98, percent)));
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
    if (isPanning && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isDragging, isPanning, zoomLevel, panStart, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isDragging || isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isPanning, handleMouseMove, handleMouseUp, handleTouchMove]);

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const zoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };
  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSliderPosition(50);
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1 && !isDragging) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      });
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Visual Workspace Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleContainerMouseDown}
        className={`relative w-full aspect-square sm:aspect-[4/3] max-h-[640px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none ${
          zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-ew-resize'
        }`}
      >
        {/* Zoom & Pan Wrapper */}
        <div
          className="relative w-full h-full transition-transform duration-75"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'bottom right'
          }}
        >
          {/* Base Layer: Cleaned Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterUrl}
            alt={afterLabel}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            draggable={false}
          />

          {/* Top Layer: Original Watermarked Image clipped by slider position */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeUrl}
              alt={beforeLabel}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] z-20 cursor-ew-resize pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setIsDragging(true);
            }}
            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-violet-500 shadow-xl flex items-center justify-center text-violet-600 dark:text-violet-400 hover:scale-110 active:scale-95 transition-transform"
          >
            <SplitSquareVertical className="w-5 h-5 rotate-90" />
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-md">
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-violet-600/80 backdrop-blur-md text-white text-xs font-bold border border-violet-400/20 shadow-md">
            {afterLabel}
          </span>
        </div>
      </div>

      {/* Control Bar: Zoom & Inspection Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Comparison Position:</span>
          <span className="font-mono text-violet-400 font-bold">{Math.round(sliderPosition)}%</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoomLevel <= 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors text-slate-200"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono px-2 py-1 rounded bg-slate-800/80 text-[11px] font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoomLevel >= 4}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors text-slate-200"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-200 flex items-center gap-1 ml-1"
            title="Reset position & zoom"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[11px] hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Move className="w-3.5 h-3.5" />
          <span>Drag slider or pan when zoomed</span>
        </div>
      </div>
    </div>
  );
}

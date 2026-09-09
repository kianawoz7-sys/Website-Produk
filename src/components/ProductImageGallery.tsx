'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[activeIndex] || images[0];

  return (
    <>
      <div className="mb-8">
        {/* Main Display Image */}
        <div
          onClick={() => setIsFullscreen(true)}
          className="relative group cursor-zoom-in w-full h-[260px] sm:h-[400px] rounded-[20px] overflow-hidden bg-[#0E0E10] border border-black/[0.08] flex items-center justify-center p-1.5 sm:p-2.5"
        >
          <Image
            key={currentImage}
            src={currentImage}
            alt={`${title} - Foto ${activeIndex + 1}`}
            fill
            className="object-contain group-hover:scale-[1.01] transition-transform duration-300 drop-shadow-md"
            priority
            sizes="(max-width: 768px) 100vw, 840px"
          />

          {/* Prev / Next Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm"
                aria-label="Foto Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm"
                aria-label="Foto Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Photo Counter Badge */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {/* Tap to Zoom Badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Perbesar</span>
          </div>
        </div>

        {/* Horizontal Thumbnails Carousel */}
        {images.length > 1 && (
          <div className="mt-3 flex items-center gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
            {images.map((imgUrl, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all cursor-pointer ${
                    isActive
                      ? 'ring-2 ring-[#0B0F19] ring-offset-2 scale-105 shadow-sm opacity-100'
                      : 'border border-black/[0.1] opacity-50 hover:opacity-100 hover:border-black/30'
                  }`}
                  aria-label={`Lihat screenshot ${idx + 1}`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${title} - Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover object-top"
                    sizes="70px"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen HD Lightbox */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex flex-col items-center justify-center p-3 animate-fadeIn select-none"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-lg"
            aria-label="Tutup Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <div className="absolute top-5 left-5 z-20 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[12px] font-medium">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="absolute left-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all backdrop-blur-md"
                aria-label="Foto Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all backdrop-blur-md"
                aria-label="Foto Selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative w-full h-full max-w-[1200px] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={currentImage}
              src={currentImage}
              alt={`${title} - Fullscreen Foto ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}

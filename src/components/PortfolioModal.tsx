'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X, Check, ExternalLink, Layers, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioProject } from '@/lib/types';
import { formatWhatsAppUrl } from '@/lib/whatsapp';

interface PortfolioModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  whatsappNumber?: string;
}

export default function PortfolioModal({
  project,
  onClose,
  whatsappNumber = '6281234567890',
}: PortfolioModalProps) {
  const [isLandscape, setIsLandscape] = useState<boolean | null>(null);
  const [imageRatios, setImageRatios] = useState<Record<string, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Extract all available images
  const imageList = useMemo(() => {
    if (!project) return [];
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images.filter(Boolean);
    }
    if (project.image_url) {
      return [project.image_url];
    }
    return [];
  }, [project]);

  // Reset state when project changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsLandscape(null);
    setIsFullscreen(false);
  }, [project]);

  // Auto-detect image ratio (landscape vs portrait) instantly with cache and preloader
  const currentImage = imageList[activeImageIndex] || project?.image_url || null;
  useEffect(() => {
    if (!currentImage) return;
    if (imageRatios[currentImage] !== undefined) {
      setIsLandscape(imageRatios[currentImage]);
      return;
    }
    const testImg = new window.Image();
    testImg.src = currentImage;
    if (testImg.complete && testImg.naturalWidth && testImg.naturalHeight) {
      const landscape = testImg.naturalWidth > testImg.naturalHeight;
      setIsLandscape(landscape);
      setImageRatios((prev) => ({ ...prev, [currentImage]: landscape }));
    } else {
      testImg.onload = () => {
        if (testImg.naturalWidth && testImg.naturalHeight) {
          const landscape = testImg.naturalWidth > testImg.naturalHeight;
          setIsLandscape(landscape);
          setImageRatios((prev) => ({ ...prev, [currentImage]: landscape }));
        }
      };
    }
  }, [currentImage, imageRatios]);

  // Keyboard navigation & Escape handler
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && imageList.length > 1) {
        setActiveImageIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' && imageList.length > 1) {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, isFullscreen, imageList.length]);

  if (!project) return null;

  const waUrl = formatWhatsAppUrl(
    whatsappNumber,
    `Halo KyDev, saya tertarik dengan produk jadi / portofolio "${project.title}". Boleh minta info harga, kustomisasi, dan cara pemesanannya?`
  );

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[760px] max-h-[90vh] overflow-y-auto bg-white rounded-[24px] border border-black/[0.08] shadow-2xl p-5 sm:p-7 text-left transition-all no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Close Button */}
          <div className="sticky top-0 z-30 flex justify-end -mt-2 -mr-2 mb-2 pointer-events-none">
            <button
              onClick={onClose}
              className="pointer-events-auto w-9 h-9 rounded-full bg-[#E8E8ED]/90 hover:bg-[#DCDCE2] text-[#424245] hover:text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer shadow-md backdrop-blur-md"
              aria-label="Tutup"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 items-start">
            {/* Left / Top Media: Auto-Adaptive Device Canvas + Thumbnails */}
            <div className={isLandscape ? 'md:col-span-12' : 'md:col-span-5 flex flex-col items-center'}>
              {/* Main Featured Image */}
              <div
                onClick={() => currentImage && setIsFullscreen(true)}
                className={`relative group cursor-zoom-in overflow-hidden border border-black/[0.08] shadow-md transition-all ${
                  isLandscape
                    ? 'w-full aspect-[16/10] sm:aspect-[16/9] max-h-[380px] sm:max-h-[420px] rounded-[20px] bg-[#0E0E10]'
                    : 'w-full max-w-[280px] sm:max-w-[320px] md:max-w-none md:w-full aspect-[9/16] md:aspect-[9/15] rounded-[24px] bg-[#0E0E10]'
                } flex items-center justify-center p-1.5 sm:p-2`}
                title="Klik untuk melihat layar penuh"
              >
                {currentImage ? (
                  <>
                    <Image
                      key={currentImage}
                      src={currentImage}
                      alt={`${project.title} - Foto ${activeImageIndex + 1}`}
                      fill
                      className="object-contain group-hover:scale-[1.01] transition-transform duration-300 drop-shadow-md"
                      sizes="(max-width: 768px) 100vw, 750px"
                      priority
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (img.naturalWidth && img.naturalHeight) {
                          const landscape = img.naturalWidth > img.naturalHeight;
                          setIsLandscape(landscape);
                          if (currentImage) {
                            setImageRatios((prev) => ({ ...prev, [currentImage]: landscape }));
                          }
                        }
                      }}
                    />

                    {/* Prev / Next Arrows on Main Image (if multiple images) */}
                    {imageList.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) =>
                              prev > 0 ? prev - 1 : imageList.length - 1
                            );
                          }}
                          className="absolute left-2 z-10 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm"
                          aria-label="Foto Sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) =>
                              prev < imageList.length - 1 ? prev + 1 : 0
                            );
                          }}
                          className="absolute right-2 z-10 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm"
                          aria-label="Foto Selanjutnya"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Photo Counter Badge */}
                    {imageList.length > 1 && (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                        {activeImageIndex + 1} / {imageList.length}
                      </div>
                    )}

                    {/* Badge Tap to Zoom */}
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3 h-3" />
                      <span>Perbesar</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-neutral-900 to-black text-white">
                    <Layers className="w-10 h-10 mb-2 text-[#2563EB]" />
                    <span className="text-[14px] font-semibold">{project.title}</span>
                    <span className="text-[11px] text-white/60 mt-1">Web & Aplikasi</span>
                  </div>
                )}
              </div>

              {/* Horizontal Thumbnails Carousel (Strip Foto Banyak Sesuai Referensi) */}
              {imageList.length > 1 && (
                <div className="w-full mt-3 flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar justify-start sm:justify-center">
                  {imageList.map((imgUrl, idx) => {
                    const isActive = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden transition-all cursor-pointer ${
                          isActive
                            ? 'ring-2 ring-[#0B0F19] ring-offset-2 scale-105 shadow-sm opacity-100'
                            : 'border border-black/[0.1] opacity-50 hover:opacity-100 hover:border-black/30'
                        }`}
                        aria-label={`Lihat screenshot ${idx + 1}`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${project.title} - Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover object-top"
                          sizes="60px"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right / Bottom: Full Details & Descriptions */}
            <div className={isLandscape ? 'md:col-span-12' : 'md:col-span-7 flex flex-col justify-between'}>
              <div>
                {/* Category */}
                <span className="text-[11px] sm:text-[12px] font-semibold text-[#2563EB] uppercase tracking-wider block mb-1">
                  {project.category}
                </span>

                {/* Title */}
                <h3 className="font-display text-[20px] sm:text-[24px] font-bold text-[#0B0F19] leading-tight mb-2">
                  {project.title}
                </h3>

                {/* Full Description */}
                <div className="text-[13px] sm:text-[14px] text-[#6B7280] leading-relaxed mb-4 space-y-2">
                  <p className="whitespace-pre-line">{project.description}</p>
                </div>

                {/* Full Features Checklist */}
                {project.features && project.features.length > 0 && (
                  <div className="pt-3 border-t border-black/[0.06] mb-4">
                    <h4 className="text-[12px] font-semibold text-[#0B0F19] uppercase tracking-wider mb-2">
                      Fitur & Fasilitas Unggulan:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {project.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[#374151]">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row gap-2.5">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-5 py-2.5 text-[13px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.97] rounded-full transition-all shadow-xs"
                >
                  <span>Pesan Seperti Ini</span>
                </a>

                {project.has_live_url && project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-[#0B0F19] bg-white hover:bg-[#F3F4F6] active:scale-[0.97] rounded-full transition-all border border-[#D1D5DB]"
                  >
                    <span>Buka Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6B7280]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen HD Lightbox Modal with Multi-Photo Navigation */}
      {isFullscreen && currentImage && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex flex-col items-center justify-center p-3 animate-fadeIn select-none"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-lg"
            aria-label="Tutup Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Fullscreen Counter */}
          {imageList.length > 1 && (
            <div className="absolute top-5 left-5 z-20 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[12px] font-medium">
              {activeImageIndex + 1} / {imageList.length}
            </div>
          )}

          {/* Left / Right Nav in Fullscreen */}
          {imageList.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) =>
                    prev > 0 ? prev - 1 : imageList.length - 1
                  );
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
                  setActiveImageIndex((prev) =>
                    prev < imageList.length - 1 ? prev + 1 : 0
                  );
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
              alt={`${project.title} - Fullscreen Foto ${activeImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <p className="text-white/70 text-[12px] mt-2">
            Gunakan panah kiri/kanan untuk berganti foto • Ketuk tombol silang untuk menutup
          </p>
        </div>
      )}
    </>
  );
}

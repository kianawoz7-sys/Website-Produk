'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { X, Check, Clock, Shield, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatWhatsAppUrl, getProductConsultationMessage } from '@/lib/whatsapp';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  whatsappNumber?: string;
}

export default function ProductModal({
  product,
  onClose,
  whatsappNumber = '6281234567890',
}: ProductModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLandscape, setIsLandscape] = useState<boolean | null>(null);
  const [imageRatios, setImageRatios] = useState<Record<string, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const imageList = useMemo(() => {
    if (!product) return [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }
    if (product.image_url) {
      return [product.image_url];
    }
    return [];
  }, [product]);

  // Reset state when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsLandscape(null);
    setIsFullscreen(false);
  }, [product]);

  const currentImage = imageList[activeImageIndex] || product?.image_url || null;

  // Auto-detect image ratio (landscape vs portrait) instantly with cache and preloader
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
    if (!product) return;

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
  }, [product, onClose, isFullscreen, imageList.length]);

  // Auto-scroll active thumbnail into center view
  useEffect(() => {
    if (thumbsRef.current && thumbsRef.current.children[activeImageIndex]) {
      const activeEl = thumbsRef.current.children[activeImageIndex] as HTMLElement;
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeImageIndex]);

  // Mouse drag-to-scroll support for thumbnails
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!thumbsRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - thumbsRef.current.offsetLeft;
    scrollLeftRef.current = thumbsRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !thumbsRef.current) return;
    const x = e.pageX - thumbsRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
      thumbsRef.current.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  if (!product) return null;

  const waUrl = formatWhatsAppUrl(
    whatsappNumber,
    getProductConsultationMessage(product.name)
  );

  const ctaRawLink = product.button_link?.trim();
  const ctaLink = ctaRawLink
    ? (ctaRawLink.startsWith('http://') || ctaRawLink.startsWith('https://') || ctaRawLink.startsWith('/') || ctaRawLink.startsWith('#')
        ? ctaRawLink
        : `https://${ctaRawLink}`)
    : waUrl;
  const isExternalCta = !ctaRawLink || ctaLink.startsWith('http://') || ctaLink.startsWith('https://');
  const ctaButtonText = product.button_text?.trim() || 'Pilih Paket Ini';

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[680px] max-h-[90vh] overflow-y-auto bg-white rounded-[24px] border border-black/[0.08] shadow-2xl p-5 sm:p-8 text-left transition-all no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#E8E8ED]/90 hover:bg-[#DCDCE2] flex items-center justify-center text-[#424245] hover:text-[#1D1D1F] transition-colors shadow-sm"
            aria-label="Tutup Detail"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Multi-Image Adaptive Stage */}
          {currentImage && (
            <div className="mb-6 flex flex-col items-center">
              <div
                onClick={() => setIsFullscreen(true)}
                className={`relative group cursor-zoom-in overflow-hidden border border-black/[0.08] shadow-md transition-all ${
                  isLandscape
                    ? 'w-full aspect-[16/10] sm:aspect-[16/9] max-h-[360px] rounded-[18px] bg-[#0E0E10]'
                    : 'w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-[22px] bg-[#0E0E10]'
                } flex items-center justify-center p-1.5 sm:p-2`}
                title="Klik untuk melihat layar penuh"
              >
                <Image
                  key={currentImage}
                  src={currentImage}
                  alt={`${product.name} - Foto ${activeImageIndex + 1}`}
                  fill
                  className="object-contain group-hover:scale-[1.01] transition-transform duration-300 drop-shadow-md"
                  priority
                  sizes="(max-width: 768px) 100vw, 680px"
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

                {/* Prev / Next Arrows */}
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
                      className="absolute left-2.5 z-10 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm"
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
                      className="absolute right-2.5 z-10 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm"
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

                {/* Tap to Zoom Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                  <span>Perbesar</span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {imageList.length > 1 && (
                <div
                  className={`mt-3.5 w-full ${
                    isLandscape
                      ? 'max-w-full'
                      : 'max-w-[280px] sm:max-w-[320px]'
                  } mx-auto`}
                >
                  {/* Thumbnail Scroll Container - Smooth Gesture Swiping */}
                  <div
                    ref={thumbsRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`flex items-center gap-1.5 sm:gap-2 py-1.5 px-0.5 overflow-x-auto no-scrollbar touch-pan-x overscroll-x-contain select-none cursor-grab active:cursor-grabbing ${
                      imageList.length <= 6 ? 'justify-center' : 'justify-start'
                    }`}
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {imageList.map((imgUrl, idx) => {
                      const isActive = idx === activeImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!hasMovedRef.current) {
                              setActiveImageIndex(idx);
                            }
                          }}
                          className={`relative shrink-0 w-[40px] h-[40px] sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl overflow-hidden transition-all cursor-pointer aspect-square ${
                            isActive
                              ? 'ring-2 ring-[#0B0F19] ring-offset-1 shadow-sm opacity-100'
                              : 'border border-black/[0.08] opacity-50 hover:opacity-100 hover:border-black/25'
                          }`}
                          aria-label={`Pilih screenshot ${idx + 1}`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`${product.name} - Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover object-top pointer-events-none"
                            sizes="48px"
                          />
                        </button>
                      );
                    })}
                    {imageList.length > 6 && <div className="w-2 shrink-0" aria-hidden="true" />}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Header Info */}
          <div className="mb-4">
            <span className="text-[12px] font-semibold text-[#2563EB] uppercase tracking-wider block mb-1">
              Paket Layanan KyDev
            </span>
            <h3 className="font-display text-[22px] sm:text-[26px] font-semibold text-[#0B0F19] leading-tight">
              {product.name}
            </h3>
          </div>

          {/* Pricing Badge */}
          {product.show_price && product.price ? (
            <div className="inline-block py-1.5 px-3 rounded-[6px] bg-[#F5F5F7] text-[#0B0F19] font-semibold text-[17px] mb-4">
              {product.harga_maks && Number(product.harga_maks) > Number(product.price)
                ? `Rp ${Number(product.price).toLocaleString('id-ID')} - ${Number(product.harga_maks).toLocaleString('id-ID')}`
                : `${product.is_starting_price ? 'Mulai ' : ''}Rp ${Number(product.price).toLocaleString('id-ID')}`}
              <span className="text-xs font-normal text-[#6B7280] ml-1">/ project</span>
            </div>
          ) : (
            <div className="inline-block py-1.5 px-3 rounded-[6px] bg-[#F5F5F7] text-[#2563EB] font-medium text-[14px] mb-4">
              Harga Menyesuaikan Kebutuhan (Custom Quote)
            </div>
          )}

          {/* Descriptions */}
          <p className="text-[15px] text-[#424245] leading-relaxed mb-4 whitespace-pre-line">
            {product.full_description || product.short_description}
          </p>

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div className="my-6 pt-5 border-t border-black/[0.06]">
              <h4 className="text-[13px] font-semibold text-[#0B0F19] uppercase tracking-wider mb-3">
                Fasilitas & Fitur Termasuk:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[13px] text-[#424245]">
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Perks */}
          <div className="flex flex-wrap items-center gap-4 py-3 text-[12px] text-[#6B7280] border-y border-black/[0.06] mb-6">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> Estimasi pengerjaan: 3–7 hari
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2563EB]" /> Garansi & Panduan Penggunaan
            </span>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={ctaLink}
              target={isExternalCta ? '_blank' : undefined}
              rel={isExternalCta ? 'noopener noreferrer' : undefined}
              className="w-full inline-flex items-center justify-center py-2.5 px-5 text-[14px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.98] rounded-full transition-all"
            >
              <span>{ctaButtonText}</span>
            </a>
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 text-[14px] font-medium text-[#6B7280] hover:text-[#0B0F19] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen HD Lightbox Modal */}
      {isFullscreen && currentImage && (
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

          {imageList.length > 1 && (
            <div className="absolute top-5 left-5 z-20 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[12px] font-medium">
              {activeImageIndex + 1} / {imageList.length}
            </div>
          )}

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
              alt={`${product.name} - Fullscreen Foto ${activeImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <p className="text-white/70 text-[12px] mt-2">
            Gunakan panah kiri/kanan untuk berganti foto • Ketuk di luar atau tombol silang untuk menutup
          </p>
        </div>
      )}
    </>
  );
}

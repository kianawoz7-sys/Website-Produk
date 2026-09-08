'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Check, ExternalLink, Layers, Maximize2 } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset landscape state when project changes
  useEffect(() => {
    setIsLandscape(null);
    setIsFullscreen(false);
  }, [project]);

  // Close on Escape key press and freeze background scroll
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, isFullscreen]);

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
            {/* Left / Top Media: Auto-Adaptive Device Canvas */}
            <div className={isLandscape ? 'md:col-span-12' : 'md:col-span-5 flex justify-center'}>
              <div
                onClick={() => project.image_url && setIsFullscreen(true)}
                className={`relative group cursor-zoom-in overflow-hidden border border-black/[0.08] shadow-sm transition-all ${
                  isLandscape
                    ? 'w-full aspect-[16/10] sm:aspect-[16/9] max-h-[340px] rounded-[16px] bg-[#0E0E10]'
                    : 'w-[180px] h-[220px] sm:w-[210px] sm:h-[250px] md:w-full md:h-auto md:aspect-[9/15] rounded-[20px] bg-[#0E0E10]'
                } flex items-center justify-center`}
                title="Klik untuk melihat layar penuh"
              >
                {project.image_url ? (
                  <>
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 700px"
                      priority
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (img.naturalWidth && img.naturalHeight) {
                          setIsLandscape(img.naturalWidth > img.naturalHeight);
                        }
                      }}
                    />
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

      {/* Fullscreen HD Lightbox Modal */}
      {isFullscreen && project.image_url && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex flex-col items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-lg"
            aria-label="Tutup Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full h-full max-w-[1200px] max-h-[90vh] flex items-center justify-center">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <p className="text-white/70 text-[12px] mt-2">Ketuk di mana saja untuk menutup</p>
        </div>
      )}
    </>
  );
}

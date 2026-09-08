'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { ExternalLink, ChevronLeft, ChevronRight, Layers, Maximize2 } from 'lucide-react';
import { PortfolioProject } from '@/lib/types';
import { formatWhatsAppUrl } from '@/lib/whatsapp';
import PortfolioModal from '@/components/PortfolioModal';

interface PortfolioShowcaseProps {
  portfolios: PortfolioProject[];
  whatsappNumber?: string;
}

export default function PortfolioShowcase({
  portfolios,
  whatsappNumber = '6281234567890',
}: PortfolioShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const list = ['Semua'];
    portfolios.forEach((p) => {
      if (p.category && !list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [portfolios]);

  // Filtered list
  const filteredPortfolios = useMemo(() => {
    if (activeCategory === 'Semua') return portfolios;
    return portfolios.filter((p) => p.category === activeCategory);
  }, [portfolios, activeCategory]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="portofolio" className="py-16 md:py-24 bg-surface/50 border-b border-black/[0.04] overflow-hidden">
      <div className="apple-container">
        {/* Header di tengah (Floating Text Center ala Apple) */}
        <div className="text-center max-w-[680px] mx-auto mb-10">
          <span className="text-[13px] font-semibold tracking-wide text-accent block mb-3">
            Produk Buatan KyDev
          </span>
          <h2 className="font-display text-[34px] sm:text-[46px] md:text-[54px] font-semibold text-primary tracking-tight leading-[1.08] mb-4">
            Karya Nyata. <br />
            Apa saja yang sudah kami buat.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-muted max-w-[540px] mx-auto leading-relaxed">
            Mulai dari aplikasi kasir, sistem bisnis, hingga landing page. Didesain presisi dan dioptimalkan.
          </p>
        </div>

        {/* Filter Category Pills di Tengah */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-muted hover:text-primary hover:bg-neutral-100 border border-black/[0.06]'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Slider: Smooth, fluid, no aggressive snap */}
      <div className="w-full">
        <div
          ref={sliderRef}
          className="flex gap-8 sm:gap-10 md:gap-12 overflow-x-auto px-4 sm:px-8 md:px-[max(1rem,calc((100vw-980px)/2))] pb-6 pt-2 no-scrollbar scroll-smooth"
        >
          {filteredPortfolios.map((item) => {
            const waUrl = formatWhatsAppUrl(
              whatsappNumber,
              `Halo KyDev, saya tertarik dengan produk jadi / portofolio "${item.title}". Boleh minta info detail dan pemesanannya?`
            );

            return (
              <div
                key={item.id}
                className="shrink-0 w-[270px] sm:w-[290px] md:w-[310px] flex flex-col justify-between"
              >
                {/* Bagian Atas: Media & Teks Alami Sesuai Screenshot Apple */}
                <div>
                  {/* Card Media: Aspek Rasio Portrait 9:16 - Interaktif Klik Membesar */}
                  {/* Card Media: Neutral Stage Canvas (Mendukung HP 9:16 & Tablet/Web 16:9 tanpa kepotong) */}
                  <div
                    onClick={() => setSelectedProject(item)}
                    className="relative w-full aspect-[4/5] rounded-[22px] bg-[#F8F9FA] overflow-hidden border border-black/[0.06] shadow-xs group transition-all cursor-pointer select-none flex items-center justify-center p-3.5"
                    role="button"
                    tabIndex={0}
                    aria-label={`Lihat detail lengkap ${item.title}`}
                  >
                    {item.image_url ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-contain drop-shadow-sm group-hover:scale-[1.03] transition-transform duration-500"
                          sizes="(max-width: 640px) 280px, 320px"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl text-primary">
                        <Layers className="w-10 h-10 mb-2 text-[#2563EB]" />
                        <span className="text-[14px] font-semibold">{item.title}</span>
                        <span className="text-[11px] text-muted mt-1">Web & Aplikasi</span>
                      </div>
                    )}

                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1.5 rounded-full bg-[#0B0F19]/80 backdrop-blur-md text-white text-[12px] font-medium flex items-center gap-1.5 shadow-md">
                        <Maximize2 className="w-3.5 h-3.5" />
                        Lihat Detail
                      </span>
                    </div>
                  </div>

                  {/* Category & Title ala Apple (Posisi tetap pas di bawah foto) */}
                  <div className="mt-4">
                    <span className="text-[12px] font-medium text-muted block mb-1">
                      {item.category}
                    </span>
                    <h3
                      onClick={() => setSelectedProject(item)}
                      className="font-display text-[22px] font-semibold text-primary leading-tight tracking-tight hover:text-accent cursor-pointer transition-colors line-clamp-2"
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Deskripsi tetap di posisinya (menjauh/menurun secara natural jika teks banyak) */}
                  <p className="text-[14px] text-muted mt-2 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Fitur opsional ringkas */}
                  {item.features && item.features.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {item.features.slice(0, 2).map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-[12px] text-body/80"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-muted/60 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bagian Bawah: Baris Tombol Selalu Sejajar Rata (Pinned to Bottom Baseline ala Apple) */}
                <div className="mt-6 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Tombol Utama: Selengkapnya */}
                    <button
                      onClick={() => setSelectedProject(item)}
                      className="inline-flex items-center justify-center px-4 py-1.5 text-[13px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.97] rounded-full transition-all shadow-xs"
                    >
                      <span>Selengkapnya</span>
                    </button>

                    {/* Tombol Sekunder Teks: Pesan */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-[#0B0F19] hover:text-[#2563EB] transition-colors"
                    >
                      <span>Pesan</span>
                      <ChevronRight className="w-3.5 h-3.5 mt-0.5 stroke-[2.5]" />
                    </a>
                  </div>

                  {/* Link Web jika ada link online: Rapi di baris bawah tombol */}
                  <div className="mt-2.5 min-h-[20px]">
                    {item.has_live_url && item.live_url ? (
                      <a
                        href={item.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted hover:text-primary transition-colors group"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-accent" />
                        <span className="hover:underline">Buka Website</span>
                      </a>
                    ) : (
                      <span className="text-[12px] text-transparent select-none">.</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Apple Style Floating Circular Navigation Buttons (Persis Screenshot Referensi) */}
        <div className="apple-container flex items-center justify-end pt-4 pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollSlider('left')}
              aria-label="Sebelumnya"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8E8ED] hover:bg-[#DCDCE2] active:scale-90 text-[#424245] hover:text-[#1D1D1F] flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer select-none"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              aria-label="Selanjutnya"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8E8ED] hover:bg-[#DCDCE2] active:scale-90 text-[#424245] hover:text-[#1D1D1F] flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer select-none"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Apple Quick View Modal untuk Portofolio Produk */}
      {selectedProject && (
        <PortfolioModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          whatsappNumber={whatsappNumber}
        />
      )}
    </section>
  );
}


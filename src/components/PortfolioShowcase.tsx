'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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

  // When activeCategory === 'Semua', show all categories.
  // When activeCategory !== 'Semua', show only ['Semua', activeCategory].
  const displayedCategories = useMemo(() => {
    if (activeCategory === 'Semua') {
      return categories;
    }
    return ['Semua', activeCategory];
  }, [categories, activeCategory]);

  // Reset slider position whenever category changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -304 : 304;
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

        {/* Filter Category Pills */}
        <div className="w-full mb-10">
          <div
            className={`flex items-center gap-2 pb-3 sm:pb-0 px-4 sm:px-0 no-scrollbar transition-all duration-300 ${
              activeCategory === 'Semua'
                ? 'overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-center'
                : 'justify-center'
            }`}
          >
            {displayedCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? 'Semua' : cat)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20 scale-[1.02]'
                      : 'bg-white text-muted hover:text-primary hover:bg-neutral-100 border border-black/[0.06]'
                  }`}
                  title={isActive && cat !== 'Semua' ? 'Klik untuk kembali ke Semua' : undefined}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Horizontal Slider: Centered Card on Mobile, Smooth Carousel on Desktop */}
      <div className="w-full">
        {filteredPortfolios.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-[15px] text-muted mb-4">
              Belum ada portofolio untuk kategori ini.
            </p>
            <button
              onClick={() => setActiveCategory('Semua')}
              className="px-5 py-2 rounded-full bg-primary text-white text-[13px] font-medium hover:bg-black transition-colors"
            >
              Lihat Semua Portofolio
            </button>
          </div>
        ) : (
          <>
            <div
              ref={sliderRef}
              className="flex gap-6 sm:gap-8 md:gap-10 overflow-x-auto px-[calc((100vw-280px)/2)] sm:px-8 md:px-[max(1.5rem,calc((100vw-980px)/2))] snap-x snap-mandatory md:snap-none pb-6 pt-2 no-scrollbar scroll-smooth"
            >
              {filteredPortfolios.map((item) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedProject}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>

            {/* Apple Style Floating Circular Navigation Buttons (Persis Screenshot Referensi) */}
            {filteredPortfolios.length > 1 && (
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
            )}
          </>
        )}
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

function PortfolioCard({
  item,
  onSelect,
  whatsappNumber,
}: {
  item: PortfolioProject;
  onSelect: (item: PortfolioProject) => void;
  whatsappNumber: string;
}) {
  const waUrl = formatWhatsAppUrl(
    whatsappNumber,
    `Halo KyDev, saya tertarik dengan produk jadi / portofolio "${item.title}". Boleh minta info detail dan pemesanannya?`
  );

  return (
    <div className="shrink-0 w-[280px] sm:w-[290px] md:w-[310px] snap-center md:snap-align-none flex flex-col justify-between">
      {/* Bagian Atas: Media & Teks Alami */}
      <div>
        {/* Card Media Canvas */}
        <div
          onClick={() => onSelect(item)}
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

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-[#0B0F19]/80 backdrop-blur-md text-white text-[12px] font-medium flex items-center gap-1.5 shadow-md">
              <Maximize2 className="w-3.5 h-3.5" />
              Lihat Detail
            </span>
          </div>
        </div>

        {/* Category & Title */}
        <div className="mt-4">
          <span className="text-[12px] font-medium text-muted block mb-1">
            {item.category}
          </span>
          <h3
            onClick={() => onSelect(item)}
            className="font-display text-[22px] font-semibold text-primary leading-tight tracking-tight hover:text-accent cursor-pointer transition-colors line-clamp-2"
          >
            {item.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-[14px] text-muted mt-2 leading-relaxed line-clamp-3">
          {item.description}
        </p>

        {/* Features */}
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

      {/* Bagian Bawah: Buttons */}
      <div className="mt-6 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelect(item)}
            className="inline-flex items-center justify-center px-4 py-1.5 text-[13px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.97] rounded-full transition-all shadow-xs"
          >
            Lihat Detail
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-1.5 text-[13px] font-semibold text-[#0B0F19] bg-white hover:bg-[#F3F4F6] active:scale-[0.97] rounded-full transition-all border border-[#D1D5DB]"
          >
            Pesan
          </a>

          {item.has_live_url && item.live_url && (
            <a
              href={item.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#6B7280] hover:text-[#0B0F19] transition-colors ml-auto"
              title="Kunjungi Website Langsung"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


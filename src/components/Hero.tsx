import React from 'react';
import Link from 'next/link';
import { formatWhatsAppUrl, getGeneralConsultationMessage } from '@/lib/whatsapp';

interface HeroProps {
  tagline?: string;
  whatsappNumber?: string;
}

export default function Hero({
  tagline = 'Solusi pembuatan website berkelas dunia untuk pertumbuhan bisnis Anda.',
  whatsappNumber = '6281234567890',
}: HeroProps) {
  const waUrl = formatWhatsAppUrl(whatsappNumber, getGeneralConsultationMessage());

  return (
    <section
      id="beranda"
      className="relative min-h-[100dvh] flex flex-col justify-center pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden border-b border-black/[0.04] bg-white"
    >
      {/* Texture garis kotak-kotak tipis pudar di background (Sesuai Referensi) */}
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none" />

      <div className="apple-container relative text-center max-w-[680px] mx-auto z-10 px-5">
        {/* Eyebrow teks polos dengan jarak lapang dari navbar */}
        <p className="text-[13px] sm:text-[15px] font-semibold text-[#2563EB] mb-6 tracking-normal">
          Jasa Pembuatan Website
        </p>

        {/* Headline besar, megah & tegas */}
        <h1 className="font-display text-[38px] sm:text-[54px] md:text-[66px] font-extrabold text-[#0B0F19] leading-[1.08] tracking-tight mb-6">
          Website yang Menjual.<br />
          Bukan Sekadar Tampil.
        </h1>

        {/* Subtitle dengan ruang bernapas yang lega */}
        <p className="text-[15px] sm:text-[17px] text-[#6B7280] max-w-[420px] mx-auto leading-relaxed mb-10 font-normal">
          Desain premium, loading super cepat, dan dirancang khusus untuk mengubah pengunjung jadi pelanggan.
        </p>

        {/* Tombol minimalis proporsional */}
        <div className="flex items-center justify-center gap-3.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-[14px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.97] rounded-full transition-all shadow-sm"
          >
            Konsultasi Website
          </a>

          <Link
            href="/#produk"
            className="inline-flex items-center justify-center px-6 py-3 text-[14px] font-semibold text-[#0B0F19] bg-white hover:bg-[#F3F4F6] active:scale-[0.97] rounded-full transition-all border border-[#D1D5DB]"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </section>
  );
}

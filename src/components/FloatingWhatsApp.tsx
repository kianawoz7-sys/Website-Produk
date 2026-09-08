'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { formatWhatsAppUrl, getGeneralConsultationMessage } from '@/lib/whatsapp';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export default function FloatingWhatsApp({
  whatsappNumber = '6281234567890',
}: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastScrollY = useRef(0);
  const waUrl = formatWhatsAppUrl(whatsappNumber, getGeneralConsultationMessage());

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const pastHero = currentY > 320;

      // Hanya aktif setelah melewati hero
      setIsVisible(pastHero);

      // Ngumpet ke kanan saat scroll ke bawah, muncul kembali saat scroll ke atas
      if (currentY > 320 && currentY > lastScrollY.current) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-5 z-40 transition-all duration-300 ${
        !isVisible || isScrolledDown
          ? 'translate-x-24 opacity-0 pointer-events-none'
          : 'translate-x-0 opacity-100 pointer-events-auto'
      }`}
    >
      {/* Tombol Floating WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 p-3 sm:px-4 sm:py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
        aria-label="Hubungi via WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          </span>
        </div>
        <span className="text-[13px] font-semibold tracking-tight pr-1 hidden sm:inline">
          Konsultasi WhatsApp
        </span>
      </a>
    </div>
  );
}


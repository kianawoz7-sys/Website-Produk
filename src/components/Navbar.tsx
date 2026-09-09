'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle } from 'lucide-react';
import { formatWhatsAppUrl, getGeneralConsultationMessage } from '@/lib/whatsapp';

interface NavbarProps {
  whatsappNumber?: string;
}

export default function Navbar({ whatsappNumber = '6281234567890' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const waUrl = formatWhatsAppUrl(whatsappNumber, getGeneralConsultationMessage());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close mobile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      ref={navRef}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-[600px] transition-all duration-300"
    >
      {/* Capsule Nav */}
      <div className={`flex items-center justify-between h-12 px-5 rounded-full backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
          : 'bg-white/70 border border-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
      }`}>
        {/* Brand — tanpa logo K */}
        <Link
          href="/"
          className="font-display text-[16px] font-bold tracking-tight text-[#0B0F19] hover:opacity-70 transition-opacity"
        >
          KyDev
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium text-[#6B7280]">
          <Link href="/#portofolio" className="hover:text-[#0B0F19] transition-colors">
            Portofolio
          </Link>
          <Link href="/#produk" className="hover:text-[#0B0F19] transition-colors">
            Produk
          </Link>
          <Link href="/#keunggulan" className="hover:text-[#0B0F19] transition-colors">
            Keunggulan
          </Link>
          <Link href="/#faq" className="hover:text-[#0B0F19] transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Desktop CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.97] rounded-full transition-all"
        >
          <MessageCircle className="w-3 h-3" />
          <span>WhatsApp</span>
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden p-1.5 text-[#0B0F19] hover:text-[#6B7280] transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[2]" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="mt-2 mx-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-5 py-4 animate-fadeIn">
          <div className="flex flex-col space-y-3 text-[15px] font-medium text-[#0B0F19]">
            <Link href="/#beranda" onClick={() => setIsOpen(false)} className="py-1 hover:text-[#2563EB] transition-colors">
              Beranda
            </Link>
            <Link href="/#portofolio" onClick={() => setIsOpen(false)} className="py-1 hover:text-[#2563EB] transition-colors">
              Portofolio
            </Link>
            <Link href="/#produk" onClick={() => setIsOpen(false)} className="py-1 hover:text-[#2563EB] transition-colors">
              Paket Jasa
            </Link>
            <Link href="/#keunggulan" onClick={() => setIsOpen(false)} className="py-1 hover:text-[#2563EB] transition-colors">
              Keunggulan
            </Link>
            <Link href="/#testimoni" onClick={() => setIsOpen(false)} className="py-1 hover:text-[#2563EB] transition-colors">
              Testimoni
            </Link>
            <Link href="/#faq" onClick={() => setIsOpen(false)} className="py-1 hover:text-[#2563EB] transition-colors">
              FAQ
            </Link>
            <Link href="/#kontak" onClick={() => setIsOpen(false)} className="py-1 hover:text-[#2563EB] transition-colors">
              Kontak
            </Link>
          </div>

          <div className="pt-3 mt-3 border-t border-black/[0.06]">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-[14px] font-semibold text-white bg-[#0B0F19] rounded-full active:scale-[0.97] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}


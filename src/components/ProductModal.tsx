'use client';

import React from 'react';
import Image from 'next/image';
import { X, Check, Clock, Shield } from 'lucide-react';
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
  if (!product) return null;

  const waUrl = formatWhatsAppUrl(
    whatsappNumber,
    getProductConsultationMessage(product.name)
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-white rounded-[16px] border border-black/[0.08] shadow-2xl p-6 sm:p-8 text-left transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface hover:bg-neutral-2 flex items-center justify-center text-primary transition-colors"
          aria-label="Tutup Detail"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Thumbnail Image if available */}
        {product.image_url && (
          <div className="relative w-full h-[200px] sm:h-[240px] rounded-[10px] overflow-hidden bg-surface mb-6">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Header Info */}
        <div className="mb-4">
          <span className="text-[12px] font-semibold text-accent uppercase tracking-wider block mb-1">
            Paket Layanan KyDev
          </span>
          <h3 className="font-display text-[22px] sm:text-[26px] font-semibold text-primary leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Pricing Badge */}
        {product.show_price && product.price ? (
          <div className="inline-block py-1.5 px-3 rounded-[6px] bg-surface text-primary font-semibold text-[17px] mb-4">
            Rp {Number(product.price).toLocaleString('id-ID')}
            <span className="text-xs font-normal text-muted ml-1">/ project</span>
          </div>
        ) : (
          <div className="inline-block py-1.5 px-3 rounded-[6px] bg-surface text-accent font-medium text-[14px] mb-4">
            Harga Menyesuaikan Kebutuhan (Custom Quote)
          </div>
        )}

        {/* Descriptions */}
        <p className="text-[15px] text-body leading-relaxed mb-4">
          {product.full_description || product.short_description}
        </p>

        {/* Features Checklist */}
        {product.features && product.features.length > 0 && (
          <div className="my-6 pt-5 border-t border-black/[0.06]">
            <h4 className="text-[13px] font-semibold text-primary uppercase tracking-wider mb-3">
              Fasilitas & Fitur Termasuk:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[13px] text-muted">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extra Perks */}
        <div className="flex flex-wrap items-center gap-4 py-3 text-[12px] text-muted border-y border-black/[0.06] mb-6">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent" /> Estimasi pengerjaan: 3–7 hari
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-accent" /> Garansi & Panduan Penggunaan
          </span>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center py-2.5 px-5 text-[14px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.98] rounded-full transition-all"
          >
            <span>Pilih Paket Ini</span>
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 text-[14px] font-medium text-muted hover:text-primary transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

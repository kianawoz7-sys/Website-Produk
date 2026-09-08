import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { ServiceItem, SiteSettings } from '@/lib/types';
import { formatWhatsAppUrl, getGeneralConsultationMessage } from '@/lib/whatsapp';

interface FooterProps {
  services: ServiceItem[];
  settings: SiteSettings;
}

export default function Footer({ services, settings }: FooterProps) {
  const waUrl = formatWhatsAppUrl(
    settings.whatsapp_number,
    getGeneralConsultationMessage()
  );

  return (
    <footer id="kontak" className="bg-surface text-body pt-16 pb-12 border-t border-black/[0.06]">
      <div className="apple-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-black/[0.08]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="font-display text-[20px] font-bold tracking-tight text-primary hover:opacity-80 transition-opacity"
            >
              KyDev
            </Link>
            <p className="text-[14px] text-muted leading-relaxed max-w-[340px]">
              Studio pembuatan website profesional dengan fokus utama pada desain premium dan konversi penjualan bisnis Anda.
            </p>
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#0B0F19] text-white text-[13px] font-semibold hover:bg-black active:scale-[0.97] transition-all shadow-xs"
              >
                <span>Mulai Konsultasi Gratis</span>
              </a>
            </div>
          </div>

          {/* Services List */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-primary">
              Layanan Pilihan
            </h4>
            <ul className="space-y-2 text-[14px] text-muted">
              {services.map((srv) => (
                <li key={srv.id}>
                  <Link
                    href="/#produk"
                    className="hover:text-primary transition-colors"
                  >
                    {srv.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-primary">
              Kontak Kami
            </h4>
            <div className="space-y-2.5 text-[14px] text-muted">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-accent shrink-0" />
                <span>+{settings.whatsapp_number}</span>
              </a>
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <span>{settings.contact_email}</span>
                </a>
              )}
              {settings.contact_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{settings.contact_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-muted">
          <div>
            &copy; {new Date().getFullYear()} KyDev Studio. Seluruh hak cipta dilindungi.
          </div>

          <div className="flex items-center gap-5">
            <Link href="/#faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
            <span>&bull;</span>
            <Link href="/#produk" className="hover:text-primary transition-colors">
              Paket & Harga
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

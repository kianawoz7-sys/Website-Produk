'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  MessageSquareQuote,
  HelpCircle,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    portfolios: 0,
    products: 0,
    testimonials: 0,
    faqs: 0,
    waNumber: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const supabase = createClient();
        const [portRes, prodRes, testRes, faqRes, setRes] = await Promise.all([
          supabase.from('portfolios').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('testimonials').select('id', { count: 'exact', head: true }),
          supabase.from('faqs').select('id', { count: 'exact', head: true }),
          supabase.from('site_settings').select('whatsapp_number').eq('id', 1).maybeSingle(),
        ]);

        setCounts({
          portfolios: portRes.count ?? 6,
          products: prodRes.count ?? 4,
          testimonials: testRes.count ?? 3,
          faqs: faqRes.count ?? 5,
          waNumber: setRes.data?.whatsapp_number || 'Belum diatur',
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-[14px] p-6 sm:p-8 border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface text-accent text-[12px] font-medium tracking-tight mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dashboard Owner KyDev</span>
          </div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-semibold text-primary">
            Selamat Datang di Admin KyDev
          </h1>
          <p className="text-[14px] text-muted mt-1 max-w-[600px]">
            Kelola portofolio produk jadi (Kasir, Laundry, Gym, Cafe), paket jasa website, testimoni, FAQ, dan informasi kontak WhatsApp Anda.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-surface hover:bg-neutral-2 text-primary text-[13px] font-medium transition-colors shrink-0"
        >
          <span>Buka Website Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Portofolio Karya */}
        <div className="bg-white rounded-[12px] p-5 border border-black/[0.06]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[13px] font-medium">Produk Jadi</span>
            <Briefcase className="w-4 h-4 text-accent" />
          </div>
          <div className="text-[28px] font-bold text-primary font-display">
            {loading ? '...' : counts.portfolios}
          </div>
          <Link
            href="/admin/portofolio"
            className="text-[12px] text-accent hover:underline inline-flex items-center gap-1 mt-2"
          >
            Kelola karya <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Paket Jasa */}
        <div className="bg-white rounded-[12px] p-5 border border-black/[0.06]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[13px] font-medium">Paket Jasa</span>
            <Package className="w-4 h-4 text-accent" />
          </div>
          <div className="text-[28px] font-bold text-primary font-display">
            {loading ? '...' : counts.products}
          </div>
          <Link
            href="/admin/produk"
            className="text-[12px] text-accent hover:underline inline-flex items-center gap-1 mt-2"
          >
            Kelola paket <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Testimoni */}
        <div className="bg-white rounded-[12px] p-5 border border-black/[0.06]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[13px] font-medium">Testimoni</span>
            <MessageSquareQuote className="w-4 h-4 text-accent" />
          </div>
          <div className="text-[28px] font-bold text-primary font-display">
            {loading ? '...' : counts.testimonials}
          </div>
          <Link
            href="/admin/testimoni"
            className="text-[12px] text-accent hover:underline inline-flex items-center gap-1 mt-2"
          >
            Kelola ulasan <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-[12px] p-5 border border-black/[0.06]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[13px] font-medium">FAQ</span>
            <HelpCircle className="w-4 h-4 text-accent" />
          </div>
          <div className="text-[28px] font-bold text-primary font-display">
            {loading ? '...' : counts.faqs}
          </div>
          <Link
            href="/admin/faq"
            className="text-[12px] text-accent hover:underline inline-flex items-center gap-1 mt-2"
          >
            Kelola FAQ <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-[12px] p-5 border border-black/[0.06]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[13px] font-medium">WhatsApp Aktif</span>
            <MessageCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-[16px] font-bold text-primary font-display truncate pt-2">
            {loading ? '...' : counts.waNumber}
          </div>
          <Link
            href="/admin/settings"
            className="text-[12px] text-accent hover:underline inline-flex items-center gap-1 mt-2"
          >
            Ubah kontak <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[14px] p-6 border border-black/[0.06]">
          <h2 className="font-display text-[18px] font-semibold text-primary mb-3">
            Aksi Cepat
          </h2>
          <div className="space-y-2.5 text-[14px]">
            <Link
              href="/admin/portofolio"
              className="flex items-center justify-between p-3 rounded-xs bg-surface hover:bg-neutral-2/50 transition-colors"
            >
              <span className="text-body font-medium">Pamerkan Produk Jadi Baru (Mockup HP)</span>
              <ArrowRight className="w-4 h-4 text-muted" />
            </Link>
            <Link
              href="/admin/produk"
              className="flex items-center justify-between p-3 rounded-xs bg-surface hover:bg-neutral-2/50 transition-colors"
            >
              <span className="text-body font-medium">Tambah Paket Layanan Website</span>
              <ArrowRight className="w-4 h-4 text-muted" />
            </Link>
            <Link
              href="/admin/testimoni"
              className="flex items-center justify-between p-3 rounded-xs bg-surface hover:bg-neutral-2/50 transition-colors"
            >
              <span className="text-body font-medium">Tambah Testimoni Pelanggan</span>
              <ArrowRight className="w-4 h-4 text-muted" />
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3 rounded-xs bg-surface hover:bg-neutral-2/50 transition-colors"
            >
              <span className="text-body font-medium">Update Nomor WhatsApp & Info Kontak</span>
              <ArrowRight className="w-4 h-4 text-muted" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-6 border border-black/[0.06]">
          <h2 className="font-display text-[18px] font-semibold text-primary mb-3">
            Tips Optimasi Portofolio Produk Jadi
          </h2>
          <ul className="space-y-2 text-[13px] text-muted leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">&bull;</span>
              <span><strong>Format Screenshot HP (9:16)</strong>: Sangat dianjurkan mengambil tangkapan layar langsung dari HP agar tampilan presisi di frame smartphone Apple.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">&bull;</span>
              <span><strong>Link Website Kondisional</strong>: Jika website portofolio sudah live online di Vercel/domain, centang opsi online agar tombol &quot;Kunjungi Website Demo&quot; otomatis muncul.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">&bull;</span>
              <span><strong>Spotlight Hero</strong>: Centang &quot;Jadikan Spotlight di Hero&quot; pada salah satu produk terbaik Anda agar langsung tampil di baris teratas halaman depan!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

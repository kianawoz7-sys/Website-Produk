'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings } from '@/lib/types';
import { defaultSiteSettings } from '@/lib/mockData';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [tagline, setTagline] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [advantagesText, setAdvantagesText] = useState('');

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        const s: SiteSettings = data || defaultSiteSettings;
        setTagline(s.tagline || defaultSiteSettings.tagline || '');
        setWhatsappNumber(s.whatsapp_number || defaultSiteSettings.whatsapp_number);
        setContactEmail(s.contact_email || defaultSiteSettings.contact_email || '');
        setContactAddress(s.contact_address || defaultSiteSettings.contact_address || '');
        setAdvantagesText(
          ((s.advantages && s.advantages.length > 0 ? s.advantages : defaultSiteSettings.advantages) || []).join('\n')
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const parsedAdvantages = advantagesText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      id: 1,
      tagline,
      whatsapp_number: whatsappNumber.replace(/[^0-9]/g, ''),
      contact_email: contactEmail,
      contact_address: contactAddress,
      advantages: parsedAdvantages,
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = createClient();
      
      // Cek apakah row id = 1 sudah ada
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('id', 1)
        .maybeSingle();

      let saveError = null;

      if (existing) {
        // Update hanya memerlukan policy UPDATE
        const { error } = await supabase
          .from('site_settings')
          .update({
            tagline,
            whatsapp_number: whatsappNumber.replace(/[^0-9]/g, ''),
            contact_email: contactEmail,
            contact_address: contactAddress,
            advantages: parsedAdvantages,
            updated_at: new Date().toISOString(),
          })
          .eq('id', 1);
        saveError = error;
      } else {
        // Jika row belum ada, lakukan insert
        const { error } = await supabase
          .from('site_settings')
          .insert([payload]);
        saveError = error;
      }

      if (saveError) throw saveError;

      setMessage({
        text: 'Pengaturan berhasil disimpan! Nomor WhatsApp dan teks situs langsung aktif di halaman depan.',
        type: 'success',
      });
    } catch (err: unknown) {
      setMessage({
        text: `Gagal menyimpan: ${(err as Error)?.message}`,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-[800px]">
      <div>
        <h1 className="font-display text-[26px] font-semibold text-primary">
          Pengaturan Website & Kontak
        </h1>
        <p className="text-[14px] text-muted mt-1">
          Ubah nomor WhatsApp tujuan konsultasi, teks beranda, dan alamat kontak tanpa perlu deploy ulang kode.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-[10px] text-[13px] flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-[14px] border border-black/[0.06] p-6 sm:p-8">
        {loading ? (
          <div className="text-muted text-[14px] py-8 text-center">
            Memuat pengaturan website...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* WhatsApp Section */}
            <div className="p-4 rounded-[10px] bg-surface border border-black/[0.04] space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-[14px]">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Nomor WhatsApp Utama (Paling Krusial)</span>
              </div>
              <p className="text-[12px] text-muted leading-relaxed">
                Semua tombol &ldquo;Konsultasi via WhatsApp&rdquo; di seluruh website akan mengarah ke nomor ini. Format internasional tanpa tanda plus (+), contoh: <code className="font-mono text-primary font-semibold">6281234567890</code>.
              </p>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="6281234567890"
                className="w-full px-3.5 py-2.5 rounded-xs bg-white border border-black/[0.08] text-[15px] font-mono text-primary focus:border-accent focus:outline-none"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-[13px] font-medium text-primary mb-1">
                Tagline / Sub-headline Hero
              </label>
              <textarea
                rows={2}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Teks pengantar di bawah judul utama beranda..."
                className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
              />
            </div>

            {/* Contact Email & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Email Kontak
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="halo@kydev.id"
                  className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Alamat / Kota Domisili
                </label>
                <input
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  placeholder="Jakarta Selatan, Indonesia"
                  className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Keunggulan List */}
            <div>
              <label className="block text-[13px] font-medium text-primary mb-1">
                Daftar Keunggulan KyDev (Satu baris per poin)
              </label>
              <textarea
                rows={4}
                value={advantagesText}
                onChange={(e) => setAdvantagesText(e.target.value)}
                placeholder={"Desain Mewah & Presisi\nLoading Cepat & Muncul di Google\nLangsung Closing via WhatsApp\nKelola Website Sendiri"}
                className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none font-mono text-xs"
              />
            </div>

            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xs bg-primary hover:bg-black text-white text-[14px] font-medium active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-accent" />
                <span>{saving ? 'Menyimpan Perubahan...' : 'Simpan Pengaturan'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

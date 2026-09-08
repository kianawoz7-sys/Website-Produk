'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Check, X, Upload, Star, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Testimonial } from '@/lib/types';
import { defaultTestimonials } from '@/lib/mockData';

export default function AdminTestimoniPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState<string | number>('1');

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setTestimonials(defaultTestimonials);
      } else {
        setTestimonials(data as Testimonial[]);
      }
    } catch {
      setTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setCustomerName('');
    setCompany('');
    setSource('');
    setContent('');
    setRating(5);
    setImageUrl('');
    setIsVisible(true);
    setSortOrder(String(testimonials.length + 1));
    setIsModalOpen(true);
    setMessage(null);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setCustomerName(t.customer_name);
    setCompany(t.company || '');
    setSource(t.source || '');
    setContent(t.content || '');
    setRating(t.rating || 5);
    setImageUrl(t.image_url || '');
    setIsVisible(t.is_visible);
    setSortOrder(t.sort_order !== undefined ? String(t.sort_order) : '1');
    setIsModalOpen(true);
    setMessage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `testimonial-${Date.now()}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('public-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrlData.publicUrl);
      setMessage({ text: 'Foto/screenshot berhasil diupload!', type: 'success' });
    } catch (err: unknown) {
      setMessage({
        text: `Gagal upload: ${(err as Error)?.message || 'Pastikan bucket public-images sudah dibuat di Supabase'}`,
        type: 'error',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      customer_name: customerName,
      company: company || null,
      source: source || null,
      content,
      rating: Number(rating),
      image_url: imageUrl || null,
      is_visible: isVisible,
      sort_order: sortOrder === '' ? 0 : Number(sortOrder),
    };

    try {
      const supabase = createClient();

      if (editingItem && !editingItem.id.startsWith('test-')) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchTestimonials();
      setMessage({ text: 'Testimoni berhasil disimpan!', type: 'success' });
    } catch (err: unknown) {
      setMessage({
        text: `Gagal menyimpan: ${(err as Error)?.message}`,
        type: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return;

    try {
      const supabase = createClient();
      if (!id.startsWith('test-')) {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
      }
      setTestimonials(testimonials.filter((t) => t.id !== id));
      setMessage({ text: 'Testimoni berhasil dihapus!', type: 'success' });
    } catch (err: unknown) {
      setMessage({ text: `Gagal menghapus: ${(err as Error)?.message}`, type: 'error' });
    }
  };

  const toggleVisibility = async (t: Testimonial) => {
    const updatedVisible = !t.is_visible;
    try {
      const supabase = createClient();
      if (!t.id.startsWith('test-')) {
        await supabase
          .from('testimonials')
          .update({ is_visible: updatedVisible })
          .eq('id', t.id);
      }
      setTestimonials(
        testimonials.map((item) =>
          item.id === t.id ? { ...item, is_visible: updatedVisible } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-semibold text-primary">
            Testimoni Pelanggan
          </h1>
          <p className="text-[14px] text-muted mt-1">
            Kelola ulasan klien, rating bintang, dan bukti kepuasan pelanggan.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xs bg-primary hover:bg-black text-white text-[13px] font-medium active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Tambah Testimoni</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-[8px] text-[13px] flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-[14px] border border-black/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted text-[14px]">
            Memuat testimoni...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center text-muted text-[14px]">
            Belum ada testimoni. Klik tombol di atas untuk menambah testimoni pertama.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-surface text-muted text-[12px] uppercase tracking-wider border-b border-black/[0.06]">
                <tr>
                  <th className="px-6 py-3.5">Klien</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Isi Ulasan</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {t.image_url ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-surface shrink-0">
                            <Image
                              src={t.image_url}
                              alt={t.customer_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface text-primary font-bold flex items-center justify-center text-xs shrink-0 font-sans">
                            {t.customer_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-primary">{t.customer_name}</div>
                          <div className="text-[12px] text-muted">
                            {t.company || t.source || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-0.5">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[320px]">
                      <p className="text-[13px] text-body line-clamp-2 italic">
                        &ldquo;{t.content}&rdquo;
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVisibility(t)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors ${
                          t.is_visible
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {t.is_visible ? (
                          <>
                            <Eye className="w-3 h-3" /> Tampil
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Sembunyi
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 text-muted hover:text-primary rounded-xs hover:bg-surface transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-xs hover:bg-rose-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-[16px] border border-black/[0.08] shadow-2xl p-6 sm:p-8 text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface hover:bg-neutral-2 flex items-center justify-center text-primary"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-[20px] font-semibold text-primary mb-5">
              {editingItem ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Nama Klien
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Hartanto"
                  className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-primary mb-1">
                    Nama Usaha / Perusahaan (Company)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Contoh: PT Sinergi Abadi"
                    className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-primary mb-1">
                    Sumber / Layanan (Source)
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Contoh: Klien Landing Page"
                    className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-primary mb-1">
                    Rating Bintang (1 - 5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-primary mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Isi Testimoni / Review Klien
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ketik ulasan atau hasil positif yang dirasakan klien setelah menggunakan jasa KyDev..."
                  className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              {/* Foto or Screenshot Upload */}
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Foto Klien / Bukti Chat (Bucket Storage: public-images)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xs bg-surface hover:bg-neutral-2 border border-black/[0.08] text-[13px] font-medium text-primary transition-colors">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>{uploadingImage ? 'Mengupload...' : 'Pilih Foto/Screenshot'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {imageUrl && (
                    <span className="text-[12px] text-emerald-600 font-medium inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Gambar terpasang
                    </span>
                  )}
                </div>
                {imageUrl && (
                  <div className="mt-2 text-[11px] font-mono text-muted truncate max-w-full">
                    {imageUrl}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-[13px] text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded text-accent focus:ring-accent w-4 h-4"
                  />
                  <span>Tampilkan di halaman depan</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-medium text-muted hover:text-primary transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xs bg-primary hover:bg-black text-white text-[13px] font-medium active:scale-[0.98] transition-all"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

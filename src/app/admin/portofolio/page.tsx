'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PortfolioProject } from '@/lib/types';
import { defaultPortfolios } from '@/lib/mockData';

export default function AdminPortofolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Aplikasi Kasir');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hasLiveUrl, setHasLiveUrl] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState<string | number>('1');

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setPortfolios(defaultPortfolios);
      } else {
        setPortfolios(data as PortfolioProject[]);
      }
    } catch {
      setPortfolios(defaultPortfolios);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setCategory('Aplikasi Kasir');
    setDescription('');
    setFeaturesText('');
    setImageUrl('');
    setHasLiveUrl(false);
    setLiveUrl('');
    setIsFeatured(false);
    setIsVisible(true);
    setSortOrder(String(portfolios.length + 1));
    setIsModalOpen(true);
    setMessage(null);
  };

  const openEditModal = (item: PortfolioProject) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug || '');
    setCategory(item.category || 'Aplikasi Kasir');
    setDescription(item.description || '');
    setFeaturesText((item.features || []).join('\n'));
    setImageUrl(item.image_url || '');
    setHasLiveUrl(item.has_live_url);
    setLiveUrl(item.live_url || '');
    setIsFeatured(item.is_featured);
    setIsVisible(item.is_visible);
    setSortOrder(item.sort_order !== undefined ? String(item.sort_order) : '1');
    setIsModalOpen(true);
    setMessage(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingItem) {
      setSlug(generateSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `portfolio-${Date.now()}.${fileExt}`;
      const filePath = `portfolios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('public-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrlData.publicUrl);
      setMessage({ text: 'Mockup gambar berhasil diupload ke storage!', type: 'success' });
    } catch (err: unknown) {
      setMessage({
        text: `Gagal upload gambar: ${(err as Error)?.message || 'Pastikan bucket public-images aktif di Supabase'}`,
        type: 'error',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const parsedFeatures = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug.trim() || generateSlug(title),
      category,
      description,
      features: parsedFeatures,
      image_url: imageUrl || null,
      has_live_url: hasLiveUrl,
      live_url: hasLiveUrl ? liveUrl.trim() : null,
      is_featured: isFeatured,
      is_visible: isVisible,
      sort_order: sortOrder === '' ? 0 : Number(sortOrder),
    };

    try {
      const supabase = createClient();

      if (editingItem && !editingItem.id.startsWith('port-')) {
        const { error } = await supabase
          .from('portfolios')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('portfolios').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchPortfolios();
      setMessage({ text: 'Karya portofolio berhasil disimpan!', type: 'success' });
    } catch (err: unknown) {
      setMessage({
        text: `Gagal menyimpan: ${(err as Error)?.message}`,
        type: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus portofolio produk ini?')) return;

    try {
      const supabase = createClient();
      if (!id.startsWith('port-')) {
        const { error } = await supabase.from('portfolios').delete().eq('id', id);
        if (error) throw error;
      }
      setPortfolios(portfolios.filter((p) => p.id !== id));
      setMessage({ text: 'Portofolio berhasil dihapus!', type: 'success' });
    } catch (err: unknown) {
      setMessage({ text: `Gagal menghapus: ${(err as Error)?.message}`, type: 'error' });
    }
  };

  const toggleVisibility = async (p: PortfolioProject) => {
    const updatedVisible = !p.is_visible;
    try {
      const supabase = createClient();
      if (!p.id.startsWith('port-')) {
        await supabase
          .from('portfolios')
          .update({ is_visible: updatedVisible })
          .eq('id', p.id);
      }
      setPortfolios(
        portfolios.map((item) =>
          item.id === p.id ? { ...item, is_visible: updatedVisible } : item
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
            Portofolio & Produk Jadi
          </h1>
          <p className="text-[14px] text-muted mt-1">
            Pamerkan produk dan aplikasi nyata buatan Anda (Kasir POS, Warkop, Laundry, Gym, Cafe).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xs bg-primary hover:bg-black text-white text-[13px] font-medium active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Tambah Portofolio Baru</span>
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

      {/* Table */}
      <div className="bg-white rounded-[14px] border border-black/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted text-[14px]">
            Memuat daftar portofolio...
          </div>
        ) : portfolios.length === 0 ? (
          <div className="p-12 text-center text-muted text-[14px]">
            Belum ada portofolio. Klik tombol di atas untuk menambah produk pertama.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-surface text-muted text-[12px] uppercase tracking-wider border-b border-black/[0.06]">
                <tr>
                  <th className="px-6 py-3.5">Karya / Aplikasi</th>
                  <th className="px-6 py-3.5">Kategori</th>
                  <th className="px-6 py-3.5">Website Live</th>
                  <th className="px-6 py-3.5">Spotlight Hero</th>
                  <th className="px-6 py-3.5">Status Tampil</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {portfolios.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <div className="relative w-12 h-16 rounded-[8px] overflow-hidden bg-surface shrink-0 border border-black/[0.06]">
                            <Image
                              src={p.image_url}
                              alt={p.title}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-16 rounded-[8px] bg-surface flex flex-col items-center justify-center text-muted text-[10px] shrink-0 border border-black/[0.06]">
                            <Smartphone className="w-4 h-4 mb-1" />
                            No Img
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-primary">{p.title}</div>
                          <div className="text-[12px] text-muted line-clamp-1 max-w-[260px]">
                            {p.description}
                          </div>
                          {p.slug && (
                            <div className="text-[11px] font-mono text-accent">
                              /{p.slug}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-surface text-primary text-[12px] font-medium border border-black/[0.04]">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.has_live_url && p.live_url ? (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[12px] text-emerald-600 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Online</span>
                        </a>
                      ) : (
                        <span className="text-muted text-[12px]">Tidak online</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.is_featured ? (
                        <span className="inline-flex items-center gap-1 text-accent text-[12px] font-semibold bg-accent/10 px-2.5 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" /> Hero Card
                        </span>
                      ) : (
                        <span className="text-muted text-[12px]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVisibility(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors ${
                          p.is_visible
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {p.is_visible ? (
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
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-muted hover:text-primary rounded-xs hover:bg-surface transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
          <div className="relative w-full max-w-[620px] max-h-[90vh] overflow-y-auto bg-white rounded-[16px] border border-black/[0.08] shadow-2xl p-6 sm:p-8 text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface hover:bg-neutral-2 flex items-center justify-center text-primary"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-[20px] font-semibold text-primary mb-5">
              {editingItem ? 'Edit Karya Portofolio' : 'Tambah Portofolio Produk Jadi'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Nama Karya / Produk Jadi
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Kasir Cerdas POS, Kasir Warkop, Laundry App, dll"
                  className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-primary mb-1">
                    Kategori Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Aplikasi Kasir, F&B & Warkop, Gym, Laundry..."
                    className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                  />
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
                  Deskripsi Produk
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan fungsi aplikasi, solusi untuk bisnis klien, dan keunggulannya..."
                  className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Fitur Unggulan (Satu baris per fitur)
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Scan Barcode & Cetak Struk&#10;Laporan Omzet Harian Otomatis&#10;Bisa Diakses dari HP"
                  className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none font-mono text-xs"
                />
              </div>

              {/* Upload Foto Mockup dengan Saran Format HP */}
              <div className="p-3.5 rounded-[10px] bg-surface border border-black/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[13px] font-medium text-primary">
                    Upload Foto / Mockup UI (Bucket: public-images)
                  </label>
                  <span className="text-[11px] font-semibold text-accent bg-white px-2 py-0.5 rounded-full border border-black/[0.04]">
                    Disarankan: Rasio HP (9:16)
                  </span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  💡 Tips: Ambil screenshot tampilan HP aplikasi Anda agar pas di frame smartphone Apple.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xs bg-white hover:bg-neutral-100 border border-black/[0.08] text-[13px] font-medium text-primary transition-colors">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>{uploadingImage ? 'Mengupload...' : 'Pilih Screenshot HP'}</span>
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
                  <div className="text-[11px] font-mono text-muted truncate">
                    {imageUrl}
                  </div>
                )}
              </div>

              {/* Section Toggle Live Demo URL */}
              <div className="p-3.5 rounded-[10px] bg-surface border border-black/[0.06] space-y-3">
                <label className="inline-flex items-center gap-2 text-[13px] font-medium text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLiveUrl}
                    onChange={(e) => setHasLiveUrl(e.target.checked)}
                    className="rounded text-accent focus:ring-accent w-4 h-4"
                  />
                  <span>Website / Aplikasi ini sudah online (Ada link demo aktif)</span>
                </label>

                {hasLiveUrl ? (
                  <div className="animate-fadeIn">
                    <label className="block text-[12px] text-muted mb-1">
                      Masukkan Link URL Website (Contoh: <code className="text-primary font-mono">https://kasir.kydev.id</code>)
                    </label>
                    <input
                      type="url"
                      required={hasLiveUrl}
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xs bg-white border border-black/[0.08] text-[13px] font-mono text-primary focus:border-accent focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-muted italic">
                    (Jika tidak dicentang, tombol &quot;Kunjungi Website&quot; otomatis tidak akan muncul di front-end, hanya menampilkan tombol WhatsApp untuk konsultasi/order).
                  </p>
                )}
              </div>

              {/* Additional Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-[13px] text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-accent focus:ring-accent w-4 h-4"
                  />
                  <span>Jadikan Spotlight di dalam Card Hero</span>
                </label>

                <label className="inline-flex items-center gap-2 text-[13px] text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded text-accent focus:ring-accent w-4 h-4"
                  />
                  <span>Tampilkan di publik</span>
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
                  Simpan Portofolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Check, X, Upload, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { defaultProducts } from '@/lib/mockData';

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [price, setPrice] = useState<string>('');
  const [showPrice, setShowPrice] = useState(true);
  const [featuresText, setFeaturesText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState<string | number>('1');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setProducts(defaultProducts);
      } else {
        setProducts(data as Product[]);
      }
    } catch {
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setShortDesc('');
    setFullDesc('');
    setPrice('');
    setShowPrice(true);
    setFeaturesText('');
    setImageUrl('');
    setIsVisible(true);
    setSortOrder(String(products.length + 1));
    setIsModalOpen(true);
    setMessage(null);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug || '');
    setShortDesc(p.short_description || '');
    setFullDesc(p.full_description || '');
    setPrice(p.price ? p.price.toString() : '');
    setShowPrice(p.show_price);
    setFeaturesText((p.features || []).join('\n'));
    setImageUrl(p.image_url || '');
    setIsVisible(p.is_visible);
    setSortOrder(p.sort_order !== undefined ? String(p.sort_order) : '1');
    setIsModalOpen(true);
    setMessage(null);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
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
      const fileName = `product-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('public-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrlData.publicUrl);
      setMessage({ text: 'Gambar berhasil diupload ke storage!', type: 'success' });
    } catch (err: unknown) {
      setMessage({
        text: `Gagal upload gambar: ${(err as Error)?.message || 'Pastikan bucket public-images sudah dibuat di Supabase'}`,
        type: 'error',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const parsedFeatures = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload = {
      name,
      slug: slug.trim() || generateSlug(name),
      short_description: shortDesc,
      full_description: fullDesc,
      price: price ? parseFloat(price) : null,
      show_price: showPrice,
      features: parsedFeatures,
      image_url: imageUrl || null,
      is_visible: isVisible,
      sort_order: sortOrder === '' ? 0 : Number(sortOrder),
    };

    try {
      const supabase = createClient();

      if (editingProduct && !editingProduct.id.startsWith('prod-')) {
        // Update existing record in Supabase
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Insert new record in Supabase
        const { error } = await supabase.from('products').insert([productPayload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchProducts();
      setMessage({ text: 'Paket produk berhasil disimpan!', type: 'success' });
    } catch (err: unknown) {
      setMessage({
        text: `Gagal menyimpan: ${(err as Error)?.message}`,
        type: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const supabase = createClient();
      if (!id.startsWith('prod-')) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      }
      setProducts(products.filter((p) => p.id !== id));
      setMessage({ text: 'Produk berhasil dihapus!', type: 'success' });
    } catch (err: unknown) {
      setMessage({ text: `Gagal menghapus: ${(err as Error)?.message}`, type: 'error' });
    }
  };

  const toggleVisibility = async (p: Product) => {
    const updatedVisible = !p.is_visible;
    try {
      const supabase = createClient();
      if (!p.id.startsWith('prod-')) {
        await supabase
          .from('products')
          .update({ is_visible: updatedVisible })
          .eq('id', p.id);
      }
      setProducts(
        products.map((item) =>
          item.id === p.id ? { ...item, is_visible: updatedVisible } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-semibold text-primary">
            Katalog Produk & Paket
          </h1>
          <p className="text-[14px] text-muted mt-1">
            Atur nama paket, deskripsi fitur, status tampil, dan harga jasa pembuatan website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xs bg-primary hover:bg-black text-white text-[13px] font-medium active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Tambah Paket Baru</span>
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

      {/* Product Table / Cards */}
      <div className="bg-white rounded-[14px] border border-black/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted text-[14px]">
            Memuat data produk...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-muted text-[14px]">
            Belum ada produk. Klik tombol di atas untuk menambah paket pertama.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-surface text-muted text-[12px] uppercase tracking-wider border-b border-black/[0.06]">
                <tr>
                  <th className="px-6 py-3.5">Produk</th>
                  <th className="px-6 py-3.5">Harga</th>
                  <th className="px-6 py-3.5">Urutan</th>
                  <th className="px-6 py-3.5">Status Tampil</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <div className="relative w-12 h-12 rounded-[6px] overflow-hidden bg-surface shrink-0">
                            <Image
                              src={p.image_url}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-[6px] bg-surface flex items-center justify-center text-muted text-xs shrink-0">
                            No Img
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-primary">{p.name}</div>
                          <div className="text-[12px] text-muted line-clamp-1 max-w-[280px]">
                            {p.short_description}
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
                      {p.show_price && p.price ? (
                        <span className="font-medium text-primary">
                          Rp {Number(p.price).toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-muted text-[13px]">Custom Quote</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted text-[13px]">
                      {p.sort_order}
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
              {editingProduct ? 'Edit Paket Layanan' : 'Tambah Paket Baru'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Nama Paket
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Landing Page Konversi Tinggi"
                  className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Slug URL (SEO)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="contoh: landing-page-bisnis"
                  className="w-full px-3.5 py-2.5 rounded-xs bg-surface border border-black/[0.08] text-[14px] font-mono text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-primary mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Contoh: 1500000"
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

              <div className="flex items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-[13px] text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPrice}
                    onChange={(e) => setShowPrice(e.target.checked)}
                    className="rounded text-accent focus:ring-accent w-4 h-4"
                  />
                  <span>Tampilkan nominal harga di website</span>
                </label>

                <label className="inline-flex items-center gap-2 text-[13px] text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded text-accent focus:ring-accent w-4 h-4"
                  />
                  <span>Status: Tampilkan di publik</span>
                </label>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Deskripsi Singkat (Tampil di Grid Katalog)
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk calon klien..."
                  className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Deskripsi Lengkap (Tampil di Modal & Halaman Detail)
                </label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Penjelasan mendalam mengenai value dan alur pengerjaan..."
                  className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Daftar Fitur Termasuk (Satu baris per fitur)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Desain Custom Premium&#10;Copywriting Konversi&#10;Gratis Domain & Hosting 1 Tahun&#10;Integrasi WhatsApp"
                  className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none font-mono text-xs"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Upload Gambar Paket (Bucket Storage: public-images)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xs bg-surface hover:bg-neutral-2 border border-black/[0.08] text-[13px] font-medium text-primary transition-colors">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>{uploadingImage ? 'Mengupload...' : 'Pilih File Gambar'}</span>
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
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FAQ } from '@/lib/types';
import { defaultFaqs } from '@/lib/mockData';

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState<string | number>('1');

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setFaqs(defaultFaqs);
      } else {
        setFaqs(data as FAQ[]);
      }
    } catch {
      setFaqs(defaultFaqs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setQuestion('');
    setAnswer('');
    setIsVisible(true);
    setSortOrder(String(faqs.length + 1));
    setIsModalOpen(true);
    setMessage(null);
  };

  const openEditModal = (f: FAQ) => {
    setEditingItem(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setIsVisible(f.is_visible);
    setSortOrder(f.sort_order !== undefined ? String(f.sort_order) : '1');
    setIsModalOpen(true);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      question,
      answer,
      is_visible: isVisible,
      sort_order: sortOrder === '' ? 0 : Number(sortOrder),
    };

    try {
      const supabase = createClient();

      if (editingItem && !editingItem.id.startsWith('faq-')) {
        const { error } = await supabase
          .from('faqs')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('faqs').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchFaqs();
      setMessage({ text: 'Pertanyaan FAQ berhasil disimpan!', type: 'success' });
    } catch (err: unknown) {
      setMessage({
        text: `Gagal menyimpan: ${(err as Error)?.message}`,
        type: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pertanyaan FAQ ini?')) return;

    try {
      const supabase = createClient();
      if (!id.startsWith('faq-')) {
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (error) throw error;
      }
      setFaqs(faqs.filter((f) => f.id !== id));
      setMessage({ text: 'FAQ berhasil dihapus!', type: 'success' });
    } catch (err: unknown) {
      setMessage({ text: `Gagal menghapus: ${(err as Error)?.message}`, type: 'error' });
    }
  };

  const toggleVisibility = async (f: FAQ) => {
    const updatedVisible = !f.is_visible;
    try {
      const supabase = createClient();
      if (!f.id.startsWith('faq-')) {
        await supabase
          .from('faqs')
          .update({ is_visible: updatedVisible })
          .eq('id', f.id);
      }
      setFaqs(
        faqs.map((item) =>
          item.id === f.id ? { ...item, is_visible: updatedVisible } : item
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
            Tanya Jawab (FAQ)
          </h1>
          <p className="text-[14px] text-muted mt-1">
            Kelola pertanyaan umum seputar biaya, proses kerja, dan garansi untuk calon klien.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xs bg-primary hover:bg-black text-white text-[13px] font-medium active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Tambah Pertanyaan</span>
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
            Memuat daftar FAQ...
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-muted text-[14px]">
            Belum ada FAQ. Klik tombol di atas untuk menambah pertanyaan pertama.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-surface text-muted text-[12px] uppercase tracking-wider border-b border-black/[0.06]">
                <tr>
                  <th className="px-6 py-3.5">Pertanyaan</th>
                  <th className="px-6 py-3.5">Jawaban</th>
                  <th className="px-6 py-3.5">Urutan</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {faqs.map((f) => (
                  <tr key={f.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-primary max-w-[280px]">
                      {f.question}
                    </td>
                    <td className="px-6 py-4 text-muted text-[13px] max-w-[340px]">
                      <p className="line-clamp-2">{f.answer}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted text-[13px]">
                      {f.sort_order}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVisibility(f)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors ${
                          f.is_visible
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {f.is_visible ? (
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
                          onClick={() => openEditModal(f)}
                          className="p-1.5 text-muted hover:text-primary rounded-xs hover:bg-surface transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
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
              {editingItem ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Pertanyaan (Question)
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Contoh: Berapa lama pengerjaan website?"
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

              <div>
                <label className="block text-[13px] font-medium text-primary mb-1">
                  Jawaban Lengkap (Answer)
                </label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Tuliskan jawaban yang jelas dan menenangkan kekhawatiran calon klien..."
                  className="w-full px-3.5 py-2 rounded-xs bg-surface border border-black/[0.08] text-[14px] text-primary focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-[13px] text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded text-accent focus:ring-accent w-4 h-4"
                  />
                  <span>Tampilkan di accordion halaman depan</span>
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
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

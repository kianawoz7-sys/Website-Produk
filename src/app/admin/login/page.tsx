'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
        setLoading(false);
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || 'Terjadi kesalahan pada sistem autentikasi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display text-[22px] font-semibold tracking-tight text-primary mb-2"
        >
          <span className="w-7 h-7 rounded-[8px] bg-primary text-white flex items-center justify-center text-sm font-bold font-sans">
            K
          </span>
          <span>KyDev Studio</span>
        </Link>
        <h2 className="font-display text-[24px] font-semibold text-primary">
          Masuk ke Dashboard Admin
        </h2>
        <p className="mt-2 text-[14px] text-muted">
          Kelola katalog produk, testimoni, FAQ, dan pengaturan website secara mandiri.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-[14px] sm:px-10 border border-black/[0.06]">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-700 text-[13px] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-primary mb-1.5"
              >
                Email Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kydev.id"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-surface border border-black/[0.08] rounded-xs text-[14px] text-primary placeholder-muted/60 focus:bg-white focus:border-accent focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-primary mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-surface border border-black/[0.08] rounded-xs text-[14px] text-primary placeholder-muted/60 focus:bg-white focus:border-accent focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-[14px] font-medium text-white bg-primary hover:bg-black active:scale-[0.99] rounded-xs transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <span>Masuk ke Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-black/[0.06] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Publik</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

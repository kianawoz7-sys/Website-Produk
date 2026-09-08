'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  Briefcase,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || 'Admin');
      }
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  // If on login page, render children directly without admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: 'Ringkasan',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Portofolio Karya',
      href: '/admin/portofolio',
      icon: Briefcase,
    },
    {
      label: 'Paket Jasa Web',
      href: '/admin/produk',
      icon: Package,
    },
    {
      label: 'Testimoni',
      href: '/admin/testimoni',
      icon: MessageSquareQuote,
    },
    {
      label: 'Tanya Jawab (FAQ)',
      href: '/admin/faq',
      icon: HelpCircle,
    },
    {
      label: 'Pengaturan Tampilan',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden glass-nav border-b border-black/[0.08] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-display text-[17px] font-semibold text-primary">
          <span className="w-6 h-6 rounded-[6px] bg-primary text-white flex items-center justify-center text-xs font-bold font-sans">
            K
          </span>
          <span>KyDev Admin</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 rounded-xs text-primary"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`w-full md:w-64 bg-white border-r border-black/[0.06] flex-shrink-0 flex flex-col justify-between ${
          mobileNavOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-black/[0.06] hidden md:flex items-center justify-between">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-display text-[18px] font-semibold text-primary"
            >
              <span className="w-7 h-7 rounded-[7px] bg-primary text-white flex items-center justify-center text-xs font-bold font-sans">
                K
              </span>
              <span>KyDev Studio</span>
            </Link>
            <span className="text-[10px] font-mono uppercase bg-surface text-muted px-2 py-0.5 rounded-full border border-black/[0.04]">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xs text-[14px] font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-primary hover:bg-surface'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-black/[0.06] space-y-2">
          {/* User info */}
          <div className="px-3.5 py-2 flex items-center gap-2.5 text-[13px] text-muted">
            <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-primary">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">{userEmail || 'Admin KyDev'}</span>
          </div>

          {/* View Website */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xs text-[13px] text-muted hover:text-primary hover:bg-surface transition-colors"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xs text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 md:p-10 overflow-y-auto max-w-[1200px]">
        {children}
      </main>
    </div>
  );
}

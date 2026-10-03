'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  GraduationCap,
  TrendingUp,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { href: '/', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/library', label: t.nav.library, icon: BookOpen },
    { href: '/tutor', label: t.nav.tutor, icon: Bot },
    { href: '/exams', label: t.nav.exams, icon: GraduationCap },
    { href: '/progress', label: t.nav.progress, icon: TrendingUp },
    { href: '/geography', label: t.nav.geography, icon: MapPin },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'CONTENT_REVIEWER') {
    navItems.push({ href: '/admin', label: t.nav.admin, icon: ShieldCheck });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Privacy Notice Box for Sri Lankan Students & Minors */}
      <div className="p-4 m-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
        <p className="text-xs text-indigo-900/80 font-medium leading-relaxed">
          {t.auth.consentNotice}
        </p>
      </div>
    </aside>
  );
}

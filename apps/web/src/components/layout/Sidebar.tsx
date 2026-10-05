'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import {
  LayoutDashboard,
  BookMarked,
  Library,
  BrainCircuit,
  GraduationCap,
  Map,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

/**
 * Sidebar — cream background, forest-ink text, yellow highlight wash on active tab.
 * Matches the 7-section IA + optional admin link.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { href: '/dashboard',  label: t.nav.dashboard,  icon: LayoutDashboard },
    { href: '/curriculum', label: t.nav.curriculum,  icon: BookMarked },
    { href: '/library',    label: t.nav.library,     icon: Library },
    { href: '/study-room', label: t.nav.studyRoom,   icon: BrainCircuit },
    { href: '/practice',   label: t.nav.practice,    icon: GraduationCap },
    { href: '/map-lab',    label: t.nav.mapLab,      icon: Map },
    { href: '/progress',   label: t.nav.progress,    icon: TrendingUp },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'CONTENT_REVIEWER') {
    navItems.push({ href: '/admin', label: t.nav.admin, icon: ShieldCheck });
  }

  return (
    <aside className="w-60 bg-cream-paper border-r border-pencil-gray/30 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4.5rem)]">
      <nav className="p-3 space-y-0.5 flex-1" aria-label="Sidebar navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-card text-[14px] font-medium transition-all ${
                isActive
                  ? 'bg-highlighter-yellow/30 text-forest-ink font-semibold'
                  : 'text-forest-ink/60 hover:text-forest-ink hover:bg-whisper-gray'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-[18px] h-[18px] ${
                  isActive ? 'text-forest-ink' : 'text-forest-ink/40'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Privacy notice */}
      <div className="p-3 m-3 bg-highlighter-yellow/15 rounded-card border border-highlighter-yellow/30">
        <p className="text-[11px] text-forest-ink/60 font-medium leading-relaxed font-mono">
          {t.auth.consentNotice}
        </p>
      </div>
    </aside>
  );
}

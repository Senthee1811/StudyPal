'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import { Logo } from '../ui/Logo';
import { Globe, User, LogOut, Search, Sparkles } from 'lucide-react';
import { SupportedLocale } from '@studypal/i18n';

/**
 * Floating pill navbar — "Say Briefly" aesthetic.
 * Sits cleanly above the content with cream paper background, pencil-gray border,
 * 38px logo, centered quick-search shortcut, and trilingual language switcher.
 */
interface NavbarProps {
  variant?: 'app' | 'landing';
}

/**
 * Navbar — Supports 'app' (sketchbook pill) and 'landing' (Duolingo sticker header).
 */
export function Navbar({ variant = 'app' }: NavbarProps) {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();

  const langOptions: { code: SupportedLocale; label: string }[] = [
    { code: 'si', label: 'සිංහල' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'en', label: 'English' },
  ];

  if (variant === 'landing') {
    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-[#e5e5e5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          {/* Left: Mascot Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity"
            title="StudyPal Sri Lanka"
          >
            <Logo />
          </Link>

          {/* Right: Language Pill & Auth Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Duolingo Nav Language Pill */}
            <div className="flex items-center gap-1 border-2 border-[#afafaf] rounded-[12px] p-1 bg-white">
              <Globe className="w-3.5 h-3.5 text-[#777777] ml-2 mr-0.5 hidden sm:block" />
              {langOptions.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLocale(code)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.053em] rounded-[8px] transition-all ${
                    locale === code
                      ? 'bg-[#58cc02] text-white shadow-sm'
                      : 'text-[#777777] hover:text-[#4b4b4b] hover:bg-[#f1f1f1]'
                  }`}
                  aria-label={`Switch to ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Auth / Action Button */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#58cc02] text-white text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.053em] rounded-[12px] border-b-4 border-[#46a302] hover:bg-[#61e002] active:translate-y-0.5 active:border-b-0 transition-all"
                >
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title={t.auth.logoutButton}
                  className="p-2 text-[#777777] hover:text-[#cb5521] rounded-[12px] transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 text-[#1cb0f6] text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.053em] rounded-[12px] border-2 border-[#afafaf] hover:border-[#1cb0f6] hover:bg-[#1cb0f6]/5 transition-all"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>{t.auth.loginButton}</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-cream-paper/90 backdrop-blur-sm">
      <div className="max-w-layout mx-auto px-4 py-2.5">
        <div className="bg-cream-paper border border-pencil-gray/40 rounded-nav px-4 sm:px-5 h-[56px] flex items-center justify-between shadow-sm">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity"
            title="StudyPal Home"
          >
            <Logo />
          </Link>

          {/* Center: Clean Quick Search / Curriculum Badge (No wrapped links!) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/curriculum"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-whisper-gray/70 hover:bg-whisper-gray border border-pencil-gray/30 rounded-btn text-[13px] text-forest-ink/75 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-forest-ink/40" />
              <span>Search Grade 6–13 syllabi, past papers, notes...</span>
              <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-cream-paper border border-pencil-gray/30 rounded text-forest-ink/60">
                ⌘K
              </kbd>
            </Link>
          </div>

          {/* Right: Language switcher + Auth */}
          <div className="flex items-center gap-3">
            {/* Trilingual Switcher */}
            <div className="flex items-center gap-0.5 bg-whisper-gray border border-pencil-gray/30 p-0.5 rounded-tag">
              <Globe className="w-3.5 h-3.5 text-forest-ink/40 ml-1.5 mr-0.5 hidden sm:block" aria-hidden="true" />
              {langOptions.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLocale(code)}
                  className={`px-2.5 py-1 text-[12px] font-medium rounded-tag transition-all ${
                    locale === code
                      ? 'bg-cream-paper text-forest-ink shadow-sm font-semibold'
                      : 'text-forest-ink/60 hover:text-forest-ink'
                  }`}
                  aria-label={`Switch to ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right leading-tight">
                  <span className="text-[13px] font-semibold text-forest-ink">
                    {user.displayName}
                  </span>
                  <span className="text-[10px] font-mono text-forest-ink/50 uppercase">
                    Grade {user.grade || 11}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  title={t.auth.logoutButton}
                  className="p-2 text-forest-ink/50 hover:text-terracotta hover:bg-terracotta/10 rounded-btn transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-ink text-cream-paper text-[13px] font-semibold rounded-btn shadow-sm hover:opacity-90 transition-opacity"
              >
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.auth.loginButton}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

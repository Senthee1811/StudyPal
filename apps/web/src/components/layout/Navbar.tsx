'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import { Globe, BookOpen, User, LogOut } from 'lucide-react';
import { SupportedLocale } from '@studypal/i18n';

export function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              StudyPal <span className="text-indigo-600">LK</span>
            </span>
            <span className="hidden sm:block text-xs text-slate-500 font-medium">
              {t.common.tagline}
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Globe className="w-4 h-4 text-slate-500 ml-1.5" />
            <button
              onClick={() => setLocale('si')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                locale === 'si'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              සිංහල
            </button>
            <button
              onClick={() => setLocale('ta')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                locale === 'ta'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                locale === 'en'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-800">{user.displayName}</span>
                <span className="text-xs text-indigo-600 font-medium capitalize">
                  {user.role.toLowerCase()} {user.grade ? `• Grade ${user.grade}` : ''}
                </span>
              </div>
              <button
                onClick={() => logout()}
                title={t.auth.logoutButton}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{t.auth.loginButton}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import { BookOpen, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [grade, setGrade] = useState(9);
  const [parentConsent, setParentConsent] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!parentConsent) {
          throw new Error('Parental consent is required for student accounts');
        }
        await register({
          email,
          password,
          displayName,
          grade: Number(grade),
          language: locale,
          role: 'STUDENT',
          parentConsentGiven: parentConsent,
        });
      } else {
        await login(email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 sm:px-0">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
          </h1>
          <p className="text-xs text-slate-500">{t.common.tagline}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isRegister ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.auth.loginButton}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isRegister ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.auth.registerButton}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.auth.displayName}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Kasun Perera"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.auth.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.auth.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.auth.grade}
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  <option value={6}>Grade 6 (ශ්‍රේණිය 6 / தரம் 6)</option>
                  <option value={7}>Grade 7 (ශ්‍රේණිය 7 / தரம் 7)</option>
                  <option value={8}>Grade 8 (ශ්‍රේණිය 8 / தரம் 8)</option>
                  <option value={9}>Grade 9 (ශ්‍රේණිය 9 / தரம் 9)</option>
                  <option value={10}>Grade 10 - O/L (සාමාන්‍ය පෙළ)</option>
                  <option value={11}>Grade 11 - O/L (සාමාන්‍ය පෙළ)</option>
                  <option value={12}>Grade 12 - A/L (උසස් පෙළ)</option>
                  <option value={13}>Grade 13 - A/L (උසස් පෙළ)</option>
                </select>
              </div>

              {/* Minor Parental Consent Checkbox */}
              <div className="flex items-start space-x-2.5 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <input
                  type="checkbox"
                  id="consent"
                  checked={parentConsent}
                  onChange={(e) => setParentConsent(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="consent" className="text-xs text-indigo-950/80 leading-snug">
                  I confirm parental / guardian consent for this student learning account.
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.common.loading}</span>
              </>
            ) : (
              <span>{isRegister ? t.auth.registerButton : t.auth.loginButton}</span>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {isRegister ? t.auth.hasAccount : t.auth.noAccount}
          </button>
        </div>
      </div>
    </div>
  );
}

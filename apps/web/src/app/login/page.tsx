'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import {
  DisplayHeading,
  Highlight,
  Badge,
  Card,
  Button,
  Logo,
  MicroLabel,
} from '../../components/ui';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [grade, setGrade] = useState(11);
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
    <div className="max-w-md mx-auto py-8 px-4 sm:px-0">
      <Card className="p-8 border-pencil-gray/40 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-[24px] font-bold text-forest-ink font-sans">
            {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
          </h1>
          <p className="text-[13px] text-forest-ink/65">
            Sri Lanka National Curriculum AI Platform
          </p>
        </div>

        {error && (
          <div className="p-3 bg-terracotta/10 border border-terracotta/30 rounded-btn flex items-start gap-2 text-forest-ink text-[12px]">
            <AlertCircle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-forest-ink mb-1">
                  {t.auth.displayName}
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  className="w-full px-3.5 py-2.5 bg-white border border-pencil-gray/40 rounded-btn text-[14px] text-forest-ink focus:outline-none focus:border-forest-ink"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-forest-ink mb-1">
                  {t.auth.grade}
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-pencil-gray/40 rounded-btn text-[14px] text-forest-ink focus:outline-none focus:border-forest-ink"
                >
                  {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                    <option key={g} value={g}>
                      Grade {g} {g === 11 ? '(O/L)' : g === 13 ? '(A/L)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-forest-ink mb-1">
              {t.auth.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.lk"
              className="w-full px-3.5 py-2.5 bg-white border border-pencil-gray/40 rounded-btn text-[14px] text-forest-ink focus:outline-none focus:border-forest-ink"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-forest-ink mb-1">
              {t.auth.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-white border border-pencil-gray/40 rounded-btn text-[14px] text-forest-ink focus:outline-none focus:border-forest-ink"
            />
          </div>

          {isRegister && (
            <div className="flex items-start gap-2 p-3 bg-highlighter-yellow/20 rounded-btn border border-highlighter-yellow/30">
              <input
                type="checkbox"
                id="consent"
                checked={parentConsent}
                onChange={(e) => setParentConsent(e.target.checked)}
                className="mt-0.5 rounded accent-forest-ink"
              />
              <label htmlFor="consent" className="text-[11px] text-forest-ink/75 leading-tight">
                {t.auth.consentNotice}
              </label>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full justify-center"
          >
            {loading
              ? 'Authenticating...'
              : isRegister
              ? t.auth.registerButton
              : t.auth.loginButton}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-pencil-gray/20">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-[13px] font-semibold text-forest-ink hover:underline"
          >
            {isRegister ? t.auth.hasAccount : t.auth.noAccount}
          </button>
        </div>
      </Card>
    </div>
  );
}

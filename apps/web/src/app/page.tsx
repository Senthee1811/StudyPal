'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/language-context';
import { useAuth } from '../context/auth-context';
import {
  BookOpen,
  Bot,
  GraduationCap,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { user, api } = useAuth();
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [currRes, progRes] = await Promise.allSettled([
          api.curriculum.getCurriculum(),
          api.progress.getMyProgress(),
        ]);

        if (currRes.status === 'fulfilled' && currRes.value.data) {
          setCurriculums(currRes.value.data);
        }
        if (progRes.status === 'fulfilled' && progRes.value.data) {
          setProgressSummary(progRes.value.data);
        }
      } catch (_) {}
      setLoading(false);
    }

    loadData();
  }, [api]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-4 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sri Lanka National Curriculum • NIE Aligned</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t.common.appName}
          </h1>
          <p className="mt-3 text-indigo-100 text-base sm:text-lg leading-relaxed">
            {t.common.tagline}. Upload textbook notes, practice official past papers, explore geography maps, and learn with your AI tutor in Sinhala, Tamil, or English.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/library"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold rounded-xl text-sm shadow-md transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.library.uploadPdf}</span>
            </Link>
            <Link
              href="/tutor"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-semibold rounded-xl text-sm backdrop-blur-md transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>{t.tutor.startSession}</span>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/library"
          className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
              {t.nav.library}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Upload textbook PDFs, generate executive summaries, and take grounded quizzes.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>Explore Library</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/tutor"
          className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">
              {t.nav.tutor}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Trilingual RAG-grounded conversational AI tutor with Vapi voice support.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span>Ask Tutor</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/exams"
          className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-amber-600 transition-colors">
              {t.nav.exams}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Official model test papers with timed countdown, autosave, and instant marking.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>Take Exam</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/geography"
          className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-rose-600 transition-colors">
              {t.nav.geography}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Interactive Leaflet maps of Sri Lanka landmarks, rivers, and provinces.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600">
            <span>Open Map</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Curriculum & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Subjects */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">National Curriculum (Grade 9)</h2>
            <span className="text-xs font-medium text-slate-500">2024 Revised Edition</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
                  MATH-G9
                </span>
                <span className="text-xs text-slate-500">Grade 9</span>
              </div>
              <h4 className="font-bold text-slate-800 text-base">
                {locale === 'si'
                  ? 'ගණිතය (9 ශ්‍රේණිය)'
                  : locale === 'ta'
                    ? 'கணிதம் (தரம் 9)'
                    : 'Mathematics'}
              </h4>
              <p className="text-xs text-slate-500">
                Indices, scientific notation, linear equations, geometry theorems.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                  GEO-G9
                </span>
                <span className="text-xs text-slate-500">Grade 9</span>
              </div>
              <h4 className="font-bold text-slate-800 text-base">
                {locale === 'si'
                  ? 'ශ්‍රී ලංකාවේ භූගෝල විද්‍යාව'
                  : locale === 'ta'
                    ? 'இலங்கையின் புவியியல்'
                    : 'Geography of Sri Lanka'}
              </h4>
              <p className="text-xs text-slate-500">
                Topography, climate zones, Mahaweli river drainage, relief maps.
              </p>
            </div>
          </div>
        </div>

        {/* Live Mastery Widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">{t.progress.topicMastery}</h2>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="mt-4 text-center py-4 space-y-2">
              <div className="text-4xl font-extrabold text-indigo-600">
                {progressSummary?.overallMastery ?? 65}%
              </div>
              <p className="text-xs font-medium text-slate-500">
                Average Mastery Across Syllabus
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-3">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressSummary?.overallMastery ?? 65}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/progress"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs text-center transition-colors block"
          >
            {t.progress.title}
          </Link>
        </div>
      </div>
    </div>
  );
}

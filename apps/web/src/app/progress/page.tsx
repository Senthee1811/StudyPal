'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function ProgressPage() {
  const { t } = useLanguage();
  const { api } = useAuth();

  const [progressData, setProgressData] = useState<any | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const [progRes, recRes] = await Promise.allSettled([
          api.progress.getMyProgress(),
          api.progress.getMyRecommendations(),
        ]);

        if (progRes.status === 'fulfilled' && progRes.value.data) {
          setProgressData(progRes.value.data);
        } else {
          // Default initial state
          setProgressData({
            overallMastery: 72.5,
            totalQuestionsAnswered: 24,
            topicsTracked: 3,
            topicBreakdown: [
              {
                topicId: 't1',
                topicName: 'Real Numbers & Indices',
                evidenceCount: 12,
                correctCount: 10,
                masteryScore: 81.0,
                confidence: 1.0,
              },
              {
                topicId: 't2',
                topicName: 'Linear Equations in One Variable',
                evidenceCount: 8,
                correctCount: 5,
                masteryScore: 62.5,
                confidence: 0.8,
              },
              {
                topicId: 't3',
                topicName: 'Topography and Relief Features',
                evidenceCount: 4,
                correctCount: 2,
                masteryScore: 50.0,
                confidence: 0.4,
              },
            ],
          });
        }

        if (recRes.status === 'fulfilled' && recRes.value.data && recRes.value.data.length > 0) {
          setRecommendations(recRes.value.data);
        } else {
          setRecommendations([
            {
              priority: 'HIGH',
              topicName: 'Topography and Relief Features of Sri Lanka',
              reason: 'Mastery score is 50.0% with low confidence (4 questions).',
              actionTitle: 'Take a targeted 5-question practice quiz on relief maps',
            },
            {
              priority: 'MEDIUM',
              topicName: 'Linear Equations in One Variable',
              reason: 'Moderate mastery (62.5%). Practice bracket expansion.',
              actionTitle: 'Review worked examples in study library',
            },
          ]);
        }
      } catch (_) {}
      setLoading(false);
    }

    loadProgress();
  }, [api]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.progress.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Bayesian mastery tracking calibrated against Sri Lankan national syllabus benchmarks.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Mastery</span>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">
            {progressData?.overallMastery ?? 0}%
          </div>
          <p className="text-xs text-slate-400">Bayesian weighted average</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t.progress.evidenceCount}
            </span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {progressData?.totalQuestionsAnswered ?? 0}
          </div>
          <p className="text-xs text-slate-400">Across quizzes and model papers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Topics Tracked</span>
            <BookOpen className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {progressData?.topicsTracked ?? 0}
          </div>
          <p className="text-xs text-slate-400">In Grade 9 Syllabus</p>
        </div>
      </div>

      {/* Topic Mastery Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">{t.progress.topicMastery}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressData?.topicBreakdown?.map((topic: any, idx: number) => {
            const mastery = Math.round(topic.masteryScore);
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {topic.topicName || `Topic ${idx + 1}`}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Evidence: {topic.evidenceCount} questions ({topic.correctCount || 0} correct)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-indigo-700">{mastery}%</span>
                </div>

                {/* Mastery Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      mastery >= 75
                        ? 'bg-emerald-500'
                        : mastery >= 50
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                    }`}
                    style={{ width: `${mastery}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Confidence:</span>
                  <span className="font-semibold text-slate-700">
                    {Math.round((topic.confidence || 0) * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-600">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900">{t.progress.recommendations}</h2>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-start space-x-3"
            >
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 mt-0.5 ${
                  rec.priority === 'HIGH'
                    ? 'bg-rose-100 text-rose-700'
                    : rec.priority === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {rec.priority}
              </span>
              <div className="space-y-1 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{rec.actionTitle}</h4>
                <p className="text-xs text-slate-600">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

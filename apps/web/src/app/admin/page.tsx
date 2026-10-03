'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import { ShieldCheck, Check, X, AlertCircle } from 'lucide-react';

export default function AdminReviewPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<any[]>([
    {
      id: 'rev-q1',
      prompt: 'What is the sum of interior angles in an octagon?',
      options: ['1080 degrees', '720 degrees', '900 degrees', '1260 degrees'],
      correctAnswer: '1080 degrees',
      explanation: 'Formula: (n - 2) × 180 = (8 - 2) × 180 = 1080 degrees.',
      status: 'IN_REVIEW',
      language: 'en',
      marks: 2,
    },
    {
      id: 'rev-q2',
      prompt: 'Which province in Sri Lanka has the highest population density?',
      options: ['Western Province', 'Central Province', 'Southern Province', 'Northern Province'],
      correctAnswer: 'Western Province',
      explanation: 'Western Province contains the commercial capital Colombo with over 3,400 people per sq km.',
      status: 'IN_REVIEW',
      language: 'en',
      marks: 2,
    },
  ]);

  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleDecision = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: decision } : q)),
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t.nav.admin}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and moderate official curriculum question bank items.
          </p>
        </div>
        <div className="flex items-center space-x-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Moderator Mode</span>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  q.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : q.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                }`}
              >
                {q.status}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{q.marks} Marks</span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-relaxed">{q.prompt}</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {q.options?.map((opt: string, i: number) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border ${
                      opt === q.correctAnswer
                        ? 'border-emerald-300 bg-emerald-50/50 font-semibold text-emerald-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic mt-2.5">
                Explanation: {q.explanation}
              </p>
            </div>

            {q.status === 'IN_REVIEW' && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Optional review notes..."
                  value={notes[q.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [q.id]: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDecision(q.id, 'APPROVED')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleDecision(q.id, 'REJECTED')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

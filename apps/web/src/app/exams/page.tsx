'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';

export default function ExamsPage() {
  const { t, locale } = useLanguage();
  const { user, api } = useAuth();

  const [exams, setExams] = useState<any[]>([]);
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1800); // 30 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await api.exams.list();
        if (res.data && res.data.length > 0) {
          setExams(res.data);
        } else {
          // Fallback mock exams for Grade 9 Maths and Geography
          setExams([
            {
              id: 'exam-sample-maths',
              title:
                locale === 'si'
                  ? '9 ශ්‍රේණිය ගණිතය - පළමු වාර ආදර්ශ ප්‍රශ්න පත්‍රය'
                  : locale === 'ta'
                    ? 'தரம் 9 கணிதம் - முதலாம் தவணை மாதிரி வினாத்தாள்'
                    : 'Grade 9 Mathematics - Term 1 Model Examination',
              description: 'Covers real numbers, scientific notation, and linear equations.',
              durationMinutes: 30,
              totalMarks: 20,
              passPercentage: 40,
              questions: [
                {
                  id: 'q1',
                  type: 'MCQ',
                  prompt: 'What is the value of 2^3 × 2^4 expressed as a single power of 2?',
                  options: ['2^7', '2^12', '4^7', '4^12'],
                  marks: 2,
                  correctAnswer: '2^7',
                  explanation: 'Law of indices: a^m × a^n = a^(m+n). Thus 2^3 × 2^4 = 2^7.',
                },
                {
                  id: 'q2',
                  type: 'MCQ',
                  prompt: 'Solve for x: 3(x + 4) = 24',
                  options: ['x = 4', 'x = 8', 'x = 6', 'x = 2'],
                  marks: 2,
                  correctAnswer: 'x = 4',
                  explanation: '3x + 12 = 24 => 3x = 12 => x = 4.',
                },
                {
                  id: 'q3',
                  type: 'MCQ',
                  prompt: 'Which of the following numbers is written in correct scientific notation?',
                  options: ['4.5 × 10^3', '45 × 10^2', '0.45 × 10^4', '450 × 10^1'],
                  marks: 2,
                  correctAnswer: '4.5 × 10^3',
                  explanation: 'Standard scientific notation has a coefficient 1 <= a < 10.',
                },
              ],
            },
          ]);
        }
      } catch (_) {}
    }

    loadExams();
  }, [api, locale]);

  // Timer countdown
  useEffect(() => {
    if (!activeExam || evaluationResult) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeExam, evaluationResult]);

  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setEvaluationResult(null);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitExam = async () => {
    if (!activeExam) return;
    setIsSubmitting(true);

    const submissionAnswers = activeExam.questions.map((q: any) => ({
      questionId: q.id,
      studentAnswer: answers[q.id] || '',
    }));

    const idempotencyKey = `exam-sub-${activeExam.id}-${Date.now()}`;

    try {
      // Calculate score objectively against snapshot questions
      let score = 0;
      let totalMarks = 0;
      const detailedAnswers = activeExam.questions.map((q: any) => {
        const given = answers[q.id] || '';
        const isCorrect = String(q.correctAnswer).trim().toLowerCase() === given.trim().toLowerCase();
        const marksObtained = isCorrect ? q.marks : 0;
        score += marksObtained;
        totalMarks += q.marks;

        return {
          questionId: q.id,
          prompt: q.prompt,
          studentAnswer: given,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          isCorrect,
          marksObtained,
          maxMarks: q.marks,
        };
      });

      const percentage = Math.round((score / totalMarks) * 100);

      setEvaluationResult({
        score,
        totalMarks,
        percentage,
        isPassed: percentage >= activeExam.passPercentage,
        detailedAnswers,
      });
    } catch (_) {
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {!activeExam ? (
        // Exam Catalog View
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t.exams.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Timed model papers and practice quizzes adhering strictly to the national syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                      Grade 9
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {exam.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{exam.title}</h3>
                  <p className="text-xs text-slate-500">{exam.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Total: {exam.totalMarks} Marks
                  </span>
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <span>{t.exams.startExam}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : evaluationResult ? (
        // Results & Explanation View
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2 pb-6 border-b border-slate-100">
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg ${
                evaluationResult.isPassed ? 'bg-emerald-600 shadow-emerald-100' : 'bg-rose-600 shadow-rose-100'
              }`}
            >
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t.exams.score}</h2>
            <div className="text-4xl font-extrabold text-indigo-600">
              {evaluationResult.score} / {evaluationResult.totalMarks}{' '}
              <span className="text-xl font-bold text-slate-500">
                ({evaluationResult.percentage}%)
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {evaluationResult.isPassed ? 'Passed (A-Grade Benchmark Achieved)' : 'Needs Revision'}
            </p>
          </div>

          {/* Question by Question Review */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900">{t.exams.reviewAnswers}</h3>
            {evaluationResult.detailedAnswers.map((da: any, i: number) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border space-y-2 ${
                  da.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">Question {i + 1}</span>
                  <span className={da.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                    {da.marksObtained} / {da.maxMarks} Marks
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium">{da.prompt}</p>
                <div className="text-xs space-y-1 pt-1">
                  <p className="text-slate-600">
                    Your Answer: <span className="font-semibold">{da.studentAnswer || 'None'}</span>
                  </p>
                  <p className="text-slate-700 font-semibold">
                    Correct Answer: <span className="text-emerald-700">{da.correctAnswer}</span>
                  </p>
                  <p className="text-xs text-slate-500 italic pt-1">{da.explanation}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setActiveExam(null)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to Exams</span>
            </button>
          </div>
        </div>
      ) : (
        // Active Timed Exam Runner
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Header with Countdown Timer & Progress Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activeExam.title}</h2>
              <span className="text-xs text-slate-400">
                Question {currentQuestionIndex + 1} of {activeExam.questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-mono font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          </div>

          {/* Active Question Box */}
          {activeExam.questions[currentQuestionIndex] && (
            <div className="space-y-4 py-2">
              <h3 className="text-base font-semibold text-slate-900 leading-relaxed">
                {activeExam.questions[currentQuestionIndex].prompt}
              </h3>

              <div className="space-y-2.5">
                {activeExam.questions[currentQuestionIndex].options?.map((opt: string, idx: number) => {
                  const currentQId = activeExam.questions[currentQuestionIndex].id;
                  const isSelected = answers[currentQId] === opt;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(currentQId, opt)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Navigation & Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              {t.common.previous}
            </button>

            {currentQuestionIndex < activeExam.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all"
              >
                {t.common.next}
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center space-x-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{t.exams.submitExam}</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

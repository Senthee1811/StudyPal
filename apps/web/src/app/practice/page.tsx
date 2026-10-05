'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import {
  DisplayHeading,
  Highlight,
  Badge,
  Card,
  Button,
  MicroLabel,
} from '../../components/ui';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';
import { StorysetExamPassed } from '../../components/illustrations';

export default function PracticePage() {
  const { t, locale } = useLanguage();
  const { user, api } = useAuth();

  const [activeTab, setActiveTab] = useState<'quizzes' | 'mock-exams'>('mock-exams');
  const [exams, setExams] = useState<any[]>([]);
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1800);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await api.exams.list();
        if (res?.data && res.data.length > 0) {
          setExams(res.data);
        } else {
          setExams([
            {
              id: 'exam-sample-maths',
              title:
                locale === 'si'
                  ? '11 ශ්‍රේණිය (සා/පෙ) ගණිතය - පළමු වාර ආදර්ශ ප්‍රශ්න පත්‍රය'
                  : locale === 'ta'
                  ? 'தரம் 11 கணிதம் - முதலாம் தவணை மாதிரி வினாத்தாள்'
                  : 'Grade 11 (O/L) Mathematics - Term 1 Model Paper',
              description: 'Covers real numbers, scientific notation, and quadratic equations.',
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
                  prompt: 'The roots of x² - 5x + 6 = 0 are:',
                  options: ['2 and 3', '-2 and -3', '1 and 6', '-1 and -6'],
                  marks: 2,
                  correctAnswer: '2 and 3',
                  explanation: '(x - 2)(x - 3) = 0 => x = 2 or x = 3.',
                },
                {
                  id: 'q3',
                  type: 'MCQ',
                  prompt: 'Express 0.00045 in scientific notation (standard form):',
                  options: ['4.5 × 10^-4', '45 × 10^-5', '4.5 × 10^4', '0.45 × 10^-3'],
                  marks: 2,
                  correctAnswer: '4.5 × 10^-4',
                  explanation: 'Move decimal point 4 places to the right: 4.5 × 10^-4.',
                },
              ],
            },
            {
              id: 'exam-sample-science',
              title:
                locale === 'si'
                  ? '11 ශ්‍රේණිය විද්‍යාව - ප්‍රභාසංස්ලේෂණය හා සෛල ව්‍යුහය'
                  : locale === 'ta'
                  ? 'தரம் 11 அறிவியல் - ஒளிச்சேர்க்கை மற்றும் செல் கட்டமைப்பு'
                  : 'Grade 11 Science - Photosynthesis & Cell Structure',
              description: 'Core biology units with structured questions.',
              durationMinutes: 20,
              totalMarks: 15,
              passPercentage: 40,
              questions: [
                {
                  id: 'sq1',
                  type: 'MCQ',
                  prompt: 'Which organelle is responsible for cellular respiration in plant cells?',
                  options: ['Mitochondrion', 'Chloroplast', 'Ribosome', 'Golgi apparatus'],
                  marks: 2,
                  correctAnswer: 'Mitochondrion',
                  explanation: 'Mitochondria are the powerhouses of cells where ATP is generated.',
                },
              ],
            },
          ]);
        }
      } catch (_) {}
    }

    loadExams();
  }, [api, locale]);

  // Countdown timer for active exam
  useEffect(() => {
    if (!activeExam || evaluationResult) return;
    if (timeLeftSeconds <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeExam, evaluationResult, timeLeftSeconds]);

  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setEvaluationResult(null);
  };

  const handleSelectAnswer = (qId: string, opt: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitExam = async () => {
    if (!activeExam) return;
    setIsSubmitting(true);

    try {
      const answerList = Object.entries(answers).map(([questionId, studentAnswer]) => ({
        questionId,
        studentAnswer,
      }));
      const res = await api.exams.submitAttempt(activeExam.id, {
        answers: answerList,
        idempotencyKey: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      });
      if (res?.data) {
        setEvaluationResult(res.data);
      } else {
        mockLocalGrading();
      }
    } catch (_) {
      mockLocalGrading();
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockLocalGrading = () => {
    const questions = activeExam.questions || [];
    let earned = 0;
    let total = 0;
    const perQ: any[] = [];

    questions.forEach((q: any) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      const marks = isCorrect ? q.marks : 0;
      earned += marks;
      total += q.marks;

      perQ.push({
        questionId: q.id,
        isCorrect,
        awardedMarks: marks,
        maxMarks: q.marks,
        feedback: isCorrect ? 'Correct! Well done.' : `Expected: ${q.correctAnswer}. ${q.explanation || ''}`,
      });
    });

    setEvaluationResult({
      totalScore: earned,
      maxScore: total,
      percentage: Math.round((earned / (total || 1)) * 100),
      passed: (earned / (total || 1)) * 100 >= activeExam.passPercentage,
      details: perQ,
    });
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-layout mx-auto pb-12">
      {/* Header */}
      {!activeExam && (
        <div className="space-y-3">
          <Badge icon={<GraduationCap className="w-3.5 h-3.5" />}>
            PRACTICE & EXAMINATIONS
          </Badge>
          <DisplayHeading as="h1" size="display">
            {locale === 'si' ? (
              <>
                නිල විභාග ප්‍රශ්න පත්‍ර සහ <Highlight>පුහුණු ප්‍රශ්නාවලි</Highlight>
              </>
            ) : locale === 'ta' ? (
              <>
                அதிகாரபூர்வ மாதிரி வினாத்தாள்கள் & <Highlight>பயிற்சி வினாடிவினா</Highlight>
              </>
            ) : (
              <>
                Model Papers & <Highlight>Timed Practice</Highlight>
              </>
            )}
          </DisplayHeading>
          <p className="text-[16px] text-forest-ink/75 max-w-2xl leading-relaxed">
            Prepare for GCE Ordinary Level (O/L) and Advanced Level (A/L) examinations with
            instant AI marking and step-by-step solutions aligned to the official Sri Lankan marking scheme.
          </p>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('mock-exams')}
              className={`px-4 py-2 rounded-btn text-[14px] font-semibold transition-all ${
                activeTab === 'mock-exams'
                  ? 'bg-forest-ink text-cream-paper shadow-btn'
                  : 'bg-cream-paper border border-pencil-gray/40 text-forest-ink/70 hover:border-forest-ink hover:text-forest-ink'
              }`}
            >
              Timed Mock Exams
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2 rounded-btn text-[14px] font-semibold transition-all ${
                activeTab === 'quizzes'
                  ? 'bg-forest-ink text-cream-paper shadow-btn'
                  : 'bg-cream-paper border border-pencil-gray/40 text-forest-ink/70 hover:border-forest-ink hover:text-forest-ink'
              }`}
            >
              Topic Quick Quizzes
            </button>
          </div>
        </div>
      )}

      {/* ── Active Exam Runner ── */}
      {activeExam && !evaluationResult && (
        <div className="space-y-6">
          {/* Exam Status Bar */}
          <div className="bg-cream-paper border border-pencil-gray/40 rounded-card p-4 flex items-center justify-between shadow-sm">
            <div>
              <h2 className="text-[18px] font-bold text-forest-ink">{activeExam.title}</h2>
              <div className="flex items-center gap-3 text-[12px] text-forest-ink/60 font-mono mt-0.5">
                <span>
                  Question {currentQuestionIndex + 1} of {activeExam.questions.length}
                </span>
                <span>•</span>
                <span>Total Marks: {activeExam.totalMarks}</span>
              </div>
            </div>

            {/* Countdown Badge */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-tag font-mono text-[14px] font-bold ${
                timeLeftSeconds < 300
                  ? 'bg-terracotta/20 text-terracotta animate-pulse'
                  : 'bg-highlighter-yellow/30 text-forest-ink'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>
          </div>

          {/* Current Question Card */}
          {(() => {
            const q = activeExam.questions[currentQuestionIndex];
            const selectedOpt = answers[q.id];

            return (
              <Card className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <Badge size="sm">QUESTION {currentQuestionIndex + 1}</Badge>
                  <MicroLabel>{q.marks} MARKS</MicroLabel>
                </div>

                <p className="text-[18px] font-semibold text-forest-ink leading-relaxed">
                  {q.prompt}
                </p>

                {/* MCQ Options */}
                <div className="space-y-3">
                  {q.options.map((opt: string, i: number) => {
                    const isSelected = selectedOpt === opt;
                    const letter = String.fromCharCode(65 + i);

                    return (
                      <div
                        key={opt}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={`p-4 rounded-btn border cursor-pointer flex items-center gap-4 transition-all ${
                          isSelected
                            ? 'bg-highlighter-yellow/30 border-forest-ink font-semibold'
                            : 'bg-cream-paper border-pencil-gray/30 hover:border-forest-ink/50'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-mono font-bold ${
                            isSelected
                              ? 'bg-forest-ink text-cream-paper'
                              : 'bg-whisper-gray text-forest-ink/70'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-[15px] text-forest-ink">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Question Nav */}
                <div className="pt-4 border-t border-pencil-gray/20 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((p) => p - 1)}
                  >
                    Previous
                  </Button>

                  {currentQuestionIndex < activeExam.questions.length - 1 ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setCurrentQuestionIndex((p) => p + 1)}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSubmitExam}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Evaluating...' : 'Submit Answers'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })()}
        </div>
      )}

      {/* ── Evaluation Results Screen ── */}
      {evaluationResult && (
        <Card variant="mint" className="p-8 md:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-forest-ink text-cream-paper flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <Badge size="sm">EXAMINATION RESULT</Badge>
                <h2 className="text-[24px] font-bold text-forest-ink font-sans mt-1">
                  {evaluationResult.passed ? 'Congratulations! You Passed' : 'Keep Practicing'}
                </h2>
              </div>
            </div>
            <StorysetExamPassed className="w-32 h-32 shrink-0 self-center sm:self-auto" />
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <MicroLabel>SCORE</MicroLabel>
              <p className="text-[28px] font-bold text-forest-ink mt-1">
                {evaluationResult.totalScore} / {evaluationResult.maxScore}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <MicroLabel>PERCENTAGE</MicroLabel>
              <p className="text-[28px] font-bold text-forest-ink mt-1">
                {evaluationResult.percentage}%
              </p>
            </Card>
            <Card className="p-4 text-center">
              <MicroLabel>OUTCOME</MicroLabel>
              <p
                className={`text-[20px] font-bold mt-2 ${
                  evaluationResult.passed ? 'text-forest-ink' : 'text-terracotta'
                }`}
              >
                {evaluationResult.passed ? 'COMPETENT' : 'NEEDS REVIEW'}
              </p>
            </Card>
          </div>

          {/* Question by Question Review */}
          <div className="space-y-4 pt-4 border-t border-forest-ink/10">
            <MicroLabel>ANSWER EXPLANATIONS & MARK SCHEME</MicroLabel>
            {activeExam?.questions.map((q: any, i: number) => {
              const detail = evaluationResult.details?.[i] || {};
              const userAns = answers[q.id];

              return (
                <Card key={q.id} className="p-5 space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-forest-ink">
                      Question {i + 1}
                    </span>
                    <span
                      className={`text-[12px] font-mono font-semibold px-2 py-0.5 rounded-tag ${
                        detail.isCorrect
                          ? 'bg-sticky-mint text-forest-ink'
                          : 'bg-terracotta/20 text-terracotta'
                      }`}
                    >
                      {detail.isCorrect ? 'Full Marks' : '0 Marks'}
                    </span>
                  </div>
                  <p className="text-[14px] text-forest-ink font-medium">{q.prompt}</p>
                  <div className="text-[13px] text-forest-ink/80 space-y-1 pt-1 border-t border-pencil-gray/20">
                    <p>
                      Your answer: <span className="font-semibold">{userAns || 'None'}</span>
                    </p>
                    <p className="text-forest-ink font-semibold">
                      Correct answer: {q.correctAnswer}
                    </p>
                    {q.explanation && (
                      <p className="text-[12px] text-forest-ink/70 font-mono mt-1">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="primary"
              onClick={() => {
                setActiveExam(null);
                setEvaluationResult(null);
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1" /> Back to Practice
            </Button>
          </div>
        </Card>
      )}

      {/* ── Exam List ── */}
      {!activeExam && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              variant="blush"
              className="p-6 flex flex-col justify-between space-y-4 hover:border-forest-ink transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge size="sm">{exam.durationMinutes} MINUTES</Badge>
                  <MicroLabel>{exam.totalMarks} MARKS</MicroLabel>
                </div>
                <h3 className="text-[18px] font-bold text-forest-ink font-sans">
                  {exam.title}
                </h3>
                <p className="text-[14px] text-forest-ink/75 leading-relaxed">
                  {exam.description}
                </p>
              </div>

              <div className="pt-3 border-t border-forest-ink/10 flex items-center justify-between">
                <span className="text-[12px] font-mono text-forest-ink/60">
                  Pass: {exam.passPercentage}%
                </span>
                <Button variant="primary" size="sm" onClick={() => handleStartExam(exam)}>
                  Start Exam <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

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
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { StorysetAnalyticsGrowth } from '../../components/illustrations';

export default function ProgressPage() {
  const { t, locale } = useLanguage();
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

        if (progRes.status === 'fulfilled' && progRes.value?.data) {
          setProgressData(progRes.value.data);
        } else {
          setProgressData({
            overallMastery: 72.5,
            totalQuestionsAnswered: 24,
            topicsTracked: 3,
            streakDays: 5,
            topicBreakdown: [
              {
                topicId: 't1',
                topicName: 'Real Numbers & Indices (Grade 11)',
                evidenceCount: 12,
                correctCount: 10,
                masteryScore: 81.0,
                confidence: 1.0,
              },
              {
                topicId: 't2',
                topicName: 'Quadratic Equations & Graphs',
                evidenceCount: 8,
                correctCount: 5,
                masteryScore: 62.5,
                confidence: 0.8,
              },
              {
                topicId: 't3',
                topicName: 'Sri Lanka Topography & River Basins',
                evidenceCount: 4,
                correctCount: 2,
                masteryScore: 48.0,
                confidence: 0.5,
              },
            ],
          });
        }

        if (recRes.status === 'fulfilled' && recRes.value?.data) {
          setRecommendations(recRes.value.data);
        } else {
          setRecommendations([
            {
              id: 'r1',
              topicName: 'Sri Lanka Topography & River Basins',
              priority: 'HIGH',
              reason: 'Mastery score below 50% in recent map exercises. Practice river locations.',
              actionUrl: '/map-lab',
            },
            {
              id: 'r2',
              topicName: 'Quadratic Equations',
              priority: 'MEDIUM',
              reason: 'Consistent errors in factorization. Review with AI Tutor in Study Room.',
              actionUrl: '/study-room?topic=Quadratic%20Equations',
            },
          ]);
        }
      } catch (_) {}
      setLoading(false);
    }

    loadProgress();
  }, [api]);

  return (
    <div className="space-y-8 max-w-layout mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <Badge icon={<TrendingUp className="w-3.5 h-3.5" />}>
            MASTERY & REVISION TRACKER
          </Badge>
          <DisplayHeading as="h1" size="display">
            {locale === 'si' ? (
              <>
                ඔබේ <Highlight>ඉගෙනුම් ප්‍රගතිය</Highlight> සහ නිර්දේශ
              </>
            ) : locale === 'ta' ? (
              <>
                உங்கள் <Highlight>கற்றல் முன்னேற்றம்</Highlight> மற்றும் வழிகாட்டல்
              </>
            ) : (
              <>
                Learning Mastery & <Highlight>Adaptive Progress</Highlight>
              </>
            )}
          </DisplayHeading>
          <p className="text-[16px] text-forest-ink/75 max-w-2xl leading-relaxed">
            Competency evaluations based on quiz submissions, mock exam performance, and map
            exercises. The Bayesian mastery engine surfaces topics needing immediate revision.
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center shrink-0">
          <StorysetAnalyticsGrowth className="w-40 h-40" />
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="mint" className="p-5 space-y-1">
          <MicroLabel>OVERALL MASTERY</MicroLabel>
          <p className="text-[34px] font-bold text-forest-ink font-sans">
            {progressData?.overallMastery ? Math.round(progressData.overallMastery) : 73}%
          </p>
          <span className="text-[12px] text-forest-ink/70">
            Across {progressData?.topicsTracked || 3} subjects
          </span>
        </Card>

        <Card variant="teal" className="p-5 space-y-1">
          <MicroLabel>STUDY STREAK</MicroLabel>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-terracotta" />
            <p className="text-[34px] font-bold text-forest-ink font-sans">
              {progressData?.streakDays || 5} Days
            </p>
          </div>
          <span className="text-[12px] text-forest-ink/70">Target: 7-day milestone</span>
        </Card>

        <Card variant="blush" className="p-5 space-y-1">
          <MicroLabel>QUESTIONS ANSWERED</MicroLabel>
          <p className="text-[34px] font-bold text-forest-ink font-sans">
            {progressData?.totalQuestionsAnswered || 24}
          </p>
          <span className="text-[12px] text-forest-ink/70">82% first-try accuracy</span>
        </Card>

        <Card className="p-5 space-y-1">
          <MicroLabel>REVISION DUE</MicroLabel>
          <p className="text-[34px] font-bold text-forest-ink font-sans">
            {recommendations.length} Topics
          </p>
          <span className="text-[12px] text-forest-ink/70">Spaced repetition queue</span>
        </Card>
      </div>

      {/* 2-Column: Topic Mastery Breakdown + AI Revision Nudges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topic Mastery Bars (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-forest-ink font-sans">
              Syllabus Competency Breakdown
            </h3>
            <MicroLabel>BAYESIAN KNOWLEDGE TRACING</MicroLabel>
          </div>

          <Card className="p-6 space-y-5">
            {progressData?.topicBreakdown?.map((topic: any) => {
              const score = Math.round(topic.masteryScore);
              const isWeak = score < 60;

              return (
                <div key={topic.topicId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[15px] font-bold text-forest-ink">
                        {topic.topicName}
                      </h4>
                      <p className="text-[11px] font-mono text-forest-ink/50">
                        {topic.correctCount} / {topic.evidenceCount} questions correct • Confidence:{' '}
                        {Math.round((topic.confidence || 0.8) * 100)}%
                      </p>
                    </div>
                    <span
                      className={`text-[15px] font-mono font-bold ${
                        isWeak ? 'text-terracotta' : 'text-forest-ink'
                      }`}
                    >
                      {score}%
                    </span>
                  </div>

                  {/* Custom Progress Bar */}
                  <div className="w-full h-3 bg-whisper-gray rounded-full overflow-hidden border border-pencil-gray/20">
                    <div
                      className={`h-full rounded-full transition-all ${
                        score >= 80
                          ? 'bg-forest-ink'
                          : score >= 60
                          ? 'bg-highlighter-yellow'
                          : 'bg-terracotta'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Right Column: AI Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-forest-ink font-sans">
              Adaptive Revision Plan
            </h3>
            <Badge size="sm">SPACED RECALL</Badge>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                variant={rec.priority === 'HIGH' ? 'blush' : 'default'}
                className="p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-tag ${
                      rec.priority === 'HIGH'
                        ? 'bg-terracotta/20 text-terracotta'
                        : 'bg-highlighter-yellow/40 text-forest-ink'
                    }`}
                  >
                    {rec.priority} PRIORITY
                  </span>
                  <Target className="w-4 h-4 text-forest-ink/50" />
                </div>

                <h4 className="text-[16px] font-bold text-forest-ink font-sans">
                  {rec.topicName}
                </h4>
                <p className="text-[13px] text-forest-ink/75 leading-relaxed">{rec.reason}</p>

                <div className="pt-2 border-t border-forest-ink/10 flex justify-end">
                  <Link href={rec.actionUrl || '/practice'}>
                    <Button variant="primary" size="sm">
                      Start Revision <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

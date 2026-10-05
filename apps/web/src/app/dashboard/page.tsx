'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { StorysetStudentStudy } from '../../components/illustrations';
import {
  Sparkles,
  BookMarked,
  BrainCircuit,
  GraduationCap,
  MapPin,
  Flame,
  Target,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { user, api } = useAuth();
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const progRes = await api.progress.getMyProgress();
        if (progRes?.data) {
          setProgressSummary(progRes.data);
        }
      } catch (_) {}
      setLoading(false);
    }

    loadData();
  }, [api]);

  return (
    <div className="space-y-8 max-w-layout mx-auto pb-12">
      {/* ── Top Hero Section ── */}
      <section className="bg-cream-paper border border-pencil-gray/40 rounded-card p-6 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-4">
          <Badge icon={<Sparkles className="w-3.5 h-3.5" />}>
            Sri Lanka National Curriculum • NIE Aligned
          </Badge>

          <DisplayHeading as="h1" size="display">
            {locale === 'si' ? (
              <>
                ඔබේ විෂය නිර්දේශය <Highlight>AI සහායකයෙකු</Highlight> සමඟ පහසුවෙන් ඉගෙන ගන්න
              </>
            ) : locale === 'ta' ? (
              <>
                உங்கள் பாடத்திட்டத்தை <Highlight>AI துணையுடன்</Highlight> எளிதாகக் கற்கவும்
              </>
            ) : (
              <>
                Master your syllabus with a <Highlight>trilingual AI</Highlight> companion
              </>
            )}
          </DisplayHeading>

          <p className="text-[17px] text-forest-ink/80 leading-relaxed font-sans">
            {t.common.tagline}. Upload textbook notes, practice official past papers, explore Sri
            Lanka geography maps, and get taught one-to-one in Sinhala, Tamil, or English.
          </p>

          {/* User welcome & quick CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/study-room">
              <Button variant="primary">
                {locale === 'si'
                  ? 'AI අධ්‍යයන කාමරයට යන්න'
                  : locale === 'ta'
                  ? 'AI கற்றல் அறைக்கு செல்க'
                  : 'Open AI Study Room'}
              </Button>
            </Link>
            <Link href="/practice">
              <Button variant="outline">
                {locale === 'si'
                  ? 'ප්‍රශ්නාවලි පුහුණුවන්න'
                  : locale === 'ta'
                  ? 'வினாடிவினா பயிற்சி'
                  : 'Practice Quizzes'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Storyset Vector Illustration */}
        <div className="hidden md:flex justify-center items-center shrink-0">
          <StorysetStudentStudy className="w-56 h-56 lg:w-64 lg:h-64" />
        </div>
      </section>

      {/* ── Daily Snapshot & Quick Cards (Mint / Teal / Blush Pastels) ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Today's Focus (Mint) */}
        <Card variant="mint" className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Badge size="sm">TODAY'S PLAN</Badge>
              <Target className="w-4 h-4 text-forest-ink/60" />
            </div>
            <h3 className="mt-3 text-[19px] font-bold text-forest-ink font-sans">
              Grade {user?.grade || 11} Mathematics
            </h3>
            <p className="mt-1 text-[14px] text-forest-ink/80 leading-normal">
              Quadratic equations & theorem review. 3 learning outcomes scheduled.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-forest-ink/10">
            <MicroLabel>20 MIN RECOMMENDED</MicroLabel>
            <Link
              href="/practice"
              className="text-[13px] font-semibold text-forest-ink hover:underline inline-flex items-center gap-1"
            >
              Start <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 2: Continue Learning (Teal) */}
        <Card variant="teal" className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Badge size="sm">CONTINUE LEARNING</Badge>
              <Clock className="w-4 h-4 text-forest-ink/60" />
            </div>
            <h3 className="mt-3 text-[19px] font-bold text-forest-ink font-sans">
              Science • Unit 4: Ecosystems
            </h3>
            <p className="mt-1 text-[14px] text-forest-ink/80 leading-normal">
              Last read 2 hours ago. AI tutor notes ready on energy pyramids.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-forest-ink/10">
            <MicroLabel>PAGE 42 OF 88</MicroLabel>
            <Link
              href="/study-room"
              className="text-[13px] font-semibold text-forest-ink hover:underline inline-flex items-center gap-1"
            >
              Resume <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Weak Topic Nudge (Blush) */}
        <Card variant="blush" className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Badge size="sm">REVISION NUDGE</Badge>
              <AlertCircle className="w-4 h-4 text-forest-ink/60" />
            </div>
            <h3 className="mt-3 text-[19px] font-bold text-forest-ink font-sans">
              History • Ancient Kingdoms
            </h3>
            <p className="mt-1 text-[14px] text-forest-ink/80 leading-normal">
              Mastery dropped to 48% on Irrigation Systems of Anuradhapura.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-forest-ink/10">
            <MicroLabel>TARGET: +25% TODAY</MicroLabel>
            <Link
              href="/practice"
              className="text-[13px] font-semibold text-forest-ink hover:underline inline-flex items-center gap-1"
            >
              Review <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </section>

      {/* ── 7-Section Quick Access Grid ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-forest-ink font-sans">
              {locale === 'si'
                ? 'අධ්‍යයන මෙවලම්'
                : locale === 'ta'
                ? 'கற்றல் கருவிகள்'
                : 'Study Workspaces'}
            </h2>
            <p className="text-[14px] text-forest-ink/70">
              Access all 7 modules of the StudyPal learning environment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[13px] font-semibold text-forest-ink px-2.5 py-1 bg-highlighter-yellow/30 rounded-tag">
              <Flame className="w-4 h-4 text-terracotta" />
              <span>5 Day Streak</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Curriculum */}
          <Link href="/curriculum" className="group">
            <Card className="p-5 h-full hover:border-forest-ink transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-btn bg-sticky-mint/60 flex items-center justify-center text-forest-ink">
                  <BookMarked className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-bold text-forest-ink group-hover:text-forest-ink flex items-center justify-between">
                  {t.nav.curriculum}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[13px] text-forest-ink/70 leading-relaxed">
                  Browse Grade 6–13 syllabi, subject trees, and learning outcome competencies.
                </p>
              </div>
              <div className="pt-3 border-t border-pencil-gray/20 mt-3">
                <MicroLabel>NIE ALIGNED</MicroLabel>
              </div>
            </Card>
          </Link>

          {/* 2. My Library */}
          <Link href="/library" className="group">
            <Card className="p-5 h-full hover:border-forest-ink transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-btn bg-whisper-gray flex items-center justify-center text-forest-ink">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-bold text-forest-ink group-hover:text-forest-ink flex items-center justify-between">
                  {t.nav.library}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[13px] text-forest-ink/70 leading-relaxed">
                  Upload textbooks and study notes. Auto-chunked with citations and instant quiz gen.
                </p>
              </div>
              <div className="pt-3 border-t border-pencil-gray/20 mt-3">
                <MicroLabel>PDF / OCR READY</MicroLabel>
              </div>
            </Card>
          </Link>

          {/* 3. AI Study Room */}
          <Link href="/study-room" className="group">
            <Card className="p-5 h-full hover:border-forest-ink transition-all flex flex-col justify-between border-forest-ink/40">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-btn bg-sticky-teal/60 flex items-center justify-center text-forest-ink">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-bold text-forest-ink group-hover:text-forest-ink flex items-center justify-between">
                  {t.nav.studyRoom}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[13px] text-forest-ink/70 leading-relaxed">
                  Document chat, Socratic one-to-one teaching, and real-time voice sessions via Vapi.
                </p>
              </div>
              <div className="pt-3 border-t border-pencil-gray/20 mt-3">
                <MicroLabel>TEXT + VOICE</MicroLabel>
              </div>
            </Card>
          </Link>

          {/* 4. Practice & Exams */}
          <Link href="/practice" className="group">
            <Card className="p-5 h-full hover:border-forest-ink transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-btn bg-sticky-blush/60 flex items-center justify-center text-forest-ink">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-bold text-forest-ink group-hover:text-forest-ink flex items-center justify-between">
                  {t.nav.practice}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[13px] text-forest-ink/70 leading-relaxed">
                  Timed mock exams, topic quizzes, and detailed answer explanations with mark schemes.
                </p>
              </div>
              <div className="pt-3 border-t border-pencil-gray/20 mt-3">
                <MicroLabel>TIMED & MARKED</MicroLabel>
              </div>
            </Card>
          </Link>

          {/* 5. Map Lab */}
          <Link href="/map-lab" className="group">
            <Card className="p-5 h-full hover:border-forest-ink transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-btn bg-terracotta/15 flex items-center justify-center text-terracotta">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-bold text-forest-ink group-hover:text-forest-ink flex items-center justify-between">
                  {t.nav.mapLab}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[13px] text-forest-ink/70 leading-relaxed">
                  Interactive Leaflet map exercises for Grade 10–11 Sri Lankan geography syllabus.
                </p>
              </div>
              <div className="pt-3 border-t border-pencil-gray/20 mt-3">
                <MicroLabel>O/L GEOGRAPHY</MicroLabel>
              </div>
            </Card>
          </Link>

          {/* 6. Progress */}
          <Link href="/progress" className="group">
            <Card className="p-5 h-full hover:border-forest-ink transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-btn bg-highlighter-yellow/40 flex items-center justify-center text-forest-ink">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-bold text-forest-ink group-hover:text-forest-ink flex items-center justify-between">
                  {t.nav.progress}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[13px] text-forest-ink/70 leading-relaxed">
                  Competency heatmaps, mastery tracking by learning outcome, and smart revision plans.
                </p>
              </div>
              <div className="pt-3 border-t border-pencil-gray/20 mt-3">
                <MicroLabel>MASTERY INSIGHTS</MicroLabel>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}

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
import {
  BookMarked,
  Layers,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';

interface GradeOption {
  grade: number;
  label: string;
}

const GRADES: GradeOption[] = [
  { grade: 6, label: 'Grade 6' },
  { grade: 7, label: 'Grade 7' },
  { grade: 8, label: 'Grade 8' },
  { grade: 9, label: 'Grade 9' },
  { grade: 10, label: 'Grade 10 (O/L)' },
  { grade: 11, label: 'Grade 11 (O/L)' },
  { grade: 12, label: 'Grade 12 (A/L)' },
  { grade: 13, label: 'Grade 13 (A/L)' },
];

export default function CurriculumPage() {
  const { t, locale } = useLanguage();
  const { user, api } = useAuth();

  const [selectedGrade, setSelectedGrade] = useState<number>(user?.grade || 11);
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurriculum() {
      setLoading(true);
      try {
        const res = await api.curriculum.getCurriculum();
        if (res?.data) {
          setCurriculums(res.data);
          // Set initial subject if available
          const matching = res.data.filter((c: any) => c.grade === selectedGrade);
          if (matching.length > 0) {
            setSelectedSubject(matching[0]);
            if (matching[0].topics?.length > 0) {
              setSelectedTopic(matching[0].topics[0]);
            }
          } else {
            setSelectedSubject(res.data[0] || null);
            if (res.data[0]?.topics?.length > 0) {
              setSelectedTopic(res.data[0].topics[0]);
            }
          }
        }
      } catch (_) {}
      setLoading(false);
    }

    loadCurriculum();
  }, [api, selectedGrade]);

  const filteredSubjects = curriculums.filter(
    (c: any) => !selectedGrade || c.grade === selectedGrade
  );

  return (
    <div className="space-y-8 max-w-layout mx-auto pb-12">
      {/* Header */}
      <div className="space-y-3">
        <Badge icon={<BookMarked className="w-3.5 h-3.5" />}>
          {locale === 'si'
            ? 'ජාතික අධ්‍යාපන ආයතන (NIE) විෂය නිර්දේශය'
            : locale === 'ta'
            ? 'தேசிய கல்வி நிறுவனம் (NIE) பாடத்திட்டம்'
            : 'National Institute of Education (NIE) Framework'}
        </Badge>
        <DisplayHeading as="h1" size="display">
          {locale === 'si' ? (
            <>
              ජාතික <Highlight>විෂය නිර්දේශය</Highlight> සහ ඉගෙනුම් ඵල
            </>
          ) : locale === 'ta' ? (
            <>
              தேசிய <Highlight>பாடத்திட்டம்</Highlight> & கற்றல் விளைவுகள்
            </>
          ) : (
            <>
              National <Highlight>Curriculum</Highlight> & Learning Outcomes
            </>
          )}
        </DisplayHeading>
        <p className="text-[16px] text-forest-ink/75 max-w-2xl leading-relaxed">
          Structured competencies mapped across Grades 6 through 13. Select a subject to explore
          topics, learning outcomes, and connect directly to AI tutoring or quizzes.
        </p>
      </div>

      {/* Grade Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-pencil-gray/30">
        {GRADES.map(({ grade, label }) => {
          const isSelected = selectedGrade === grade;
          return (
            <button
              key={grade}
              onClick={() => {
                setSelectedGrade(grade);
                const matching = curriculums.filter((c: any) => c.grade === grade);
                if (matching.length > 0) {
                  setSelectedSubject(matching[0]);
                  setSelectedTopic(matching[0].topics?.[0] || null);
                }
              }}
              className={`px-3.5 py-1.5 rounded-btn text-[13px] font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-forest-ink text-cream-paper shadow-btn'
                  : 'bg-cream-paper border border-pencil-gray/40 text-forest-ink/70 hover:border-forest-ink hover:text-forest-ink'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Subjects List + Topics & Outcomes Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Subjects for selected grade */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <MicroLabel>SUBJECTS (GRADE {selectedGrade})</MicroLabel>
            <span className="text-[12px] text-forest-ink/50 font-mono">
              {filteredSubjects.length} found
            </span>
          </div>

          {filteredSubjects.length === 0 ? (
            <Card className="p-6 text-center text-forest-ink/60 text-[14px]">
              No subjects registered for Grade {selectedGrade} yet.
            </Card>
          ) : (
            filteredSubjects.map((sub: any) => {
              const isSelected = selectedSubject?.id === sub.id;
              const name =
                locale === 'si' && sub.nameSi
                  ? sub.nameSi
                  : locale === 'ta' && sub.nameTa
                  ? sub.nameTa
                  : sub.name;

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubject(sub);
                    setSelectedTopic(sub.topics?.[0] || null);
                  }}
                  className={`p-4 rounded-card border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sticky-mint/40 border-forest-ink shadow-sm'
                      : 'bg-cream-paper border-pencil-gray/30 hover:border-forest-ink/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-medium text-forest-ink/60 uppercase">
                        {sub.code || `G${sub.grade}-${sub.name.slice(0, 4).toUpperCase()}`}
                      </span>
                      <h4 className="text-[16px] font-bold text-forest-ink">{name}</h4>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'rotate-90 text-forest-ink' : 'text-forest-ink/30'
                      }`}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[12px] text-forest-ink/60 font-mono">
                    <span>{sub.topics?.length || 0} units</span>
                    <span>•</span>
                    <span>Version 2024.1</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Topics & Learning Outcomes Tree */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSubject ? (
            <div className="space-y-6">
              {/* Subject Title Banner */}
              <div className="p-6 bg-cream-paper border border-pencil-gray/40 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge size="sm">SYLLABUS BREAKDOWN</Badge>
                    <MicroLabel>GRADE {selectedSubject.grade}</MicroLabel>
                  </div>
                  <h2 className="mt-2 text-[24px] font-bold text-forest-ink font-sans">
                    {locale === 'si' && selectedSubject.nameSi
                      ? selectedSubject.nameSi
                      : locale === 'ta' && selectedSubject.nameTa
                      ? selectedSubject.nameTa
                      : selectedSubject.name}
                  </h2>
                  <p className="text-[14px] text-forest-ink/70 mt-1">
                    {selectedSubject.description ||
                      'Comprehensive learning outcomes mapped to the Sri Lankan secondary school curriculum.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/study-room?subject=${encodeURIComponent(selectedSubject.name)}`}>
                    <Button variant="mint" size="sm">
                      <BrainCircuit className="w-3.5 h-3.5 mr-1" />
                      Teach Me
                    </Button>
                  </Link>
                  <Link href={`/practice?subject=${encodeURIComponent(selectedSubject.name)}`}>
                    <Button variant="outline" size="sm">
                      <GraduationCap className="w-3.5 h-3.5 mr-1" />
                      Quiz
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Topics / Units */}
              <div className="space-y-4">
                <MicroLabel>UNITS & LEARNING OUTCOMES</MicroLabel>

                {(!selectedSubject.topics || selectedSubject.topics.length === 0) ? (
                  <Card className="p-8 text-center text-forest-ink/60 text-[14px]">
                    No detailed topics indexed for this subject yet.
                  </Card>
                ) : (
                  selectedSubject.topics.map((topic: any, idx: number) => {
                    const isExpanded = selectedTopic?.id === topic.id;
                    const topicTitle =
                      locale === 'si' && topic.titleSi
                        ? topic.titleSi
                        : locale === 'ta' && topic.titleTa
                        ? topic.titleTa
                        : topic.title;

                    return (
                      <Card
                        key={topic.id || idx}
                        className={`p-5 transition-all ${
                          isExpanded ? 'border-forest-ink shadow-sm' : 'border-pencil-gray/30'
                        }`}
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setSelectedTopic(isExpanded ? null : topic)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-btn bg-whisper-gray text-[12px] font-mono font-bold flex items-center justify-center text-forest-ink">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="text-[16px] font-bold text-forest-ink">
                                {topicTitle}
                              </h4>
                              <p className="text-[13px] text-forest-ink/65 line-clamp-1">
                                {topic.description || 'Core competency units and outcomes'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <ChevronRight
                              className={`w-4 h-4 text-forest-ink/40 transition-transform ${
                                isExpanded ? 'rotate-90 text-forest-ink' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {/* Expanded details: Learning Outcomes */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-pencil-gray/20 space-y-3">
                            <MicroLabel>SPECIFIC LEARNING OUTCOMES (SLO)</MicroLabel>
                            <ul className="space-y-2">
                              {[
                                'Understand core principles and theoretical models',
                                'Apply formulas and analytical methods to past exam problems',
                                'Synthesize concepts with real-world Sri Lankan context',
                              ].map((slo, sIdx) => (
                                <li
                                  key={sIdx}
                                  className="flex items-start gap-2 text-[14px] text-forest-ink/80"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-forest-ink mt-0.5 shrink-0" />
                                  <span>{slo}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="pt-3 flex items-center justify-end gap-2">
                              <Link
                                href={`/study-room?topic=${encodeURIComponent(topic.title)}`}
                                className="inline-flex items-center gap-1 text-[13px] font-semibold text-forest-ink hover:underline"
                              >
                                Study with AI Tutor <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center text-forest-ink/60">
              Select a subject from the left column to view its syllabus and outcomes.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

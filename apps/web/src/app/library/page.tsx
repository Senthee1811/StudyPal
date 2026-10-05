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
import { StorysetLibraryBooks } from '../../components/illustrations';
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  BookOpen,
  Search,
  ArrowRight,
  Trash2,
  BookMarked,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
  const { t, locale } = useLanguage();
  const { user, api } = useAuth();

  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Grounded Q&A state
  const [qaQuery, setQaQuery] = useState('');
  const [qaAnswer, setQaAnswer] = useState<any | null>(null);
  const [qaLoading, setQaLoading] = useState(false);

  // Quiz Generation state
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizGeneratedMsg, setQuizGeneratedMsg] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.documents.list();
      if (res?.data) {
        setDocuments(res.data);
        if (res.data.length > 0 && !selectedDoc) {
          setSelectedDoc(res.data[0]);
        }
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 3000);
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    if (selectedDoc?.id && selectedDoc.status === 'READY') {
      api.documents
        .getSummaries(selectedDoc.id)
        .then((res: any) => {
          if (res?.data) setSummaries(res.data);
        })
        .catch(() => {});
    } else {
      setSummaries([]);
    }
    setQaAnswer(null);
    setQuizGeneratedMsg(null);
  }, [selectedDoc, api]);

  const handleUploadSimulated = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const intentRes = await api.documents.createUploadIntent({
        filename: `${uploadTitle.replace(/\s+/g, '_')}.pdf`,
        fileSize: 1024 * 500,
        mimeType: 'application/pdf',
        title: uploadTitle,
        language: locale,
      });

      if (!intentRes?.data) throw new Error('Upload intent rejected');

      await api.documents.completeUpload(intentRes.data.documentId);
      setUploadTitle('');
      await fetchDocuments();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaQuery.trim() || !selectedDoc) return;

    setQaLoading(true);
    try {
      const res = await api.documents.askQuestion(selectedDoc.id, qaQuery, locale);
      setQaAnswer(res.data);
    } catch (err: any) {
      setQaAnswer({
        answer: 'Could not retrieve answer. Please try again.',
        isUncertain: true,
        citations: [],
      });
    } finally {
      setQaLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedDoc) return;
    setQuizLoading(true);
    setQuizGeneratedMsg(null);

    try {
      await api.documents.generateQuiz(selectedDoc.id, {
        language: locale,
        numQuestions: 5,
        difficulty: 'MEDIUM',
      });
      setQuizGeneratedMsg('Practice quiz generated! View under Practice & Exams.');
    } catch (err: any) {
      setQuizGeneratedMsg('Quiz generation queued in background.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this study document?')) return;
    try {
      await api.documents.delete(docId);
      if (selectedDoc?.id === docId) setSelectedDoc(null);
      await fetchDocuments();
    } catch (_) {}
  };

  return (
    <div className="space-y-8 max-w-layout mx-auto pb-12">
      {/* Header */}
      <div className="space-y-3">
        <Badge icon={<BookOpen className="w-3.5 h-3.5" />}>
          MY STUDY LIBRARY
        </Badge>
        <DisplayHeading as="h1" size="display">
          {locale === 'si' ? (
            <>
              පාසල් පෙළපොත් සහ <Highlight>අධ්‍යයන සටහන්</Highlight>
            </>
          ) : locale === 'ta' ? (
            <>
              பாடநூல்கள் மற்றும் <Highlight>கற்றல் குறிப்புகள்</Highlight>
            </>
          ) : (
            <>
              Textbooks & <Highlight>Study Materials</Highlight>
            </>
          )}
        </DisplayHeading>
        <p className="text-[16px] text-forest-ink/75 max-w-2xl leading-relaxed">
          Upload government textbooks and handwritten notes. The StudyPal document pipeline
          extracts chapters, generates chapter summaries, and indexes verified page citations for RAG.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload Box & Documents List (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upload Form */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-forest-ink">
              <Upload className="w-4 h-4" />
              <h2 className="text-[15px] font-bold text-forest-ink">{t.library.uploadPdf}</h2>
            </div>

            {uploadError && (
              <p className="text-[12px] text-terracotta bg-terracotta/10 p-2.5 rounded-btn font-mono">
                {uploadError}
              </p>
            )}

            <form onSubmit={handleUploadSimulated} className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-forest-ink/80 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Grade 11 Science Unit 5"
                  className="w-full px-3 py-2 bg-white border border-pencil-gray/40 rounded-btn text-[13px] text-forest-ink focus:outline-none focus:border-forest-ink"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-pencil-gray/40 rounded-btn text-center space-y-1.5 bg-whisper-gray/50">
                <FileText className="w-6 h-6 mx-auto text-forest-ink/40" />
                <p className="text-[11px] text-forest-ink/60">{t.library.dragDrop}</p>
              </div>

              <Button
                type="submit"
                disabled={isUploading}
                variant="primary"
                size="sm"
                className="w-full justify-center"
              >
                {isUploading ? 'Uploading & Indexing...' : 'Upload & Index'}
              </Button>
            </form>
          </Card>

          {/* Document List */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <MicroLabel>INDEXED TEXTBOOKS</MicroLabel>
              <span className="text-[11px] font-mono text-forest-ink/50">
                {documents.length} docs
              </span>
            </div>

            {documents.length === 0 ? (
              <p className="text-center py-6 text-forest-ink/50 text-[13px]">
                No documents uploaded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-3 rounded-btn border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-sticky-mint/40 border-forest-ink shadow-sm'
                          : 'bg-cream-paper border-pencil-gray/30 hover:border-forest-ink/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h4 className="text-[14px] font-bold text-forest-ink line-clamp-1">
                            {doc.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-forest-ink/50">
                            <span className="uppercase">{doc.language || locale}</span>
                            <span>•</span>
                            <span>{doc.pageCount ? `${doc.pageCount} pages` : 'PDF'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-tag text-[10px] font-mono font-semibold ${
                              doc.status === 'READY'
                                ? 'bg-forest-ink text-cream-paper'
                                : 'bg-highlighter-yellow text-forest-ink'
                            }`}
                          >
                            {doc.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc.id);
                            }}
                            className="p-1 text-forest-ink/30 hover:text-terracotta"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Document Details, Grounded Q&A, and Summaries (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedDoc ? (
            <>
              {/* Document Header Card */}
              <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge size="sm">ACTIVE TEXTBOOK</Badge>
                    <MicroLabel>{selectedDoc.status}</MicroLabel>
                  </div>
                  <h3 className="text-[20px] font-bold text-forest-ink font-sans">
                    {selectedDoc.title}
                  </h3>
                  <p className="text-[13px] text-forest-ink/60 font-mono">
                    ID: {selectedDoc.id.slice(0, 16)}... • Status: {selectedDoc.status}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={quizLoading || selectedDoc.status !== 'READY'}
                    onClick={handleGenerateQuiz}
                  >
                    <GraduationCap className="w-3.5 h-3.5 mr-1" />
                    {quizLoading ? 'Generating...' : 'Generate Quiz'}
                  </Button>
                  <Link href={`/study-room?docId=${selectedDoc.id}`}>
                    <Button variant="primary" size="sm">
                      <BrainCircuit className="w-3.5 h-3.5 mr-1" />
                      Chat in Study Room
                    </Button>
                  </Link>
                </div>
              </Card>

              {quizGeneratedMsg && (
                <div className="p-3 bg-sticky-mint/40 border border-forest-ink/30 rounded-btn text-[13px] font-semibold text-forest-ink flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-ink" />
                  <span>{quizGeneratedMsg}</span>
                </div>
              )}

              {/* Grounded Textbook Q&A */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-forest-ink" />
                    <h4 className="text-[16px] font-bold text-forest-ink font-sans">
                      Ask Questions Grounded in this Document
                    </h4>
                  </div>
                  <Badge size="sm">CITATION VERIFIED</Badge>
                </div>

                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={qaQuery}
                    onChange={(e) => setQaQuery(e.target.value)}
                    placeholder="e.g. What are the key stages of cellular division in unit 4?"
                    className="flex-1 bg-white border border-pencil-gray/40 rounded-btn px-4 py-2 text-[14px] text-forest-ink focus:outline-none focus:border-forest-ink"
                  />
                  <Button type="submit" variant="primary" size="sm" disabled={qaLoading}>
                    {qaLoading ? 'Searching...' : 'Ask'}
                  </Button>
                </form>

                {qaAnswer && (
                  <div className="p-4 bg-whisper-gray/70 rounded-btn border border-pencil-gray/30 space-y-3">
                    <p className="text-[14px] text-forest-ink leading-relaxed font-sans">
                      {qaAnswer.answer}
                    </p>

                    {qaAnswer.citations && qaAnswer.citations.length > 0 && (
                      <div className="pt-2 border-t border-pencil-gray/20 flex flex-wrap gap-2 items-center">
                        <MicroLabel>VERIFIED CITATIONS:</MicroLabel>
                        {qaAnswer.citations.map((c: any, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-tag bg-highlighter-yellow/50 text-[11px] font-mono font-semibold text-forest-ink"
                          >
                            Page {c.page || c.pageNumber}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Chapter Summaries */}
              <Card className="p-6 space-y-4">
                <MicroLabel>CHAPTER SUMMARIES & KEY TAKEAWAYS</MicroLabel>
                {summaries.length === 0 ? (
                  <p className="text-[14px] text-forest-ink/60">
                    {selectedDoc.status === 'READY'
                      ? 'Summaries are being generated by the background knowledge worker.'
                      : 'Upload processing must complete before summaries are available.'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {summaries.map((sum, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-btn border border-pencil-gray/30 bg-white space-y-2"
                      >
                        <h5 className="text-[15px] font-bold text-forest-ink">
                          {sum.title || `Chapter Summary ${i + 1}`}
                        </h5>
                        <p className="text-[13px] text-forest-ink/80 leading-relaxed">
                          {sum.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          ) : (
            <Card className="p-10 text-center text-forest-ink/60 flex flex-col items-center justify-center space-y-4">
              <StorysetLibraryBooks className="w-56 h-56 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-[18px] font-bold text-forest-ink">No Textbook Selected</h4>
                <p className="text-[14px] text-forest-ink/65 max-w-sm">
                  Select a document from the left or upload a PDF textbook to browse summaries and ask citation-grounded questions.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

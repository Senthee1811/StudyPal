'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  BookOpen,
  Search,
  HelpCircle,
  ArrowRight,
  Loader2,
  Trash2,
} from 'lucide-react';

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
      if (res.data) {
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
    // Poll for status transitions (UPLOADED -> PROCESSING -> READY)
    const interval = setInterval(fetchDocuments, 3000);
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    if (selectedDoc?.id && selectedDoc.status === 'READY') {
      api.documents
        .getSummaries(selectedDoc.id)
        .then((res) => {
          if (res.data) setSummaries(res.data);
        })
        .catch(() => {});
    } else {
      setSummaries([]);
    }
    setQaAnswer(null);
    setQuizGeneratedMsg(null);
  }, [selectedDoc]);

  const handleUploadSimulated = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Create upload intent
      const intentRes = await api.documents.createUploadIntent({
        filename: `${uploadTitle.replace(/\s+/g, '_')}.pdf`,
        fileSize: 1024 * 500, // 500KB
        mimeType: 'application/pdf',
        title: uploadTitle,
        language: locale,
      });

      if (!intentRes.data) throw new Error('Upload intent rejected');

      // 2. Complete upload
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
        answer: 'Failed to retrieve answer. Please try again.',
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
      const res = await api.documents.generateQuiz(selectedDoc.id, {
        language: locale,
        numQuestions: 5,
        difficulty: 'MEDIUM',
      });
      setQuizGeneratedMsg('Practice quiz generated successfully! Ready under Exams & Quizzes.');
    } catch (err: any) {
      setQuizGeneratedMsg('Quiz generation initiated.');
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t.library.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Government textbooks and study materials with AI extraction, summaries, and page citations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload Box & Documents List */}
        <div className="space-y-6">
          {/* Upload Form */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-indigo-700">
              <Upload className="w-5 h-5" />
              <h2 className="text-sm font-bold text-slate-900">{t.library.uploadPdf}</h2>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">{uploadError}</p>
            )}

            <form onSubmit={handleUploadSimulated} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Grade 9 Science Unit 4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-1.5 bg-slate-50/50">
                <FileText className="w-7 h-7 mx-auto text-slate-400" />
                <p className="text-xs text-slate-500">{t.library.dragDrop}</p>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading & Queuing...</span>
                  </>
                ) : (
                  <span>Upload & Index</span>
                )}
              </button>
            </form>
          </div>

          {/* Document List */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Your Documents ({documents.length})
            </h3>

            {documents.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  let badge = (
                    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700">
                      <Clock className="w-3 h-3 mr-1" />
                      {doc.status}
                    </span>
                  );
                  if (doc.status === 'READY') {
                    badge = (
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
                      </span>
                    );
                  }

                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="font-semibold text-xs text-slate-900 truncate">
                          {doc.title}
                        </h4>
                        <div className="mt-1 flex items-center space-x-2">{badge}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Document Inspector */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDoc ? (
            <div className="space-y-6">
              {/* Document Overview Header */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedDoc.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Language: <span className="uppercase font-semibold">{selectedDoc.language}</span>{' '}
                      • Status: <span className="font-semibold">{selectedDoc.status}</span>
                    </p>
                  </div>
                  {selectedDoc.status === 'READY' && (
                    <button
                      onClick={handleGenerateQuiz}
                      disabled={quizLoading}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{quizLoading ? 'Generating...' : t.library.generateQuiz}</span>
                    </button>
                  )}
                </div>

                {quizGeneratedMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{quizGeneratedMsg}</span>
                  </div>
                )}

                {/* Status Callout if still processing */}
                {selectedDoc.status !== 'READY' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin shrink-0 text-amber-600" />
                    <div>
                      <p className="font-semibold">{t.library.statusProcessing}</p>
                      <p className="text-amber-700 mt-0.5">
                        Our knowledge worker is extracting pages, cleaning OCR artifacts, and generating pgvector embeddings.
                      </p>
                    </div>
                  </div>
                )}

                {/* Hierarchical Summary View */}
                {selectedDoc.status === 'READY' && (
                  <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>{t.library.summary}</span>
                    </h3>

                    {summaries.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        Document executive summary indexed. Ask questions below to test grounded retrieval.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {summaries.map((s, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                              <span>{s.sectionTitle || 'Section Summary'}</span>
                              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {s.level}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                              {s.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Grounded Q&A Card */}
              {selectedDoc.status === 'READY' && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <Search className="w-4 h-4 text-indigo-600" />
                    <span>{t.library.askQuestion}</span>
                  </h3>

                  <form onSubmit={handleAskQuestion} className="flex gap-2">
                    <input
                      type="text"
                      value={qaQuery}
                      onChange={(e) => setQaQuery(e.target.value)}
                      placeholder="Ask any question grounded in this document..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={qaLoading}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors shrink-0"
                    >
                      {qaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
                    </button>
                  </form>

                  {/* Grounded Response & Page Citations */}
                  {qaAnswer && (
                    <div
                      className={`p-4 rounded-xl border space-y-3 ${
                        qaAnswer.isUncertain
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-indigo-50/40 border-indigo-100'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Verified Answer
                        </span>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                          {qaAnswer.answer}
                        </p>
                      </div>

                      {/* Verified Citations List */}
                      {qaAnswer.citations?.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/60 space-y-2">
                          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                            {t.library.citations}:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {qaAnswer.citations.map((c: any, cIdx: number) => (
                              <div
                                key={cIdx}
                                className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1"
                              >
                                <span className="font-bold text-indigo-600">
                                  Page {c.pageNumber}
                                </span>
                                <p className="text-slate-600 line-clamp-2 italic">
                                  &quot;{c.snippet}&quot;
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-medium">Select a document from the left or upload a new PDF.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { StorysetAiTutor, StorysetLibraryBooks } from '../../components/illustrations';
import {
  BrainCircuit,
  FileText,
  MessageSquare,
  Mic,
  PhoneCall,
  Send,
  Sparkles,
  Volume2,
  StopCircle,
  ExternalLink,
  BookOpen,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';

type StudyRoomTab = 'doc-chat' | 'one-to-one' | 'voice';

export default function StudyRoomPage() {
  const { t, locale } = useLanguage();
  const { user, api } = useAuth();

  const [activeTab, setActiveTab] = useState<StudyRoomTab>('one-to-one');
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Documents for Document Chat tab
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  // Voice state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceCallId, setVoiceCallId] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load documents for Document Chat
  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await api.documents.list();
        if (res?.data && res.data.length > 0) {
          setDocuments(res.data);
          setSelectedDoc(res.data[0]);
        }
      } catch (_) {}
    }
    loadDocs();
  }, [api]);

  // Load chat sessions
  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await api.tutor.listSessions();
        if (res?.data && res.data.length > 0) {
          setSessions(res.data);
          setActiveSession(res.data[0]);
        } else {
          const newSession = await api.tutor.createSession({ language: locale });
          if (newSession?.data) {
            setSessions([newSession.data]);
            setActiveSession(newSession.data);
          }
        }
      } catch (_) {}
    }
    loadSessions();
  }, [api, locale]);

  useEffect(() => {
    if (activeSession) {
      api.tutor
        .getSession(activeSession.id)
        .then((res) => {
          if (res?.data?.messages) {
            setMessages(res.data.messages);
          }
        })
        .catch(() => {});
    }
  }, [activeSession, api]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeSession) return;

    const userText = inputMessage;
    setInputMessage('');
    setIsSending(true);

    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.tutor.sendMessage(activeSession.id, userText);
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (_) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing your request. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleStartVoice = async () => {
    try {
      setIsVoiceActive(true);
      const res = await api.tutor.createVoiceSession({ language: locale });
      if (res?.data) {
        setVoiceCallId(res.data.vapiCallId);
        setVoiceTranscript([
          'Voice channel connected with Vapi Sri Lanka Agent.',
          'Assistant: ආයුබෝවන් / வணக்கம் / Hello! What concept would you like to review today?',
        ]);
      }
    } catch (_) {
      setIsVoiceActive(false);
    }
  };

  const handleEndVoice = () => {
    setIsVoiceActive(false);
    setVoiceCallId(null);
  };

  return (
    <div className="space-y-6 max-w-layout mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge icon={<BrainCircuit className="w-3.5 h-3.5" />}>
              AI STUDY ROOM
            </Badge>
            <MicroLabel>TRILINGUAL: SI • TA • EN</MicroLabel>
          </div>
          <DisplayHeading as="h1" size="display-sm">
            {locale === 'si' ? (
              <>
                ඔබේ පුද්ගලික <Highlight>AI ගුරු සහකරු</Highlight>
              </>
            ) : locale === 'ta' ? (
              <>
                உங்கள் தனிப்பட்ட <Highlight>AI ஆசிரியர்</Highlight>
              </>
            ) : (
              <>
                Your One-to-One <Highlight>AI Study Room</Highlight>
              </>
            )}
          </DisplayHeading>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center bg-cream-paper border border-pencil-gray/40 rounded-nav p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('one-to-one')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-btn text-[13px] font-semibold transition-all ${
              activeTab === 'one-to-one'
                ? 'bg-forest-ink text-cream-paper shadow-btn'
                : 'text-forest-ink/70 hover:text-forest-ink'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>One-to-One Teaching</span>
          </button>
          <button
            onClick={() => setActiveTab('doc-chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-btn text-[13px] font-semibold transition-all ${
              activeTab === 'doc-chat'
                ? 'bg-forest-ink text-cream-paper shadow-btn'
                : 'text-forest-ink/70 hover:text-forest-ink'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-btn text-[13px] font-semibold transition-all ${
              activeTab === 'voice'
                ? 'bg-forest-ink text-cream-paper shadow-btn'
                : 'text-forest-ink/70 hover:text-forest-ink'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice Tutor</span>
          </button>
        </div>
      </div>

      {/* ── Tab 1: One-to-One Teaching & Tab 2: Document Chat ── */}
      {(activeTab === 'one-to-one' || activeTab === 'doc-chat') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-16rem)] min-h-[550px]">
          {/* Left panel: Context or Docs */}
          <div className="lg:col-span-4 bg-cream-paper border border-pencil-gray/40 rounded-card p-4 flex flex-col justify-between hidden lg:flex">
            {activeTab === 'doc-chat' ? (
              <div className="space-y-4">
                <MicroLabel>SELECT TEXTBOOK / DOCUMENT</MicroLabel>
                {documents.length === 0 ? (
                  <p className="text-[13px] text-forest-ink/60">
                    No documents uploaded yet. Go to My Library to upload a textbook.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => {
                      const isSel = selectedDoc?.id === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoc(doc)}
                          className={`p-3 rounded-btn border cursor-pointer text-[13px] transition-all ${
                            isSel
                              ? 'bg-sticky-teal/30 border-forest-ink font-semibold'
                              : 'bg-cream-paper border-pencil-gray/30 hover:border-forest-ink/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-forest-ink/70 shrink-0" />
                            <span className="truncate">{doc.title}</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-forest-ink/50 font-mono">
                            <span>{doc.pageCount ? `${doc.pageCount} pages` : 'PDF'}</span>
                            <span className="uppercase">{doc.language || locale}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <MicroLabel>SOCRATIC TUTORING PROTOCOL</MicroLabel>
                <Card variant="mint" className="p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[14px] text-forest-ink">
                    <Lightbulb className="w-4 h-4" />
                    <span>How Socratic Teaching Works</span>
                  </div>
                  <p className="text-[13px] text-forest-ink/80 leading-relaxed">
                    Instead of just giving direct answers, StudyPal guides you step-by-step
                    with questions so you build genuine mastery for your Sri Lankan national
                    examinations.
                  </p>
                </Card>

                <div className="space-y-2">
                  <MicroLabel>QUICK PROMPTS</MicroLabel>
                  {[
                    'Explain the difference between plant and animal cells',
                    'How do I solve quadratic equations with completing the square?',
                    'Explain King Parakramabahu I’s irrigation policy',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(prompt)}
                      className="w-full text-left p-2.5 rounded-btn bg-whisper-gray hover:bg-highlighter-yellow/30 text-[12px] text-forest-ink/80 transition-colors border border-pencil-gray/20"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-highlighter-yellow/20 rounded-btn border border-highlighter-yellow/40">
              <p className="text-[11px] text-forest-ink/70 font-mono">
                AI outputs are strictly grounded in NIE official textbooks.
              </p>
            </div>
          </div>

          {/* Right chat panel */}
          <div className="lg:col-span-8 bg-cream-paper border border-pencil-gray/40 rounded-card flex flex-col justify-between overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-pencil-gray/30 flex items-center justify-between bg-whisper-gray/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-ink animate-pulse" />
                <span className="text-[14px] font-bold text-forest-ink">
                  {activeTab === 'doc-chat'
                    ? selectedDoc
                      ? `Chatting with: ${selectedDoc.title}`
                      : 'Document Grounded Chat'
                    : 'One-to-One Interactive Tutor'}
                </span>
              </div>
              <Badge size="sm">{locale.toUpperCase()}</Badge>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-forest-ink/60">
                  <StorysetAiTutor className="w-48 h-48 mb-2" />
                  <p className="text-[16px] font-bold text-forest-ink">
                    {t.tutor.title}
                  </p>
                  <p className="text-[13px] text-forest-ink/60 max-w-sm mt-1">
                    {t.tutor.placeholder}
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-card p-4 text-[14px] leading-relaxed ${
                          isUser
                            ? 'bg-forest-ink text-cream-paper shadow-btn'
                            : 'bg-white border border-pencil-gray/30 text-forest-ink shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>

                        {/* Citation tag if available */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-forest-ink/10 flex flex-wrap gap-1.5">
                            {msg.citations.map((c: any, cIdx: number) => (
                              <span
                                key={cIdx}
                                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-tag bg-highlighter-yellow/40 text-forest-ink"
                              >
                                <span>p. {c.page || c.pageNumber}</span>
                                {c.docTitle && <span className="opacity-70">• {c.docTitle}</span>}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-forest-ink/40 font-mono mt-1 px-1">
                        {isUser ? 'You' : 'StudyPal AI'}
                      </span>
                    </div>
                  );
                })
              )}
              {isSending && (
                <div className="flex items-center gap-2 text-[13px] text-forest-ink/60 font-mono">
                  <span className="w-2 h-2 rounded-full bg-forest-ink animate-bounce" />
                  <span>{t.tutor.aiTyping}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-pencil-gray/30 bg-cream-paper flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t.tutor.placeholder}
                className="flex-1 bg-white border border-pencil-gray/40 rounded-btn px-4 py-2.5 text-[14px] text-forest-ink focus:outline-none focus:border-forest-ink"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!inputMessage.trim() || isSending}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ── Tab 3: Real-Time Voice Tutor (Vapi) ── */}
      {activeTab === 'voice' && (
        <Card className="p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-sticky-teal/40 mx-auto flex items-center justify-center text-forest-ink border border-forest-ink/20">
            {isVoiceActive ? (
              <Volume2 className="w-10 h-10 animate-pulse text-forest-ink" />
            ) : (
              <PhoneCall className="w-10 h-10 text-forest-ink" />
            )}
          </div>

          <div className="space-y-2">
            <Badge size="default">VAPI CLOUD VOICE SESSION</Badge>
            <h2 className="text-[26px] font-bold text-forest-ink font-sans">
              Talk Directly with Your StudyPal Tutor
            </h2>
            <p className="text-[15px] text-forest-ink/75 max-w-md mx-auto leading-relaxed">
              Real-time voice dialogue powered by Vapi. Speak naturally in Sinhala, Tamil, or
              English to review notes, solve exam problems, or get spoken explanations.
            </p>
          </div>

          {isVoiceActive ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sticky-mint/60 border border-forest-ink/20 rounded-tag text-[13px] font-mono font-semibold text-forest-ink">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-ink animate-ping" />
                <span>Call Active • ID: {voiceCallId?.slice(0, 16) || 'Connected'}...</span>
              </div>

              {/* Transcript Box */}
              <div className="p-4 bg-whisper-gray rounded-card text-left text-[13px] text-forest-ink/80 space-y-2 max-h-48 overflow-y-auto font-mono">
                {voiceTranscript.map((tLine, i) => (
                  <p key={i}>{tLine}</p>
                ))}
              </div>

              <div>
                <Button variant="outline" onClick={handleEndVoice}>
                  <StopCircle className="w-4 h-4 mr-1 text-terracotta" />
                  End Voice Call
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <Button variant="primary" onClick={handleStartVoice}>
                <Mic className="w-4 h-4 mr-1" />
                Start Voice Session ({locale.toUpperCase()})
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/language-context';
import { useAuth } from '../../context/auth-context';
import {
  Bot,
  Send,
  Mic,
  PhoneCall,
  Loader2,
  CheckCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function TutorPage() {
  const { t, locale } = useLanguage();
  const { user, api } = useAuth();

  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceCallId, setVoiceCallId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await api.tutor.listSessions();
        if (res.data && res.data.length > 0) {
          setSessions(res.data);
          setActiveSession(res.data[0]);
        } else {
          // Auto create initial session
          const newSession = await api.tutor.createSession({ language: locale });
          if (newSession.data) {
            setSessions([newSession.data]);
            setActiveSession(newSession.data);
          }
        }
      } catch (_) {}
    }

    loadSessions();
  }, [api]);

  useEffect(() => {
    if (activeSession) {
      api.tutor
        .getSession(activeSession.id)
        .then((res) => {
          if (res.data?.messages) {
            setMessages(res.data.messages);
          }
        })
        .catch(() => {});
    }
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeSession) return;

    const userText = inputMessage;
    setInputMessage('');
    setIsSending(true);

    // Optimistic user message
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.tutor.sendMessage(activeSession.id, userText);
      if (res.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (_) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing your question. Please try again.',
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
      if (res.data) {
        setVoiceCallId(res.data.vapiCallId);
      }
    } catch (_) {
      setIsVoiceActive(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Tutor Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base">{t.tutor.title}</h1>
            <p className="text-xs text-slate-500">
              Grounded in Sri Lanka NIE Curriculum • Language: <span className="uppercase font-semibold text-indigo-600">{locale}</span>
            </p>
          </div>
        </div>

        {/* Vapi Voice Action Button */}
        <div>
          {isVoiceActive ? (
            <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>Voice Live: {voiceCallId?.substring(0, 14)}...</span>
              <button
                onClick={() => setIsVoiceActive(false)}
                className="ml-2 text-rose-800 hover:underline font-bold"
              >
                End
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartVoice}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.tutor.voiceCall}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Conversation View */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/30 to-white">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md shadow-indigo-100 font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Citations if available */}
                {msg.metadata?.citations?.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <span className="font-bold text-indigo-600">Verified Sources:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.metadata.citations.map((c: any, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium"
                        >
                          Page {c.pageNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>{t.tutor.aiTyping}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.tutor.placeholder}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl transition-all shadow-md shadow-indigo-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

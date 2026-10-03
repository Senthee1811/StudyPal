import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';

interface Message {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  citations?: number[];
}

export default function MobileTutor() {
  const { t, locale } = useMobileLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'tutor',
      text:
        locale === 'si'
          ? 'ආයුබෝවන්! මම StudyPal AI උපදේශක වෙමි. අද අපි ගණිතය හෝ භූගෝල විද්‍යාව හදාරමුද?'
          : locale === 'ta'
            ? 'வணக்கம்! நான் StudyPal AI ஆசிரியர். கணிதம் அல்லது புவியியல் கற்கலாமா?'
            : 'Hello! I am your StudyPal AI Tutor. Ask me any question from your Grade 9 textbooks.',
      citations: [1],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: inputText.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    setTimeout(() => {
      const tutorReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text:
          locale === 'si'
            ? `ඔබගේ ප්‍රශ්නය: "${userMsg.text}". දර්ශක නීතිය අනුව: a^m × a^n = a^(m+n). මෙය පාඩම් ඒකකය 1 හි පැහැදිලි කර ඇත.`
            : locale === 'ta'
              ? `உங்கள் கேள்வி: "${userMsg.text}". அடுக்கு விதிகள்: a^m × a^n = a^(m+n).`
              : `According to Grade 9 Mathematics (Unit 1): When multiplying terms with the same base, add exponents: a^m × a^n = a^(m+n).`,
        citations: [2, 3],
      };
      setMessages((prev) => [...prev, tutorReply]);
      setIsSending(false);
    }, 700);
  };

  const handleToggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      Alert.alert(
        t.tutor.voiceCall,
        locale === 'si'
          ? 'Vapi හඬ සේවාව හා සම්බන්ධ විය (Mock WebRTC Session). කතා කරන්න...'
          : locale === 'ta'
            ? 'Vapi குரல் அமர்வு இணைக்கப்பட்டது (Mock WebRTC). பேசுங்கள்...'
            : 'Connected to Vapi voice session. Speak into microphone.',
        [{ text: 'OK' }],
      );
    } else {
      setIsVoiceActive(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Voice Call Banner */}
      <View style={styles.voiceBar}>
        <View style={styles.voiceInfo}>
          <Text style={styles.voiceTitle}>{t.tutor.title}</Text>
          <Text style={styles.voiceSub}>RAG Grounded • Vapi WebRTC</Text>
        </View>
        <TouchableOpacity
          onPress={handleToggleVoice}
          style={[styles.voiceBtn, isVoiceActive && styles.voiceBtnActive]}
        >
          <Text style={styles.voiceBtnText}>
            {isVoiceActive ? 'End Call' : t.tutor.voiceCall}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatList} contentContainerStyle={{ paddingBottom: 16 }}>
        {messages.map((m) => {
          const isUser = m.sender === 'student';
          return (
            <View
              key={m.id}
              style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowTutor]}
            >
              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleTutor]}>
                <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
                  {m.text}
                </Text>
                {m.citations && m.citations.length > 0 && (
                  <View style={styles.citationBadge}>
                    <Text style={styles.citationText}>
                      {t.library.sourcePages}: {m.citations.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
        {isSending && (
          <View style={styles.typingBox}>
            <ActivityIndicator size="small" color="#4f46e5" />
            <Text style={styles.typingText}>{t.tutor.aiTyping}</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Row */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={t.tutor.placeholder}
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendBtnText}>{t.common.submit}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  voiceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  voiceInfo: { flex: 1 },
  voiceTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  voiceSub: { fontSize: 11, color: '#64748b' },
  voiceBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  voiceBtnActive: { backgroundColor: '#ef4444' },
  voiceBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  chatList: { flex: 1, padding: 16 },
  msgRow: { flexDirection: 'row', marginBottom: 12 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowTutor: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  bubbleUser: { backgroundColor: '#4f46e5', borderBottomRightRadius: 4 },
  bubbleTutor: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bubbleText: { fontSize: 13, color: '#0f172a', lineHeight: 18 },
  bubbleTextUser: { color: '#ffffff' },
  citationBadge: {
    marginTop: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  citationText: { fontSize: 10, color: '#2563eb', fontWeight: '600' },
  typingBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  typingText: { fontSize: 12, color: '#64748b', fontStyle: 'italic' },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  sendBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});

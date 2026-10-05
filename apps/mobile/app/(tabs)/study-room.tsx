import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';
import { Button, Badge, Card, MicroLabel } from '../../src/components/ui';
import { C, R, S } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  citations?: number[];
}

export default function MobileStudyRoom() {
  const { t, locale } = useMobileLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'tutor',
      text:
        locale === 'si'
          ? 'ආයුබෝවන්! මම StudyPal AI උපදේශක වෙමි. අද අපි ගණිතය හෝ විද්‍යාව හදාරමුද?'
          : locale === 'ta'
          ? 'வணக்கம்! நான் StudyPal AI ஆசிரியர். கணிதம் அல்லது அறிவியல் கற்கலாமா?'
          : 'Hello! I am your StudyPal AI Tutor. Ask me any question from your school textbooks.',
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
            ? `ඔබගේ ප්‍රශ්නය: "${userMsg.text}". විෂය කරුණු අනුව සවිස්තරාත්මක විසඳුම සහ සටහන් පෙළපොතේ පිටු අංක 14 හි දක්වා ඇත.`
            : locale === 'ta'
            ? `உங்கள் கேள்வி: "${userMsg.text}". பாடநூலின் 14 ஆம் பக்கத்தில் இதற்குரிய விளக்கம் உள்ளது.`
            : `Here is the explanation for "${userMsg.text}": Concepts are grounded in your Sri Lankan curriculum syllabus.`,
        citations: [14],
      };
      setMessages((prev) => [...prev, tutorReply]);
      setIsSending(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner: Voice Session Bar */}
      <View style={styles.voiceBar}>
        <View style={styles.voiceInfo}>
          <Ionicons
            name={isVoiceActive ? 'radio' : 'mic-outline'}
            size={18}
            color={C['forest-ink']}
          />
          <Text style={styles.voiceText}>
            {isVoiceActive ? 'Voice Live (Vapi Connected)' : 'One-to-One AI Tutor'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsVoiceActive(!isVoiceActive)}
          style={[styles.voiceBtn, isVoiceActive && styles.voiceBtnActive]}
        >
          <Text style={[styles.voiceBtnText, isVoiceActive && styles.voiceBtnTextActive]}>
            {isVoiceActive ? 'End Call' : 'Start Voice'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        style={styles.messageScroll}
        contentContainerStyle={styles.messageContent}
      >
        {messages.map((msg) => {
          const isStudent = msg.sender === 'student';
          return (
            <View
              key={msg.id}
              style={[
                styles.bubbleWrapper,
                isStudent ? styles.bubbleStudentWrapper : styles.bubbleTutorWrapper,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isStudent ? styles.bubbleStudent : styles.bubbleTutor,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isStudent ? styles.messageTextStudent : styles.messageTextTutor,
                  ]}
                >
                  {msg.text}
                </Text>

                {msg.citations && msg.citations.length > 0 && (
                  <View style={styles.citationRow}>
                    {msg.citations.map((page) => (
                      <View key={page} style={styles.citationBadge}>
                        <Text style={styles.citationText}>p. {page} Textbook</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <Text style={styles.senderLabel}>
                {isStudent ? 'You' : 'StudyPal AI'}
              </Text>
            </View>
          );
        })}

        {isSending && (
          <View style={styles.typingRow}>
            <ActivityIndicator size="small" color={C['forest-ink']} />
            <Text style={styles.typingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Field */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask your syllabus question..."
          placeholderTextColor={C['forest-ink'] + '66'}
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isSending}
          style={[
            styles.sendBtn,
            (!inputText.trim() || isSending) && styles.sendBtnDisabled,
          ]}
        >
          <Ionicons name="send" size={18} color={C['cream-paper']} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C['cream-paper'],
  },
  voiceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    backgroundColor: C['sticky-teal'] + '55', // subtle pastel teal
    borderBottomWidth: 1,
    borderBottomColor: C['pencil-gray'] + '4D',
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  voiceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: R.btn,
    backgroundColor: C['forest-ink'],
  },
  voiceBtnActive: {
    backgroundColor: C.terracotta,
  },
  voiceBtnText: {
    color: C['cream-paper'],
    fontSize: 12,
    fontWeight: '700',
  },
  voiceBtnTextActive: {
    color: '#ffffff',
  },
  messageScroll: {
    flex: 1,
  },
  messageContent: {
    padding: S.md,
    gap: S.sm,
  },
  bubbleWrapper: {
    marginVertical: 4,
  },
  bubbleStudentWrapper: {
    alignItems: 'flex-end',
  },
  bubbleTutorWrapper: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: R.card,
    padding: S.md,
  },
  bubbleStudent: {
    backgroundColor: C['forest-ink'],
  },
  bubbleTutor: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextStudent: {
    color: C['cream-paper'],
  },
  messageTextTutor: {
    color: C['forest-ink'],
  },
  citationRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: C['pencil-gray'] + '33',
  },
  citationBadge: {
    backgroundColor: C['highlighter-yellow'] + '80',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: R.tag,
  },
  citationText: {
    fontSize: 10,
    fontWeight: '600',
    color: C['forest-ink'],
  },
  senderLabel: {
    fontSize: 10,
    color: C['forest-ink'] + '66',
    marginTop: 2,
    marginHorizontal: 4,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  typingText: {
    fontSize: 12,
    color: C['forest-ink'] + '80',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    padding: S.sm,
    backgroundColor: C['cream-paper'],
    borderTopWidth: 1,
    borderTopColor: C['pencil-gray'] + '4D',
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '66',
    borderRadius: R.btn,
    paddingHorizontal: S.md,
    paddingVertical: 10,
    fontSize: 14,
    color: C['forest-ink'],
    maxHeight: 90,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: R.btn,
    backgroundColor: C['forest-ink'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});

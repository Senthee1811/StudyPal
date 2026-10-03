import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';

interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function MobileExams() {
  const { t, locale } = useMobileLanguage();
  const [examStarted, setExamStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; total: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const questions: ExamQuestion[] = [
    {
      id: 'q1',
      prompt:
        locale === 'si'
          ? 'දර්ශක නීති අනුව 2^3 × 2^4 හි අගය කුමක්ද?'
          : locale === 'ta'
            ? 'அடுக்கு விதிகள் படி 2^3 × 2^4 இன் மதிப்பு என்ன?'
            : 'According to index laws, what is 2^3 × 2^4?',
      options: ['2^7', '2^12', '4^7', '4^12'],
      correctAnswer: '2^7',
      explanation: 'When bases are equal, add the indices: 3 + 4 = 7.',
    },
    {
      id: 'q2',
      prompt:
        locale === 'si'
          ? 'ශ්‍රී ලංකාවේ දිගම ගංගාව කුමක්ද?'
          : locale === 'ta'
            ? 'இலங்கையின் மிக நீண்ட நதி எது?'
            : 'Which is the longest river in Sri Lanka?',
      options: [
        locale === 'si' ? 'මහවැලි ගඟ' : locale === 'ta' ? 'மகாவலி நதி' : 'Mahaweli River',
        locale === 'si' ? 'කැළණි ගඟ' : locale === 'ta' ? 'களனி நதி' : 'Kelani River',
        locale === 'si' ? 'කළු ගඟ' : locale === 'ta' ? 'களு நதி' : 'Kalu River',
        locale === 'si' ? 'වලවේ ගඟ' : locale === 'ta' ? 'வலவை நதி' : 'Walawe River',
      ],
      correctAnswer: locale === 'si' ? 'මහවැලි ගඟ' : locale === 'ta' ? 'மகாவலி நதி' : 'Mahaweli River',
      explanation: 'The Mahaweli River is 335 km long and the longest river in Sri Lanka.',
    },
  ];

  useEffect(() => {
    let timer: any;
    if (examStarted && !scoreResult && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, scoreResult, timeLeft]);

  const handleSelectOption = (qId: string, opt: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      let earned = 0;
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswer) earned += 1;
      });
      setScoreResult({ score: earned, total: questions.length });
      setIsSubmitting(false);
    }, 600);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (scoreResult) {
    const percentage = Math.round((scoreResult.score / scoreResult.total) * 100);
    return (
      <ScrollView style={styles.container}>
        <View style={styles.resultCard}>
          <Text style={styles.resultBadge}>Exam Completed</Text>
          <Text style={styles.scoreText}>
            {scoreResult.score} / {scoreResult.total}
          </Text>
          <Text style={styles.percentageText}>{percentage}% Mastery</Text>

          <View style={styles.reviewSection}>
            <Text style={styles.reviewHeader}>{t.exams.reviewAnswers}</Text>
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <View key={q.id} style={styles.reviewCard}>
                  <Text style={styles.qNum}>
                    {t.exams.questionNumber} {idx + 1}
                  </Text>
                  <Text style={styles.qPrompt}>{q.prompt}</Text>
                  <Text style={[styles.ansText, isCorrect ? styles.correct : styles.incorrect]}>
                    Selected: {userAns || 'None'} ({isCorrect ? 'Correct' : 'Incorrect'})
                  </Text>
                  <Text style={styles.explanationText}>Explanation: {q.explanation}</Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              setScoreResult(null);
              setExamStarted(false);
              setSelectedAnswers({});
              setTimeLeft(600);
            }}
          >
            <Text style={styles.actionBtnText}>{t.common.retry}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (!examStarted) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.exams.title}</Text>
          <Text style={styles.subtitle}>
            Timed National Curriculum Mock Exams with automatic marking.
          </Text>
        </View>

        <View style={styles.examCard}>
          <Text style={styles.examBadge}>Grade 9 • Combined Exam</Text>
          <Text style={styles.examTitle}>Mathematics & Geography Mock Paper 1</Text>
          <Text style={styles.examInfo}>2 Questions • 10 Minutes • Immutable Snapshot</Text>

          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => setExamStarted(true)}
          >
            <Text style={styles.startBtnText}>{t.exams.startExam}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <View style={styles.container}>
      {/* Top Bar with Timer */}
      <View style={styles.topBar}>
        <Text style={styles.progressText}>
          {t.exams.questionNumber} {currentIdx + 1} of {questions.length}
        </Text>
        <Text style={styles.timerText}>
          {t.exams.timeRemaining}: {formatTimer(timeLeft)}
        </Text>
      </View>

      {/* Question Card */}
      <ScrollView style={styles.questionContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.prompt}>{currentQ.prompt}</Text>

          <View style={styles.optionsList}>
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedAnswers[currentQ.id] === opt;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSelectOption(currentQ.id, opt)}
                  style={[styles.optBtn, isSelected && styles.optBtnSelected]}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]} />
                  <Text style={[styles.optText, isSelected && styles.optTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          style={[styles.navBtn, currentIdx === 0 && styles.navBtnDisabled]}
        >
          <Text style={styles.navBtnText}>{t.common.previous}</Text>
        </TouchableOpacity>

        {currentIdx < questions.length - 1 ? (
          <TouchableOpacity
            onPress={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
            style={styles.navBtnPrimary}
          >
            <Text style={styles.navBtnPrimaryText}>{t.common.next}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitBtn}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>{t.exams.submitExam}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 4 },
  examCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  examBadge: { color: '#4f46e5', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  examTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  examInfo: { fontSize: 12, color: '#64748b', marginBottom: 20 },
  startBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressText: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  timerText: { fontSize: 13, fontWeight: '700', color: '#ea580c' },
  questionContainer: { flex: 1, padding: 16 },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  prompt: { fontSize: 15, fontWeight: '700', color: '#0f172a', lineHeight: 22, marginBottom: 16 },
  optionsList: { gap: 10 },
  optBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optBtnSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#94a3b8',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#4f46e5',
  },
  optText: { fontSize: 13, color: '#334155' },
  optTextSelected: { color: '#4f46e5', fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  navBtnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#4f46e5',
  },
  navBtnPrimaryText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#16a34a',
  },
  submitBtnText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  resultCard: { margin: 16, backgroundColor: '#ffffff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  resultBadge: { color: '#16a34a', fontSize: 12, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  scoreText: { fontSize: 32, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
  percentageText: { fontSize: 14, fontWeight: '600', color: '#64748b', textAlign: 'center', marginBottom: 20 },
  reviewSection: { marginTop: 10, marginBottom: 20 },
  reviewHeader: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  reviewCard: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, marginBottom: 8 },
  qNum: { fontSize: 11, fontWeight: '700', color: '#4f46e5' },
  qPrompt: { fontSize: 12, fontWeight: '600', color: '#0f172a', marginTop: 2 },
  ansText: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  correct: { color: '#16a34a' },
  incorrect: { color: '#dc2626' },
  explanationText: { fontSize: 10, color: '#64748b', marginTop: 4, fontStyle: 'italic' },
  actionBtn: { backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});

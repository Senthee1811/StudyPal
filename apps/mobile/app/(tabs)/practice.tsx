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
import { Button, Card, Badge, MicroLabel } from '../../src/components/ui';
import { C, R, S } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function MobilePractice() {
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
      correctAnswer:
        locale === 'si' ? 'මහවැලි ගඟ' : locale === 'ta' ? 'மகாவலி நதி' : 'Mahaweli River',
      explanation: 'The Mahaweli River is 335 km long and the longest river in Sri Lanka.',
    },
    {
      id: 'q3',
      prompt:
        locale === 'si'
          ? 'x² - 5x + 6 = 0 සමීකරණයේ මූල මොනවාද?'
          : locale === 'ta'
          ? 'x² - 5x + 6 = 0 சமன்பாட்டின் மூலங்கள் என்ன?'
          : 'What are the roots of x² - 5x + 6 = 0?',
      options: ['2 and 3', '-2 and -3', '1 and 6', '-1 and -6'],
      correctAnswer: '2 and 3',
      explanation: '(x - 2)(x - 3) = 0 => x = 2 or x = 3.',
    },
  ];

  useEffect(() => {
    if (!examStarted || scoreResult) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, scoreResult]);

  const handleSelectOption = (qId: string, opt: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    setTimeout(() => {
      setScoreResult({ score: correct, total: questions.length });
      setIsSubmitting(false);
    }, 600);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {!examStarted ? (
        <View style={styles.startContainer}>
          <Card variant="blush" style={styles.heroCard}>
            <Badge size="sm">TIMED MOCK PAPER</Badge>
            <Text style={styles.heroTitle}>
              {locale === 'si'
                ? 'සාමාන්‍ය පෙළ (O/L) ආදර්ශ ප්‍රශ්න පත්‍රය'
                : locale === 'ta'
                ? 'சா/த மாதிரி வினாத்தாள்'
                : 'Grade 11 (O/L) Model Paper'}
            </Text>
            <Text style={styles.heroDesc}>
              Mathematics & Sri Lankan Geography. 3 multiple-choice questions with 10-minute
              countdown timer.
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>⏱ 10 Mins</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>📝 3 Questions</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>🎯 Pass: 60%</Text>
            </View>

            <Button
              variant="primary"
              onPress={() => {
                setExamStarted(true);
                setCurrentIdx(0);
                setSelectedAnswers({});
                setScoreResult(null);
                setTimeLeft(600);
              }}
            >
              Start Timed Exam
            </Button>
          </Card>
        </View>
      ) : scoreResult ? (
        /* Score Screen */
        <Card variant="mint" style={styles.scoreCard}>
          <Badge size="sm">EXAMINATION RESULT</Badge>
          <Text style={styles.scoreTitle}>
            {scoreResult.score / scoreResult.total >= 0.6
              ? 'Congratulations! Passed'
              : 'Keep Practicing'}
          </Text>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreBig}>
              {scoreResult.score} / {scoreResult.total}
            </Text>
            <Text style={styles.scorePct}>
              {Math.round((scoreResult.score / scoreResult.total) * 100)}%
            </Text>
          </View>

          {/* Question Breakdown */}
          <View style={styles.reviewSection}>
            <MicroLabel>ANSWER EXPLANATIONS</MicroLabel>
            {questions.map((q, i) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <View key={q.id} style={styles.reviewItem}>
                  <Text style={styles.reviewQ}>
                    {i + 1}. {q.prompt}
                  </Text>
                  <Text
                    style={[
                      styles.reviewStatus,
                      isCorrect ? styles.statusCorrect : styles.statusIncorrect,
                    ]}
                  >
                    {isCorrect ? '✓ Correct' : `✗ Expected: ${q.correctAnswer}`}
                  </Text>
                  <Text style={styles.reviewExp}>{q.explanation}</Text>
                </View>
              );
            })}
          </View>

          <Button
            variant="primary"
            onPress={() => {
              setExamStarted(false);
              setScoreResult(null);
            }}
          >
            Back to Practice
          </Button>
        </Card>
      ) : (
        /* Active Question Screen */
        <View style={styles.activeContainer}>
          <View style={styles.statusBar}>
            <Text style={styles.statusCounter}>
              Question {currentIdx + 1} of {questions.length}
            </Text>
            <View style={styles.timerBadge}>
              <Ionicons name="time-outline" size={14} color={C['forest-ink']} />
              <Text style={styles.timerText}>{formatTimer(timeLeft)}</Text>
            </View>
          </View>

          <Card style={styles.questionCard}>
            <Text style={styles.questionPrompt}>{questions[currentIdx].prompt}</Text>

            <View style={styles.optionsList}>
              {questions[currentIdx].options.map((opt, i) => {
                const isSelected = selectedAnswers[questions[currentIdx].id] === opt;
                const letter = String.fromCharCode(65 + i);

                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => handleSelectOption(questions[currentIdx].id, opt)}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                  >
                    <View
                      style={[
                        styles.letterCircle,
                        isSelected && styles.letterCircleSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.letterText,
                          isSelected && styles.letterTextSelected,
                        ]}
                      >
                        {letter}
                      </Text>
                    </View>
                    <Text
                      style={[styles.optionText, isSelected && styles.optionTextSelected]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* Navigation Controls */}
          <View style={styles.actionRow}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onPress={() => setCurrentIdx((p) => p - 1)}
            >
              Previous
            </Button>

            {currentIdx < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onPress={() => setCurrentIdx((p) => p + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Answers'}
              </Button>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C['cream-paper'],
  },
  contentContainer: {
    padding: S.md,
    gap: S.md,
    paddingBottom: 40,
  },
  startContainer: {
    gap: S.md,
  },
  heroCard: {
    padding: S.lg,
    gap: S.sm,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C['forest-ink'],
    lineHeight: 26,
  },
  heroDesc: {
    fontSize: 13,
    color: C['forest-ink'] + 'CC',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: C['forest-ink'] + '99',
    fontFamily: 'monospace',
  },
  activeContainer: {
    gap: S.md,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  statusCounter: {
    fontSize: 13,
    fontWeight: '700',
    color: C['forest-ink'],
    fontFamily: 'monospace',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C['highlighter-yellow'],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: R.tag,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: C['forest-ink'],
    fontFamily: 'monospace',
  },
  questionCard: {
    padding: S.md,
    gap: S.md,
  },
  questionPrompt: {
    fontSize: 16,
    fontWeight: '700',
    color: C['forest-ink'],
    lineHeight: 22,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
    borderRadius: R.btn,
    gap: 12,
  },
  optionItemSelected: {
    backgroundColor: C['highlighter-yellow'] + '4D',
    borderColor: C['forest-ink'],
  },
  letterCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C['whisper-gray'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterCircleSelected: {
    backgroundColor: C['forest-ink'],
  },
  letterText: {
    fontSize: 12,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  letterTextSelected: {
    color: C['cream-paper'],
  },
  optionText: {
    fontSize: 14,
    color: C['forest-ink'],
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: S.xs,
  },
  scoreCard: {
    padding: S.lg,
    gap: S.md,
  },
  scoreTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C['forest-ink'],
  },
  scoreBox: {
    alignItems: 'center',
    padding: S.md,
    backgroundColor: '#ffffff',
    borderRadius: R.card,
    borderWidth: 1,
    borderColor: C['forest-ink'] + '20',
  },
  scoreBig: {
    fontSize: 36,
    fontWeight: '900',
    color: C['forest-ink'],
  },
  scorePct: {
    fontSize: 14,
    fontWeight: '600',
    color: C['forest-ink'] + '99',
    marginTop: 2,
  },
  reviewSection: {
    gap: S.sm,
    paddingTop: S.sm,
  },
  reviewItem: {
    backgroundColor: '#ffffff',
    padding: S.md,
    borderRadius: R.btn,
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
    gap: 4,
  },
  reviewQ: {
    fontSize: 13,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  reviewStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusCorrect: {
    color: C['forest-ink'],
  },
  statusIncorrect: {
    color: C.terracotta,
  },
  reviewExp: {
    fontSize: 11,
    color: C['forest-ink'] + '99',
    lineHeight: 16,
    fontFamily: 'monospace',
  },
});

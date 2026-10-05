import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';
import { Card, Badge, MicroLabel, Button } from '../../src/components/ui';
import { C, R, S } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobileProgress() {
  const router = useRouter();
  const { t, locale } = useMobileLanguage();

  const masteryItems = [
    {
      topic:
        locale === 'si'
          ? 'දර්ශක සහ සම්මත ආකාරය'
          : locale === 'ta'
          ? 'அடுக்குகளும் நியம வடிவமும்'
          : 'Indices and Standard Form',
      subject: 'Mathematics G11',
      score: 85,
      confidence: 90,
      evidence: 14,
    },
    {
      topic:
        locale === 'si'
          ? 'වර්ගජ සමීකරණ'
          : locale === 'ta'
          ? 'இருபடிச் சமன்பாடுகள்'
          : 'Quadratic Equations',
      subject: 'Mathematics G11',
      score: 62,
      confidence: 80,
      evidence: 8,
    },
    {
      topic:
        locale === 'si'
          ? 'ශ්‍රී ලංකාවේ ප්‍රධාන ගංගා සහ භූ විෂමතාව'
          : locale === 'ta'
          ? 'இலங்கையின் முக்கிய நதிகளும் தரைத்தோற்றமும்'
          : 'Major Rivers & Relief Features',
      subject: 'Geography G11',
      score: 48,
      confidence: 60,
      evidence: 5,
    },
  ];

  const recommendations = [
    {
      title:
        locale === 'si'
          ? 'භූගෝල විද්‍යා සිතියම් පුහුණුව'
          : locale === 'ta'
          ? 'புவியியல் வரைபடப் பயிற்சி'
          : 'Geography Map Pinpoint Practice',
      reason:
        locale === 'si'
          ? 'මහවැලි ගඟ සහ සමනල කන්ද සිතියමේ ලකුණු කිරීම තවදුරටත් පුහුණු වන්න.'
          : locale === 'ta'
          ? 'மகாவலி நதியையும் சிவனொளிபாதமலையையும் வரைபடத்தில் அடையாளம் காணுங்கள்.'
          : 'Accuracy on Mahaweli River location is below 50%. Practice coordinates identification in Map Lab.',
      priority: 'HIGH',
      actionRoute: '/(tabs)/map-lab',
    },
    {
      title:
        locale === 'si'
          ? 'වර්ගජ සමීකරණ සාධක සෙවීම'
          : locale === 'ta'
          ? 'இருபடிச் சமன்பாடுகள் காரணிப்படுத்தல்'
          : 'Quadratic Factorization Review',
      reason:
        locale === 'si'
          ? 'මූලික සාධක සෙවීමේ ගැටළු කිහිපයක් AI ගුරු සහකරු සමඟ විසඳන්න.'
          : locale === 'ta'
          ? 'காரணிப்படுத்தல் பாடங்களை AI ஆசிரியருடன் படியுங்கள்.'
          : 'Resolve factorization doubts step-by-step with your Socratic AI Tutor.',
      priority: 'MEDIUM',
      actionRoute: '/(tabs)/study-room',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.heroCard}>
        <Badge size="sm">MASTERY ENGINE</Badge>
        <Text style={styles.heroTitle}>
          {locale === 'si'
            ? 'ඔබේ ඉගෙනුම් ප්‍රගතිය'
            : locale === 'ta'
            ? 'கற்றல் முன்னேற்றம்'
            : 'Adaptive Mastery'}
        </Text>
        <Text style={styles.heroDesc}>
          Bayesian knowledge estimation based on quiz answers, exams, and map lab exercises.
        </Text>
      </Card>

      {/* Top Stat Row */}
      <View style={styles.statRow}>
        <Card variant="mint" style={styles.statCard}>
          <MicroLabel>OVERALL</MicroLabel>
          <Text style={styles.statNum}>73%</Text>
          <Text style={styles.statSub}>Competent</Text>
        </Card>

        <Card variant="teal" style={styles.statCard}>
          <MicroLabel>STREAK</MicroLabel>
          <Text style={styles.statNum}>🔥 5d</Text>
          <Text style={styles.statSub}>Keep going!</Text>
        </Card>

        <Card variant="blush" style={styles.statCard}>
          <MicroLabel>ANSWERS</MicroLabel>
          <Text style={styles.statNum}>27</Text>
          <Text style={styles.statSub}>Questions</Text>
        </Card>
      </View>

      {/* Topic Mastery Bars */}
      <View style={styles.sectionHeader}>
        <MicroLabel>SYLLABUS COMPETENCY</MicroLabel>
      </View>

      <Card style={styles.masteryListCard}>
        {masteryItems.map((item, idx) => {
          const isWeak = item.score < 60;
          return (
            <View key={idx} style={styles.masteryItem}>
              <View style={styles.itemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topicTitle}>{item.topic}</Text>
                  <Text style={styles.topicSub}>
                    {item.subject} • {item.evidence} questions
                  </Text>
                </View>
                <Text
                  style={[
                    styles.scoreText,
                    isWeak ? styles.scoreWeak : styles.scoreGood,
                  ]}
                >
                  {item.score}%
                </Text>
              </View>

              {/* Progress bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${item.score}%`,
                      backgroundColor:
                        item.score >= 80
                          ? C['forest-ink']
                          : item.score >= 60
                          ? C['highlighter-yellow']
                          : C.terracotta,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </Card>

      {/* Revision Recommendations */}
      <View style={styles.sectionHeader}>
        <MicroLabel>ADAPTIVE REVISION QUEUE</MicroLabel>
      </View>

      <View style={styles.recList}>
        {recommendations.map((rec, i) => (
          <Card
            key={i}
            variant={rec.priority === 'HIGH' ? 'blush' : 'default'}
            style={styles.recCard}
          >
            <View style={styles.recHeader}>
              <Badge size="sm">{rec.priority} PRIORITY</Badge>
              <Ionicons name="sparkles-outline" size={16} color={C['forest-ink']} />
            </View>

            <Text style={styles.recTitle}>{rec.title}</Text>
            <Text style={styles.recReason}>{rec.reason}</Text>

            <View style={styles.recAction}>
              <Button
                variant="primary"
                size="sm"
                onPress={() => router.push(rec.actionRoute as any)}
              >
                Revise Topic
              </Button>
            </View>
          </Card>
        ))}
      </View>
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
  statRow: {
    flexDirection: 'row',
    gap: S.sm,
  },
  statCard: {
    flex: 1,
    padding: S.md,
    gap: 2,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '900',
    color: C['forest-ink'],
  },
  statSub: {
    fontSize: 10,
    color: C['forest-ink'] + '80',
  },
  sectionHeader: {
    paddingHorizontal: 2,
  },
  masteryListCard: {
    padding: S.md,
    gap: S.md,
  },
  masteryItem: {
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  topicSub: {
    fontSize: 11,
    color: C['forest-ink'] + '80',
    fontFamily: 'monospace',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  scoreGood: {
    color: C['forest-ink'],
  },
  scoreWeak: {
    color: C.terracotta,
  },
  barTrack: {
    height: 8,
    backgroundColor: C['whisper-gray'],
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  recList: {
    gap: S.sm,
  },
  recCard: {
    padding: S.md,
    gap: S.sm,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  recReason: {
    fontSize: 13,
    color: C['forest-ink'] + 'CC',
    lineHeight: 18,
  },
  recAction: {
    paddingTop: 4,
    alignItems: 'flex-start',
  },
});

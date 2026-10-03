import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';

export default function MobileProgress() {
  const { t, locale } = useMobileLanguage();

  const masteryItems = [
    {
      topic:
        locale === 'si'
          ? 'දර්ශක සහ සම්මත ආකාරය'
          : locale === 'ta'
            ? 'அடுக்குகளும் நியம வடிவமும்'
            : 'Indices and Standard Form',
      subject: 'Mathematics G9',
      score: 0.85,
      confidence: 0.9,
      evidence: 14,
    },
    {
      topic:
        locale === 'si'
          ? 'ශ්‍රී ලංකාවේ ප්‍රධාන ගංගා සහ භූ විෂමතාව'
          : locale === 'ta'
            ? 'இலங்கையின் முக்கிய நதிகளும் தரைத்தோற்றமும்'
            : 'Major Rivers & Relief Features',
      subject: 'Geography G9',
      score: 0.72,
      confidence: 0.75,
      evidence: 8,
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
            : 'Accuracy on Mahaweli River location is below 80%. Practice coordinates identification.',
      priority: 'HIGH',
    },
    {
      title:
        locale === 'si'
          ? 'දර්ශක දෙවන ඒකකය ආරම්භ කරන්න'
          : locale === 'ta'
            ? 'அடுக்குகள் அலகு 2 ஐத் தொடங்குங்கள்'
            : 'Advance to Fractional Indices',
      reason:
        locale === 'si'
          ? 'මූලික දර්ශක පිළිබඳ ඉහළ ප්‍රවීණතාවක් පෙන්වා ඇත.'
          : locale === 'ta'
            ? 'அடிப்படை அடுக்குகளில் சிறந்த தேர்ச்சி பெறப்பட்டுள்ளது.'
            : 'High mastery achieved (85%). Ready for advanced algebra.',
      priority: 'MEDIUM',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.progress.title}</Text>
        <Text style={styles.subtitle}>
          Bayesian Topic Mastery & Rule-Based AI Recommendations
        </Text>
      </View>

      {/* Mastery Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.progress.topicMastery}</Text>
        {masteryItems.map((m, i) => {
          const pct = Math.round(m.score * 100);
          return (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.topicName}>{m.topic}</Text>
                <Text style={styles.scoreText}>{pct}%</Text>
              </View>
              <Text style={styles.subjectName}>{m.subject}</Text>

              {/* Progress Bar */}
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${pct}%` }]} />
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  {t.progress.confidence}: {Math.round(m.confidence * 100)}%
                </Text>
                <Text style={styles.metaText}>
                  {t.progress.evidenceCount}: {m.evidence}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Recommendations Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.progress.recommendations}</Text>
        {recommendations.map((r, i) => (
          <View key={i} style={styles.recCard}>
            <View style={styles.recHeader}>
              <Text style={styles.recTitle}>{r.title}</Text>
              <View
                style={[
                  styles.priorityBadge,
                  r.priority === 'HIGH' ? styles.badgeHigh : styles.badgeMed,
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    r.priority === 'HIGH' ? styles.textHigh : styles.textMed,
                  ]}
                >
                  {r.priority}
                </Text>
              </View>
            </View>
            <Text style={styles.recReason}>{r.reason}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topicName: { fontSize: 14, fontWeight: '700', color: '#0f172a', flex: 1 },
  scoreText: { fontSize: 15, fontWeight: '800', color: '#4f46e5', marginLeft: 8 },
  subjectName: { fontSize: 11, color: '#64748b', marginTop: 2, marginBottom: 10 },
  barBackground: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  metaText: { fontSize: 11, color: '#64748b' },
  recCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', flex: 1 },
  priorityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  badgeHigh: { backgroundColor: '#fee2e2' },
  badgeMed: { backgroundColor: '#fef3c7' },
  priorityText: { fontSize: 10, fontWeight: '800' },
  textHigh: { color: '#dc2626' },
  textMed: { color: '#d97706' },
  recReason: { fontSize: 12, color: '#475569', marginTop: 6, lineHeight: 18 },
});

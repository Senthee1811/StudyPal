import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';
import { Card, Badge, MicroLabel, Button } from '../../src/components/ui';
import { C, R, S } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobileCurriculum() {
  const router = useRouter();
  const { t, locale } = useMobileLanguage();
  const [selectedGrade, setSelectedGrade] = useState(11);

  const subjects = [
    {
      code: 'MATH-G11',
      name:
        locale === 'si' ? 'ගණිතය' : locale === 'ta' ? 'கணிதம்' : 'Mathematics',
      units: [
        'Real Numbers & Indices',
        'Quadratic Equations',
        'Geometric Theorems',
        'Trigonometry',
      ],
    },
    {
      code: 'SCI-G11',
      name:
        locale === 'si' ? 'විද්‍යාව' : locale === 'ta' ? 'அறிவியல்' : 'Science',
      units: [
        'Photosynthesis & Cell Biology',
        'Newtonian Mechanics',
        'Chemical Bonding',
        'Ecosystems & Biodiversity',
      ],
    },
    {
      code: 'GEO-G11',
      name:
        locale === 'si' ? 'භූගෝල විද්‍යාව' : locale === 'ta' ? 'புவியியல்' : 'Geography',
      units: [
        'Topography of Sri Lanka',
        'Climatic Zones & Rainfall',
        'Agriculture & Irrigation Systems',
        'Industrial Development',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card variant="mint" style={styles.heroCard}>
        <Badge size="sm">NIE CURRICULUM FRAMEWORK</Badge>
        <Text style={styles.heroTitle}>
          {locale === 'si'
            ? 'ශ්‍රී ලංකා ජාතික විෂය නිර්දේශය'
            : locale === 'ta'
            ? 'இலங்கை தேசிய பாடத்திட்டம்'
            : 'National Curriculum Tree'}
        </Text>
        <Text style={styles.heroDesc}>
          Official competencies and syllabus breakdown mapped to national examination standards.
        </Text>
      </Card>

      {/* Grade Selector Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradeScroll}>
        {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => {
          const isSel = selectedGrade === g;
          return (
            <TouchableOpacity
              key={g}
              onPress={() => setSelectedGrade(g)}
              style={[styles.gradePill, isSel && styles.gradePillSelected]}
            >
              <Text style={[styles.gradeText, isSel && styles.gradeTextSelected]}>
                Grade {g} {g === 11 ? '(O/L)' : g === 13 ? '(A/L)' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <MicroLabel>SUBJECTS (GRADE {selectedGrade})</MicroLabel>
      </View>

      {/* Subject Cards */}
      <View style={styles.list}>
        {subjects.map((sub) => (
          <Card key={sub.code} style={styles.subCard}>
            <View style={styles.subHeader}>
              <View>
                <Text style={styles.subCode}>{sub.code}</Text>
                <Text style={styles.subName}>{sub.name}</Text>
              </View>
              <Badge size="sm">NIE ALIGNED</Badge>
            </View>

            <View style={styles.unitsSection}>
              <MicroLabel>CORE UNITS</MicroLabel>
              {sub.units.map((u, i) => (
                <View key={i} style={styles.unitItem}>
                  <Text style={styles.unitNum}>{i + 1}.</Text>
                  <Text style={styles.unitName}>{u}</Text>
                </View>
              ))}
            </View>

            <View style={styles.subActions}>
              <Button
                variant="primary"
                size="sm"
                onPress={() => router.push('/(tabs)/study-room' as any)}
              >
                Study Unit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => router.push('/(tabs)/practice' as any)}
              >
                Practice Quiz
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
  gradeScroll: {
    flexDirection: 'row',
  },
  gradePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: R.btn,
    backgroundColor: C['cream-paper'],
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '66',
    marginRight: 8,
  },
  gradePillSelected: {
    backgroundColor: C['forest-ink'],
    borderColor: C['forest-ink'],
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  gradeTextSelected: {
    color: C['cream-paper'],
  },
  sectionHeader: {
    paddingHorizontal: 2,
  },
  list: {
    gap: S.md,
  },
  subCard: {
    padding: S.md,
    gap: S.sm,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subCode: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: C['forest-ink'] + '80',
  },
  subName: {
    fontSize: 18,
    fontWeight: '800',
    color: C['forest-ink'],
  },
  unitsSection: {
    gap: 4,
    paddingTop: 4,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  unitNum: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: C['forest-ink'] + '80',
  },
  unitName: {
    fontSize: 13,
    color: C['forest-ink'],
  },
  subActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 6,
  },
});

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';
import { Card, Badge, MicroLabel, Button } from '../../src/components/ui';
import { C, R, S } from '../../src/styles/theme';
import { useRouter } from 'expo-router';

export default function MobileLibrary() {
  const router = useRouter();
  const { t, locale } = useMobileLanguage();
  const [selectedDoc, setSelectedDoc] = useState<any>({
    title: 'Grade 11 Mathematics Unit 1',
    status: 'READY',
    summary:
      'Covers laws of indices, standard form scientific notation, quadratic factorization, and practical applications in national curriculum.',
    pages: [1, 2, 3, 4],
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.heroCard}>
        <Badge size="sm">TEXTBOOK ARCHIVE</Badge>
        <Text style={styles.heroTitle}>{t.library.title}</Text>
        <Text style={styles.heroDesc}>
          Official NIE school textbooks and notes with chapter chunking, verified citations, and instant quiz generation.
        </Text>
      </Card>

      <View style={styles.sectionHeader}>
        <MicroLabel>INDEXED TEXTBOOK</MicroLabel>
      </View>

      <Card variant="mint" style={styles.docCard}>
        <View style={styles.docHeader}>
          <Badge size="sm">READY FOR LEARNING</Badge>
          <MicroLabel>PDF • 4 PAGES</MicroLabel>
        </View>

        <Text style={styles.docTitle}>{selectedDoc.title}</Text>

        <View style={styles.summaryBox}>
          <MicroLabel>CHAPTER SUMMARY</MicroLabel>
          <Text style={styles.summaryText}>{selectedDoc.summary}</Text>
        </View>

        <View style={styles.citationsBox}>
          <MicroLabel>VERIFIED CITATIONS</MicroLabel>
          <Text style={styles.citationsText}>
            Pages 1, 2, 3, 4 (Verified Sri Lankan Textbook Source)
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            variant="primary"
            size="sm"
            onPress={() => router.push('/(tabs)/study-room' as any)}
          >
            Chat with Document
          </Button>
          <Button
            variant="outline"
            size="sm"
            onPress={() => router.push('/(tabs)/practice' as any)}
          >
            Generate Quiz
          </Button>
        </View>
      </Card>
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
  sectionHeader: {
    paddingHorizontal: 2,
  },
  docCard: {
    padding: S.md,
    gap: S.sm,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C['forest-ink'],
    marginVertical: 4,
  },
  summaryBox: {
    gap: 4,
    backgroundColor: '#ffffff',
    padding: S.md,
    borderRadius: R.btn,
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
  },
  summaryText: {
    fontSize: 13,
    color: C['forest-ink'],
    lineHeight: 18,
  },
  citationsBox: {
    gap: 4,
    backgroundColor: C['highlighter-yellow'] + '33',
    padding: S.md,
    borderRadius: R.btn,
    borderWidth: 1,
    borderColor: C['highlighter-yellow'],
  },
  citationsText: {
    fontSize: 12,
    color: C['forest-ink'],
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
});

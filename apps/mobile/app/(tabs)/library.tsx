import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';

export default function MobileLibrary() {
  const { t } = useMobileLanguage();
  const [selectedDoc, setSelectedDoc] = useState<any>({
    title: 'Grade 9 Mathematics Unit 1',
    status: 'READY',
    summary: 'Covers laws of indices, standard form scientific notation, and practical applications in national curriculum.',
    pages: [1, 2, 3],
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.library.title}</Text>
        <Text style={styles.subtitle}>Textbooks and notes with AI extraction and verified citations.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>READY</Text>
        </View>
        <Text style={styles.docTitle}>{selectedDoc.title}</Text>
        <Text style={styles.summaryLabel}>{t.library.summary}:</Text>
        <Text style={styles.summaryText}>{selectedDoc.summary}</Text>

        <View style={styles.citationsBox}>
          <Text style={styles.citationsLabel}>{t.library.citations}:</Text>
          <Text style={styles.citationsText}>Pages: 1, 2, 3 (Verified Textbook Source)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 4 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#e2e8f0' },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  statusText: { color: '#065f46', fontSize: 10, fontWeight: '700' },
  docTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  summaryLabel: { fontSize: 12, fontWeight: '700', color: '#4f46e5', marginBottom: 4 },
  summaryText: { fontSize: 12, color: '#334155', lineHeight: 18, marginBottom: 14 },
  citationsBox: { backgroundColor: '#f1f5f9', padding: 10, borderRadius: 10 },
  citationsLabel: { fontSize: 11, fontWeight: '700', color: '#475569' },
  citationsText: { fontSize: 11, color: '#64748b', marginTop: 2 },
});

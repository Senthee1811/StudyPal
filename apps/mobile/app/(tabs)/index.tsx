import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';
import { useMobileAuth } from '../../src/context/auth-context';

export default function MobileDashboard() {
  const { t, locale, setLocale } = useMobileLanguage();
  const { user } = useMobileAuth();

  return (
    <ScrollView style={styles.container}>
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroBadge}>Sri Lanka National Curriculum</Text>
        <Text style={styles.heroTitle}>{t.common.appName}</Text>
        <Text style={styles.heroSubtitle}>{t.common.tagline}</Text>

        {/* Trilingual Language Selector */}
        <View style={styles.langRow}>
          <TouchableOpacity
            onPress={() => setLocale('si')}
            style={[styles.langBtn, locale === 'si' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, locale === 'si' && styles.langTextActive]}>
              සිංහල
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLocale('ta')}
            style={[styles.langBtn, locale === 'ta' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, locale === 'ta' && styles.langTextActive]}>
              தமிழ்
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLocale('en')}
            style={[styles.langBtn, locale === 'en' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, locale === 'en' && styles.langTextActive]}>
              English
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grade 9 Subjects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Curriculum Subjects (Grade 9)</Text>

        <View style={styles.card}>
          <Text style={styles.cardCode}>MATH-G9</Text>
          <Text style={styles.cardTitle}>
            {locale === 'si' ? 'ගණිතය (9 ශ්‍රේණිය)' : locale === 'ta' ? 'கணிதம்' : 'Mathematics'}
          </Text>
          <Text style={styles.cardDesc}>
            Indices, scientific notation, algebra, geometry theorems.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardCode}>GEO-G9</Text>
          <Text style={styles.cardTitle}>
            {locale === 'si'
              ? 'ශ්‍රී ලංකා භූගෝල විද්‍යාව'
              : locale === 'ta'
                ? 'இலங்கை புவியியல்'
                : 'Geography of Sri Lanka'}
          </Text>
          <Text style={styles.cardDesc}>
            Topography, climate zones, Mahaweli river, relief maps.
          </Text>
        </View>
      </View>

      {/* Minor Consent Banner */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>{t.auth.consentNotice}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  heroCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  heroBadge: { color: '#e0e7ff', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  heroTitle: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  heroSubtitle: { color: '#c7d2fe', fontSize: 13, marginTop: 4, lineHeight: 18 },
  langRow: { flexDirection: 'row', marginTop: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 3 },
  langBtn: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 9 },
  langBtnActive: { backgroundColor: '#ffffff' },
  langText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  langTextActive: { color: '#4f46e5' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardCode: { color: '#4f46e5', fontSize: 10, fontWeight: '800', marginBottom: 2 },
  cardTitle: { color: '#0f172a', fontSize: 15, fontWeight: '700' },
  cardDesc: { color: '#64748b', fontSize: 12, marginTop: 4 },
  noticeBox: { backgroundColor: '#eef2ff', padding: 14, borderRadius: 14, marginBottom: 30 },
  noticeText: { color: '#3730a3', fontSize: 11, lineHeight: 16, textAlign: 'center' },
});

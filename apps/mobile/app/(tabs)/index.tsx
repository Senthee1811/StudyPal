import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useMobileLanguage } from '../../src/context/language-context';
import { useMobileAuth } from '../../src/context/auth-context';
import {
  Button,
  Card,
  Badge,
  DisplayHeading,
  Highlight,
  Logo,
  MicroLabel,
} from '../../src/components/ui';
import { C, R, S } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MobileDashboard() {
  const router = useRouter();
  const { t, locale, setLocale } = useMobileLanguage();
  const { user } = useMobileAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top Bar with Logo & Trilingual Selector */}
      <View style={styles.topRow}>
        <Logo showWordmark={true} />

        <View style={styles.langPill}>
          {(['si', 'ta', 'en'] as const).map((l) => (
            <TouchableOpacity
              key={l}
              onPress={() => setLocale(l)}
              style={[styles.langBtn, locale === l && styles.langBtnActive]}
            >
              <Text style={[styles.langText, locale === l && styles.langTextActive]}>
                {l === 'si' ? 'සිං' : l === 'ta' ? 'த' : 'EN'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hero Welcome Card */}
      <Card style={styles.heroCard}>
        <Badge size="sm">
          <Text>NIE SRI LANKA CURRICULUM</Text>
        </Badge>

        <Text style={styles.heroTitle}>
          {locale === 'si' ? (
            <>
              ඔබේ විෂය නිර්දේශය <Highlight>AI සහායකයෙකු</Highlight> සමඟ ඉගෙන ගන්න
            </>
          ) : locale === 'ta' ? (
            <>
              உங்கள் பாடத்திட்டத்தை <Highlight>AI துணையுடன்</Highlight> கற்கவும்
            </>
          ) : (
            <>
              Master your syllabus with <Highlight>StudyPal AI</Highlight>
            </>
          )}
        </Text>

        <Text style={styles.heroSubtitle}>{t.common.tagline}</Text>

        <View style={styles.heroCtaRow}>
          <Button
            variant="primary"
            size="sm"
            onPress={() => router.push('/(tabs)/study-room' as any)}
          >
            Open Study Room
          </Button>
          <Button
            variant="outline"
            size="sm"
            onPress={() => router.push('/(tabs)/practice' as any)}
          >
            Practice
          </Button>
        </View>
      </Card>

      {/* Daily Plan & Nudge Pastel Cards */}
      <View style={styles.sectionHeader}>
        <MicroLabel>TODAY'S STUDY PLAN</MicroLabel>
        <Text style={styles.streakText}>🔥 5 Day Streak</Text>
      </View>

      {/* Mint Card: Mathematics Plan */}
      <Card variant="mint" style={styles.pastelCard}>
        <View style={styles.cardHeader}>
          <Badge size="sm">DAILY FOCUS</Badge>
          <Ionicons name="compass-outline" size={16} color={C['forest-ink']} />
        </View>
        <Text style={styles.cardTitle}>Grade {user?.grade || 11} Mathematics</Text>
        <Text style={styles.cardBody}>
          Quadratic equations & factorization. 3 learning outcomes scheduled today.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/practice' as any)}
          style={styles.cardAction}
        >
          <Text style={styles.actionText}>Start Practice →</Text>
        </TouchableOpacity>
      </Card>

      {/* Teal Card: Science Unit */}
      <Card variant="teal" style={styles.pastelCard}>
        <View style={styles.cardHeader}>
          <Badge size="sm">CONTINUE LEARNING</Badge>
          <Ionicons name="time-outline" size={16} color={C['forest-ink']} />
        </View>
        <Text style={styles.cardTitle}>Science • Unit 4: Ecosystems</Text>
        <Text style={styles.cardBody}>
          Page 42 of 88. AI tutor notes and flashcards ready for review.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/study-room' as any)}
          style={styles.cardAction}
        >
          <Text style={styles.actionText}>Resume Reading →</Text>
        </TouchableOpacity>
      </Card>

      {/* Blush Card: History Nudge */}
      <Card variant="blush" style={styles.pastelCard}>
        <View style={styles.cardHeader}>
          <Badge size="sm">REVISION NUDGE</Badge>
          <Ionicons name="alert-circle-outline" size={16} color={C['forest-ink']} />
        </View>
        <Text style={styles.cardTitle}>History • Ancient Kingdoms</Text>
        <Text style={styles.cardBody}>
          Mastery dropped to 48% on Irrigation Systems. Recommended 10-min review.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/practice' as any)}
          style={styles.cardAction}
        >
          <Text style={styles.actionText}>Review Now →</Text>
        </TouchableOpacity>
      </Card>

      {/* 7 Workspaces Quick Grid */}
      <View style={styles.sectionHeader}>
        <MicroLabel>ALL WORKSPACES</MicroLabel>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/curriculum' as any)}
          style={styles.gridItem}
        >
          <Ionicons name="layers-outline" size={24} color={C['forest-ink']} />
          <Text style={styles.gridTitle}>Curriculum</Text>
          <Text style={styles.gridSubtitle}>Grade 6–13 NIE Tree</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/library' as any)}
          style={styles.gridItem}
        >
          <Ionicons name="book-outline" size={24} color={C['forest-ink']} />
          <Text style={styles.gridTitle}>Library</Text>
          <Text style={styles.gridSubtitle}>Textbooks & Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/study-room' as any)}
          style={styles.gridItem}
        >
          <Ionicons name="sparkles-outline" size={24} color={C['forest-ink']} />
          <Text style={styles.gridTitle}>Study Room</Text>
          <Text style={styles.gridSubtitle}>Chat & Voice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/practice' as any)}
          style={styles.gridItem}
        >
          <Ionicons name="school-outline" size={24} color={C['forest-ink']} />
          <Text style={styles.gridTitle}>Practice</Text>
          <Text style={styles.gridSubtitle}>Timed Mock Papers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/map-lab' as any)}
          style={styles.gridItem}
        >
          <Ionicons name="map-outline" size={24} color={C['forest-ink']} />
          <Text style={styles.gridTitle}>Map Lab</Text>
          <Text style={styles.gridSubtitle}>Sri Lanka Geography</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/progress' as any)}
          style={styles.gridItem}
        >
          <Ionicons name="trending-up-outline" size={24} color={C['forest-ink']} />
          <Text style={styles.gridTitle}>Progress</Text>
          <Text style={styles.gridSubtitle}>Mastery Heatmap</Text>
        </TouchableOpacity>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: S.xs,
  },
  langPill: {
    flexDirection: 'row',
    backgroundColor: C['whisper-gray'],
    borderRadius: R.tag,
    padding: 2,
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: R.tag,
  },
  langBtnActive: {
    backgroundColor: C['cream-paper'],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: C['forest-ink'] + '99',
  },
  langTextActive: {
    color: C['forest-ink'],
  },
  heroCard: {
    padding: S.md,
    gap: S.sm,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C['forest-ink'],
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 13,
    color: C['forest-ink'] + 'B3', // 70% opacity
    lineHeight: 18,
  },
  heroCtaRow: {
    flexDirection: 'row',
    gap: S.sm,
    paddingTop: S.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: C['forest-ink'],
  },
  pastelCard: {
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  cardBody: {
    fontSize: 13,
    color: C['forest-ink'] + 'CC',
    lineHeight: 18,
  },
  cardAction: {
    paddingTop: 4,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: S.sm,
  },
  gridItem: {
    width: '48%',
    backgroundColor: C['cream-paper'],
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
    borderRadius: R.card,
    padding: S.md,
    gap: 4,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C['forest-ink'],
    marginTop: 4,
  },
  gridSubtitle: {
    fontSize: 11,
    color: C['forest-ink'] + '80',
  },
});

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';
import { Card, Badge, MicroLabel, Button } from '../../src/components/ui';
import { C, R, S } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MobileMapLab() {
  const { t, locale } = useMobileLanguage();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'mahaweli',
      name:
        locale === 'si'
          ? 'මහවැලි ගඟ'
          : locale === 'ta'
          ? 'மகாவலி நதி'
          : 'Mahaweli River',
      type: 'River',
      lat: 8.46,
      lng: 81.23,
      desc: 'Longest river in Sri Lanka (335 km), originating from Horton Plains.',
    },
    {
      id: 'pidurutalagala',
      name:
        locale === 'si'
          ? 'පිදුරුතලාගල කන්ද'
          : locale === 'ta'
          ? 'பிதுருதலாகலை'
          : 'Mount Pidurutalagala',
      type: 'Mountain Peak',
      lat: 7.001,
      lng: 80.774,
      desc: 'Highest mountain peak in Sri Lanka (2,524 m).',
    },
    {
      id: 'parakrama',
      name:
        locale === 'si'
          ? 'පරාක්‍රම සමුද්‍රය'
          : locale === 'ta'
          ? 'பராக்கிரம சமுத்திரம்'
          : 'Parakrama Samudra',
      type: 'Reservoir (Wewa)',
      lat: 7.935,
      lng: 81.002,
      desc: 'Ancient reservoir constructed by King Parakramabahu I in Polonnaruwa.',
    },
    {
      id: 'trinco',
      name:
        locale === 'si'
          ? 'ත්‍රිකුණාමලය වරාය'
          : locale === 'ta'
          ? 'திருகோணமலை துறைமுகம்'
          : 'Port of Trincomalee',
      type: 'Natural Harbour',
      lat: 8.567,
      lng: 81.233,
      desc: 'One of the finest natural deep-water harbours in the world.',
    },
  ];

  const handlePinpoint = (name: string, lat: number, lng: number) => {
    setSelectedFeature(name);
    Alert.alert(
      name,
      `Location Coordinates: [${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E]\n\nPin placed accurately for Grade 10-11 O/L Geography syllabus.`,
      [{ text: 'Continue Practice' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top Banner */}
      <Card style={styles.heroCard}>
        <Badge size="sm">SRI LANKA MAP LAB</Badge>
        <Text style={styles.heroTitle}>
          {locale === 'si'
            ? 'ශ්‍රී ලංකා සිතියම් අභ්‍යාස (සා/පෙ)'
            : locale === 'ta'
            ? 'இலங்கை வரைபட பயிற்சி (ச/த)'
            : 'Sri Lanka Map Exercises (O/L)'}
        </Text>
        <Text style={styles.heroDesc}>
          Test your topographical knowledge on essential rivers, mountains, ancient reservoirs,
          and ports mapped to the National Curriculum.
        </Text>
      </Card>

      <View style={styles.sectionHeader}>
        <MicroLabel>ESSENTIAL SYLLABUS FEATURES ({features.length})</MicroLabel>
      </View>

      {/* Feature List */}
      <View style={styles.list}>
        {features.map((feat) => {
          const isSelected = selectedFeature === feat.name;
          return (
            <Card
              key={feat.id}
              style={[styles.featureCard, isSelected && styles.featureCardSelected]}
            >
              <View style={styles.cardTop}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{feat.type}</Text>
                </View>
                <Text style={styles.coordText}>
                  {feat.lat.toFixed(2)}°N, {feat.lng.toFixed(2)}°E
                </Text>
              </View>

              <Text style={styles.featureTitle}>{feat.name}</Text>
              <Text style={styles.featureDesc}>{feat.desc}</Text>

              <View style={styles.actionRow}>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={() => handlePinpoint(feat.name, feat.lat, feat.lng)}
                >
                  Pinpoint on Map
                </Button>
              </View>
            </Card>
          );
        })}
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
    color: C['forest-ink'] + 'B3',
    lineHeight: 18,
  },
  sectionHeader: {
    paddingHorizontal: 2,
  },
  list: {
    gap: S.sm,
  },
  featureCard: {
    gap: S.sm,
  },
  featureCardSelected: {
    borderColor: C['forest-ink'],
    backgroundColor: C['highlighter-yellow'] + '20',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    backgroundColor: C.terracotta + '25',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: R.tag,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.terracotta,
    textTransform: 'uppercase',
  },
  coordText: {
    fontSize: 11,
    color: C['forest-ink'] + '80',
    fontFamily: 'monospace',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C['forest-ink'],
  },
  featureDesc: {
    fontSize: 13,
    color: C['forest-ink'] + 'CC',
    lineHeight: 18,
  },
  actionRow: {
    paddingTop: 4,
    alignItems: 'flex-start',
  },
});

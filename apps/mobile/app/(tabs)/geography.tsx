import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMobileLanguage } from '../../src/context/language-context';

export default function MobileGeography() {
  const { t, locale } = useMobileLanguage();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // TODO(phase-2): Integrate native MapView (react-native-maps) or WebView Leaflet on mobile.
  // Leaflet is active on web (apps/web/src/app/geography/page.tsx).

  const features = [
    {
      id: 'mahaweli',
      name:
        locale === 'si'
          ? 'මහවැලි ගඟ'
          : locale === 'ta'
            ? 'மகாவலி நதி'
            : 'Mahaweli River',
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
      lat: 7.001,
      lng: 80.774,
      desc: 'Highest mountain peak in Sri Lanka (2,524 m).',
    },
    {
      id: 'adams_peak',
      name:
        locale === 'si'
          ? 'ශ්‍රී පාදය (සමනල කන්ද)'
          : locale === 'ta'
            ? 'சிவனொளிபாதமலை'
            : "Adam's Peak (Sri Pada)",
      lat: 6.809,
      lng: 80.499,
      desc: 'Sacred mountain summit (2,243 m) with historical and cultural significance.',
    },
  ];

  const handlePinpoint = (name: string, lat: number, lng: number) => {
    setSelectedFeature(name);
    Alert.alert(
      name,
      `Coordinates: [${lat.toFixed(3)}, ${lng.toFixed(3)}]\n\nMobile map pinpoint recorded. Check web portal for interactive Leaflet polygon tracing.`,
      [{ text: 'OK' }],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.geography.title}</Text>
        <Text style={styles.subtitle}>{t.geography.mapInstructions}</Text>
      </View>

      {/* Map Graphic & Stub Notice */}
      <View style={styles.mapStubCard}>
        <View style={styles.stubBadge}>
          <Text style={styles.stubBadgeText}>MOBILE STUB • TODO(phase-2)</Text>
        </View>
        <Text style={styles.mapStubTitle}>Sri Lanka Topography & Relief Map</Text>
        <Text style={styles.mapStubNotice}>
          Interactive Leaflet map is available on Web. Select a geographic feature below to pinpoint coordinates on mobile.
        </Text>

        <View style={styles.mapOutlineBox}>
          <Text style={styles.mapPlaceholderGraphic}>🗺️ [Sri Lanka Relief Grid 5°N - 10°N]</Text>
          {selectedFeature && (
            <Text style={styles.activePinText}>📍 Selected: {selectedFeature}</Text>
          )}
        </View>
      </View>

      {/* Feature Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.geography.locateFeature}</Text>
        {features.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.featureCard,
              selectedFeature === f.name && styles.featureCardSelected,
            ]}
            onPress={() => handlePinpoint(f.name, f.lat, f.lng)}
          >
            <View style={styles.featureHeader}>
              <Text style={styles.featureName}>{f.name}</Text>
              <Text style={styles.coordText}>
                {f.lat.toFixed(2)}°N, {f.lng.toFixed(2)}°E
              </Text>
            </View>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </TouchableOpacity>
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
  mapStubCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stubBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  stubBadgeText: { color: '#b45309', fontSize: 10, fontWeight: '800' },
  mapStubTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  mapStubNotice: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 18 },
  mapOutlineBox: {
    backgroundColor: '#f1f5f9',
    height: 160,
    borderRadius: 14,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
  },
  mapPlaceholderGraphic: { fontSize: 14, fontWeight: '700', color: '#475569' },
  activePinText: { marginTop: 8, fontSize: 12, fontWeight: '700', color: '#4f46e5' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureCardSelected: { borderColor: '#4f46e5', backgroundColor: '#eef2ff' },
  featureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featureName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  coordText: { fontSize: 11, color: '#4f46e5', fontWeight: '700' },
  featureDesc: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 16 },
});

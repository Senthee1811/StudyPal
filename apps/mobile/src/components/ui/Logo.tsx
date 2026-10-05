import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { C } from '../../styles/theme';

export interface LogoProps extends ViewProps {
  showWordmark?: boolean;
}

export function Logo({ showWordmark = true, style, ...props }: LogoProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.square}>
        <Text style={styles.monogram}>S</Text>
      </View>
      {showWordmark && (
        <View style={styles.wordmarkContainer}>
          <Text style={styles.wordmark}>StudyPal</Text>
          <Text style={styles.edition}>Sri Lanka</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  square: {
    width: 36,
    height: 36,
    backgroundColor: C['highlighter-yellow'],
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C['forest-ink'] + '20',
  },
  monogram: {
    color: C['forest-ink'],
    fontWeight: '900',
    fontSize: 22,
    lineHeight: 26,
  },
  wordmarkContainer: {
    flexDirection: 'column',
  },
  wordmark: {
    color: C['forest-ink'],
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  edition: {
    color: C['forest-ink'] + '80',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

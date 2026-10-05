import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { C, R, S } from '../../styles/theme';

export type CardVariant = 'default' | 'mint' | 'teal' | 'blush' | 'bordered';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
}

export function Card({ variant = 'default', children, style, ...props }: CardProps) {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'mint':
        return styles.mint;
      case 'teal':
        return styles.teal;
      case 'blush':
        return styles.blush;
      case 'bordered':
        return styles.bordered;
      case 'default':
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: R.card,
    padding: S.md,
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D', // 30% opacity
  },
  default: {
    backgroundColor: C['cream-paper'],
  },
  mint: {
    backgroundColor: C['sticky-mint'],
  },
  teal: {
    backgroundColor: C['sticky-teal'],
  },
  blush: {
    backgroundColor: C['sticky-blush'],
  },
  bordered: {
    backgroundColor: 'transparent',
    borderColor: C['forest-ink'] + '33',
  },
});

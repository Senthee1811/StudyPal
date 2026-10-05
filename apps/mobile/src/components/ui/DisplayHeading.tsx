import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';
import { C } from '../../styles/theme';

export interface DisplayHeadingProps extends TextProps {
  size?: 'heading' | 'display-sm' | 'display' | 'display-lg';
  children: React.ReactNode;
}

export function DisplayHeading({
  size = 'display',
  children,
  style,
  ...props
}: DisplayHeadingProps) {
  const getSizeStyle = (): TextStyle => {
    switch (size) {
      case 'heading':
        return styles.heading;
      case 'display-sm':
        return styles.displaySm;
      case 'display-lg':
        return styles.displayLg;
      case 'display':
      default:
        return styles.display;
    }
  };

  return (
    <Text style={[styles.base, getSizeStyle(), style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: C['forest-ink'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 26,
    lineHeight: 30,
  },
  displaySm: {
    fontSize: 32,
    lineHeight: 36,
  },
  display: {
    fontSize: 38,
    lineHeight: 40,
  },
  displayLg: {
    fontSize: 48,
    lineHeight: 50,
  },
});

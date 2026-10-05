import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { C } from '../../styles/theme';

export function MicroLabel({ children, style, ...props }: TextProps) {
  return (
    <Text style={[styles.micro, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  micro: {
    color: C['forest-ink'] + '99',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

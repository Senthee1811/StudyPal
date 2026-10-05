import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { C } from '../../styles/theme';

export function Highlight({ children, style, ...props }: TextProps) {
  return (
    <Text style={[styles.highlight, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: C['highlighter-yellow'] + '99', // 60% opacity
    color: C['forest-ink'],
    paddingHorizontal: 4,
    borderRadius: 3,
  },
});

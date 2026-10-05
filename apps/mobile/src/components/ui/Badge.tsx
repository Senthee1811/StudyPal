import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { C, R } from '../../styles/theme';

export interface BadgeProps extends ViewProps {
  size?: 'default' | 'sm';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Badge({ size = 'default', icon, children, style, ...props }: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        size === 'sm' ? styles.smContainer : styles.defaultContainer,
        style,
      ]}
      {...props}
    >
      {icon}
      <Text style={[styles.text, size === 'sm' ? styles.smText : styles.defaultText]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C['highlighter-yellow'],
    borderRadius: R.tag,
    alignSelf: 'flex-start',
    gap: 6,
  },
  defaultContainer: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  smContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    color: C['forest-ink'],
    fontWeight: '600',
  },
  defaultText: {
    fontSize: 12,
  },
  smText: {
    fontSize: 11,
  },
});

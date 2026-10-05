import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { C, R, S } from '../../styles/theme';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'outline' | 'mint' | 'teal' | 'blush';
  size?: 'default' | 'sm';
  showArrow?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'default',
  showArrow = true,
  children,
  style,
  ...props
}: ButtonProps) {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'outline':
        return styles.outlineContainer;
      case 'mint':
        return styles.mintContainer;
      case 'teal':
        return styles.tealContainer;
      case 'blush':
        return styles.blushContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'outline':
      case 'mint':
      case 'teal':
      case 'blush':
      default:
        return styles.darkText;
    }
  };

  const sizeStyle: ViewStyle = size === 'sm' ? styles.smContainer : styles.defaultContainer;
  const textSizeStyle: TextStyle = size === 'sm' ? styles.smText : styles.defaultText;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.base, getContainerStyle(), sizeStyle, style]}
      {...props}
    >
      <Text style={[styles.baseText, getTextStyle(), textSizeStyle]}>{children}</Text>
      {showArrow && variant === 'primary' && (
        <Text style={[styles.arrowText, getTextStyle(), textSizeStyle]}>→</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: R.btn,
    gap: 8,
  },
  defaultContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  smContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  primaryContainer: {
    backgroundColor: C['forest-ink'],
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C['forest-ink'],
  },
  mintContainer: {
    backgroundColor: C['sticky-mint'],
  },
  tealContainer: {
    backgroundColor: C['sticky-teal'],
  },
  blushContainer: {
    backgroundColor: C['sticky-blush'],
  },
  baseText: {
    fontWeight: '600',
  },
  defaultText: {
    fontSize: 15,
  },
  smText: {
    fontSize: 13,
  },
  primaryText: {
    color: C['cream-paper'],
  },
  darkText: {
    color: C['forest-ink'],
  },
  arrowText: {
    marginLeft: 2,
    fontWeight: '700',
  },
});

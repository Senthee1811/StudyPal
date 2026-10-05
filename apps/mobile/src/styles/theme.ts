// ============================================================================
// StudyPal — Shared Mobile Style Constants ("Say Briefly" Design System)
// ============================================================================
// React Native StyleSheet-compatible constants derived from @studypal/ui-tokens.
// ============================================================================

import { StyleSheet } from 'react-native';
import {
  colors,
  spacingNum,
  borderRadiusNum,
  nativeFonts,
} from '@studypal/ui-tokens';

/** Core color constants for direct use in StyleSheet */
export const C = colors;

/** Spacing constants (numeric px values) */
export const S = spacingNum;

/** Border radius constants */
export const R = borderRadiusNum;

/** Font names for React Native */
export const F = nativeFonts;

/** Common reusable styles */
export const commonStyles = StyleSheet.create({
  // ── Containers ──
  screen: {
    flex: 1,
    backgroundColor: C['cream-paper'],
    padding: S.sm,
  },

  // ── Cards ──
  card: {
    backgroundColor: C['cream-paper'],
    borderRadius: R.card,
    padding: S.md,
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D', // 30% opacity
  },
  cardMint: {
    backgroundColor: C['sticky-mint'],
    borderRadius: R.card,
    padding: S.md,
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
  },
  cardTeal: {
    backgroundColor: C['sticky-teal'],
    borderRadius: R.card,
    padding: S.md,
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
  },
  cardBlush: {
    backgroundColor: C['sticky-blush'],
    borderRadius: R.card,
    padding: S.md,
    borderWidth: 1,
    borderColor: C['pencil-gray'] + '4D',
  },

  // ── Buttons ──
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 19,
    paddingVertical: 10,
    backgroundColor: C['forest-ink'],
    borderRadius: R.btn,
  },
  btnPrimaryText: {
    color: C['cream-paper'],
    fontSize: 16,
    fontWeight: '500',
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 19,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: R.btn,
    borderWidth: 1,
    borderColor: C['forest-ink'],
  },
  btnOutlineText: {
    color: C['forest-ink'],
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Badge ──
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: C['highlighter-yellow'],
    borderRadius: R.tag,
  },
  badgeText: {
    color: C['forest-ink'],
    fontSize: 12,
    fontWeight: '500',
  },

  // ── Typography ──
  textDisplay: {
    color: C['forest-ink'],
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 1.6, // 0.04em at 40px
    lineHeight: 40,
  },
  textHeadingSm: {
    color: C['forest-ink'],
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  textBody: {
    color: C['forest-ink'],
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 27,
  },
  textBodySm: {
    color: C['forest-ink'],
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  textCaption: {
    color: C['forest-ink'] + '99', // 60% opacity
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  textMicro: {
    color: C['forest-ink'] + '99',
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
    letterSpacing: 0.22,
  },

  // ── Highlight wash ──
  highlight: {
    backgroundColor: C['highlighter-yellow'] + '66', // 40% opacity
    paddingHorizontal: 4,
    borderRadius: 2,
  },

  // ── Dividers ──
  hairline: {
    height: 1,
    backgroundColor: C['pencil-gray'] + '4D',
  },
});

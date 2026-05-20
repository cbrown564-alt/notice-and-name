// EmptyState Component
// Contextual empty states with illustration, copy, and optional CTA

import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from './Typography';

export interface EmptyStateProps {
  /** Primary headline */
  title: string;
  /** Descriptive body text */
  message: string;
  /** Optional illustration image */
  illustration?: ImageSourcePropType;
  /** Optional fallback icon name */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Optional CTA button text */
  actionLabel?: string;
  /** CTA press handler */
  onAction?: () => void;
  /** Vertical padding override */
  paddingVertical?: number;
}

export function EmptyState({
  title,
  message,
  illustration,
  icon,
  actionLabel,
  onAction,
  paddingVertical = spacing['3xl'],
}: EmptyStateProps) {
  return (
    <View style={[styles.container, { paddingVertical }]}>
      {illustration ? (
        <Image
          source={illustration}
          style={styles.illustration}
          resizeMode="contain"
        />
      ) : icon ? (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={32} color={colors.primary[300]} />
        </View>
      ) : null}

      <Text variant="h3" align="center" style={styles.title}>
        {title}
      </Text>

      <Text variant="body" align="center" color={colors.text.secondary} style={styles.message}>
        {message}
      </Text>

      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction} activeOpacity={0.8}>
          <Text variant="bodyBold" color={colors.primary[600]}>
            {actionLabel}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.primary[600]}
            style={{ marginLeft: spacing.xs }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  illustration: {
    width: 120,
    height: 120,
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  title: {
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  message: {
    maxWidth: 280,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
});

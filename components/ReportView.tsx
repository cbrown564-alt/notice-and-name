import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/theme';
import { LiteracyReportData } from '@/lib/literacyReport';

interface ReportViewProps {
  report: LiteracyReportData;
}

export function ReportView({ report }: ReportViewProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary[700], colors.primary[900], colors.secondary[900]]}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text variant="labelSmall" color={colors.primary[200]} style={styles.eyebrow}>
          PLEASURE LITERACY REPORT
        </Text>
        <Text variant="h1" color={colors.text.inverse} style={styles.levelTitle}>
          {report.literacyLevel.label}
        </Text>
        <Text variant="body" color={colors.primary[100]} style={styles.levelDesc}>
          {report.literacyLevel.description}
        </Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text variant="h2" color={colors.primary[700]}>{report.exploredCount}</Text>
          <Text variant="caption" color={colors.text.tertiary}>Explored</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text variant="h2" color={colors.primary[700]}>{report.resonatesCount}</Text>
          <Text variant="caption" color={colors.text.tertiary}>Resonate</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text variant="h2" color={colors.primary[700]}>{report.progressPercent}%</Text>
          <Text variant="caption" color={colors.text.tertiary}>Complete</Text>
        </View>
      </View>

      {report.patternPoetry && (
        <View style={styles.poetryBox}>
          <Text variant="labelSmall" color={colors.text.tertiary} style={styles.sectionLabel}>
            YOUR PATTERN
          </Text>
          <Text variant="body" color={colors.text.primary} style={styles.poetryText}>
            You're drawn to {report.patternPoetry}.
          </Text>
        </View>
      )}

      {report.topConcepts.length > 0 && (
        <View style={styles.conceptsSection}>
          <Text variant="labelSmall" color={colors.text.tertiary} style={styles.sectionLabel}>
            CONCEPTS THAT RESONATE
          </Text>
          {report.topConcepts.map((concept) => (
            <View key={concept.id} style={styles.conceptChip}>
              <Text variant="bodyBold" color={colors.primary[800]}>{concept.name}</Text>
            </View>
          ))}
        </View>
      )}

      {report.streakDays > 0 && (
        <View style={styles.streakBox}>
          <Text variant="body" color={colors.text.secondary} style={{ fontStyle: 'italic' }}>
            {report.streakDays} day{report.streakDays === 1 ? '' : 's'} of curiosity and exploration.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  hero: {
    padding: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['2xl'],
  },
  eyebrow: {
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  levelTitle: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  levelDesc: {
    fontStyle: 'italic',
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.primary,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.neutral[200],
  },
  poetryBox: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  sectionLabel: {
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  poetryText: {
    fontStyle: 'italic',
    lineHeight: 26,
    fontSize: 17,
  },
  conceptsSection: {
    padding: spacing.lg,
    paddingTop: 0,
    gap: spacing.sm,
  },
  conceptChip: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[400],
  },
  streakBox: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: spacing.xl,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReportView } from '@/components/ReportView';
import { Button, EmptyState, Text, ThemedView } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { buildLiteracyReport, formatReportAsText } from '@/lib/literacyReport';
import { useStats, useStreaks, useUserConcepts } from '@/hooks/useDatabase';
import { logger } from '@/lib/logger';

export default function LiteracyReportScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts } = useUserConcepts();
  const { exploredCount, resonatesCount } = useStats();
  const { streak } = useStreaks();
  const [sharing, setSharing] = useState(false);

  const report = useMemo(
    () => buildLiteracyReport(userConcepts, exploredCount, resonatesCount, streak),
    [userConcepts, exploredCount, resonatesCount, streak]
  );

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await Share.share({
        message: formatReportAsText(report),
        ...(Platform.OS === 'ios' ? { title: 'My Pleasure Literacy Report' } : {}),
      });
    } catch (error) {
      logger.error('LiteracyReport', 'Share failed', error);
    } finally {
      setSharing(false);
    }
  };

  const hasData = exploredCount > 0;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <Text variant="h1">Literacy Report</Text>
          <Text variant="body" color={colors.text.secondary}>
            Your journey of discovery, beautifully summarized
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!hasData ? (
          <EmptyState
            title="Your report is waiting"
            message="Explore a few concepts to generate your Pleasure Literacy Report."
            icon="document-text-outline"
            actionLabel="Explore Library"
            onAction={() => router.push('/(tabs)/library')}
          />
        ) : (
          <>
            <ReportView report={report} />
            <View style={styles.shareSection}>
              <Button
                title={sharing ? 'Opening share…' : 'Share Report'}
                onPress={handleShare}
                disabled={sharing}
                variant="primary"
                fullWidth
              />
              <Text variant="caption" color={colors.text.tertiary} style={styles.shareHint}>
                Exports as plain text — share when it feels right
              </Text>
            </View>
          </>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.md,
  },
  headerTitleRow: {
    gap: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  shareSection: {
    marginTop: spacing.xl,
  },
  shareHint: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

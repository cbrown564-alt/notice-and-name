import { Card, EmptyState, Text, ThemedView } from '@/components/ui';
import { AuraVisualization } from '@/components/profile/AuraVisualization';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { concepts, getConceptById } from '@/data/vocabulary';
import { useOnboarding, useStats, useStreaks, useUserConcepts } from '@/hooks/useDatabase';
import { getLiteracyLevel, getStreakMessage } from '@/lib/streaks';
import { ConceptCategory } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const goalLabels: Record<string, string> = {
  self_discovery: 'Self-discovery',
  partner_communication: 'Partner communication',
  expanding_knowledge: 'Expanding knowledge',
};

const categoryLabels: Record<ConceptCategory, string> = {
  technique: 'Techniques',
  sensation: 'Sensations',
  timing: 'Timing & Pacing',
  psychological: 'Psychological',
  anatomy: 'Anatomy',
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technique': return require('@/assets/images/ui/category-technique.png');
    case 'sensation': return require('@/assets/images/ui/category-sensation.png');
    case 'timing': return require('@/assets/images/ui/category-timing.png');
    case 'psychological': return require('@/assets/images/ui/category-psychological.png');
    case 'anatomy': return require('@/assets/images/ui/category-anatomy.png');
    default: return null;
  }
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { concepts: userConcepts, reload: reloadConcepts } = useUserConcepts();
  const { goal } = useOnboarding();
  const { exploredCount, resonatesCount, reload: reloadStats } = useStats();
  const { streak, reload: reloadStreak } = useStreaks();

  useFocusEffect(
    useCallback(() => {
      reloadConcepts();
      reloadStats();
      reloadStreak();
    }, [reloadConcepts, reloadStats, reloadStreak])
  );

  const literacyLevel = useMemo(
    () => getLiteracyLevel(exploredCount, concepts.length),
    [exploredCount]
  );

  const totalCount = concepts.length;
  const progress = totalCount > 0 ? exploredCount / totalCount : 0;

  // Resonating concepts — memoized to stabilize downstream insights
  const resonatesConcepts = useMemo(
    () => userConcepts.filter((c) => c.status === 'resonates'),
    [userConcepts]
  );

  // Calculate category counts from ALL explored concepts (for aura visualization)
  const exploredCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    userConcepts
      .filter((uc) => uc.status !== 'unexplored')
      .forEach((uc) => {
        const concept = getConceptById(uc.concept_id);
        if (concept) {
          counts[concept.category] = (counts[concept.category] || 0) + 1;
        }
      });
    return counts;
  }, [userConcepts]);

  // Calculate pattern insights
  const patternInsights = useMemo(() => {
    if (resonatesConcepts.length < 2) return null;

    const categoryCounts: Record<string, number> = {};
    resonatesConcepts.forEach((uc) => {
      const concept = getConceptById(uc.concept_id);
      if (concept) {
        categoryCounts[concept.category] = (categoryCounts[concept.category] || 0) + 1;
      }
    });

    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .filter(([, count]) => count >= 1);

    if (sortedCategories.length === 0) return null;

    const topCategory = sortedCategories[0][0] as ConceptCategory;
    const topCategoryCount = sortedCategories[0][1];

    return { topCategory, topCategoryCount };
  }, [resonatesConcepts]);

  return (
    <ThemedView colorKey="primary" style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="h1" style={styles.pageTitle}>Your Profile</Text>
            <Text variant="body" color={colors.text.secondary}>Your journey of discovery</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/modal')} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Aura Visualization */}
        {exploredCount > 0 && (
          <View style={styles.auraContainer}>
            <AuraVisualization
              categoryCounts={exploredCategoryCounts}
              totalExplored={exploredCount}
              size={180}
            />
          </View>
        )}

        {/* Literacy Level Banner */}
        <View style={styles.levelBanner}>
          <View style={styles.levelBadge}>
            <Text variant="labelSmall" color={colors.primary[700]} style={{ letterSpacing: 1 }}>
              {literacyLevel.label.toUpperCase()}
            </Text>
          </View>
          <Text variant="body" color={colors.text.secondary} style={{ marginTop: spacing.xs }}>
            {literacyLevel.description}
          </Text>
          {literacyLevel.nextThreshold !== null && (
            <Text variant="caption" color={colors.text.tertiary} style={{ marginTop: 2 }}>
              {literacyLevel.nextThreshold - exploredCount} more concept{literacyLevel.nextThreshold - exploredCount === 1 ? '' : 's'} to the next level
            </Text>
          )}
        </View>

        {/* 2. Core Vitals (Bento Box) */}
        <View style={styles.bentoContainer}>
          {/* Left Column: Big Progress */}
          <Card variant="filled" style={styles.bentoBig}>
            <View style={styles.bentoIconWrapper}>
              <Image
                source={require('@/assets/images/ui/profile/stat-explored.png')}
                style={styles.bentoImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.bentoContentBig}>
              <Text variant="h1" color={colors.secondary[800]} style={{ fontSize: 42 }}>{exploredCount}</Text>
              <Text variant="bodyBold" color={colors.secondary[600]}>Explored</Text>
              <Text variant="caption" color={colors.text.primary} style={{ marginTop: 4, opacity: 0.7 }}>
                {Math.round(progress * 100)}% of library
              </Text>
            </View>
          </Card>

          {/* Right Column: Stack */}
          <View style={styles.bentoStack}>
            {/* Resonates */}
            <Card variant="elevated" style={styles.bentoSmall}>
              <View style={styles.rowCentered}>
                <View style={styles.bentoIconWrapperSmall}>
                  <Image
                    source={require('@/assets/images/ui/profile/stat-resonates.png')}
                    style={styles.bentoImageSmall}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="h3" color={colors.primary[700]}>{resonatesCount}</Text>
                  <Text variant="caption">resonates</Text>
                </View>
              </View>
            </Card>

            {/* Streak */}
            <Card variant="outlined" style={styles.bentoSmall}>
              <View style={styles.rowCentered}>
                <View style={[styles.bentoIconWrapperSmall, { backgroundColor: colors.primary[50], borderRadius: 28, alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons
                    name={streak?.isPaused ? 'pause-circle' : streak && streak.currentStreak > 0 ? 'flame' : 'sunny-outline'}
                    size={24}
                    color={streak?.isPaused ? colors.text.tertiary : colors.primary[500]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="h3" color={colors.primary[700]}>
                    {streak?.currentStreak ?? 0}
                  </Text>
                  <Text variant="caption">day streak</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

        {/* Streak Message */}
        {streak && (
          <View style={styles.streakMessageBox}>
            <Text variant="body" color={colors.text.secondary} style={{ fontStyle: 'italic' }}>
              {getStreakMessage(streak)}
            </Text>
          </View>
        )}

        {/* 3. Insight Spotlight */}
        {patternInsights && (
          <TouchableOpacity style={styles.insightWrapper} activeOpacity={0.9} onPress={() => router.push('/(tabs)/library')}>
            <LinearGradient
              colors={[colors.primary[600], colors.primary[800]]}
              style={styles.insightBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.insightContent}>
                <View style={styles.insightHeader}>
                  <Ionicons name="sparkles" size={16} color={colors.primary[200]} />
                  <Text variant="labelSmall" color={colors.primary[200]}>PATTERN FOUND</Text>
                </View>
                <Text variant="h3" color={colors.text.inverse}>
                  You resonate with <Text style={{ fontStyle: 'italic' }}>{categoryLabels[patternInsights.topCategory]}</Text>.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primary[200]} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* 4. The Collection (Shelf) */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="h4">Your Collection</Text>
            <Text variant="caption" color={colors.text.tertiary}>{resonatesConcepts.length} items</Text>
          </View>

          {resonatesConcepts.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfScroll}>
              {resonatesConcepts.map((uc) => {
                const concept = getConceptById(uc.concept_id);
                if (!concept) return null;

                const imageSource = concept.thumbnail || getCategoryIcon(concept.category);

                return (
                  <TouchableOpacity
                    key={uc.concept_id}
                    style={styles.collectionCard}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/concept/${uc.concept_id}`)}
                  >
                    <View style={styles.collectionIconArea}>
                      {imageSource && (
                        <Image
                          source={imageSource}
                          style={styles.collectionImage}
                          resizeMode="contain"
                        />
                      )}
                    </View>

                    <View style={styles.collectionCardContent}>
                      <View style={styles.collectionCardBadge}>
                        <Text variant="labelSmall" style={{ fontSize: 10, color: colors.text.secondary }}>
                          {concept.category.toUpperCase()}
                        </Text>
                      </View>
                      <Text variant="bodyBold" color={colors.text.primary} numberOfLines={2} style={{ textAlign: 'center' }}>
                        {concept.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <EmptyState
              title="Your collection is waiting"
              message="Concepts that resonate with you will appear here. Explore the library to find what speaks to you."
              icon="heart-outline"
              actionLabel="Explore Library"
              onAction={() => router.push('/(tabs)/library')}
            />
          )}
        </View>

        {/* 5. Tools Grid */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>Tools & Settings</Text>

          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/communicate')}>
              <View style={styles.toolIconWrapper}>
                <Image
                  source={require('@/assets/images/ui/profile/tool-communicate.png')}
                  style={styles.toolImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.toolContent}>
                <Text variant="bodyBold" style={{ textAlign: 'center' }}>Communication</Text>
                <Text variant="caption" color={colors.text.tertiary} style={{ textAlign: 'center' }}>Toolkit</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/literacy-report')}>
              <View style={styles.toolIconWrapper}>
                <Ionicons name="document-text-outline" size={36} color={colors.primary[600]} />
              </View>
              <View style={styles.toolContent}>
                <Text variant="bodyBold" style={{ textAlign: 'center' }}>Literacy</Text>
                <Text variant="caption" color={colors.text.tertiary} style={{ textAlign: 'center' }}>Report</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/share')}>
              <View style={styles.toolIconWrapper}>
                <Image
                  source={require('@/assets/images/ui/profile/tool-export.png')}
                  style={styles.toolImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.toolContent}>
                <Text variant="bodyBold" style={{ textAlign: 'center' }}>Export</Text>
                <Text variant="caption" color={colors.text.tertiary} style={{ textAlign: 'center' }}>Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // 1. Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  auraContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerText: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 32,
    marginBottom: 4,
  },
  settingsButton: {
    padding: spacing.sm,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.sm,
  },

  // Literacy Level
  levelBanner: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  levelBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },

  // Streak message
  streakMessageBox: {
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[300],
  },

  // 2. Bento Grid
  bentoContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    height: 190,
    marginBottom: spacing['2xl'],
  },
  bentoBig: { // Left Column
    flex: 1.2,
    backgroundColor: colors.background.surface, // WHITE
    justifyContent: 'space-between',
    padding: 0,
    overflow: 'hidden',
    ...shadows.sm, // Ensure it pops
    borderRadius: borderRadius.lg,
  },
  bentoIconWrapper: {
    width: '100%',
    height: '60%',
    overflow: 'hidden',
  },
  bentoImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  bentoContentBig: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  bentoStack: { // Right Column
    flex: 1,
    gap: spacing.md,
  },
  bentoSmall: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.surface, // WHITE
    overflow: 'hidden',
    ...shadows.sm,
    borderRadius: borderRadius.lg,
  },
  bentoIconWrapperSmall: {
    width: 56,
    height: 56,
    marginRight: spacing.xs,
  },
  bentoImageSmall: {
    width: '100%',
    height: '100%',
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 3. Insight
  insightWrapper: {
    marginBottom: spacing['2xl'],
    ...shadows.md,
  },
  insightBanner: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },

  // 4. Collection
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shelfScroll: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  collectionCard: {
    width: 140,
    height: 190,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background.primary, // CREAM/TRANSPARENT-LIKE
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  collectionIconArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.conceptCanvas,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  collectionImage: {
    width: 90,
    height: 90,
  },
  collectionCardContent: {
    width: '100%',
    alignItems: 'center', // CENTERED
  },
  collectionCardBadge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'center', // CENTERED
    marginBottom: 4,
  },
  // 5. Tools Grid
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  toolCard: {
    width: '30%',
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: colors.background.surface, // WHITE
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  toolIconWrapper: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolImage: {
    width: '100%',
    height: '100%',
  },
  toolContent: {
    alignItems: 'center',
  },
});

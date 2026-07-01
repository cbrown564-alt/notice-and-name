import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { useUserConcepts } from '@/hooks/useDatabase';
import { Concept, ConceptSlide, ConceptSlideType, ConceptStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { ExploreSlide } from './conceptdeck/ExploreSlide';
import { IllustrateSlide } from './conceptdeck/IllustrateSlide';
import { NameSlide } from './conceptdeck/NameSlide';
import { RecognizeSlide } from './conceptdeck/RecognizeSlide';
import { ReflectSlide } from './conceptdeck/ReflectSlide';
import { UnderstandSlide } from './conceptdeck/UnderstandSlide';

const SLIDE_WIDTH_RATIO = 0.88;
const SPRING_CONFIG = { damping: 20, stiffness: 180, mass: 0.8 };

// Ambient tint colors per slide type for immersive chromatic rhythm
const AMBIENT_TINTS: Record<ConceptSlideType, string> = {
  recognize: colors.primary[50],   // warm blush
  name: colors.primary[50],        // light blush
  illustrate: colors.conceptCanvas, // cream
  understand: colors.secondary[50], // cool sage
  explore: '#F5F9F6',              // very light mint
  reflect: colors.primary[100],    // deep coral glow
};

const Slide = ({
  item,
  concept,
  onFinish,
  isLast,
  onSetStatus,
  currentStatus,
  savingStatus,
  feedbackMessage,
  isActive,
}: {
  item: ConceptSlide;
  concept: Concept;
  onFinish: () => void;
  isLast: boolean;
  onSetStatus: (status: ConceptStatus) => Promise<void>;
  currentStatus: ConceptStatus;
  savingStatus: ConceptStatus | null;
  feedbackMessage?: string | null;
  isActive: boolean;
}) => {
  switch (item.type) {
    case 'recognize':
      return <RecognizeSlide item={item} concept={concept} />;
    case 'name':
      return <NameSlide item={item} concept={concept} />;
    case 'illustrate':
      return (
        <IllustrateSlide
          item={item}
          isActive={isActive}
          diagramType={concept.diagramType}
        />
      );
    case 'understand':
      return <UnderstandSlide item={item} />;
    case 'explore':
      return <ExploreSlide item={item} />;
    case 'reflect':
      return (
        <ReflectSlide
          item={item}
          onFinish={onFinish}
          onSetStatus={onSetStatus}
          currentStatus={currentStatus}
          savingStatus={savingStatus}
        />
      );
    default:
      return null;
  }
};

export const ConceptDeck = ({ concept }: { concept: Concept }) => {
  const { width: windowWidth } = useWindowDimensions();
  const router = useRouter();
  const { setStatus, getStatus, masterConcept } = useUserConcepts();
  const [activeIndex, setActiveIndex] = useState(0);
  const [savingStatus, setSavingStatus] = useState<ConceptStatus | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ConceptStatus>('unexplored');
  const [feedbackMessage] = useState<string | null>(null);

  const slideWidth = windowWidth * SLIDE_WIDTH_RATIO;
  const slideSpacing = (windowWidth - slideWidth) / 2;

  // Construct slides if not present (legacy fallback)
  let slides: ConceptSlide[] = concept.slides || [
    {
      type: 'recognize',
      content: concept.recognitionPrompts[0] || 'Have you experienced this?',
    },
    { type: 'name', content: concept.definition },
    { type: 'understand', content: concept.researchBasis },
    {
      type: 'explore',
      content: concept.recognitionPrompts[1] || 'Try noticing this next time.',
    },
  ];

  // Ensure Reflect slide exists at the end
  if (slides[slides.length - 1].type !== 'reflect') {
    slides = [...slides, { type: 'reflect', content: 'Reflection', title: 'Reflection' }];
  }

  const totalSlides = slides.length;
  const maxTranslate = 0;
  const minTranslate = -(totalSlides - 1) * slideWidth;

  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);
  const activeIndexSV = useSharedValue(0);

  useEffect(() => {
    setSelectedStatus(getStatus(concept.id));
  }, [concept.id, getStatus]);

  const announceSlideChange = useCallback(
    (index: number) => {
      const slide = slides[index];
      if (!slide) return;
      const label =
        slide.type === 'recognize'
          ? `Recognize: ${concept.name}`
          : slide.type === 'name'
            ? `The word: ${concept.name}`
            : slide.type === 'illustrate'
              ? 'Illustration'
              : slide.type === 'understand'
                ? 'The research'
                : slide.type === 'explore'
                  ? 'Try this'
                  : 'Reflection';
      AccessibilityInfo.announceForAccessibility(
        `${label}, slide ${index + 1} of ${totalSlides}`
      );
    },
    [slides, concept.name, totalSlides]
  );

  const triggerHaptic = useCallback((index: number) => {
    if (index === totalSlides - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [totalSlides]);

  // Sync shared value active index to React state + accessibility
  useAnimatedReaction(
    () => activeIndexSV.value,
    (current, previous) => {
      if (current !== previous && previous !== null) {
        runOnJS(setActiveIndex)(Math.round(current));
        runOnJS(announceSlideChange)(Math.round(current));
        runOnJS(triggerHaptic)(Math.round(current));
      }
    },
    [announceSlideChange, triggerHaptic]
  );

  const handleStatusSelection = async (status: ConceptStatus) => {
    try {
      setSavingStatus(status);
      await setStatus(concept.id, status);
      if (status !== 'unexplored') {
        await masterConcept(concept.id);
      }
      setSelectedStatus(status);
    } catch (error) {
      console.error('Failed to update status', error);
      Alert.alert('Could not save', 'Please try selecting a status again.');
    } finally {
      setSavingStatus(null);
    }
  };

  const onFinish = async () => {
    if (selectedStatus === 'unexplored') {
      await handleStatusSelection('explored');
    }
    router.back();
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      const newTranslate = contextX.value + event.translationX;
      // Rubber-band effect at edges
      if (newTranslate > maxTranslate) {
        translateX.value = maxTranslate + (newTranslate - maxTranslate) * 0.3;
      } else if (newTranslate < minTranslate) {
        translateX.value = minTranslate + (newTranslate - minTranslate) * 0.3;
      } else {
        translateX.value = newTranslate;
      }
    })
    .onEnd((event) => {
      const velocityFactor = event.velocityX * 0.15;
      const targetTranslate = translateX.value + velocityFactor;
      let targetIndex = Math.round(-targetTranslate / slideWidth);
      targetIndex = Math.max(0, Math.min(targetIndex, totalSlides - 1));

      activeIndexSV.value = targetIndex;
      translateX.value = withSpring(-targetIndex * slideWidth, SPRING_CONFIG);
    })
    .enabled(totalSlides > 1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const ambientBackgroundStyle = useAnimatedStyle(() => {
    const index = activeIndexSV.value;
    const slideTypes = slides.map((s) => s.type);
    const colorsList = slideTypes.map((t) => AMBIENT_TINTS[t]);

    // For interpolation we need numeric stops; we'll approximate by
    // blending between adjacent slide colors based on progress
    const progress = index / Math.max(1, totalSlides - 1);
    const fromIdx = Math.floor(progress * (colorsList.length - 1));
    const toIdx = Math.min(fromIdx + 1, colorsList.length - 1);
    const localProgress = progress * (colorsList.length - 1) - fromIdx;

    const fromColor = colorsList[fromIdx] ?? colors.background.primary;
    const toColor = colorsList[toIdx] ?? colors.background.primary;

    return {
      backgroundColor: interpolateColor(
        localProgress,
        [0, 1],
        [fromColor, toColor]
      ),
    };
  });

  return (
    <View style={styles.container}>
      {/* Ambient background tint */}
      <Animated.View style={[StyleSheet.absoluteFill, ambientBackgroundStyle]} />

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.track}>
          {slides.map((_, idx) => (
            <ProgressDot
              key={idx}
              index={idx}
              activeIndex={activeIndexSV}
            />
          ))}
        </View>
        <ProgressGlowBar activeIndex={activeIndexSV} total={totalSlides} />
      </View>

      {/* Close Button */}
      <View style={styles.closeButton}>
        <TouchableIcon
          name="close"
          onPress={() => router.back()}
          label="Close concept deck"
        />
      </View>

      {/* Slide Deck */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.deck,
            animatedContainerStyle,
            { paddingHorizontal: slideSpacing },
          ]}
        >
          {slides.map((item, index) => (
            <AnimatedSlideWrapper
              key={index}
              index={index}
              activeIndex={activeIndexSV}
              slideWidth={slideWidth}
            >
              <Slide
                item={item}
                concept={concept}
                onFinish={onFinish}
                isLast={index === totalSlides - 1}
                onSetStatus={handleStatusSelection}
                currentStatus={selectedStatus}
                savingStatus={savingStatus}
                feedbackMessage={feedbackMessage}
                isActive={index === activeIndex}
              />
            </AnimatedSlideWrapper>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                               SUB-COMPONENTS                               */
/* -------------------------------------------------------------------------- */

function AnimatedSlideWrapper({
  index,
  activeIndex,
  slideWidth,
  children,
}: {
  index: number;
  activeIndex: SharedValue<number>;
  slideWidth: number;
  children: React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const current = activeIndex.value;
    const distance = Math.abs(current - index);

    // Spring settle: scale from 1.02 -> 1.0 when becoming active
    const scale = interpolate(
      distance,
      [0, 0.5, 1, 2],
      [1, 1.01, 0.98, 0.95]
    );

    // Cross-fade: active slide fully opaque, adjacent slightly dimmed, far slides more dimmed
    const opacity = interpolate(
      distance,
      [0, 0.8, 1.5, 3],
      [1, 0.85, 0.6, 0.3]
    );

    return {
      width: slideWidth,
      transform: [{ scale: withSpring(scale, { damping: 25, stiffness: 200 }) }],
      opacity: withTiming(opacity, { duration: 250 }),
    };
  });

  return (
    <Animated.View style={[styles.slideWrapper, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

function TouchableIcon({
  name,
  onPress,
  label,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label: string;
}) {
  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Double tap to close"
    >
      <Ionicons
        name={name}
        size={24}
        color={colors.text.tertiary}
        onPress={onPress}
        style={{ padding: 8 }}
      />
    </View>
  );
}

function ProgressDot({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const current = activeIndex.value;
    const isActive = Math.round(current) === index;
    const isVisited = current > index;
    const distance = Math.abs(current - index);
    const progress = Math.min(1, Math.max(0, current - index + 1));

    // Pulsing glow intensity for the active dot
    const glowOpacity = isActive
      ? interpolate(progress, [0, 1], [0.5, 0.9])
      : 0;

    return {
      width: isActive ? 18 : 6,
      height: isActive ? 6 : 6,
      backgroundColor: isActive
        ? colors.primary[500]
        : isVisited
          ? colors.primary[300]
          : colors.neutral[200],
      opacity: isActive ? 1 : isVisited ? 0.9 : 0.5,
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: glowOpacity,
      shadowRadius: isActive ? 8 : 0,
      elevation: isActive ? 3 : 0,
      transform: [
        {
          scale: isActive
            ? withSpring(1, { damping: 10, stiffness: 200 })
            : withTiming(1 - distance * 0.05, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.progressDotBase, animatedStyle]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}

function ProgressGlowBar({
  activeIndex,
  total,
}: {
  activeIndex: SharedValue<number>;
  total: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const progress = activeIndex.value / (total - 1);
    return {
      width: `${progress * 100}%`,
      opacity: interpolate(progress, [0, 0.3, 1], [0.3, 0.6, 0.9]),
    };
  });

  return (
    <View style={styles.glowTrack}>
      <Animated.View style={[styles.glowFill, animatedStyle]} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  track: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    height: 8,
  },
  progressDotBase: {
    height: 6,
    borderRadius: 3,
  },
  glowTrack: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.neutral[200],
    borderRadius: 1,
    overflow: 'hidden',
  },
  glowFill: {
    height: '100%',
    backgroundColor: colors.primary[400],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 20,
  },

  deck: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 100,
    paddingBottom: 60,
  },
  slideWrapper: {
    flex: 1,
  },

  // Legacy slide styles (kept for any inline references)
  slideBase: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 100,
    paddingBottom: 60,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Recognize slide
  categoryLabel: {
    letterSpacing: 2,
    marginBottom: spacing.sm,
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 42,
    marginBottom: spacing.xl,
    lineHeight: 48,
  },
  recognizeCard: {
    marginBottom: spacing.xl * 2,
  },
  recognizeText: {
    fontSize: 22,
    lineHeight: 34,
    fontStyle: 'italic',
    color: colors.text.secondary,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    opacity: 0.6,
    marginTop: 20,
  },

  // Name slide
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nameTitle: {
    fontSize: 28,
    color: colors.primary[800],
    marginBottom: spacing.lg,
  },
  nameBody: {
    fontSize: 20,
    lineHeight: 32,
    color: colors.text.primary,
  },

  // Understand slide
  evidenceCard: {
    backgroundColor: colors.background.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    width: '100%',
    ...shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[300],
  },
  quoteIcon: {
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  evidenceText: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.headingItalic,
  },

  // Explore slide
  slideTitle: {
    fontSize: 32,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sparkleContainer: {
    marginBottom: spacing.md,
  },
  exploreCard: {
    marginBottom: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  exploreText: {
    fontSize: 24,
    lineHeight: 38,
    color: colors.text.primary,
  },
  actionContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  collectButton: {
    ...shadows.md,
  },

  // Diagram
  diagramContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagramPlaceholder: {
    alignItems: 'center',
  },

  // Fallback
  BodyCentered: {
    fontSize: 21,
    lineHeight: 34,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

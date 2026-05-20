// AuraVisualization Component
// An abstract generative "bloom" in the profile header
// Grows and morphs based on explored concept categories

import { colors } from '@/constants/theme';
import { ConceptCategory } from '@/types';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/* -------------------------------------------------------------------------- */
/*                               CATEGORY MAP                                 */
/* -------------------------------------------------------------------------- */

const CATEGORY_META: Record<
  ConceptCategory,
  { label: string; color: string; angle: number }
> = {
  technique: { label: 'Techniques', color: colors.primary[400], angle: 0 },
  sensation: { label: 'Sensations', color: colors.secondary[400], angle: 72 },
  timing: { label: 'Timing', color: colors.accent[400], angle: 144 },
  psychological: { label: 'Psychology', color: colors.primary[300], angle: 216 },
  anatomy: { label: 'Anatomy', color: colors.secondary[300], angle: 288 },
};

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

interface AuraVisualizationProps {
  categoryCounts: Record<string, number>;
  totalExplored: number;
  size?: number;
}

export function AuraVisualization({
  categoryCounts,
  totalExplored,
  size = 200,
}: AuraVisualizationProps) {
  const breathe = useSharedValue(1);

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1.06, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  const categories = Object.keys(categoryCounts) as ConceptCategory[];
  const maxCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.bloomContainer, containerStyle, { width: size, height: size }]}>
        {/* Central glow */}
        <View
          style={[
            styles.core,
            {
              width: size * 0.35,
              height: size * 0.35,
              borderRadius: size * 0.175,
              backgroundColor: colors.primary[200],
              opacity: 0.4 + Math.min(totalExplored * 0.05, 0.5),
            },
          ]}
        />

        {/* Category petals */}
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const count = categoryCounts[cat] ?? 0;
          if (count === 0) return null;

          const intensity = count / maxCount;
          const petalSize = size * (0.12 + intensity * 0.18);
          const radius = size * 0.28;
          const angleRad = (meta.angle * Math.PI) / 180;
          const x = size / 2 + Math.cos(angleRad) * radius - petalSize / 2;
          const y = size / 2 + Math.sin(angleRad) * radius - petalSize / 2;

          return (
            <View
              key={cat}
              style={[
                styles.petal,
                {
                  width: petalSize,
                  height: petalSize,
                  borderRadius: petalSize / 2,
                  backgroundColor: meta.color,
                  left: x,
                  top: y,
                  opacity: 0.5 + intensity * 0.4,
                },
              ]}
            />
          );
        })}

        {/* Orbiting rings */}
        <View
          style={[
            styles.ring,
            {
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: size * 0.3,
              borderColor: colors.primary[200],
              opacity: 0.25 + Math.min(totalExplored * 0.03, 0.3),
            },
          ]}
        />
        <View
          style={[
            styles.ring,
            {
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: size * 0.4,
              borderColor: colors.secondary[200],
              opacity: 0.15 + Math.min(totalExplored * 0.02, 0.2),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  core: {
    position: 'absolute',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 4,
  },
  petal: {
    position: 'absolute',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 2,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
});

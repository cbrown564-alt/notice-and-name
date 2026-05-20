// ResonanceRitual Component
// A celebratory moment of self-knowledge when marking a concept as "resonates"
// Particle burst + quote + pause before completion

import { colors, spacing, typography } from '@/constants/theme';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { Text } from './Typography';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const QUOTES = [
  'Naming is the first act of mastery.',
  'To name it is to claim it.',
  'Every word you learn is a door you open.',
  'This is how fluency begins — one concept at a time.',
  'You are building a vocabulary of pleasure.',
];

function generateParticles(count: number): Particle[] {
  const palette = [
    colors.primary[400],
    colors.primary[300],
    colors.primary[500],
    colors.secondary[400],
    colors.accent[400],
    colors.primary[200],
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    distance: 80 + Math.random() * 160,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 200,
    duration: 600 + Math.random() * 600,
    color: palette[Math.floor(Math.random() * palette.length)],
  }));
}

function ParticleBurst({ particles, onComplete }: { particles: Particle[]; onComplete: () => void }) {
  return (
    <View style={styles.particleContainer} pointerEvents="none">
      {particles.map((p) => (
        <ParticleDot key={p.id} particle={p} />
      ))}
    </View>
  );
}

function ParticleDot({ particle }: { particle: Particle }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  useEffect(() => {
    const dx = Math.cos(particle.angle) * particle.distance;
    const dy = Math.sin(particle.angle) * particle.distance;

    scale.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(1.2, { duration: 150, easing: Easing.out(Easing.ease) }),
        withTiming(0.6, { duration: particle.duration, easing: Easing.out(Easing.ease) })
      )
    );

    translateX.value = withDelay(
      particle.delay,
      withTiming(dx, { duration: particle.duration, easing: Easing.out(Easing.ease) })
    );

    translateY.value = withDelay(
      particle.delay,
      withTiming(dy, { duration: particle.duration, easing: Easing.out(Easing.ease) })
    );

    opacity.value = withDelay(
      particle.delay + particle.duration * 0.4,
      withTiming(0, { duration: particle.duration * 0.5 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    width: particle.size,
    height: particle.size,
    borderRadius: particle.size / 2,
    backgroundColor: particle.color,
  }));

  return <Animated.View style={[styles.particle, style]} />;
}

interface ResonanceRitualProps {
  visible: boolean;
  onComplete: () => void;
  quote?: string;
}

export function ResonanceRitual({ visible, onComplete, quote }: ResonanceRitualProps) {
  const overlayOpacity = useSharedValue(0);
  const quoteOpacity = useSharedValue(0);
  const quoteTranslateY = useSharedValue(20);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0.6);

  const particles = React.useMemo(() => generateParticles(16), []);

  useEffect(() => {
    if (!visible) {
      overlayOpacity.value = 0;
      quoteOpacity.value = 0;
      return;
    }

    // Fade in overlay
    overlayOpacity.value = withTiming(1, { duration: 300 });

    // Ring burst
    ringScale.value = withSequence(
      withTiming(0.5, { duration: 100 }),
      withTiming(2.5, { duration: 800, easing: Easing.out(Easing.ease) })
    );
    ringOpacity.value = withSequence(
      withTiming(0.4, { duration: 100 }),
      withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) })
    );

    // Quote fades in after burst begins
    quoteOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    quoteTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));

    // Complete after ritual duration
    const timer = setTimeout(() => {
      overlayOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(onComplete)();
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const quoteStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
    transform: [{ translateY: quoteTranslateY.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  if (!visible) return null;

  const displayQuote = quote || QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      <ParticleBurst particles={particles} onComplete={() => {}} />

      <Animated.View style={[styles.ring, ringStyle]} />

      <Animated.View style={[styles.quoteContainer, quoteStyle]}>
        <View style={styles.quoteLine} />
        <Text
          variant="deckPrompt"
          align="center"
          style={styles.quoteText}
        >
          {displayQuote}
        </Text>
        <View style={styles.quoteLine} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(252, 250, 249, 0.88)',
    zIndex: 20,
  },
  particleContainer: {
    position: 'absolute',
    width: SCREEN_W,
    height: SCREEN_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary[300],
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
    maxWidth: 400,
  },
  quoteLine: {
    width: 40,
    height: 1,
    backgroundColor: colors.primary[300],
    marginVertical: spacing.lg,
  },
  quoteText: {
    color: colors.primary[800],
    fontSize: typography.fontSize.xl,
    lineHeight: typography.fontSize.xl * typography.lineHeight.relaxed,
  },
});

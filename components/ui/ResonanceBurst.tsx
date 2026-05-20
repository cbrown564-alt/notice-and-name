import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';

interface ResonanceBurstProps {
  visible: boolean;
  onComplete: () => void;
}

export function ResonanceBurst({ visible, onComplete }: ResonanceBurstProps) {
  const lottieRef = useRef<LottieView>(null);
  const completedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!visible) {
      completedRef.current = false;
      return;
    }

    let cancelled = false;
    const fallback = setTimeout(() => {
      if (!cancelled) handleFinish();
    }, 1800);

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) {
        handleFinish();
        return;
      }
      lottieRef.current?.play();
    });

    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, [visible, handleFinish]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <LottieView
        ref={lottieRef}
        source={require('@/assets/animations/resonance-burst.json')}
        loop={false}
        style={styles.burst}
        onAnimationFinish={handleFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(252, 250, 249, 0.85)',
    zIndex: 10,
  },
  burst: {
    width: 200,
    height: 200,
  },
});

import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Reads system Reduce Motion and re-subscribes on change. */
export function useDiagramReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => subscription.remove();
  }, []);

  return reduceMotion;
}

export function triggerDiagramHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Fires a light haptic once when `active` becomes true until it returns false.
 * Use inside `runOnJS` from Reanimated reactions.
 */
export function useHapticLatch() {
  const latched = useRef(false);

  return useCallback((active: boolean) => {
    if (active && !latched.current) {
      latched.current = true;
      triggerDiagramHaptic();
    } else if (!active) {
      latched.current = false;
    }
  }, []);
}

/**
 * Announces diagram state changes sparingly (threshold crossings only).
 * Pass the new feedback string from a Reanimated reaction via runOnJS.
 */
export function useDiagramStateAnnouncer(enabled: boolean) {
  const previous = useRef<string | null>(null);

  return useCallback(
    (next: string) => {
      if (!enabled || next === previous.current) return;
      previous.current = next;
      AccessibilityInfo.announceForAccessibility(next);
    },
    [enabled]
  );
}

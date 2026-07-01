import { borderRadius, colors, textStyles } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { DIAGRAM_HEIGHT, DIAGRAM_HORIZONTAL_INSET } from './diagramConstants';

export interface DiagramFrameProps {
  /** Deck caption — primary accessibility label for the diagram region. */
  accessibilityLabel: string;
  /** Live state label shown in UI chrome (not burned into canvas). */
  feedback?: string;
  /** Short interaction hint beneath the canvas. */
  hint?: string;
  height?: number;
  /** When true, gestures are disabled and callers render a static teaching frame. */
  reduceMotion?: boolean;
  /** Pan/tap gesture to wrap the canvas; omitted when reduceMotion is true. */
  gesture?: React.ComponentProps<typeof GestureDetector>['gesture'];
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DiagramFrame({
  accessibilityLabel,
  feedback,
  hint,
  height = DIAGRAM_HEIGHT,
  reduceMotion = false,
  gesture,
  children,
  style,
}: DiagramFrameProps) {
  const { width } = useWindowDimensions();
  const canvasWidth = width - DIAGRAM_HORIZONTAL_INSET;

  const canvas = (
    <View
      style={[styles.canvas, { width: canvasWidth, height }, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={reduceMotion ? undefined : hint}
    >
      {children}
    </View>
  );

  const wrappedCanvas =
    gesture && !reduceMotion ? (
      <GestureDetector gesture={gesture}>{canvas}</GestureDetector>
    ) : (
      canvas
    );

  return (
    <View style={styles.root}>
      {feedback ? (
        <View style={styles.feedbackOverlay} accessibilityElementsHidden importantForAccessibility="no">
          <Text style={[textStyles.label, styles.feedbackText]}>{feedback}</Text>
        </View>
      ) : null}

      {wrappedCanvas}

      {hint ? (
        <Text
          style={[textStyles.caption, styles.hint]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

/** Convenience helper for diagrams that need width/height in Skia layout. */
export function useDiagramCanvasSize(height = DIAGRAM_HEIGHT) {
  const { width } = useWindowDimensions();
  return {
    canvasWidth: width - DIAGRAM_HORIZONTAL_INSET,
    canvasHeight: height,
  };
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 10,
    zIndex: 10,
    alignItems: 'center',
  },
  feedbackText: {
    color: colors.text.secondary,
  },
  canvas: {
    overflow: 'hidden',
    backgroundColor: colors.conceptCanvas,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  hint: {
    marginTop: 10,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

import { colors } from '@/constants/theme';

/** Shared diagram canvas height — matches Style Bible §4 (~300pt). */
export const DIAGRAM_HEIGHT = 300;

/** Horizontal inset from screen edge when computing canvas width. */
export const DIAGRAM_HORIZONTAL_INSET = 40;

/** Style tokens for Skia paths — mirrors `colors.diagram.*` in theme.ts. */
export const diagramColors = colors.diagram;

/** Teaching-frame defaults when Reduce Motion is on (per INTERACTIVE_DIAGRAMS_PLAN §2). */
export const reduceMotionFrames = {
  angling: { angle: -15, feedback: 'Posterior Tilt (Tuck)' },
  rocking: { intensity: 1, feedback: 'Grinding (High Contact)' },
  shallowing: { probeX: 40, feedback: 'Introitus (High Sensitivity!)' },
  pairing: { externalActive: 1, internalActive: 1, feedback: 'Paired' },
} as const;

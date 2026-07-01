export interface DiagramProps {
  /** Deck `illustrationCaption` — primary VoiceOver label for the diagram. */
  accessibilityLabel: string;
  /** When true, render a static teaching frame and disable gestures. */
  reduceMotion?: boolean;
}

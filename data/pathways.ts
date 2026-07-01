// Learning pathways for Pleasure Vocabulary Builder
// Structured progressions through related concepts

import { Pathway } from '@/types';

export const pathways: Pathway[] = [
  {
    id: 'foundations',
    name: 'Understand My Body',
    description:
      'Start with anatomy and core patterns that make pleasure feel less mysterious.',
    intent: 'understand-body',
    icon: 'compass',
    image: require('../assets/images/pathways/foundations.png'),
    conceptIds: [
      'pairing',
      'clitoral-structure',
      'nerve-density',
      'clitourethrovaginal',
      'internal-stimulation',
      'building',
    ],
    estimatedTime: '22-28 min',
  },
  {
    id: 'solo-exploration',
    name: 'Notice What Feels Good',
    description:
      'Build language for your own sensations, timing, and the signals worth remembering.',
    intent: 'notice-patterns',
    icon: 'flower',
    image: require('../assets/images/pathways/solo-exploration.png'),
    conceptIds: [
      'edging',
      'plateauing',
      'spreading',
      'pulsing',
      'embodied-presence',
    ],
    estimatedTime: '20-25 min',
  },
  {
    id: 'partner-communication',
    name: 'Find Words For A Partner',
    description:
      'Turn personal discoveries into clear, kind explanations and requests.',
    intent: 'communicate',
    icon: 'chatbubbles',
    image: require('../assets/images/pathways/partner-communication.png'),
    conceptIds: [
      'responsive-desire',
      'spontaneous-desire',
      'warmup-window',
      'spectatoring',
      'sexual-self-esteem',
    ],
    estimatedTime: '18-22 min',
  },
  {
    id: 'expanding-repertoire',
    name: 'Try A Different Approach',
    description:
      'Explore small changes in touch, rhythm, angle, and combinations without making novelty the goal.',
    intent: 'try-something',
    icon: 'sparkles',
    image: require('../assets/images/pathways/expanding-repertoire.png'),
    conceptIds: ['angling', 'rocking', 'shallowing', 'golden-trio'],
    estimatedTime: '15-20 min',
  },
  {
    id: 'mindful-presence',
    name: 'Return To Presence',
    description:
      'Name the mental loops that pull attention away from sensation, then practice coming back.',
    intent: 'return-to-presence',
    icon: 'leaf',
    image: require('../assets/images/pathways/mindful-presence.png'),
    conceptIds: [
      'spectatoring',
      'embodied-presence',
      'non-concordance',
      'body-appreciation',
    ],
    estimatedTime: '20-25 min',
  },
];

// Helper to get pathway by ID
export function getPathwayById(id: string): Pathway | undefined {
  return pathways.find((p) => p.id === id);
}

// Helper to check if a concept is in any pathway
export function getPathwaysForConcept(conceptId: string): Pathway[] {
  return pathways.filter((p) => p.conceptIds.includes(conceptId));
}

// Get the recommended starting pathway
export function getRecommendedPathway(): Pathway {
  return pathways[0]; // Foundations is always recommended first
}

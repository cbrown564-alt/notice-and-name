// Communication toolkit content for Pleasure Vocabulary Builder
// Conversation starters, scripts, and barrier reassurance

import { ConversationStarter, ScriptExample, CommunicationBarrier, ScriptModule } from '@/types';

export const conversationStarters: ConversationStarter[] = [
  {
    id: 'introduce-preference',
    situation: 'Introducing a new preference',
    phrase:
      'I\'ve been thinking about something I\'d like to try. Would you be open to exploring [specific thing] together?',
    tips: [
      'Choose a relaxed, non-sexual moment to bring this up',
      'Frame it as something to explore together, not a criticism',
      'Be specific about what you want to try',
    ],
  },
  {
    id: 'ask-for-more',
    situation: 'Asking for more of something',
    phrase:
      'That thing you were doing earlier felt really good. Can we do more of that?',
    tips: [
      'Positive feedback encourages repetition',
      'Be specific about what felt good',
      'In-the-moment feedback is often most effective',
    ],
  },
  {
    id: 'positive-feedback',
    situation: 'Giving positive feedback',
    phrase:
      'That feels amazing. The way you\'re doing that is perfect.',
    tips: [
      'Positive reinforcement makes good things happen more often',
      'Sound and words both communicate pleasure',
      'Specific praise is more helpful than general',
    ],
  },
  {
    id: 'request-change-mid',
    situation: 'Requesting a change mid-encounter',
    phrase:
      'Can we try something a little different? I think I need more/less [speed, pressure, etc.].',
    tips: [
      'Changes aren\'t criticism - bodies need variety',
      'Guide rather than criticize: "like this" vs "not that"',
      'Your partner wants to please you; help them do it',
    ],
  },
  {
    id: 'discuss-timing',
    situation: 'Discussing timing and pacing',
    phrase:
      'I find I really enjoy things more when we take our time at the beginning. Can we slow down and build up more gradually?',
    tips: [
      'Framing around pleasure (not obligation) helps',
      'Share what you\'ve learned about your body',
      'Suggest specific activities for the warm-up phase',
    ],
  },
];

export const scriptExamples: ScriptExample[] = [
  {
    id: 'learning-about',
    category: 'Sharing discoveries',
    opening: 'I\'ve been learning about something called [concept name]...',
    context:
      'When you want to introduce vocabulary or research you\'ve encountered.',
  },
  {
    id: 'like-to-try',
    category: 'Suggesting something new',
    opening: 'Something I\'d like to try is...',
    context: 'When proposing a new activity or technique to explore together.',
  },
  {
    id: 'feels-good-when',
    category: 'Positive feedback',
    opening: 'This feels really good when you...',
    context:
      'When giving in-the-moment feedback about what\'s working.',
  },
  {
    id: 'slow-down',
    category: 'Adjusting pace',
    opening: 'Can we slow down and...',
    context: 'When you want to extend a particular activity or phase.',
  },
  {
    id: 'noticed-enjoy',
    category: 'Sharing self-knowledge',
    opening: 'I noticed I really enjoy...',
    context:
      'When sharing something you\'ve discovered about your preferences.',
  },
  {
    id: 'what-if-we',
    category: 'Collaborative exploration',
    opening: 'What if we tried...',
    context: 'When suggesting an experiment or variation together.',
  },
  {
    id: 'more-less',
    category: 'Fine-tuning',
    opening: 'A little more/less [pressure, speed, etc.]...',
    context: 'When making small adjustments to what\'s happening.',
  },
  {
    id: 'keep-doing',
    category: 'Encouragement',
    opening: 'Keep doing exactly that...',
    context: 'When something is working well and you don\'t want it to change.',
  },
  {
    id: 'want-to-feel',
    category: 'Expressing desire',
    opening: 'I want to feel your...',
    context: 'When expressing what you want next.',
  },
  {
    id: 'show-you',
    category: 'Demonstrating',
    opening: 'Let me show you how I like...',
    context: 'When guiding through demonstration rather than words.',
  },
];

export const communicationBarriers: CommunicationBarrier[] = [
  {
    id: 'hurt-feelings',
    fear: 'Fear of hurting partner\'s feelings',
    percentage: 42.4,
    reassurance:
      'Most partners genuinely want to know what feels good. Sharing preferences is an act of trust and intimacy, not criticism. Research shows that couples who communicate about sex have higher satisfaction - your guidance helps your partner succeed.',
    tips: [
      'Frame as "more of this" rather than "less of that"',
      'Share what you\'ve learned about yourself, not what they\'re doing wrong',
      'Remember: they can\'t read your mind, and they want you to feel good',
    ],
  },
  {
    id: 'discomfort-explicit',
    fear: 'Discomfort with explicit discussion',
    percentage: 40.2,
    reassurance:
      'You can start gradually - even small communications make a difference. Using this app\'s vocabulary gives you neutral, specific words. Many people find that starting with text messages or notes feels easier than face-to-face.',
    tips: [
      'Start with less vulnerable topics and build up',
      'Use vocabulary terms - they\'re designed to be speakable',
      'Consider sharing written notes or texts if speaking feels hard',
    ],
  },
  {
    id: 'embarrassment',
    fear: 'Embarrassment about desires',
    percentage: 37.7,
    reassurance:
      'The things you want are almost certainly more normal than you think. Research on sexual preferences reveals enormous diversity - you are not alone in what turns you on. Shame fades when desires are met with acceptance.',
    tips: [
      'Remember that partners are often curious and welcoming',
      'Start with lower-stakes preferences to build confidence',
      'Your desires are valid, even if they feel unusual to you',
    ],
  },
  {
    id: 'seeming-demanding',
    fear: 'Worry about seeming demanding',
    percentage: 35.1,
    reassurance:
      'Knowing what you want and asking for it is a gift to your partner, not a burden. Clear communication takes guesswork out of pleasing you. Most partners appreciate directness far more than trying to read subtle signals.',
    tips: [
      'Asking for pleasure benefits both of you',
      'Vague hints are actually harder to respond to than clear requests',
      'Confidence about your desires is often experienced as sexy',
    ],
  },
];

// Helper to get starter by situation
export function getStarterBySituation(situation: string): ConversationStarter | undefined {
  return conversationStarters.find((s) => s.situation === situation);
}

// Helper to get scripts by category
export function getScriptsByCategory(category: string): ScriptExample[] {
  return scriptExamples.filter((s) => s.category === category);
}

// Get all unique script categories
export function getScriptCategories(): string[] {
  return [...new Set(scriptExamples.map((s) => s.category))];
}

export const scriptModules: ScriptModule[] = [
  { id: 'opener-soft', category: 'opener', label: 'Soft opener', phrase: 'Can we talk about something that\'s been on my mind?' },
  { id: 'opener-curious', category: 'opener', label: 'Curious opener', phrase: 'I\'ve been learning about something and I\'d love to share it with you.' },
  { id: 'opener-direct', category: 'opener', label: 'Direct opener', phrase: 'I want to tell you about something I\'ve noticed about myself.' },
  { id: 'context-learning', category: 'context', label: 'Learning context', phrase: 'I\'ve been reading about how bodies work, and it helped me understand something.' },
  { id: 'context-discovery', category: 'context', label: 'Discovery context', phrase: 'I tried paying attention to what I actually enjoy, and I noticed something.' },
  { id: 'context-feeling', category: 'context', label: 'Feeling context', phrase: 'Something has been feeling different lately, and I want to name it.' },
  { id: 'request-explore', category: 'request', label: 'Explore together', phrase: 'Would you be open to trying [specific thing] together?' },
  { id: 'request-slow', category: 'request', label: 'Slow down', phrase: 'Can we slow down and take more time at the beginning?' },
  { id: 'request-more', category: 'request', label: 'More of this', phrase: 'That thing you were doing felt really good. Can we do more of that?' },
  { id: 'request-change', category: 'request', label: 'Try differently', phrase: 'Can we try something a little different? I think I need more [pressure/speed/etc.].' },
  { id: 'feeling-good', category: 'feeling', label: 'Feels good', phrase: 'That feels amazing — exactly like that.' },
  { id: 'feeling-curious', category: 'feeling', label: 'Curious feeling', phrase: 'I\'m curious about what would happen if we...' },
  { id: 'feeling-vulnerable', category: 'feeling', label: 'Vulnerable share', phrase: 'This feels a little vulnerable to say, but I trust you.' },
  { id: 'closer-no-pressure', category: 'closer', label: 'No pressure', phrase: 'No pressure — I just wanted you to know.' },
  { id: 'closer-together', category: 'closer', label: 'Together', phrase: 'I\'d love to figure this out together, at our own pace.' },
  { id: 'closer-thanks', category: 'closer', label: 'Gratitude', phrase: 'Thank you for being open to this conversation.' },
];

export const scriptModuleCategories: { id: ScriptModule['category']; label: string }[] = [
  { id: 'opener', label: 'Open with' },
  { id: 'context', label: 'Set context' },
  { id: 'request', label: 'Make a request' },
  { id: 'feeling', label: 'Share a feeling' },
  { id: 'closer', label: 'Close with' },
];

export function getModulesByCategory(category: ScriptModule['category']): ScriptModule[] {
  return scriptModules.filter((m) => m.category === category);
}

export function buildScriptFromModules(selectedIds: string[]): string {
  return selectedIds
    .map((id) => scriptModules.find((m) => m.id === id)?.phrase)
    .filter(Boolean)
    .join(' ');
}

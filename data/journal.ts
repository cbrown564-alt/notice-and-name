import { concepts, getConceptById } from '@/data/vocabulary';
import { JournalMood } from '@/types';

export interface MoodOption {
  id: JournalMood;
  label: string;
  emoji: string;
}

export const JOURNAL_MOODS: MoodOption[] = [
  { id: 'curious', label: 'Curious', emoji: '🔍' },
  { id: 'surprised', label: 'Surprised', emoji: '✨' },
  { id: 'validating', label: 'Validating', emoji: '💛' },
  { id: 'uncertain', label: 'Uncertain', emoji: '🌫️' },
  { id: 'excited', label: 'Excited', emoji: '🔥' },
  { id: 'reflective', label: 'Reflective', emoji: '🪞' },
];

export const GENERIC_JOURNAL_PROMPTS = [
  'What stood out to you in your exploration this week?',
  'Has anything you learned changed how you see your own body?',
  'What would you want a partner to understand about you right now?',
  'What felt surprising or new when you sat with this idea?',
];

export function getConceptJournalPrompt(conceptId: string): string | null {
  const concept = getConceptById(conceptId);
  if (!concept) return null;
  return `What does "${concept.name}" change about how you see your own experience?`;
}

export function getJournalPromptSuggestions(conceptId?: string | null): string[] {
  const prompts = [...GENERIC_JOURNAL_PROMPTS];
  if (conceptId) {
    const conceptPrompt = getConceptJournalPrompt(conceptId);
    if (conceptPrompt) prompts.unshift(conceptPrompt);
  }
  return prompts.slice(0, 4);
}

export function getMoodLabel(mood: string | null | undefined): string | null {
  if (!mood) return null;
  return JOURNAL_MOODS.find((m) => m.id === mood)?.label ?? null;
}

export function getMoodEmoji(mood: string | null | undefined): string | null {
  if (!mood) return null;
  return JOURNAL_MOODS.find((m) => m.id === mood)?.emoji ?? null;
}

/** Find a past entry linked to the same concept, at least 30 days old. */
export function findMemoryEntry<T extends { concept_id: string | null; created_at: string; content: string; id: string }>(
  entries: T[],
  conceptId: string | null
): T | null {
  if (!conceptId) return null;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const linked = entries.filter(
    (e) => e.concept_id === conceptId && new Date(e.created_at).getTime() < thirtyDaysAgo
  );
  if (linked.length === 0) return null;
  return linked[0];
}

export function formatMemoryAge(dateString: string): string {
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
  if (days < 60) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

export function getRecentlyExploredConceptIds(
  userConcepts: { concept_id: string; status: string; updated_at: string }[]
): string[] {
  return userConcepts
    .filter((uc) => uc.status !== 'unexplored')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3)
    .map((uc) => uc.concept_id);
}

export function getSuggestedConceptForJournal(
  userConcepts: { concept_id: string; status: string; updated_at: string }[]
): typeof concepts[0] | null {
  const recentId = getRecentlyExploredConceptIds(userConcepts)[0];
  return recentId ? getConceptById(recentId) ?? null : null;
}

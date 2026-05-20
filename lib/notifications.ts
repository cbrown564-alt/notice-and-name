// Lightweight daily suggestion rhythm
// Without expo-notifications installed, this module provides:
// 1. In-app daily suggestion state management
// 2. Logic for "90-second promise" and gentle nudges
// 3. Groundwork for future push notification integration

import { db } from './database/index';

const DAILY_SUGGESTION_KEY = '@vocab:daily_suggestion_state';

export interface DailySuggestionState {
  lastPresentedDate: string | null; // YYYY-MM-DD
  lastPresentedConceptId: string | null;
  conceptsExploredToday: number;
}

const DEFAULT_STATE: DailySuggestionState = {
  lastPresentedDate: null,
  lastPresentedConceptId: null,
  conceptsExploredToday: 0,
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Load daily suggestion state.
 */
export async function loadDailyState(): Promise<DailySuggestionState> {
  const data = await db.settings.getJSON<DailySuggestionState>(DAILY_SUGGESTION_KEY, DEFAULT_STATE);
  const today = getToday();

  // Reset daily counters if it's a new day
  if (data.lastPresentedDate !== today) {
    return {
      ...data,
      conceptsExploredToday: 0,
    };
  }
  return { ...DEFAULT_STATE, ...data };
}

/**
 * Save daily suggestion state.
 */
export async function saveDailyState(state: DailySuggestionState): Promise<void> {
  await db.settings.setJSON(DAILY_SUGGESTION_KEY, state);
}

/**
 * Record that a concept was explored today.
 */
export async function recordConceptExploredToday(conceptId: string): Promise<void> {
  const state = await loadDailyState();
  const today = getToday();

  await saveDailyState({
    ...state,
    lastPresentedDate: today,
    lastPresentedConceptId: conceptId,
    conceptsExploredToday: state.conceptsExploredToday + 1,
  });
}

/**
 * Get a gentle prompt message for the home screen.
 */
export function getDailyPrompt(conceptsExploredToday: number, streakDays: number): string {
  if (conceptsExploredToday === 0) {
    if (streakDays >= 3) {
      return 'Today\'s concept takes about 90 seconds.';
    }
    return 'A moment of clarity awaits.';
  }
  if (conceptsExploredToday === 1) {
    return 'One concept named. Room for more?';
  }
  return 'You\'re on a roll today.';
}

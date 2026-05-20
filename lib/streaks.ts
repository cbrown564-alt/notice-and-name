// Streak tracking — "without shame" philosophy
// If a user misses a day, the streak pauses rather than breaks.
// After 3 days of inactivity, it gently resets with a warm message.

import { db } from './database/index';

const STREAK_KEY = '@vocab:streak_data';
const STREAK_PAUSE_DAYS = 1;   // pause after 1 missed day
const STREAK_RESET_DAYS = 3;   // reset after 3 inactive days

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  lastActiveDate: string | null; // ISO date string (date only, YYYY-MM-DD)
  isPaused: boolean;
  pausedAt: string | null;
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalDaysActive: 0,
  lastActiveDate: null,
  isPaused: false,
  pausedAt: null,
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + 'T00:00:00Z');
  const d2 = new Date(b + 'T00:00:00Z');
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Load streak data from settings.
 */
export async function loadStreakData(): Promise<StreakData> {
  const data = await db.settings.getJSON<StreakData>(STREAK_KEY, DEFAULT_STREAK);
  return { ...DEFAULT_STREAK, ...data };
}

/**
 * Save streak data to settings.
 */
export async function saveStreakData(data: StreakData): Promise<void> {
  await db.settings.setJSON(STREAK_KEY, data);
}

/**
 * Record app open / activity for today.
 * Idempotent — calling multiple times per day only counts once.
 */
export async function recordActivity(): Promise<StreakData> {
  const today = getToday();
  const data = await loadStreakData();

  if (data.lastActiveDate === today) {
    return data; // already counted today
  }

  if (!data.lastActiveDate) {
    // First ever activity
    const updated: StreakData = {
      ...data,
      currentStreak: 1,
      longestStreak: 1,
      totalDaysActive: 1,
      lastActiveDate: today,
      isPaused: false,
      pausedAt: null,
    };
    await saveStreakData(updated);
    return updated;
  }

  const gap = daysBetween(data.lastActiveDate, today);

  if (gap === 1) {
    // Consecutive day
    const newStreak = data.currentStreak + 1;
    const updated: StreakData = {
      ...data,
      currentStreak: newStreak,
      longestStreak: Math.max(data.longestStreak, newStreak),
      totalDaysActive: data.totalDaysActive + 1,
      lastActiveDate: today,
      isPaused: false,
      pausedAt: null,
    };
    await saveStreakData(updated);
    return updated;
  }

  if (gap === 2) {
    // One day missed — pause, don't break
    const updated: StreakData = {
      ...data,
      currentStreak: data.currentStreak, // preserved
      totalDaysActive: data.totalDaysActive + 1,
      lastActiveDate: today,
      isPaused: true,
      pausedAt: today,
    };
    await saveStreakData(updated);
    return updated;
  }

  if (gap >= 3) {
    // 3+ days missed — gentle reset
    const updated: StreakData = {
      ...data,
      currentStreak: 1,
      totalDaysActive: data.totalDaysActive + 1,
      lastActiveDate: today,
      isPaused: false,
      pausedAt: null,
    };
    await saveStreakData(updated);
    return updated;
  }

  return data;
}

/**
 * Get streak status message for UI display.
 */
export function getStreakMessage(data: StreakData): string {
  if (data.currentStreak === 0 && data.totalDaysActive === 0) {
    return 'Your exploration begins when you\'re ready.';
  }
  if (data.isPaused) {
    return `Your ${data.currentStreak}-day streak is paused. Pick up where you left off.`;
  }
  if (data.currentStreak === 1 && data.totalDaysActive === 1) {
    return 'First day of exploration. Welcome.';
  }
  if (data.currentStreak >= 7) {
    return `${data.currentStreak} days of curiosity. You\'re building something.`;
  }
  return `${data.currentStreak} day${data.currentStreak === 1 ? '' : 's'} exploring.`;
}

/**
 * Get a "Pleasure Literacy" level based on concepts explored.
 */
export function getLiteracyLevel(exploredCount: number, totalConcepts: number): {
  level: string;
  label: string;
  description: string;
  nextThreshold: number | null;
} {
  const pct = totalConcepts > 0 ? exploredCount / totalConcepts : 0;

  if (exploredCount === 0) {
    return {
      level: 'beginner',
      label: 'Curious Beginner',
      description: 'Every expert was once a beginner.',
      nextThreshold: 3,
    };
  }
  if (pct < 0.25) {
    return {
      level: 'beginner',
      label: 'Curious Beginner',
      description: 'You\'re discovering the landscape.',
      nextThreshold: Math.ceil(totalConcepts * 0.25),
    };
  }
  if (pct < 0.5) {
    return {
      level: 'explorer',
      label: 'Pleasure Explorer',
      description: 'You\'re mapping your own terrain.',
      nextThreshold: Math.ceil(totalConcepts * 0.5),
    };
  }
  if (pct < 0.75) {
    return {
      level: 'fluent',
      label: 'Pleasure Fluent',
      description: 'You speak this language with growing confidence.',
      nextThreshold: Math.ceil(totalConcepts * 0.75),
    };
  }
  if (pct < 1) {
    return {
      level: 'scholar',
      label: 'Pleasure Scholar',
      description: 'Deep knowledge, precisely named.',
      nextThreshold: totalConcepts,
    };
  }
  return {
    level: 'master',
    label: 'Pleasure Literate',
    description: 'You\'ve named the full landscape.',
    nextThreshold: null,
  };
}

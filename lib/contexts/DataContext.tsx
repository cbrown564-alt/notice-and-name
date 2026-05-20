// Data Context
// Provides shared data state across the app, replacing event-based synchronization

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useError } from '@/components/error';
import { db, initDatabase } from '../database/index';
import { getErrorMessage } from '../errors';
import { logger } from '../logger';
import { loadStreakData, recordActivity, StreakData } from '../streaks';
import {
  ValidatedOnboardingRow,
  ValidatedUserConceptRow,
} from '../validation';

const log = logger.scope('DataContext');

// ============ Context Types ============

interface DataContextValue {
  // Database initialization
  isDbReady: boolean;
  dbError: Error | null;

  // Concepts
  concepts: ValidatedUserConceptRow[];
  unlockedIds: string[];
  masteredIds: string[];
  conceptsLoading: boolean;
  conceptsError: string | null;
  refreshConcepts: () => Promise<void>;

  // Onboarding
  onboarding: ValidatedOnboardingRow | null;
  onboardingLoading: boolean;
  onboardingError: string | null;
  refreshOnboarding: () => Promise<void>;

  // Stats (derived from concepts)
  exploredCount: number;
  resonatesCount: number;

  // Refresh all data
  refreshAll: () => Promise<void>;

  // Streaks
  streak: StreakData | null;
  streakLoading: boolean;
  refreshStreak: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

// ============ Provider Component ============

interface DataProviderProps {
  children: React.ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  // Error context integration
  const { setCriticalError, setOnRetry, setSectionError, clearSectionError } = useError();

  // Database initialization state
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<Error | null>(null);

  // Concepts state
  const [concepts, setConcepts] = useState<ValidatedUserConceptRow[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [conceptsLoading, setConceptsLoading] = useState(true);
  const [conceptsError, setConceptsError] = useState<string | null>(null);

  // Onboarding state
  const [onboarding, setOnboarding] = useState<ValidatedOnboardingRow | null>(null);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  // Streaks state
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [streakLoading, setStreakLoading] = useState(true);

  // Initialize database
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await initDatabase();
        if (mounted) {
          setIsDbReady(true);
          setCriticalError(null); // Clear any previous critical error
        }
      } catch (e) {
        const error = e instanceof Error ? e : new Error('Failed to initialize database');
        if (mounted) {
          setDbError(error);
          // Set critical error for full-screen display
          setCriticalError(error);
          // Set retry handler to re-attempt initialization
          setOnRetry(() => {
            setDbError(null);
            init();
          });
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [setCriticalError, setOnRetry]);

  // Refresh concepts
  const refreshConcepts = useCallback(async () => {
    if (!isDbReady) return;

    setConceptsLoading(true);
    setConceptsError(null);
    clearSectionError('concepts');

    try {
      const [conceptsResult, unlocked, mastered] = await Promise.all([
        db.concepts.getAll(),
        db.concepts.getUnlockedIds(),
        db.concepts.getMasteredIds(),
      ]);
      setConcepts(conceptsResult);
      setUnlockedIds(unlocked);
      setMasteredIds(mastered);
    } catch (err) {
      const message = getErrorMessage(err);
      log.error('Failed to load concepts', err);
      setConceptsError(message);
      // Set section error for inline banner display
      setSectionError('concepts', {
        message,
        retryFn: refreshConcepts,
      });
    } finally {
      setConceptsLoading(false);
    }
  }, [isDbReady, clearSectionError, setSectionError]);

  // Refresh onboarding
  const refreshOnboarding = useCallback(async () => {
    if (!isDbReady) return;

    setOnboardingLoading(true);
    setOnboardingError(null);
    clearSectionError('onboarding');

    try {
      const result = await db.onboarding.get();
      setOnboarding(result);
    } catch (err) {
      const message = getErrorMessage(err);
      log.error('Failed to load onboarding', err);
      setOnboardingError(message);
      // Set section error for inline banner display
      setSectionError('onboarding', {
        message,
        retryFn: refreshOnboarding,
      });
    } finally {
      setOnboardingLoading(false);
    }
  }, [isDbReady, clearSectionError, setSectionError]);

  // Refresh streak
  const refreshStreak = useCallback(async () => {
    setStreakLoading(true);
    try {
      const data = await loadStreakData();
      setStreak(data);
    } catch (err) {
      log.error('Failed to load streak data', err);
    } finally {
      setStreakLoading(false);
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([refreshConcepts(), refreshOnboarding(), refreshStreak()]);
  }, [refreshConcepts, refreshOnboarding, refreshStreak]);

  // Load initial data when database is ready
  useEffect(() => {
    if (isDbReady) {
      refreshAll();
    }
  }, [isDbReady, refreshAll]);

  // Record app open activity once on startup
  useEffect(() => {
    if (isDbReady) {
      let mounted = true;
      recordActivity().then((updated) => {
        if (mounted) {
          setStreak(updated);
          setStreakLoading(false);
        }
      });
      return () => {
        mounted = false;
      };
    }
  }, [isDbReady]);

  // Compute stats from concepts
  const exploredCount = useMemo(() => {
    return concepts.filter((c) => c.status !== 'unexplored').length;
  }, [concepts]);

  const resonatesCount = useMemo(() => {
    return concepts.filter((c) => c.status === 'resonates').length;
  }, [concepts]);

  // Memoize context value
  const value = useMemo<DataContextValue>(
    () => ({
      isDbReady,
      dbError,
      concepts,
      unlockedIds,
      masteredIds,
      conceptsLoading,
      conceptsError,
      refreshConcepts,
      onboarding,
      onboardingLoading,
      onboardingError,
      refreshOnboarding,
      exploredCount,
      resonatesCount,
      refreshAll,
      streak,
      streakLoading,
      refreshStreak,
    }),
    [
      isDbReady,
      dbError,
      concepts,
      unlockedIds,
      masteredIds,
      conceptsLoading,
      conceptsError,
      refreshConcepts,
      onboarding,
      onboardingLoading,
      onboardingError,
      refreshOnboarding,
      exploredCount,
      resonatesCount,
      refreshAll,
      streak,
      streakLoading,
      refreshStreak,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ============ Hook ============

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// ============ Convenience Hooks ============

/**
 * Hook for database initialization status.
 */
export function useDbReady() {
  const { isDbReady, dbError } = useData();
  return { isReady: isDbReady, error: dbError };
}

/**
 * Hook for onboarding state with update capabilities.
 */
export function useOnboardingContext() {
  const {
    onboarding,
    onboardingLoading,
    onboardingError,
    refreshOnboarding,
  } = useData();

  return {
    state: onboarding,
    isLoading: onboardingLoading,
    error: onboardingError,
    isCompleted: onboarding?.completed === 1,
    goal: onboarding?.goal ?? null,
    reload: refreshOnboarding,
  };
}

/**
 * Hook for concepts state with update capabilities.
 */
export function useConceptsContext() {
  const {
    concepts,
    unlockedIds,
    masteredIds,
    conceptsLoading,
    conceptsError,
    refreshConcepts,
  } = useData();

  return {
    concepts,
    unlockedConcepts: unlockedIds,
    masteredConcepts: masteredIds,
    isLoading: conceptsLoading,
    error: conceptsError,
    reload: refreshConcepts,
  };
}

/**
 * Hook for stats.
 */
export function useStatsContext() {
  const { exploredCount, resonatesCount, conceptsLoading, refreshConcepts } = useData();

  return {
    exploredCount,
    resonatesCount,
    isLoading: conceptsLoading,
    reload: refreshConcepts,
  };
}

/**
 * Hook for streaks.
 */
export function useStreaksContext() {
  const { streak, streakLoading, refreshStreak } = useData();

  return {
    streak,
    isLoading: streakLoading,
    reload: refreshStreak,
  };
}

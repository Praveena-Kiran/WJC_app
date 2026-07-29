/**
 * AppContext.tsx — React Native port of web/src/context/AppContext.tsx
 *
 * Source of truth: server (/api/progress). Local state is optimistic.
 * Cache: AsyncStorage (zengo_app_state_v1) for instant load on restart.
 *
 * Data flow:
 *   1. Mount: loadCache() → instant local state render
 *   2. Mount: GET /api/progress → merge into state → saveCache()
 *   3. Mutation: optimistic local state update → debounced PUT /api/progress → saveCache()
 *
 * Action surface mirrors the web AppContext exactly so modules don't need to change.
 * Functions speakJapanese() and playSound() are stubs until #038 and #055.
 *
 * Closes #013
 */
'use client'; // Not required in RN but mirrors the web file for clarity.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'expo-router';
import { apiFetch } from '@/src/lib/api-fetch';
import { loadCache, saveCache, clearCache } from '@/src/lib/storage';
import { computeSrsUpdate, defaultSrsCard, type SrsRating, type SrsCardData } from '@/src/lib/srs';
import { resolveViewRoute } from '@/src/lib/routes';

// ── State shape ───────────────────────────────────────────────────────────────

export interface AppState {
  activeView: string;
  studyMode: 'zen' | 'cyber';
  cyberTheme: 'dark' | 'light';
  userRole: 'external' | 'woxsen-student' | 'teacher' | 'admin';
  activeStudentName: string;
  solvedLessons: number[];
  activeLessonId: number;
  masteredKana: string[];
  starredVocab: string[];
  practicedKanji: string[];
  streakCount: number;
  quizState: {
    deck: string;
    length: number;
    currentQuestionIndex: number;
    score: number;
    questions: unknown[];
  };
  srsData: Record<string, SrsCardData>;
  n5TargetDate: string;
  dailyTasksCompleted: string[];
  hasCompletedOnboarding: boolean;
  targetJlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  solvedNodes: number[];
}

// Default target date = 30 days from now
const defaultTargetDate = (): string => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
};

const initialAppState: AppState = {
  activeView: 'dashboard',
  studyMode: 'zen',
  cyberTheme: 'dark',
  userRole: 'external',
  activeStudentName: '',
  solvedLessons: [1],
  activeLessonId: 1,
  masteredKana: [],
  starredVocab: [],
  practicedKanji: [],
  streakCount: 0,
  quizState: {
    deck: 'hiragana',
    length: 10,
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
  },
  srsData: {},
  n5TargetDate: defaultTargetDate(),
  dailyTasksCompleted: [],
  hasCompletedOnboarding: false,
  targetJlptLevel: 'N5',
  solvedNodes: [1],
};

// ── Context type ──────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  isReady: boolean;           // true once initial fetch completes (or fails)
  setActiveView: (view: string) => void;
  setStudyMode: (mode: 'zen' | 'cyber') => void;
  setCyberTheme: (theme: 'dark' | 'light') => void;
  setUserRole: (role: 'external' | 'woxsen-student' | 'teacher' | 'admin') => void;
  setActiveLessonId: (id: number) => void;
  markLessonSolved: (id: number) => void;
  markNodeSolved: (nodeId: number) => void;
  toggleStarVocab: (word: string) => void;
  toggleMasterKana: (kanaId: string) => void;
  addPracticedKanji: (char: string) => void;
  setQuizState: (updater: (prev: AppState['quizState']) => AppState['quizState']) => void;
  updateSrsData: (kanaId: string, rating: SrsRating) => void;
  setN5TargetDate: (dateStr: string) => void;
  toggleDailyTask: (taskId: string) => void;
  completeOnboarding: (data: {
    name: string;
    role: 'external' | 'woxsen-student' | 'teacher' | 'admin';
    targetDate: string;
    level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  }) => void;
  speakJapanese: (text: string) => void;   // stub until #038
  playSound: (type: 'click' | 'correct' | 'incorrect' | 'success') => void; // stub until #055
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AppState>(initialAppState);
  const [isReady, setIsReady] = useState(false);

  // Debounce timer ref for PUT /api/progress
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingState = useRef<AppState | null>(null);

  // ── Stubs (implemented by #038 and #055) ────────────────────────────────
  const speakJapanese = useCallback((text: string) => {
    console.log('[speakJapanese stub] text:', text, '— implement in #038');
  }, []);

  const playSound = useCallback((type: 'click' | 'correct' | 'incorrect' | 'success') => {
    console.log('[playSound stub] type:', type, '— implement in #055');
  }, []);

  // ── Sync helpers ─────────────────────────────────────────────────────────

  /** Send a debounced PUT to /api/progress. Fires 1s after last mutation. */
  const scheduleSyncToServer = useCallback((nextState: AppState) => {
    pendingState.current = nextState;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      const s = pendingState.current;
      if (!s) return;
      try {
        await apiFetch('/api/progress', {
          method: 'PUT',
          body: JSON.stringify({
            profile: {
              role: s.userRole,
              studyMode: s.studyMode,
              cyberTheme: s.cyberTheme,
              targetJlptLevel: s.targetJlptLevel,
              n5TargetDate: s.n5TargetDate,
            },
            progress: {
              masteredKana: s.masteredKana,
              starredVocab: s.starredVocab,
              practicedKanji: s.practicedKanji,
              solvedLessons: s.solvedLessons,
              solvedNodes: s.solvedNodes,
              activeLessonId: s.activeLessonId,
              streakCount: s.streakCount,
              dailyTasksCompleted: s.dailyTasksCompleted,
            },
          }),
        });
      } catch {
        // Silent fail — state is still correct in memory and AsyncStorage.
      }
    }, 1000);
  }, []);

  /** Update local state, save cache, and schedule server sync. */
  const mutate = useCallback(
    (updater: (prev: AppState) => AppState) => {
      setState((prev) => {
        const next = updater(prev);
        void saveCache(next);
        scheduleSyncToServer(next);
        return next;
      });
    },
    [scheduleSyncToServer]
  );

  // ── Initial load: cache → server ─────────────────────────────────────────
  useEffect(() => {
    async function init() {
      // 1. Load from AsyncStorage for instant render
      const cached = await loadCache();
      if (cached) {
        setState((prev) => ({ ...prev, ...(cached as Partial<AppState>) }));
      }

      // 2. Fetch from server and merge (server is the source of truth)
      try {
        const { profile, progress } = await apiFetch<{
          profile: {
            role?: string;
            studyMode?: string;
            cyberTheme?: string;
            targetJlptLevel?: string;
            n5TargetDate?: string;
          } | null;
          progress: {
            masteredKana?: string[];
            starredVocab?: string[];
            practicedKanji?: string[];
            solvedLessons?: number[];
            solvedNodes?: number[];
            activeLessonId?: number;
            streakCount?: number;
            dailyTasksCompleted?: string[];
          } | null;
        }>('/api/progress');

        setState((prev) => {
          const next: AppState = {
            ...prev,
            // From profile
            userRole: (profile?.role ?? prev.userRole) as AppState['userRole'],
            studyMode: (profile?.studyMode ?? prev.studyMode) as 'zen' | 'cyber',
            cyberTheme: (profile?.cyberTheme ?? prev.cyberTheme) as 'dark' | 'light',
            targetJlptLevel: (profile?.targetJlptLevel ?? prev.targetJlptLevel) as AppState['targetJlptLevel'],
            n5TargetDate: profile?.n5TargetDate ?? prev.n5TargetDate,
            hasCompletedOnboarding: !!profile,
            // From progress
            masteredKana: progress?.masteredKana ?? prev.masteredKana,
            starredVocab: progress?.starredVocab ?? prev.starredVocab,
            practicedKanji: progress?.practicedKanji ?? prev.practicedKanji,
            solvedLessons: progress?.solvedLessons ?? prev.solvedLessons,
            solvedNodes: progress?.solvedNodes ?? prev.solvedNodes,
            activeLessonId: progress?.activeLessonId ?? prev.activeLessonId,
            streakCount: progress?.streakCount ?? prev.streakCount,
            dailyTasksCompleted: progress?.dailyTasksCompleted ?? prev.dailyTasksCompleted,
          };
          void saveCache(next);
          return next;
        });
      } catch {
        // Offline or unauthenticated — cached state is used until reconnect.
      }
      setIsReady(true);
    }
    void init();
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => () => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const setActiveView = useCallback((view: string) => {
    playSound('click');
    const route = resolveViewRoute(view);
    setState((prev) => ({ ...prev, activeView: view }));
    router.push(route as Parameters<typeof router.push>[0]);
  }, [playSound, router]);

  const setStudyMode = useCallback((mode: 'zen' | 'cyber') => {
    playSound('click');
    mutate((prev) => ({ ...prev, studyMode: mode }));
  }, [playSound, mutate]);

  const setCyberTheme = useCallback((theme: 'dark' | 'light') => {
    playSound('click');
    mutate((prev) => ({ ...prev, cyberTheme: theme }));
  }, [playSound, mutate]);

  const setUserRole = useCallback((role: 'external' | 'woxsen-student' | 'teacher' | 'admin') => {
    playSound('success');
    mutate((prev) => ({ ...prev, userRole: role, activeView: 'dashboard' }));
  }, [playSound, mutate]);

  const setActiveLessonId = useCallback((id: number) => {
    mutate((prev) => ({ ...prev, activeLessonId: id }));
  }, [mutate]);

  const markLessonSolved = useCallback((id: number) => {
    mutate((prev) => {
      const solved = prev.solvedLessons.includes(id)
        ? prev.solvedLessons
        : [...prev.solvedLessons, id];
      const nextId = id + 1;
      return {
        ...prev,
        solvedLessons: solved,
        activeLessonId: nextId <= 10 ? nextId : prev.activeLessonId,
        streakCount: prev.solvedLessons.includes(id)
          ? prev.streakCount
          : prev.streakCount + 1,
      };
    });
    // playSound('success') is deferred until after server confirm in #038
  }, [mutate]);

  const markNodeSolved = useCallback((nodeId: number) => {
    playSound('success');
    mutate((prev) => {
      const current = prev.solvedNodes ?? [1];
      const nextSolved = current.includes(nodeId) ? current : [...current, nodeId];
      const nextUnlocked = nodeId + 1;
      const final = nextSolved.includes(nextUnlocked)
        ? nextSolved
        : [...nextSolved, nextUnlocked];
      return { ...prev, solvedNodes: final };
    });
  }, [playSound, mutate]);

  const toggleStarVocab = useCallback((word: string) => {
    playSound('click');
    mutate((prev) => {
      const isStarred = prev.starredVocab.includes(word);
      const starredVocab = isStarred
        ? prev.starredVocab.filter((w) => w !== word)
        : [...prev.starredVocab, word];
      return { ...prev, starredVocab };
    });
  }, [playSound, mutate]);

  const toggleMasterKana = useCallback((kanaId: string) => {
    playSound('click');
    mutate((prev) => {
      const isMastered = prev.masteredKana.includes(kanaId);
      const masteredKana = isMastered
        ? prev.masteredKana.filter((id) => id !== kanaId)
        : [...prev.masteredKana, kanaId];
      return { ...prev, masteredKana };
    });
  }, [playSound, mutate]);

  const addPracticedKanji = useCallback((char: string) => {
    mutate((prev) => {
      if (prev.practicedKanji.includes(char)) return prev;
      return { ...prev, practicedKanji: [...prev.practicedKanji, char] };
    });
  }, [mutate]);

  const setQuizState = useCallback(
    (updater: (prev: AppState['quizState']) => AppState['quizState']) => {
      setState((prev) => ({ ...prev, quizState: updater(prev.quizState) }));
    },
    []
  );

  const updateSrsData = useCallback((kanaId: string, rating: SrsRating) => {
    mutate((prev) => {
      const current = prev.srsData[kanaId] ?? defaultSrsCard();
      const next = computeSrsUpdate(current, rating);
      return {
        ...prev,
        srsData: { ...prev.srsData, [kanaId]: next },
      };
    });
  }, [mutate]);

  const setN5TargetDate = useCallback((dateStr: string) => {
    playSound('click');
    mutate((prev) => ({ ...prev, n5TargetDate: dateStr }));
  }, [playSound, mutate]);

  const toggleDailyTask = useCallback((taskId: string) => {
    playSound('click');
    mutate((prev) => {
      const isDone = prev.dailyTasksCompleted?.includes(taskId);
      const dailyTasksCompleted = isDone
        ? prev.dailyTasksCompleted.filter((id) => id !== taskId)
        : [...(prev.dailyTasksCompleted ?? []), taskId];
      return { ...prev, dailyTasksCompleted };
    });
  }, [playSound, mutate]);

  const completeOnboarding = useCallback(
    (data: {
      name: string;
      role: 'external' | 'woxsen-student' | 'teacher' | 'admin';
      targetDate: string;
      level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
    }) => {
      playSound('success');
      mutate((prev) => ({
        ...prev,
        activeStudentName: data.name || prev.activeStudentName,
        userRole: data.role,
        n5TargetDate: data.targetDate,
        targetJlptLevel: data.level,
        hasCompletedOnboarding: true,
      }));
    },
    [playSound, mutate]
  );

  const signOut = useCallback(async () => {
    await clearCache();
    setState(initialAppState);
    // The auth client handles session clearing — caller invokes authClient.signOut()
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        isReady,
        setActiveView,
        setStudyMode,
        setCyberTheme,
        setUserRole,
        setActiveLessonId,
        markLessonSolved,
        markNodeSolved,
        toggleStarVocab,
        toggleMasterKana,
        addPracticedKanji,
        setQuizState,
        updateSrsData,
        setN5TargetDate,
        toggleDailyTask,
        completeOnboarding,
        speakJapanese,
        playSound,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

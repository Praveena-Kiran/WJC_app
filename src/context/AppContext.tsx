"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { soundSynth } from "@/lib/sound";

export interface AppState {
  activeView: string;
  studyMode: "zen" | "cyber";
  cyberTheme: "dark" | "light";
  userRole: "external" | "woxsen-student" | "teacher";
  activeStudentName: string;
  solvedLessons: number[];
  activeLessonId: number;
  masteredKana: string[];
  starredVocab: string[];
  practicedKanji: string[];
  streakCount: number;
  attendanceDb: Record<string, Record<string, string>>;
  uploadedFiles: Array<{ name: string; size: string; date: string }>;
  quizState: {
    deck: string;
    length: number;
    currentQuestionIndex: number;
    score: number;
    questions: any[];
  };
  srsData: Record<string, { interval: number; easeFactor: number; dueDate: string; reviews: number }>;
  soundBannerDismissed: boolean;
  n5TargetDate: string;
  dailyTasksCompleted: string[];
  hasCompletedOnboarding: boolean;
  targetJlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";
  showOnboardingModal: boolean;
  solvedNodes: number[];
}

// Compute default target date (30 days from now)
const defaultTargetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const initialAppState: AppState = {
  activeView: "dashboard",
  studyMode: "zen",
  cyberTheme: "dark",
  userRole: "external",
  activeStudentName: "Sneha Reddy",
  solvedLessons: [1],
  activeLessonId: 1,
  masteredKana: [],
  starredVocab: [],
  practicedKanji: [],
  streakCount: 3,
  attendanceDb: {
    "2026-07-10": { "Sneha Reddy": "present", "Rohan Sharma": "present", "Arjun Verma": "present", "Pooja Patel": "present", "Vince Carter": "present" },
    "2026-07-12": { "Sneha Reddy": "present", "Rohan Sharma": "absent", "Arjun Verma": "present", "Pooja Patel": "present", "Vince Carter": "present" },
    "2026-07-13": { "Sneha Reddy": "present", "Rohan Sharma": "present", "Arjun Verma": "absent", "Pooja Patel": "present", "Vince Carter": "present" },
    "2026-07-14": { "Sneha Reddy": "absent", "Rohan Sharma": "present", "Arjun Verma": "present", "Pooja Patel": "present", "Vince Carter": "present" },
    "2026-07-15": { "Sneha Reddy": "present", "Rohan Sharma": "present", "Arjun Verma": "present", "Pooja Patel": "present", "Vince Carter": "present" }
  },
  uploadedFiles: [
    { name: "Minna-No-Nihongo-I-Grammar-Notes.pdf", size: "1.4 MB", date: "2026-07-14" },
    { name: "Basic-Kanji-Book-Chapter1-Exercises.pdf", size: "850 KB", date: "2026-07-17" }
  ],
  quizState: {
    deck: "hiragana",
    length: 10,
    currentQuestionIndex: 0,
    score: 0,
    questions: []
  },
  srsData: {},
  soundBannerDismissed: false,
  n5TargetDate: defaultTargetDate,
  dailyTasksCompleted: [],
  hasCompletedOnboarding: false,
  targetJlptLevel: "N5",
  showOnboardingModal: false,
  solvedNodes: [1]
};

interface AppContextType {
  state: AppState;
  setActiveView: (view: string) => void;
  setStudyMode: (mode: "zen" | "cyber") => void;
  setCyberTheme: (theme: "dark" | "light") => void;
  setUserRole: (role: "external" | "woxsen-student" | "teacher") => void;
  setActiveLessonId: (id: number) => void;
  markLessonSolved: (id: number) => void;
  markNodeSolved: (nodeId: number) => void;
  toggleStarVocab: (word: string) => void;
  toggleMasterKana: (kanaId: string) => void;
  addPracticedKanji: (char: string) => void;
  saveAttendanceRecord: (date: string, records: Record<string, string>) => void;
  addUploadedFile: (file: { name: string; size: string; date: string }) => void;
  deleteUploadedFile: (name: string) => void;
  setQuizState: (updater: (prev: AppState["quizState"]) => AppState["quizState"]) => void;
  updateSrsData: (kanaId: string, rating: "again" | "hard" | "good" | "easy") => void;
  dismissSoundBanner: () => void;
  setN5TargetDate: (dateStr: string) => void;
  toggleDailyTask: (taskId: string) => void;
  completeOnboarding: (data: { name: string; role: "external" | "woxsen-student" | "teacher"; targetDate: string; level: "N5" | "N4" | "N3" | "N2" | "N1" }) => void;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  speakJapanese: (text: string) => void;
  playSound: (type: "click" | "correct" | "incorrect" | "success") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialAppState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zengo_app_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
          showOnboardingModal: !parsed.hasCompletedOnboarding
        }));
      } else {
        setState((prev) => ({ ...prev, showOnboardingModal: true }));
      }
    } catch (e) {
      console.error("Error loading state:", e);
      setState((prev) => ({ ...prev, showOnboardingModal: true }));
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("zengo_app_state", JSON.stringify(state));
      } catch (e) {
        console.error("Error saving state:", e);
      }
    }
  }, [state, isLoaded]);

  // Sync body theme classes
  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-zen", "theme-cyber-dark", "theme-cyber-light");
    if (state.studyMode === "zen") {
      body.classList.add("theme-zen");
    } else if (state.cyberTheme === "dark") {
      body.classList.add("theme-cyber-dark");
    } else {
      body.classList.add("theme-cyber-light");
    }
  }, [state.studyMode, state.cyberTheme]);

  const playSound = (type: "click" | "correct" | "incorrect" | "success") => {
    if (type === "click") soundSynth.playClick();
    else if (type === "correct") soundSynth.playCorrect();
    else if (type === "incorrect") soundSynth.playIncorrect();
    else if (type === "success") soundSynth.playSuccess();
  };

  const speakJapanese = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.startsWith("ja") || v.lang.includes("jp"));
    if (jaVoice) utterance.voice = jaVoice;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const setActiveView = (view: string) => {
    playSound("click");
    setState((prev) => ({ ...prev, activeView: view }));
  };

  const setStudyMode = (mode: "zen" | "cyber") => {
    playSound("click");
    setState((prev) => ({ ...prev, studyMode: mode }));
  };

  const setCyberTheme = (theme: "dark" | "light") => {
    playSound("click");
    setState((prev) => ({ ...prev, cyberTheme: theme }));
  };

  const setUserRole = (role: "external" | "woxsen-student" | "teacher") => {
    playSound("success");
    setState((prev) => ({
      ...prev,
      userRole: role,
      activeView: "dashboard"
    }));
  };

  const setActiveLessonId = (id: number) => {
    setState((prev) => ({ ...prev, activeLessonId: id }));
  };

  const markLessonSolved = (id: number) => {
    setState((prev) => {
      const solved = prev.solvedLessons.includes(id) ? prev.solvedLessons : [...prev.solvedLessons, id];
      const nextId = id + 1;
      return {
        ...prev,
        solvedLessons: solved,
        activeLessonId: nextId <= 10 ? nextId : prev.activeLessonId,
        streakCount: prev.solvedLessons.includes(id) ? prev.streakCount : prev.streakCount + 1
      };
    });
  };

  const markNodeSolved = (nodeId: number) => {
    playSound("success");
    setState((prev) => {
      const currentNodes = prev.solvedNodes || [1];
      const nextSolved = currentNodes.includes(nodeId) ? currentNodes : [...currentNodes, nodeId];
      const nextUnlocked = nodeId + 1;
      const finalSolved = nextSolved.includes(nextUnlocked) ? nextSolved : [...nextSolved, nextUnlocked];
      return { ...prev, solvedNodes: finalSolved };
    });
  };

  const toggleStarVocab = (word: string) => {
    playSound("click");
    setState((prev) => {
      const isStarred = prev.starredVocab.includes(word);
      const starredVocab = isStarred
        ? prev.starredVocab.filter((w) => w !== word)
        : [...prev.starredVocab, word];
      return { ...prev, starredVocab };
    });
  };

  const toggleMasterKana = (kanaId: string) => {
    playSound("click");
    setState((prev) => {
      const isMastered = prev.masteredKana.includes(kanaId);
      const masteredKana = isMastered
        ? prev.masteredKana.filter((id) => id !== kanaId)
        : [...prev.masteredKana, kanaId];
      return { ...prev, masteredKana };
    });
  };

  const addPracticedKanji = (char: string) => {
    setState((prev) => {
      if (prev.practicedKanji.includes(char)) return prev;
      return { ...prev, practicedKanji: [...prev.practicedKanji, char] };
    });
  };

  const saveAttendanceRecord = (date: string, records: Record<string, string>) => {
    playSound("success");
    setState((prev) => ({
      ...prev,
      attendanceDb: {
        ...prev.attendanceDb,
        [date]: records
      }
    }));
  };

  const addUploadedFile = (file: { name: string; size: string; date: string }) => {
    playSound("success");
    setState((prev) => ({
      ...prev,
      uploadedFiles: [file, ...prev.uploadedFiles]
    }));
  };

  const deleteUploadedFile = (name: string) => {
    playSound("click");
    setState((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((f) => f.name !== name)
    }));
  };

  const setQuizState = (updater: (prev: AppState["quizState"]) => AppState["quizState"]) => {
    setState((prev) => ({ ...prev, quizState: updater(prev.quizState) }));
  };

  const updateSrsData = (kanaId: string, rating: "again" | "hard" | "good" | "easy") => {
    setState((prev) => {
      const current = prev.srsData[kanaId] || { interval: 1, easeFactor: 2.5, dueDate: new Date().toISOString(), reviews: 0 };
      let newInterval = current.interval;
      let newEase = current.easeFactor;

      if (rating === "again") {
        newInterval = 1;
        newEase = Math.max(1.3, newEase - 0.2);
      } else if (rating === "hard") {
        newInterval = Math.max(1, Math.round(newInterval * 1.2));
        newEase = Math.max(1.3, newEase - 0.15);
      } else if (rating === "good") {
        newInterval = Math.round(newInterval * newEase);
      } else if (rating === "easy") {
        newInterval = Math.round(newInterval * newEase * 1.3);
        newEase = newEase + 0.15;
      }

      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + newInterval);

      return {
        ...prev,
        srsData: {
          ...prev.srsData,
          [kanaId]: {
            interval: newInterval,
            easeFactor: newEase,
            dueDate: nextDue.toISOString(),
            reviews: current.reviews + 1
          }
        }
      };
    });
  };

  const dismissSoundBanner = () => {
    soundSynth.init().then(() => {
      playSound("success");
      setState((prev) => ({ ...prev, soundBannerDismissed: true }));
    });
  };

  const setN5TargetDate = (dateStr: string) => {
    playSound("click");
    setState((prev) => ({ ...prev, n5TargetDate: dateStr }));
  };

  const toggleDailyTask = (taskId: string) => {
    playSound("click");
    setState((prev) => {
      const isDone = prev.dailyTasksCompleted?.includes(taskId);
      const dailyTasksCompleted = isDone
        ? prev.dailyTasksCompleted.filter((id) => id !== taskId)
        : [...(prev.dailyTasksCompleted || []), taskId];
      return { ...prev, dailyTasksCompleted };
    });
  };

  const completeOnboarding = (data: {
    name: string;
    role: "external" | "woxsen-student" | "teacher";
    targetDate: string;
    level: "N5" | "N4" | "N3" | "N2" | "N1";
  }) => {
    playSound("success");
    setState((prev) => ({
      ...prev,
      activeStudentName: data.name || prev.activeStudentName,
      userRole: data.role,
      n5TargetDate: data.targetDate,
      targetJlptLevel: data.level,
      hasCompletedOnboarding: true,
      showOnboardingModal: false
    }));
  };

  const openOnboardingModal = () => {
    playSound("click");
    setState((prev) => ({ ...prev, showOnboardingModal: true }));
  };

  const closeOnboardingModal = () => {
    playSound("click");
    setState((prev) => ({ ...prev, showOnboardingModal: false }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
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
        saveAttendanceRecord,
        addUploadedFile,
        deleteUploadedFile,
        setQuizState,
        updateSrsData,
        dismissSoundBanner,
        setN5TargetDate,
        toggleDailyTask,
        completeOnboarding,
        openOnboardingModal,
        closeOnboardingModal,
        speakJapanese,
        playSound
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

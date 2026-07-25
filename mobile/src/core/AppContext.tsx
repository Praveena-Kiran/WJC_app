import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { computeNextSrsState, SrsItem } from "./scoring";

export interface AppState {
  activeView: string;
  studyMode: "zen" | "cyber";
  userRole: "external" | "woxsen-student" | "teacher";
  activeStudentName: string;
  solvedLessons: number[];
  activeLessonId: number;
  masteredKana: string[];
  starredVocab: string[];
  practicedKanji: string[];
  streakCount: number;
  srsData: Record<string, SrsItem>;
  solvedNodes: number[];
}

const STORAGE_KEY = "wjc_mobile_app_state";

const initialAppState: AppState = {
  activeView: "journey",
  studyMode: "zen",
  userRole: "external",
  activeStudentName: "Sneha Reddy",
  solvedLessons: [1],
  activeLessonId: 1,
  masteredKana: [],
  starredVocab: [],
  practicedKanji: [],
  streakCount: 3,
  srsData: {},
  solvedNodes: [1],
};

interface AppContextType {
  state: AppState;
  setActiveView: (view: string) => void;
  setStudyMode: (mode: "zen" | "cyber") => void;
  markNodeSolved: (nodeId: number) => void;
  toggleStarVocab: (word: string) => void;
  toggleMasterKana: (kanaId: string) => void;
  updateSrsData: (kanaId: string, rating: "again" | "hard" | "good" | "easy") => void;
  speakJapanese: (text: string, rate?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialAppState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from AsyncStorage (React Native Storage)
  useEffect(() => {
    async function loadSavedState() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setState((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("AsyncStorage Load Error:", e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadSavedState();
  }, []);

  // Save state to AsyncStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) =>
        console.error("AsyncStorage Save Error:", e)
      );
    }
  }, [state, isLoaded]);

  const speakJapanese = (text: string, rate: number = 1.0) => {
    Speech.stop();
    Speech.speak(text, {
      language: "ja-JP",
      rate: rate,
    });
  };

  const setActiveView = (view: string) => {
    setState((prev) => ({ ...prev, activeView: view }));
  };

  const setStudyMode = (mode: "zen" | "cyber") => {
    setState((prev) => ({ ...prev, studyMode: mode }));
  };

  const markNodeSolved = (nodeId: number) => {
    setState((prev) => {
      const currentNodes = prev.solvedNodes || [1];
      const nextSolved = currentNodes.includes(nodeId) ? currentNodes : [...currentNodes, nodeId];
      return { ...prev, solvedNodes: nextSolved };
    });
  };

  const toggleStarVocab = (word: string) => {
    setState((prev) => {
      const isStarred = prev.starredVocab.includes(word);
      const starredVocab = isStarred
        ? prev.starredVocab.filter((w) => w !== word)
        : [...prev.starredVocab, word];
      return { ...prev, starredVocab };
    });
  };

  const toggleMasterKana = (kanaId: string) => {
    setState((prev) => {
      const isMastered = prev.masteredKana.includes(kanaId);
      const masteredKana = isMastered
        ? prev.masteredKana.filter((id) => id !== kanaId)
        : [...prev.masteredKana, kanaId];
      return { ...prev, masteredKana };
    });
  };

  const updateSrsData = (kanaId: string, rating: "again" | "hard" | "good" | "easy") => {
    setState((prev) => {
      const updatedItem = computeNextSrsState(prev.srsData[kanaId], rating);
      return {
        ...prev,
        srsData: {
          ...prev.srsData,
          [kanaId]: updatedItem,
        },
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setActiveView,
        setStudyMode,
        markNodeSolved,
        toggleStarVocab,
        toggleMasterKana,
        updateSrsData,
        speakJapanese,
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

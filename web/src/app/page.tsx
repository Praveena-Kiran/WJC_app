"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SoundBanner } from "@/components/SoundBanner";
import { ZenDashboard } from "@/components/dashboard/ZenDashboard";
import { CyberZenDashboard } from "@/components/dashboard/CyberZenDashboard";
import { WoxsenStudentDashboard } from "@/components/dashboard/WoxsenStudentDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { KanaTrainer } from "@/components/kana/KanaTrainer";
import { DictionaryView } from "@/components/DictionaryView";
import { KanjiBoard } from "@/components/KanjiBoard";
import { QuizView } from "@/components/QuizView";
import { N5PlannerView } from "@/components/N5PlannerView";
import { OnboardingModal } from "@/components/OnboardingModal";
import { KaiwaView } from "@/components/KaiwaView";
import { PronunciationCoach } from "@/components/PronunciationCoach";
import { KanjiRadicalView } from "@/components/KanjiRadicalView";

export default function Home() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (state.activeView) {
      case "dashboard":
        if (state.userRole === "admin") {
          return <AdminDashboard />;
        }
        if (state.userRole === "teacher") {
          return <TeacherDashboard />;
        }
        if (state.userRole === "woxsen-student") {
          return <WoxsenStudentDashboard />;
        }
        return state.studyMode === "zen" ? <ZenDashboard /> : <CyberZenDashboard />;
      case "n5-roadmap":
        return <N5PlannerView />;
      case "kana-trainer":
        return <KanaTrainer />;
      case "dictionary":
        return <DictionaryView />;
      case "kanji-board":
        return <KanjiBoard />;
      case "quiz":
        return <QuizView />;
      case "kaiwa":
        return <KaiwaView />;
      case "voice-coach":
        return <PronunciationCoach />;
      case "kanji-radicals":
        return <KanjiRadicalView />;
      default:
        return <ZenDashboard />;
    }
  };

  return (
    <>
      <SoundBanner />
      <OnboardingModal />

      <MobileHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div id="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main id="main-content">
          {renderActiveView()}
        </main>
      </div>

      <MobileBottomNav />
    </>
  );
}

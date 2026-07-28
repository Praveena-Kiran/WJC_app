"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function SoundBanner() {
  const { state, dismissSoundBanner } = useApp();

  if (state.soundBannerDismissed) return null;

  return (
    <div id="sound-permission-banner" onClick={dismissSoundBanner}>
      <i className="fa-solid fa-volume-high"></i>
      <span>🔊 Sound is muted. Tap here to enable audio feedback, speech synthesis, and chimes.</span>
    </div>
  );
}

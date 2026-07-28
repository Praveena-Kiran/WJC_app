# Epic 3 — App Shell & Theming

> **Priority:** P1. All UI screens depend on ThemeProvider + navigation shell being wired first.

---

## Issue #016 — ThemeProvider + 3 theme token systems (zen, cyber-dark, cyber-light)
**Epic:** shell | **Type:** feat | **Priority:** P1 | **Size:** L
**Hard deps:** #004 (deps installed) | **Soft deps:** none | **Stream:** C | **Assignee:** ____

### Goal
Extract every CSS custom variable from `web/src/app/globals.css` (`:root`, `.theme-zen`, `.theme-cyber-dark`, `.theme-cyber-light`) into three JS token objects. Build a `ThemeProvider` that injects the active theme into the whole app via React context, persists the user's choice to `UserProfile`, and exports a `useTheme()` hook so components can consume tokens via `StyleSheet.create`.

### Context for the AI agent
- `web/src/app/globals.css` (2000 lines) contains ~50 CSS custom properties per theme. Read the entire file, focusing on the theme scoped blocks at the top (approximately the first 400 lines).
- The token names must match the CSS var names exactly: `--bg`, `--panel-active`, `--card-bg`, `--card-border`, `--text-main`, `--text-muted`, `--accent`, `--accent-secondary`, `--accent-success`, `--bonsai-trunk`, `--bonsai-pot`, `--border-radius-sm`, `--border-radius-md`, plus any other essentials (heading sizes, font families, etc.).
- Theme switching in web is done by toggling `document.body.classList` between `.theme-zen`, `.theme-cyber-dark`, `.theme-cyber-light`. Mobile uses React Context with a `theme` prop propagated through the component tree.

### Required deliverables
1. `mobile/src/theme/tokens.ts` — export three named `ThemeTokens` definitions:
   ```ts
   export interface ThemeTokens {
     bg: string;
     panelActive: string;
     cardBg: string;
     cardBorder: string;
     text: string;
     textMuted: string;
     accent: string;
     accentSecondary: string;
     accentSuccess: string;
     bonsaiTrunk: string;
     bonsaiPot: string;
     borderRadiusSm: number;
     borderRadiusMd: number;
     headingSize: number;
     bodySize: number;
     // ... all CSS vars converted
   }
   export const zenTheme: ThemeTokens = { bg: "#f5f1e8", panelActive: "#e6ddc8", ... };
   export const cyberDarkTheme: ThemeTokens = { bg: "#0d1117", panelActive: "#161b22", ... };
   export const cyberLightTheme: ThemeTokens = { bg: "#fafbfc", panelActive: "#f0f2f5", ... };
   ```
2. `mobile/src/theme/ThemeContext.tsx` — Context wrapping with dynamic values:
   ```tsx
   import React, { createContext, useContext, useState, useEffect } from "react";
   import { zenTheme, cyberDarkTheme, cyberLightTheme, ThemeTokens } from "./tokens";

   type Theme = "zen" | "cyber-dark" | "cyber-light";
   function getTokens(theme: Theme): ThemeTokens { /* switch */ }

   const ThemeCtx = createContext<{ theme: Theme; tokens: ThemeTokens; setTheme: (t: Theme) => void; }>(...);

   export function ThemeProvider({ children }: { children: React.ReactNode }) {
     const [theme, setTheme] = useState<Theme>("zen");
     // persist to AppContext / UserProfile when changed
     return <ThemeCtx.Provider value={{ theme, tokens: getTokens(theme), setTheme }}>{children}</ThemeCtx.Provider>;
   }
   export const useTheme = () => useContext(ThemeCtx);
   ```
3. An indirect form: `setStudyMode("zen" | "cyber")` and `setCyberTheme("dark" | "light")` from `AppContext` map to the combined theme selection above.
4. The root layout `_layout.tsx` wraps the entire app in `<ThemeProvider>`.
5. Verify by rendering a simple test screen: apply `backgroundColor: tokens.bg`.

### Technical notes
- Read `globals.css` line-by-line: pick only the `:root` / `.theme-zen` / `.theme-cyber-dark` / `.theme-cyber-light` blocks, all others (animations, media queries) are not tokens.
- Every component must reference `tokens` from `useTheme()` instead of hardcoded colors.
- Native styling: use plain `StyleSheet.create` with `tokens.bg` etc. — NOT CSS. No Tailwind/Material.

### Validation / acceptance
- Tapping "Study Mode: Zen" in the settings screen changes the background of the dashboard immediately.
- All screens render with the new tokens (not white hardsettled default).
- Switching study modes persists (Web shows Zen → next app boot shows Zen).

### Out of scope
- Dark/light style classes / CSS files are not used; RN uses JS styles only.
- `useWindowDimensions` / `useColorScheme` integration (optional for v2 adaptive mode).

### Linked files
- new: `mobile/src/theme/tokens.ts`, `mobile/src/theme/ThemeContext.tsx`

---

## Issue #017 — Root `_layout.tsx`: providers, auth guard, splash gate
**Epic:** shell | **Type:** feat | **Priority:** P1 | **Size:** M
**Hard deps:** #009c, #016, #013 | **Soft deps:** none | **Stream:** C | **Assignee:** ____

### Goal
The root `app/_layout.tsx` serves as the entry-point, wraps all providers (`GestureHandlerRootView`, `ThemeProvider`, `PersistQueryClientProvider`, `AuthProvider`, `AppProvider`), and enforces an auth gate that prevents any unauthenticated user from seeing `(tabs)` screens. A dedicated `<SplashGate>` ensures there is no flash between loading and the first correct route.

### Context for the AI agent
- Expo Router uses `<Slot>` to render the current route's `children`. Within the provider, include a `NaviguationContainer` and header.
- GestureHandler root is required at the top for `react-native-gesture-handler` to function across all screens.
- `expo-font` should load Noto Sans JP and any other custom font before the app renders (block via `useFonts`).
- `authClient.useSession()` returns `{ data, isPending }`. While pending, show splash.
- `userProfile` availability determines if the user is on-boarded (i.e., redirect to `/onboarding` if no `UserProfile` but logged in).

### Required deliverables
1. `mobile/app/_layout.tsx`:
   ```tsx
   import "react-native-gesture-handler";
   import { useEffect } from "react";
   import { Slot, Stack, router } from "expo-router";
   import { GestureHandlerRootView } from "react-native-gesture-handler";
   import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
   import { ThemeProvider } from "@/theme/ThemeContext";
   import { AuthProvider } from "@/context/AuthContext";
   import { AppProvider } from "@/context/AppContext";
   import { queryClient, persister } from "@/lib/query-client";

   export default function RootLayout() {
     return (
       <GestureHandlerRootView style={{ flex: 1 }}>
         <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
           <ThemeProvider>
             <AuthProvider>
               <AppProvider>
                 <SplashGate>{/* decide route here */}</SplashGate>
               </AppProvider>
             </AuthProvider>
           </ThemeProvider>
         </PersistQueryClientProvider>
       </GestureHandlerRootView>
     );
   }

   function SplashGate({ children }: { children: React.ReactNode }) {
     const { data: session, isPending } = authClient.useSession();
     const { profile } = useApp(); // from AppContext -> get user profile
     if (isPending) return <SplashScreen />;
     if (!session) return <Stack screenOptions={{ headerShown: false }}><Slot /></Stack>;
     if (!profile) { router.replace("/onboarding"); return null; }
     return <>{children}</>;
   }
   ```
2. The `(auth)` and `(tabs)` and `onboarding` screens are served via `Slot` inside the stack. (Expo Router picks the correct screen based on the URL.)
3. Ensure `"expo-router"` is in `plugins` of `app.json`

### Technical notes
- `SplashGate` is a internal function defined in the same file — NOT a separate component — to keep the auth logic tight and not block importing.
- When `useSession` resolves with a session but `profile` is null, route to `/onboarding`.
- After onboarding finishes, `profile` becomes non-null, so the gate flips to the child tree containing `(tabs)`.

### Validation / acceptance
- Fresh app launch → splash screen → auth (login) → onboarding → dashboard. No flicker.
- Logged-in user: splash → dashboard immediately.
- Clearing SecureStore (sign out) → splash → login.
- Gesture-handler working on all screens (test pan on kana/kanji drawing).

### Out of scope
- Settings for theme/sound/haptics (handled by #020).
- Full nav structure — tabs are #019, drawer is #020.

### Linked files
- new: `mobile/app/_layout.tsx`
- dep: `mobile/src/theme/ThemeContext.tsx`, `mobile/src/context/AppContext.tsx`, `mobile/src/context/AuthContext.tsx`

---

## Issue #018 — MobileHeader component
**Epic:** shell | **Type:** port | **Priority:** P2 | **Size:** S
**Hard deps:** #016 | **Soft deps:** none | **Stream:** C | **Assignee:** ____

### Goal
A consistent top header across all screens: centered "禅郷 ZENGO" branding (using Noto Sans JP or system font), right-side settings gear icon that opens the drawer/settings. Safe-area inflates on notched devices.

### Context for the AI agent
- Web `MobileHeader.tsx` renders `h1` with logo + gear icon. RN renders `<SafeAreaView>` + `<Text>` + `<TouchableOpacity>`.
- The gear icon from `@expo/vector-icons` (FontAwesome `cog` or `gear`).
- This header replaces the default Expo Router header for all screens.

### Required deliverables
1. `mobile/src/components/MobileHeader.tsx`:
   ```tsx
   import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
   import { SafeAreaView } from "react-native-safe-area-context";
   import { FontAwesome } from "@expo/vector-icons";
   import { useTheme } from "@/theme/ThemeContext";

   export function MobileHeader({ onSettingsPress }: { onSettingsPress: () => void }) {
     const { tokens } = useTheme();
     return (
       <SafeAreaView style={[styles.container, { backgroundColor: tokens.cardBg, borderBottomColor: tokens.cardBorder }]}>
         <View style={styles.spacer} />
         <Text style={[styles.logo, { color: tokens.text, fontFamily: "NotoSansJP" }]}>
           禅郷 <Text style={{ fontWeight: "300", fontSize: 20, color: tokens.accentSecondary }}>ZENGO</Text>
         </Text>
         <TouchableOpacity onPress={onSettingsPress} style={styles.gearBtn} accessibilityLabel="Open settings">
           <FontAwesome name="gear" size={22} color={tokens.textMuted} />
         </TouchableOpacity>
       </SafeAreaView>
     );
   }
   ```
2. Should be used in `_layout.tsx` as a global header (visible on all screens). Option: render it inside `(tabs)/_layout.tsx` rather than `_layout` to keep auth screens clean.

### Technical notes
- Use `expo-font` to load the custom `NotoSansJP` font before the component renders (already loaded in root _layout for #017).

### Validation / acceptance
- Centered logo, side gear icon, theme colors adjust when switching themes.

### Out of scope
- Logo meaning or badge icons.

### Linked files
- new: `mobile/src/components/MobileHeader.tsx`

---

## Issue #019 — Bottom tabs layout (5 tabs)
**Epic:** shell | **Type:** port | **Priority:** P1 | **Size:** M
**Hard deps:** #017 | **Soft deps:** #016 | **Stream:** C | **Assignee:** ____

### Goal
Replicate web's `MobileBottomNav.tsx` as the Expo Router tab layout with five tabs: Home, Kana, Dictionary, Kanji, Quiz. Respect role gating (hidden for teacher).

### Context for the AI agent
- Web bottom nav renders 5 buttons with FontAwesome icons and `active` state tracked by `state.activeView`. In Expo Router, this is a `<Tabs>` navigator with `<Tab.Screen>` and `tabBarIcon`/`tabBarActiveTintColor`.
- The tab bar is in `(tabs)/_layout.tsx`.
- Teachers see no bottom tab — instead they will navigate by drawer only (Issue #020 simplifies this).

### Required deliverables
1. `mobile/app/(tabs)/_layout.tsx`:
   ```tsx
   import { Tabs } from "expo-router";
   import { FontAwesome } from "@expo/vector-icons";
   import { useApp } from "@/context/AppContext";
   import { useTheme } from "@/theme/ThemeContext";

   export default function TabLayout() {
     const { state } = useApp();
     const { tokens } = useTheme();
     if (state.userRole === "teacher") return <Stack screenOptions={{ headerShown: false }} />; // no bottom bar
     return (
       <Tabs screenOptions={{
         tabBarActiveTintColor: tokens.accent,
         tabBarInactiveTintColor: tokens.textMuted,
         tabBarStyle: { backgroundColor: tokens.cardBg, borderTopColor: tokens.cardBorder },
         headerShown: false,
       }}>
         <Tabs.Screen name="index"     options={{ tabBarIcon: ({color,size}) => <FontAwesome name="home" size={size} color={color}/>, title: "Home" }} />
         <Tabs.Screen name="kana"      options={{ .../* fa-graduation-cap */, title: "Kana" }} />
         <Tabs.Screen name="dictionary" options={{ .../* fa-book-open */, title: "Dictionary" }} />
         <Tabs.Screen name="kanji"     options={{ .../* fa-brush */, title: "Kanji" }} />
         <Tabs.Screen name="quiz"      options={{ .../* fa-gamepad */, title: "Quiz" }} />
       </Tabs>
     );
   }
   ```
2. Stub screens for each tab: `app/(tabs)/kana.tsx`, `dictionary.tsx`, `kanji.tsx`, `quiz.tsx` with placeholder text "Coming soon".
3. Use the drawer toggle on the right of the header (from #018) to open the "More" stack.

### Validation / acceptance
- 5 tabs visible; selecting a tab switches routes.
- Theme reflects across tab bar.
- Teacher role: no tabs visible, sidebar-based nav only.

### Out of scope
- Actual implementation of each screen (they're separate issues: #032, #037, #040, #041).
- Custom tab bar shape or big-icon design.

### Linked files
- new: `mobile/app/(tabs)/_layout.tsx`, `mobile/app/(tabs)/kana.tsx`, `mobile/app/(tabs)/dictionary.tsx`, `mobile/app/(tabs)/kanji.tsx`, `mobile/app/(tabs)/quiz.tsx`

---

## Issue #019b — Reusable `SfxPlayer` singleton + soundEnabled gating
**Epic:** shell | **Type:** feat | **Priority:** P2 | **Size:** S
**Hard deps:** #055 (SFX bundling) | **Soft deps:** none | **Stream:** F | **Assignee:** ____

### Goal
A singleton audio manager (`SfxPlayer`) that module code can call `playSound("click")` etc. Respects the `soundEnabled` toggle on `UserProfile` and `soundBannerDismissed` (SoundBanner must be dismissed before any audio plays — matches web).

### Context for the AI agent
- Web has four audio types: `click`, `correct`, `incorrect`, `success`. RN uses preloaded `expo-audio` `AudioPlayer` instances per sound file.
- The player should be gated — if `soundEnabled: false` or `soundBannerDismissed: false`, `playSound()` is a no-op.
- On init, load all four sound files (`.wav` in Issue #055) and cache the player instances.

### Required deliverables
1. `mobile/src/lib/sound.ts`:
   ```ts
   import { Audio } from "expo-audio";
   import { useApp } from "@/context/AppContext";
   const players: Record<string, AudioPlayer> = {};
   async function init() {
     const files = { click: require("@/assets/sfx/click.wav"), correct: ..., incorrect: ..., success: ... };
     for (const [name, src] of Object.entries(files)) {
       const { sound } = await Audio.Sound.createAsync(src);
       players[name] = sound;
     }
   }
   export async function playSound(type: "click"|"correct"|"incorrect"|"success") {
     if (!state.soundEnabled || !state.soundBannerDismissed) return;
     // if players[type] not loaded, init (lazy)
     await players[type]?.replayAsync();
   }
   export function ensureAudioInit() { if (Object.keys(players).length === 0) init(); }
   ```
2. Call `ensureAudioInit()` from `SoundBanner` dismiss handler (Issue #021).
3. Add the `playSound` method to `AppContext` exported value (it calls the function above).

### Technical notes
- `Audio.Sound.createAsync` needs to run after a user gesture (Web Audio restriction). The SoundBanner handles this by waiting for a tap → then calling `ensureAudioInit`.
- Files are stored as `mobile/assets/sfx/*.wav` (relative import works in RN/Expo with Metro asset resolution).

### Validation / acceptance
- `playSound("click")` produces an audible short beep.
- When `soundEnabled` = false in settings, `playSound` does nothing, no error.

### Out of scope
- Custom waveform generation (#056).

### Linked files
- new: `mobile/src/lib/sound.ts`

---

## Issue #020 — Drawer ("More") for non-tab screens + settings
**Epic:** shell | **Type:** port | **Priority:** P2 | **Size:** M
**Hard deps:** #017 | **Soft deps:** #016 | **Stream:** C | **Assignee:** ____

### Goal
Replicate web's `Sidebar.tsx` full navigation list as a drawer (or modal) accessible from the gear icon. Items: N5 Roadmap, Kaiwa Roleplay, Voice Coach, Radical Puzzle, Settings, Profile, Sign out. Gate some items based on role (teacher sees all, student sees subset). Settings page with toggles for study mode, cyber theme, sound, haptics.

### Context for the AI agent
- Web sidebar is always visible on desktop; on mobile it slides in. RN: use `<Drawer>` from `expo-router` or a modal triggered by the gear icon.
- Items that are tabs (Home, Kana, Dictionary, Kanji, Quiz) should not be in this drawer.
- Teacher dashboard nav remains all in this draw (no tabs).

### Required deliverables
1. `mobile/more/_layout.tsx` — `<Drawer>` with all the screens listed.
2. `mobile/more/settings.tsx` — a screen with toggles (Study Mode, Cyber Theme, Sound, Haptics), reset options, re-configure onboarding button.
3. `mobile/more/profile.tsx` — shows user info from `session.user`, option to change password, sign out button.
4. Role gating: if teacher, the bottom tabs disappear and only drawer navigation is available.

### Technical notes
- `setStudyMode`, `setCyberTheme` toggle values and persist via AppContext (which PUTs to server).
- Role switching for dev-only: add a long-press on the logo (3 seconds) that reveals a role picker. Or just use `__DEV__` conditional.
- On sign-out: `authClient.signOut()` → clear SecureStore → `router.replace("/login")`.

### Validation / acceptance
- Gear icon opens drawer → all items visible.
- Tap "N5 Roadmap" → route changes to `/more/roadmap`.
- Sign out works and returns to login.

### Out of scope
- Animated sidebar transition (v1: simple drawer push).

### Linked files
- new: `mobile/more/_layout.tsx`, `mobile/more/settings.tsx`, `mobile/more/profile.tsx`

---

## Issue #021 — SoundBanner (audio enable gesture)
**Epic:** shell | **Type:** port | **Priority:** P2 | **Size:** S
**Hard deps:** #013, #019b | **Soft deps:** none | **Stream:** C | **Assignee:** ____

### Goal
Port `web/src/components/SoundBanner.tsx`: a dismissible floating bar that appears when `soundBannerDismissed === false`, asking the user to tap to enable audio. On tap, initialize audio (Issue #019b), play success sound, and dismiss.

### Context for the AI agent
- In web, the banner visually indicates muted sound and the user must tap it (gesture) to create an AudioContext.
- For RN: the banner invites a tap, then calls `Audio.setAudioModeAsync()` with the correct playback/mixing settings, and sets `soundBannerDismissed: true` via AppContext.

### Required deliverables
1. `mobile/src/components/SoundBanner.tsx` — a small `View` anchored at the top, with a tap to dismiss:
   ```tsx
   const { state, dismissSoundBanner } = useApp();
   if (state.soundBannerDismissed) return null;
   return (
     <TouchableOpacity onPress={dismissSoundBanner} style={...}>
       <Text>🔊 Sound is muted. Tap here to enable audio feedback.</Text>
     </TouchableOpacity>
   );
   ```

### Validation / acceptance
- Banner visible at launch, tap → disappears, audio works.
- Next launch — no banner because `soundBannerDismissed` persisted.
- Tapping banner plays the success sound.

### Out of scope
- Visual animation.

### Linked files
- new: `mobile/src/components/SoundBanner.tsx`

---

## Issue #033b — Splash gate while session resolves (root `<SplashGate>`)
**Epic:** shell | **Type:** feat | **Priority:** P1 | **Size:** S
**Hard deps:** #017 | **Soft deps:** #009 | **Stream:** C | **Assignee:** ____

### Goal
Completely eliminate the "flash of login screen" for already-authenticated users. On cold boot, while `useSession()` loading, show the Expo splash (kept from the splash screen config). Only when session is resolved (`isPending` = false) render the correct screen.

### Context for the AI agent
- In `mobile/app/_layout.tsx`, `useSession()` returns `{ data, isPending }`. While pending, return nothing (or a blank/loading view). Expo splash is automatically shown during loading.
- Or, if the splash finishes too fast and `isPending` takes a few more frames, flash may be visible. Fix: use `SplashScreen.preventAutoHideAsync()` in the root layout, then `SplashScreen.hideAsync()` after `isPending` flips. This gives pixel-perfect control.

### Required deliverables
1. Handle splash in `_layout.tsx`:
   ```tsx
   import * as SplashScreen from "expo-splash-screen";
   SplashScreen.preventAutoHideAsync();
   // Inside the gate
   const { data: session, isPending } = authClient.useSession();
   useEffect(() => {
     if (!isPending) SplashScreen.hideAsync();
   }, [isPending]);
   if (isPending) return null; // or <View/>
   ```

### Validation / acceptance
- Fresh install on a slow device: shows splash → dashboard (no blank/intermediate flash).
- Fast device: splash → dashboard near instant.

### Out of scope
- Full loading animation or splash design.

### Linked files
- edit: `mobile/app/_layout.tsx`

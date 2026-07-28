# Epic 9 — Kana Quiz

> **Priority:** P2. Multiple-choice quiz module with configurable deck/length and scoreboard.

---

## Issue #041 — QuizView (lobby → game → scoreboard)
**Epic:** quiz | **Type:** port | **Priority:** P2 | **Size:** M
**Hard deps:** #013, #042, #019b | **Soft deps:** #038 (speech) | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/QuizView.tsx`: quiz settings lobby (deck: Hiragana / Katakana / Mixed / Vocabulary + length: 10/20/40 questions + Start), interactive game panel (progress bar + live score + question display with target character + 4 choice buttons), and final scoreboard (trophy + score + feedback message + Retry).

### Context for the AI agent
- Quiz draws questions from the reference kana/vocabulary data. Web builds a deck array from all kana/vocab, shuffles, and presents 10/20/40 rounds.
- Each question: a target character/word + prompt "What is the correct Romaji for this?"; 4 answer buttons; one correct, three distractors randomly chosen from similar characters/words.
- On correct, play `correct` sound; on wrong, play `incorrect` sound.
- After all questions, show final score, save `QuizRun` via `POST /api/quiz`.

### Required deliverables
1. `mobile/app/(tabs)/quiz.tsx` — thin wrapper.
2. `mobile/src/components/QuizView.tsx`:
   - Lobby: toggles for Deck and Length, Start button.
   - Game: progress bar, current question, 4 choice buttons, live score.
   - On answer: wait 800ms, highlight correct answer in green and wrong user-selected option in red if wrong. Auto-advance.
   - Scoreboard: score/10, trophy icon, feedback message (based on %), Retry button.

### Technical notes
- Deck generation: fetch Kana/Vocab from reference cache (via `useApiQuery` → cached). Build array, shuffle using Fisher-Yates. Distractors must be different from the correct answer (pick any two non-matching kanas).
- Sound: `playSound("correct")` and `playSound("incorrect")`.
- Scoreboard: `feedbackMsg = score <= 3 ? "Keep practicing!" : score <= 7 ? "Good effort!" : "Excellent!"`.
- Retry → clear state and return to lobby.

### Validation / acceptance
- Mixing kana → questions include both hiragana and katakana characters.
- Answering correctly → green glow + points increment.
- Answering wrong → red highlight on selected, green highlight on correct.
- Final scoreboard shows "10/10" → correct feedback message.
- Retry resets game.

### Out of scope
- Leaderboard integration, timed mode.

### Linked files
- read: `web/src/components/QuizView.tsx`
- new: `mobile/app/(tabs)/quiz.tsx`, `mobile/src/components/QuizView.tsx`

---

## Issue #042 — `/api/quiz` POST handler
**Epic:** quiz | **Type:** feat | **Priority:** P2 | **Size:** S
**Hard deps:** #014 (app.ts routing exists) | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Accept `POST /api/quiz` with `{ deck: string, length: number, score: number }` payload, save a `QuizRun` row for the authenticated user with `createdAt = now()`.

### Required deliverables
1. `mobile/src/server/handlers/quiz.ts`:
   ```ts
   quizRoute.post("/", async (c) => {
     const session = await auth.api.getSession(c.req.raw);
     if (!session) return c.json({ error: "Unauthorized" }, 401);
     const { deck, length, score } = await c.req.json();
     const run = await prisma.quizRun.create({ data: { userId: session.user.id, deck, length, score } });
     return c.json(run);
   });
   ```

### Validation / acceptance
- `POST /api/quiz` with valid body → returns created run.
- Unauthenticated → 401.

### Out of scope
- Leaderboard or historical statistics.

### Linked files
- new: `mobile/src/server/handlers/quiz.ts`
- edit: `mobile/src/server/app.ts`

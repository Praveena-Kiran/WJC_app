# Epic 10 — N5 Roadmap

> **Priority:** P2. Deadline-driven planner with phase statuses and daily checklist.

---

## Issue #043 — N5PlannerView
**Epic:** roadmap | **Type:** port | **Priority:** P2 | **Size:** M
**Hard deps:** #013, #011 | **Soft deps:** none | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/N5PlannerView.tsx`: target deadline control (preset buttons 15/30/60 days + custom date input), dynamic daily pace metrics (kana cards/day, kanji/day, vocab/day, lessons/week), 4-phase status indicators (traffic-light colored), and a daily checklist (5 study tasks with checkboxes that call `toggleDailyTask`). Re-configure button re-opens onboarding.

### Context for the AI agent
- Phase 1 Complete: kana count ≥ 80 (green), else yellow.
- Phase 2 Complete: 5+ solved lessons (green), else yellow.
- Phase 3 Complete: 10+ solved lessons AND 40+ practiced kanji (green), else yellow.
- Phase 4 Complete: all tasks finished for current active lesson.
- Deadlines are `n5TargetDate` (YYYY-MM-DD string) stored in `UserProfile`.

### Required deliverables
1. `mobile/app/more/roadmap.tsx` — thin screen.
2. `mobile/src/components/N5PlannerView.tsx`:
   - Deadline banner with 15/30/60-day preset buttons.
   - Custom date input (date picker).
   - Pace calculations card: Kana/day, Kanji/day, Vocab/day, Lessons/week.
   - Phase status block with colored circles.
   - Daily checklist: 5 tasks with toggle checkboxes.

### Technical notes
- All date math: `new Date(targetDate) - new Date()` → ms → days remaining.
- Levels: 92 kana, 100 kanji, 800 vocab words (hardcoded constants from web).
- Phase check uses local AppContext state (not server).
- Task toggles use `AppContext.toggleDailyTask(taskId)`.
- Re-configure button calls `router.push("/onboarding")`.

### Validation / acceptance
- Set deadline 30 days → daysRemaining = 30 → metrics calculate.
- Solve lesson 3 → phase 2 still yellow (need 5).
- Solve lesson 5 → phase 2 turns green.
- Toggle daily task → persisted, visible as checked.

### Out of scope
- Sync with Google Calendar, notifications.

### Linked files
- read: `web/src/components/N5PlannerView.tsx`
- new: `mobile/app/more/roadmap.tsx`, `mobile/src/components/N5PlannerView.tsx`

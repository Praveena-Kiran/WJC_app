# Zengo Mobile — GitHub Issues Backlog

Complete 77-issue backlog for building the Zengo mobile app (Expo Go + React Native + better-auth + Prisma + Neon Postgres).

## How to file these issues

### Option A: Manual copy-paste
Open each `epicN_*.md` file, each issue is a `## Issue #NNN — Title` section. Copy the section body into `gh issue create --title "..." --body "..."`.

### Option B: Bulk-file via `gh` CLI
```bash
# Auth once
gh auth login

# File every issue in an epic
./file-epic.sh epic1_auth_db.md
```
The script parses `## Issue #NNN` headers, extracts the title, bodies, labels from the frontmatter line, and calls `gh issue create` per issue.

## Epic Index

| File | Covered Issues | Size |
|---|---|---|
| [epic0_foundation.md](./epic0_foundation.md) | #001–#004b (6 issues) | S/M |
| [epic1_auth_db.md](./epic1_auth_db.md) | #005–#013 (12 issues) | XL |
| [epic2_server_container.md](./epic2_server_container.md) | #014–#015 (2 issues) | M |
| [epic3_shell_theme.md](./epic3_shell_theme.md) | #016–#033b (8 issues) | L |
| [epic4_drawing.md](./epic4_drawing.md) | #022–#024 (3 issues) | M |
| [epic5_dashboards.md](./epic5_dashboards.md) | #025–#031 (7 issues) | XL |
| [epic6_kana.md](./epic6_kana.md) | #032–#036 (5 issues) | L |
| [epic7_dictionary.md](./epic7_dictionary.md) | #037, #039 (2 issues) | M |
| [epic8_kanji.md](./epic8_kanji.md) | #040 (1 issue) | L |
| [epic9_quiz.md](./epic9_quiz.md) | #041–#042 (2 issues) | M |
| [epic10_roadmap.md](./epic10_roadmap.md) | #043 (1 issue) | M |
| [epic11_kaiwa.md](./epic11_kaiwa.md) | #044 (1 issue) | M |
| [epic12_voice.md](./epic12_voice.md) | #045 (1 issue) | M |
| [epic13_radicals.md](./epic13_radicals.md) | #046 (1 issue) | S |
| [epic14_teacher_portal.md](./epic14_teacher_portal.md) | #052–#053 (2 issues) | M |
| [epic15_audio.md](./epic15_audio.md) | #038, #055, #056, #058b (4 issues) | M |
| [epic16_offline_polish.md](./epic16_offline_polish.md) | #058, #060–#067, #039b (12 issues) | L |

Total: **77 issues** across **17 epics**.

## Issue template (every issue follows this)

```
## Issue #NNN — Title
**Epic:** <name> | **Type:** <infra|feat|port|seed|polish|docs> | **Priority:** P0-P4 | **Size:** S/M/L/XL
**Hard deps:** #NNN | **Soft deps:** #NNN | **Stream:** A-G | **Assignee:** ____

### Goal
<1-2 sentences; user-visible outcome>

### Context for the AI agent
<Source references, mobile contract, package versions>

### Required deliverables
<Bullet list of files to create/edit + exact function signatures/models/env vars>

### Technical notes
<Concrete algorithm, data shape, pitfalls to avoid>

### Validation / acceptance
<Commands to run, console output expected, on-device UX checks, screenshot parity target>

### Out of scope
<Explicit non-goals>

### Linked files
web: <paths> | new: <paths> | archive: <paths>
```

## Dependency graph (quick reference)

```
#001 ─┐
#002 ─┼─ #003 ─ #003b ─ #004 ─+#004b
                                   │
#005 ─ #006 ─ #007 ─ #008 ─ #009 ─ #009b ─ #009c
         │                  └─ #010 ─ #011 ─ #012 ─ #012b ─ #013
         ├─ #035 ────────────────┬─ feeds every module
         ├─ #039 (parallel)      │
         │                       │
#014 ─ #015 (server container)   │
#016 ─ #017 ─ #018 ─ #019 ─ #019b ─ #020 ─ #021 ─ #033b
#022 ─ #023 ─ #024              (drawing engine)
                                  │
Module fan-out after #013 + #035:
  #025 → #026 → #030/#031/#029 (dashboards)
  #032 → #033/#034/#036 (kana)
  #037 → #039 (dictionary)
  #040 → uses #022/#023 (kanji)
  #041 → #042 (quiz)    #043 (roadmap)   #044 (kaiwa)
  #045 (voice)          #046 (radicals)  #052 → #053 (teacher)
  #027 → #028 → #052 (woxsen + teacher backend)
                                  │
Audio: #038 → #055 → #056 → #058b
Polish: #058, #060–#067, #039b (all defer to v1.1 after critical path)
```

## Labels reference

**Epic labels:** `epic:foundation`, `epic:auth`, `epic:db`, `epic:server`, `epic:shell`, `epic:drawing`, `epic:dashboard`, `epic:kana`, `epic:dictionary`, `epic:kanji`, `epic:quiz`, `epic:roadmap`, `epic:kaiwa`, `epic:voice`, `epic:radicals`, `epic:teacher`, `epic:audio`, `epic:offline`, `epic:polish`, `epic:infra`, `epic:docs`

**Priority labels:** `priority:P0` (blocks everything), `priority:P1` (core learner loop), `priority:P2` (parity), `priority:P3` (polish), `priority:P4` (nice-to-have)

**Type labels:** `type:infra`, `type:feat`, `type:port`, `type:seed`, `type:polish`, `type:docs`, `type:chore`

**Size labels:** `size:S` (~0.5d), `size:M` (1-2d), `size:L` (3-5d), `size:XL` (1wk+)

**Stream labels:** `stream:A` (auth/DB/server), `stream:B` (ref-data/handlers), `stream:C` (shell/theme/drawing), `stream:D` (dashboards), `stream:E` (modules), `stream:F` (audio), `stream:G` (polish)

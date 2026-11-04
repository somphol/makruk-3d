# AGENTS.md — Makruk 3D

## 1. What this is

A static, bilingual 3D **Makruk** (Thai chess) academy: one page, three source files, Three.js r160 from a CDN, no build step. It renders an 8×8 carved board with procedurally modelled Khun, Met, Khon, Ma, Ruea, Bia and Bia Ngua in four selectable families; plays Single Player (human White vs a four-level heuristic Black bot with an adjustable thinking budget) or local Pass & Play; coaches beginners with legal-move dots, a piece tutor and a seven-card glossary; adds display themes, piece and board finishes, a top-view camera, a per-piece 3D viewer, bundled Thai pronunciation, Web Audio effects, autosave and JSON save/load.

It is **not international chess** — there is no castling, en passant, double pawn step or queen. It is not a server, account system or tournament-strength engine. It is **not a complete tournament implementation of Makruk**: the Thai endgame counting rules are absent, and Black's Khun/Met start squares are transposed relative to standard Makruk (see §5). Release **1.9.0**.

Live: <https://somphol.github.io/makruk-3d/> · Local master: `~/Projects/makruk-3d`

## 2. Commands

```bash
# run — no install, no build
cd ~/Projects/makruk-3d
python3 -m http.server 8080
# open http://localhost:8080

# verification — dependency-free
node --check script.js
node scripts/check.mjs

# deploy — GitHub Pages serves the repository root from main
git push origin main
```

An HTTP server is required: `script.js` is an ES module. The page also needs network access for `three@0.160.0` (jsDelivr) and Google Fonts; it is **not offline**. `scripts/check.mjs` verifies required files, local HTML and Markdown references, JS syntax, the import-map pin, i18n symmetry, the two piece families, two finishes, four bot levels, quiescence/mop-up/repetition wiring, audio wiring and the release identity. Manual and headless-browser results are in [docs/TESTING.md](docs/TESTING.md).

## 3. Architecture

Load order: `index.html` → `style.css` → `script.js` (module; import map pins `three@0.160.0`). `script.js` is one module with these layers:

1. **Content** — `I18N.en` / `I18N.th`, `PIECES`, `THEMES`, `TEXT_SIZES`, `BOARD_STYLES`, `BOARD_MATERIALS`, `PIECE_SETS`, `PIECE_FINISHES`, `STAGE_COLORS`, `PRONUNCIATION_FILES`.
2. **State** — one mutable `state` object: board, turn, mode, `botLevel`, `thinkTimeMs`, assist, language, theme, text size, board style/material, `pieceSet`, `pieceFinish`, stage colour, history, captured lists, selection, legal moves, status, `halfmove`, `positionCounts`, `aiThinking`.
3. **Rules** — `getPseudoMoves` → `getLegalMoves` (apply, reject own check, undo) → `performMove` → `updateGameStatus`. Pieces are `{ id, type, color, promoted }`, type `K|M|B|N|R|P`. `index = row * 8 + col`, **row 0 = rank 8**, col 0 = file a; `coordinateOf` maps `8 - row`.
4. **AI** — `AI_LEVELS` (easy/medium/hard/super) → `chooseAIMove` (async; iterative deepening, alpha-beta, full-window root, killer moves, history heuristic, yields every ~70 ms) → `negamax` → `quiesce` (Hard/Super) → `evaluateBoard` → root repetition/progress adjustment. Black only.
5. **3D scene** — `boot` → `initScene` → `createMaterials` → `createEnvironment` → `buildBoard` → `createDust`; `renderFrame` runs on `setAnimationLoop`; `syncPieceMeshes` reconciles meshes to `state.board`; `renderHighlights` redraws move dots/rings.
6. **UI / I/O** — `updateAllUI` → `applyStaticTranslations`, tutor, move record, captures, result modals; `saveGameToStorage` / `savePreferences`; `downloadSave` / `handleLoadFile`; `renderGlossary`; `openPiecePreview`; display and bot controls. `sideLabel(color)` is the single source for player-facing side names; the stage toolbar's Display button and the sidebar entry both call `openDisplaySettings()`.

Boot order in `boot()`: `loadPreferences` → `warmSpeechVoices` → `applyTextSize` / `applyTheme` / `applyStageColor` / `applyBoardMaterial` / `applyBoardStyle` → `resetGameState` → `tryRestoreAutoSave` → `initScene` → `bindEvents` → `rebuildPieceMeshes` → `updateAllUI`. `pieceSet` and `pieceFinish` are applied when meshes are built, not in the boot chain.

Key constants and formulas (all in `script.js`, not CSS):

```text
promotionRowFor(w) = 2 (rank 6); promotionRowFor(b) = 5 (rank 3)
worldPosition(i) = (col - 3.5, WORLD.boardTop = 0.455, row - 3.5)
defaultCameraPosition = (8.6, 9.9, 10.2); camera FOV 40; target (0, 0.35, 0)
aspectDistanceMultiplier(a) = max(1, 1.03 / clamp(a, 0.55, 1.3))
AI_LEVELS = easy {3, 500ms}, medium {5, 1500ms}, hard {8, 5000ms}, super {12, 12000ms}
THINK_TIME_MIN_MS = 500; THINK_TIME_MAX_MS = 20000; THINK_TIME_STEP_MS = 250
PIECE_VALUES = { K: 0, M: 170, B: 305, N: 330, R: 520, P: 100 }; promoted P = 190
```

Persistence is split. Match: `localStorage["makruk3d.match.v1"]`, format `makruk-3d-save`, `version: 1`, payload `{ format, version, savedAt, app, credits, game: { board, turn, mode, assist, lang, sound, history, captured, lastMove, status, statusReason, winner, halfmove, positionCounts, startedAt } }`. Preferences: `localStorage["makruk3d.prefs.v1"]` (includes `botLevel`, `thinkTimeMs`, `pieceSet`, `pieceFinish`). The board serialises as `{t, c, p}` per square. `validateLoadedGame` only checks 64 cells, legal type/colour and exactly one Khun per side; it does not replay history.

`window.Makruk3D` is a smoke-test surface: `version`, `getState`, `getLegalMoves`, `getBoard`, `getPiecePositions`, `getScreenPoint`, `selectSquare`, `playMove`, `replayLastMove`, `replayGame`, `exitGameReplay`, `newGame`, `getView`, `setTopView`, `setBotLevel`, `setThinkTime`, `setPieceSet`, `setPieceFinish`, `setBoardMaterial`, `previewBotMove` (async), `getSearchStats`.

## 4. Decisions and constraints

- **Makruk, not FIDE chess.** The rules are the product: Khun one step; Met one diagonal; Khon one diagonal or one forward; Ma L-leap; Ruea orthogonal slider; Bia one forward, diagonal capture, no double step. Promotion is automatic to Bia Ngua at rank 6/3 and Bia Ngua moves like a Met. Do not add castling, en passant, pawn double-step or a FIDE queen.
- **The starting array is deliberate code, not data.** `createStartingBoard` puts both colours on `["R","N","B","K","M","B","N","R"]` with Bia on ranks 3 and 6. Change it only with the rules tests and docs; see the known transposition in §5.
- **The world coordinate system is fixed.** `worldPosition` places White at +z (near camera) and row 0 at −z. Board picks, piece meshes, camera framing, stalemate mini-board and `getScreenPoint` all assume it. Do not "flip" one without the others.
- **Three.js is pinned.** `index.html` maps `three` and `three/addons/` to `three@0.160.0`; `script.js` imports bare specifiers. Changing the version means retesting `OrbitControls`, `LatheGeometry`, `ExtrudeGeometry` and colour management.
- **No build, no package manager.** Only `index.html`, `style.css`, `script.js`, the seven WAVs and the docs are runtime files. Do not introduce a bundler, npm dependency or runtime fetch.
- **Bilingual symmetry is mandatory.** Every key exists in `en` and `th`; static text uses `data-i18n`, dynamic text uses `t(key, vars)`. `applyStaticTranslations`, `renderGlossary` and `syncBotControls` re-render on toggle. `scripts/check.mjs` fails on key drift.
- **Side labels are dynamic, not "Black".** `sideLabel(color)` returns White, Opponent (Single Player) or the active finish name (Ruby/Black in Pass & Play). Turn text, capture labels, result copy and the turn stone all use it. Do not hard-code "Black" in player-facing status; the pieces may be ruby.
- **Display settings must stay discoverable.** The stage toolbar carries a Display button in addition to the sidebar entry. Do not remove it or bury the piece/opponent controls below the fold; they were added to fix a real identification complaint.
- **Audio is synthesised; pronunciation is recorded.** `SoundStudio` creates one `AudioContext` on the first gesture. The seven `audio/th/*.wav` clips are primary; browser `speechSynthesis` is only a fallback and is known to be unreliable.
- **Saves are portable and shallow.** Bump `SAVE_VERSION` rather than silently reinterpreting v1. Exports are local Blobs; no network calls.
- **Board contrast and piece recognition are product requirements.** Jade & Slate and Ivory & Ruby are the defaults for that reason. Four piece families share one builder dispatch: Court (carved), Tournament (bold side silhouettes), Sigil (dark seal + gold glyph, top-down) and Monolith (geometric top faces). Keep them distinguishable at the default camera distance; do not revert the raised light square or the camera-side fill. Court is the cultural default; Sigil is the identification aid for overhead views.
- **Top view is a camera preset, not a new scene.** `setTopView` stores the current camera and target and restores them on toggle. `resetCamera` clears the preset. The button lives at the bottom-right of the stage so it is reachable on mobile without crowding the main toolbar. Manual orbit clears the preset so the button never claims to be in a view you have left.
- **The AI is one engine with four presets.** `AI_LEVELS` supplies depth cap, default clock, quiescence, move-pool margin and blunder chance. Changing a level preset must also reset the slider (`applyBotLevel`). The slider is the user's override and must persist in preferences.
- **The root must stay a full window.** A narrow root window returns the same bound for every failing move, which makes unrelated moves look tied and lets tie-breaking shuffle. This was the 1.7.0 "bot repeats instead of converting" defect. Keep `rootRepetitionPenalty` and `rootProgressScore`; do not remove the endgame mop-up term without re-running the conversion test in [docs/TESTING.md](docs/TESTING.md).
- **Search is synchronous per subtree but yields between root moves.** `chooseAIMove` is async and `yieldToBrowser` waits for a frame (40 ms fallback) roughly every 70 ms. This keeps OrbitControls and the render loop alive during a long think. Position-changing actions are still blocked; `resetGameState` and load increment `searchGeneration` so a stale search cannot move a new game's pieces. Do not remove the generation check when refactoring.
- **Replay must not mutate the live game.** `replayLastMove` animates the existing mesh from `from` to `to` and never touches `state.board`, `history`, turn or `positionCounts`. Full-game replay snapshots the live game, rebuilds `createStartingBoard()` and steps `snapshot.history` through `applyReplayMove` (not `performMove`, which would save and schedule the AI), then restores the snapshot on exit. Save and Load are disabled while it runs. Keep it read-only.
- **Documentation is part of the release.** Keep `README.md` as the human index, this file as the agent handoff, and `docs/` as the detailed set. `scripts/check.mjs` enforces the doc set, links and release identity.
- **`STATE.md` is a historical build record.** Do not rewrite its 1.7.0 timing/token numbers; add dated release notes instead.

## 5. Known issues

- **Black's centre pieces are transposed.** Standard Makruk has White Khun d1 / Met e1 and Black **Met d8 / Khun e8**. `createStartingBoard` uses the same array for both colours, so this build puts Black **Khun d8 / Met e8**. This is a rules-fidelity defect; it is documented rather than changed because the correction would invalidate existing saves and the opening book of tests.
- **No Thai counting rules.** Neither the 64-move board count when no unpromoted Bia remain, nor the bare-king material count is implemented. The app ends only by checkmate, stalemate, threefold repetition or two bare Khun.
- **No 50-move rule, draw agreement or resignation.** `state.halfmove` is updated and saved but never used by `updateGameStatus`.
- **Repetition and bare-kings draws are app conventions.** They are useful, but they are not a substitute for the Thai counting procedure.
- **Search runs on the main thread but yields.** Hard at 5 s and Super at 12 s reduce the frame rate while the bot thinks; the board remains orbitable and zoomable, but position-changing actions are blocked. The 20 s maximum is still untested on mobile.
- **Replay is a visual review, not a branch point.** Last-move replay animates the stored move with a captured-piece ghost; full-game replay rebuilds from the opening and steps the stored history. Exiting restores the live position. Neither mode allows branching or editing history, and full replay trusts the stored move list rather than re-validating it.
- **The bot is a heuristic opponent.** It converts simple king-and-rook endings, but has no opening book, transposition table or tablebase. Simple and Medium deliberately blunder. Do not market it as tournament strength.
- **Save validation is structural, not legal.** A file with two Khun per side is rejected, but an impossible board or illegal `turn` can load. History is trusted for display.
- **Browser coverage.** Verified in headless Chrome at desktop and mobile widths. Safari, Firefox, iOS and Android were not formally verified. WebGL is required; the fallback panel only reports failure.
- **Thai copy is not native-reviewed.** It is complete and symmetric, but a Thai speaker should proofread before a marketing push.
- **Network required.** Three.js and Google Fonts come from CDNs. There is no service worker. `file://` is not supported for the module app; serve over HTTP.
- **`tsc`/type-checking is not part of the build.** Bare `three` imports fail a dependency-less TypeScript check; the release relies on `node --check`.

## 6. Continuity

- **Deployed copy:** GitHub Pages, `main`, repository root, HTTPS enforced. Live URL above.
- **Local master:** `~/Projects/makruk-3d`.
- **Release identity:** app version `1.9.0` in `window.Makruk3D.version` and the release note in `STATE.md`.
- **Documentation map:** [README.md](README.md) is the human entry point; [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) is the module/algorithm map; [docs/REPRODUCTION.md](docs/REPRODUCTION.md) is the rebuild book; [docs/TESTING.md](docs/TESTING.md) separates verified results from gaps; [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) covers Pages operations; [STATE.md](STATE.md) is the historical session record.
- **Publishing rules:** keep the repository public (MIT) and Pages on `main` / `/`. Do not force-push. Do not commit credentials, `.env` files or downloaded save files. If the repository is renamed, update the absolute URLs in `index.html`, `README.md`, `AGENTS.md`, `docs/DEPLOYMENT.md` and `docs/REPRODUCTION.md`.

# Reproduction book

This is the rebuild and verification book for **Makruk 3D — Thai Chess Academy & Beginner Studio**. Read it with [ARCHITECTURE](ARCHITECTURE.md), [TESTING](TESTING.md) and [DEPLOYMENT](DEPLOYMENT.md).

> **If the three source files exist, they are the source of truth.** Do not rewrite the app from this book for style reasons. Use this book to understand, verify, extend or reconstruct it.

## 1. What is being reproduced

A single-page, bilingual 3D **Makruk** academy delivered as three static files plus seven pronunciation WAVs:

- **Ruleset:** Makruk (Thai chess). Khun one step; Met one diagonal; Khon one diagonal or one forward; Ma L-leap; Ruea orthogonal slider; Bia one forward / diagonal capture; automatic promotion to Bia Ngua at rank 6 (White) or rank 3 (Black), after which it moves like a Met. No castling, en passant, double pawn step or FIDE queen.
- **Modes:** Single Player (human White vs heuristic Black bot) and Pass & Play (two humans).
- **Languages:** English and Thai, switched live without interrupting the match.
- **Teaching layer:** legal-move dots and capture rings, selected-piece tutor, seven-card illustrated glossary, six rule cards, post-stalemate review, per-piece interactive 3D viewer with Thai pronunciation.
- **Presentation:** Three.js r160 board with 64 procedural pieces/board/tiles; two piece families (Court and Tournament); five board finishes with Jade & Slate as the default; Ivory & Ruby or Ivory & Ebony; checkered or traditional single-tone; four display themes; four text sizes; seven stage-colour choices; orbit/pan/full-size camera.
- **Bot:** Four levels (Simple, Medium, Hard, Super Super Hard) with a 0.5–20 s thinking-time slider, quiescence search, a repetition-aware root and an endgame mop-up term.
- **Audio:** synthesised Web Audio effects plus seven bundled Thai WAVs, with browser speech synthesis as fallback.
- **Persistence:** `localStorage` autosave, `makruk_save.json` download and restore.
- **Release:** **1.8.3**, MIT, deployed on GitHub Pages.

**Not reproduced:** Thai endgame counting rules, 50-move rule, draw agreement, resignation, server play, accounts, a strong engine, or international-chess rules. See §9.

## 2. Requirements matrix

| Requirement | Implementation | File |
| --- | --- | --- |
| 8×8 board with rank 3/6 pawns | `createStartingBoard`, `state.board` | `script.js` |
| Khun one step, no castling | `getPseudoMoves` `K` branch; `KING_STEPS` | `script.js` |
| Met one diagonal | `getPseudoMoves` `M` branch | `script.js` |
| Khon five directions | `getPseudoMoves` `B` branch (`DIAGONALS` + forward) | `script.js` |
| Ma L-leap | `getPseudoMoves` `N` branch | `script.js` |
| Ruea slider, blocked by pieces | `getPseudoMoves` `R` ray loop | `script.js` |
| Bia one step, diagonal capture, no en passant | `getPseudoMoves` `P` branch | `script.js` |
| Automatic Bia Ngua promotion | `applyMoveRaw`, `promotionRowFor` | `script.js` |
| Check / checkmate / stalemate | `isSquareAttacked`, `isInCheck`, `updateGameStatus` | `script.js` |
| Threefold and bare-kings draws | `positionCounts`, `positionKey`, `onlyKingsRemain` | `script.js` |
| Legal-move filtering | `getLegalMoves` (apply/reject/undo) | `script.js` |
| Heuristic Black AI | `chooseAIMove`, `negamax`, `evaluateBoard` | `script.js` |
| Mode selector | `state.mode`, `changeMode`, `scheduleAI`, `canHumanInteract` | `script.js`, `index.html` |
| Move assist | `renderHighlights`, `addGlowDot`, `addCaptureRing` | `script.js` |
| Piece tutor | `tutorMarkupForPiece`, `updateTutor` | `script.js` |
| Glossary and rule cards | `renderGlossary`, `PIECES`, `I18N.rule1…6` | `script.js` |
| EN ⇄ TH switching | `I18N`, `t`, `applyStaticTranslations`, `updateAllUI` | `script.js`, `index.html` |
| Stalemate explainer | `renderStalemateReview`, `attackersOnSquare` | `script.js` |
| Procedural 3D pieces | `createKhun`, `createMet`, `createKhon`, `createMa`, `createRuea`, `createBia` | `script.js` |
| Carved board and materials | `buildBoard`, `createMaterials`, `makeWoodTexture`, `makeStoneTexture` | `script.js` |
| Orbit / pan / full-size | `OrbitControls`, `setPanMode`, `setBoardFocus`, `resetCamera` | `script.js` |
| Themes / text sizes | `THEMES`, `TEXT_SIZES`, `applyTheme`, `applyTextSize` | `script.js`, `style.css` |
| Board pattern / material | `BOARD_STYLES`, `BOARD_MATERIALS`, `applyBoardStyle`, `applyBoardMaterial` | `script.js` |
| Stage colour | `STAGE_COLORS`, `applyStageColor`, `applyStageAppearance` | `script.js` |
| Piece 3D viewer | `openPiecePreview`, `fitPiecePreview`, `renderPiecePreviewFrame` | `script.js`, `index.html` |
| Thai pronunciation | `playRecordedPronunciation`, `audio/th/*.wav`, speech fallback | `script.js`, `audio/th/` |
| Web Audio effects | `SoundStudio` | `script.js` |
| Autosave and JSON save/load | `exportPayload`, `saveGameToStorage`, `downloadSave`, `restoreGameFromPayload` | `script.js` |
| Credits in app and save | `APP_CREDIT`, footer, `window.Makruk3D` | `script.js`, `index.html` |
| Static release checks | `scripts/check.mjs` | `scripts/` |

## 3. Non-negotiable constraints

| Constraint | Why | How it is enforced |
| --- | --- | --- |
| Makruk, not FIDE chess | Product identity | Rule branches, glossary, README; manual matrix |
| No castling / en passant / double step | Correct Makruk | Code has no such branches; manual tests |
| Promotion at rank 6/3, automatic | Correct Makruk | `promotionRowFor`; no promotion modal |
| Three source files, no build | Lifetime simplicity | No `package.json`; `scripts/check.mjs` |
| Three.js pinned at 0.160.0 | Reproducible rendering | Import map checked by `scripts/check.mjs` |
| Bilingual symmetry | Every UI state works in both languages | `scripts/check.mjs` compares 187 keys and all `data-i18n` / `t()` keys |
| Bundled audio primary | Browser speech is unreliable | `playRecordedPronunciation` before `speakThaiWithBrowser` |
| Match and preferences separate | Display changes do not affect play | `makruk3d.match.v1` vs `makruk3d.prefs.v1` |
| Local-only data | Privacy | All saves are Blobs/localStorage; no runtime fetch |
| Documentation is part of release | Handoff | `scripts/check.mjs` required-file and link checks |
| No behaviour change in 1.7.0 docs pass | Release safety | Documentation-only commit; `STATE.md` untouched |

## 4. Reference environment

| Tool | Version / note |
| --- | --- |
| macOS | Darwin, Apple Silicon (build machine) |
| Node.js | 26.13.0 used for the static checks |
| Python | 3.x, only for `python3 -m http.server` |
| Chrome | 156.0.8078.79 headless used for the smoke test |
| Dependencies | **none**; no `npm install`, no package lock |
| Network | Required at runtime for jsDelivr and Google Fonts |

Commands:

```bash
cd ~/Projects/makruk-3d
python3 -m http.server 8080          # http://localhost:8080
node --check script.js
node scripts/check.mjs
```

## 5. Build order from an empty directory

Each stage ends with an acceptance check. Do not start the next stage until it passes.

### Stage 0 — Scaffold

```bash
mkdir makruk-3d && cd makruk-3d
git init -b main
mkdir -p audio/th docs scripts
```

Create `index.html`, `style.css`, `script.js`, `.gitignore`, `LICENSE` (MIT) and `STATE.md`. Do **not** create `package.json`, a bundler config or a `node_modules` directory.

**Accept:** `python3 -m http.server 8080` serves a blank page; no 404 for `style.css`.

### Stage 1 — HTML shell

Build the semantic shell in `index.html`:

1. `<head>`: charset, viewport, theme-colour, description, inline SVG favicon, title.
2. Pre-paint script reading `makruk3d.prefs.v1` and setting `data-theme` / `data-text-size`.
3. Google Fonts preconnect and the four families; local `style.css`.
4. `<script type="importmap">` mapping `three` and `three/addons/` to `three@0.160.0`.
5. Header: brand, EN/TH toggle, sound toggle, Rules & Pieces button.
6. Arena: turn cluster, move/check/thinking chips, `<canvas id="scene">`, stage toolbar (`resetView`, `panToggle`, `fullSizeToggle`), assist pill, loader, WebGL fallback, tutor bar, capture tray.
7. Sidebar: mode cards (`data-mode="ai"` / `"local"`), assist switch, move list and status, New Game / Save / Load, glossary and display buttons, wisdom card.
8. Five modals: glossary, piece preview, display, result, stalemate review. Include the `loadFileInput` file input.
9. Toast stack and `<noscript>`.
10. `<script type="module" src="script.js">` plus the 12 s CDN-failure fallback timer.

**Accept:** the page renders with CSS disabled; every id referenced by `script.js` exists; the import map parses.

### Stage 2 — CSS system

Implement `style.css` from the top down:

- Tokens in `:root` (midnight lacquer palette, gold `#d6b36a`, ivory `#f4e9d2`, green `#6fe0a0`, red `#ff7866`, radii 10–28 px, `--text-scale`).
- Body gradient, grain overlay, focus-visible outlines, `.sr-only`, `[hidden]`, toast stack.
- Topbar, arena, stage, toolbar, tutor, capture tray, sidebar panels, mode cards, switch, move list, result modal, stalemate mini-board, display grid, glossary grid, piece preview.
- Theme overrides `html[data-theme="ivory"|"jade"|"ruby"]`, stage vignette opacity via `--stage-vignette-opacity`.
- Breakpoints 1240, 1080, 780, 540 px; piece-preview breakpoints 850/640 px.
- `body.board-focus` full-size layout.
- `@media (prefers-reduced-motion: reduce)`.

**Accept:** no horizontal overflow at 390 px; the board stage keeps a usable height; Thai text does not clip.

### Stage 3 — Rules engine

In `script.js`, in this order:

1. Constants: `FILES`, `KNIGHT_STEPS`, `KING_STEPS`, `DIAGONALS`, `ORTHOGONALS`, `MATE_SCORE`, `AI_LEVELS`, `THINK_TIME_MIN_MS`, `THINK_TIME_MAX_MS`, `THINK_TIME_STEP_MS`.
2. Content: `I18N.en` / `I18N.th`, `PIECES`, `THEMES`, `TEXT_SIZES`, `BOARD_STYLES`, `BOARD_MATERIALS`, `PIECE_SETS`, `PIECE_FINISHES`, `STAGE_COLORS`, `PRONUNCIATION_FILES`.
3. `state`, `makePiece`, `createStartingBoard`.
4. Movement: `inside`, `squareIndex`, `rowOf`, `colOf`, `forwardFor`, `promotionRowFor`, `coordinateOf`, `pieceAt`, `getPseudoMoves`.
5. Attack/legality: `isSquareAttacked`, `attackersOnSquare`, `findKing`, `isInCheck`, `applyMoveRaw`, `undoMoveRaw`, `getLegalMoves`.
6. History/status: `positionKey`, `registerPosition`, `onlyKingsRemain`, `evaluateGameState`, `updateGameStatus`, `isTerminal`, `canHumanInteract`.
7. Flow: `performMove`, `scheduleAI`, `scheduleResult`, `newGame`, `changeMode`.

Starting array (this release):

```js
const backRank = ["R", "N", "B", "K", "M", "B", "N", "R"];
// row 0 (rank 8) = black back rank; row 7 (rank 1) = white
// black Bia row 2 (rank 6); white Bia row 5 (rank 3)
```

Standard Makruk has White `R N B K M B N R` and Black `R N B M K B N R` (Black Met d8, Khun e8). This release copies the same array for both colours, so Black is `K d8, M e8`. To reproduce **this release exactly**, keep it. To build a corrected Makruk version, reverse the two centre entries for Black and update the docs.

**Accept:** `window.Makruk3D.getLegalMoves().length === 23` at the opening, and `playMove` accepts `e3–e4` (indices 44 → 36).

### Stage 4 — UI, i18n, display

Implement `dom`, `t`, `applyStaticTranslations`, `updateTurnUI`, `renderRecordStatus`, `renderMoveList`, `renderCaptures`, `tutorMarkupForPiece`, `updateTutor`, `updateModeUI`, `updateAssistUI`, `updateSoundUI`, and the display functions. Add both languages at the same time; do not leave a key in one language only.

**Accept:** switching EN/TH updates the title, buttons, tutor, record, result and glossary; `scripts/check.mjs` i18n checks pass.

### Stage 5 — Three.js scene and models

1. `initScene`: renderer, scene, camera, OrbitControls, raycaster, clock, loudness of shadows.
2. `createMaterials`: teak and maple textures, stone textures, ivory/ruby/dark piece materials, gold, board sets.
3. `buildBoard`: plinth, 64 tiles, trim, studs, labels, invisible pick planes, piece/highlight/last-move layers.
4. `createEnvironment`, `createDust`.
5. Piece builders and `createPieceGroup`.
6. Camera helpers: `aspectDistanceMultiplier`, `resetCamera`, `resizeScene`, `setPanMode`, `setBoardFocus`.
7. Frame loop and overlays: `renderFrame`, `syncPieceMeshes`, `rebuildPieceMeshes`, `renderHighlights`, `addGlowDot`, `addCaptureRing`.
8. Piece preview: `initPiecePreview`, `resizePiecePreview`, `fitPiecePreview`, `renderPiecePreviewFrame`, `openPiecePreview`, `stopPiecePreview`.

**Accept:** the loader dismisses, all 32 pieces render, clicking a piece selects it, green/red overlays appear, full-size hides the sidebar, Escape restores it.

### Stage 6 — Audio, persistence, modals

1. `SoundStudio` + `audio` singleton.
2. Recorded pronunciation + speech fallback.
3. `serializePiece`, `serializeBoard`, `exportPayload`, `saveGameToStorage`, `savePreferences`, `loadPreferences`, `validateLoadedGame`, `restoreGameFromPayload`, `tryRestoreAutoSave`, `downloadSave`, `handleLoadFile`.
4. Result/stalemate rendering, modals, focus trap, toasts.
5. `bindEvents` for every control.
6. `boot()` and `window.Makruk3D`.

**Accept:** reload restores a move and language; Save downloads `makruk_save.json`; Load rejects a malformed file; the solver opens; AI replies.

### Stage 7 — Release documentation and checks

Add `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/REPRODUCTION.md`, `docs/TESTING.md`, `docs/DEPLOYMENT.md`, `scripts/check.mjs` and the `Documentation` section in README. Do not require a skills directory; this repository ships the app and its verification script only.

**Accept:** `node scripts/check.mjs` prints `OK <n> checks`; the live page returns 200.

## 6. Where the non-obvious numbers came from

These are deliberate values in the source; changing one usually requires changing its neighbours.

### Rules and AI

| Value | Meaning | Reason |
| --- | --- | --- |
| 23 | Legal opening moves | 8 Bia + 4 Ma + 6 Khon + 2 Met + 2 Ruea + 1 Khun, with the back rank blocked |
| ranks 6 / 3 | Promotion ranks | Makruk promotes on the sixth rank from the player's side |
| 5 s default / 0.5–20 s slider | Hard thinking budget | Lets the user trade speed for strength |
| 3 / 5 / 8 / 12 | Level depth caps | Simple, Medium, Hard, Super Super Hard; the clock usually binds first |
| 420 ms | Bot “thinking” delay | Makes the reply feel deliberate and lets the UI breathe |
| 100000 | Mate score | Larger than any material/PST total |
| `M 170, B 305, N 330, R 520, P 100` | Piece values | Met is intentionally weak; Ruea is the strongest piece |
| 190 | Promoted Bia value | Slightly above a Bia, below a Khon |
| 14 × progress | Pawn advance bonus | Rewards the early promotion race |
| 20 | Khun home-rank safety | Discourages pointless king wandering |
| 3.2 / 1.6 | Centre bonuses | Small enough to keep material first |

### Board, camera, render

| Value | Meaning | Reason |
| --- | --- | --- |
| `WORLD.boardTop = 0.455` | Piece/tile top plane | All pieces and highlights use one y plane |
| `(col − 3.5, row − 3.5)` | Square centre | Centres an 8×8 board on the origin |
| 0.985 / 0.032 | Tile size / thickness | Leaves a visible carved seam |
| 9.45, 9.02, 8.58, 8.18 | Plinth boxes | Layered border with a shadow-catching step |
| `(8.6, 9.9, 10.2)` | Default camera | Three-quarter view with the white side near |
| 40° | Camera FOV | Fits the board without extreme perspective |
| 9.5–34 | Orbit distance | Prevents clipping and “lost board” zoom-out |
| `1.03 / clamp(aspect, 0.55, 1.3)` | Portrait reframe | Pulls back on narrow screens; capped so it does not over-zoom |
| 0.85 / 0.87 | Full-size zoom | Tighter framing in normal and portrait layouts |
| DPR ≤ 2 | Render scale | Retina sharpness without melting mobile GPUs |
| 4.6 / 0.19 | Move animation rate / lift | About 217 ms with a gentle hop |
| 0.38 s | Capture removal | Long enough to read, short enough not to block |
| 384 × 384 | Texture canvases | Enough grain at board scale, cheap to generate |
| seeds 42, 89, 17, 71 | Teak textures | Reproducible grain; do not randomise at runtime |
| seeds 601–608 | Stone textures | One pair per stone finish |
| 100 dust points, seed 128 | Gold dust | Deterministic, subtle depth cue |
| `0.22` master gain | Audio level | Headroom before the compressor |

### Palette

- Lacquer background `#0a0705`; table `#6c5845`; dust `#e0bc75`.
- Ivory pieces `#f4e7cc`; ruby `#b4232c`; ebony `#2a1912`.
- Teak tiles `#c29a67` / `#5b3a24`; maple `#e0c9a4` / slate `#3d4854`; Carrara `#d8d2c4` / `#17191c`; travertine `#cbb38f` / `#403a34`; jade `#d5ddcf` / `#234c3e`.
- Stone materials use roughness ≥ 0.5 to remove the key-light glare (the “anti-glare” pass).

## 7. Verification procedure

Run from the repository root:

```bash
node --check script.js
node scripts/check.mjs
```

Expected:

```text
OK <n> checks
```

Then serve and smoke-test:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

In the console:

```js
Makruk3D.version                       // "1.8.3"
Makruk3D.getLegalMoves().length        // 23 at the opening
Makruk3D.playMove(44, 36)              // true (e3–e4); bot replies
Makruk3D.getState().moveCount          // 2 after the reply
```

Expected runtime: loader disappears, 32 pieces render, assist dots appear on selection, EN/TH switches without resetting, reload restores the match, full-size toggles, Save downloads JSON, Load rejects a broken file.

The full manual matrix and the split between “verified now” and “reported from the build session” are in [TESTING](TESTING.md).

## 8. What was tried and rejected

- **Browser `speechSynthesis` as the primary pronunciation path.** Repeated “Hear Thai” clicks often played only once, and voice availability varied. Replaced by seven bundled WAVs generated with the macOS Kanya voice; speech remains a fallback.
- **A dependency-less TypeScript check.** `tsc` rejects the bare `three` / `three/addons` imports because there is no `node_modules`. It is not part of the release; `node --check` and the browser smoke test are.
- **A single fixed dark stage.** The user asked for adjustable stage colour and a movable board, which became seven stage choices plus `Move view` and `resetCamera`.
- **A single fixed camera.** Full-size mode and portrait reframing were added after desktop/mobile review; `aspectDistanceMultiplier` is the result.
- **A single board style.** The board started uncheckered; research showed modern Thai club boards often alternate, so checkered became the default and traditional remains available.
- **A fixed type size.** Four text sizes and four themes were added; `--text-scale` and `data-theme` now drive them.
- **A loader that faded but still caught clicks.** It was removed from hit-testing after the fade (`hidden = true` after 520 ms), fixing board clicks near the centre.
- **A “stalemate is wrong, I won” report.** The save was replayed; Black's Khun was not in check and had no legal move, so the draw was correct. The outcome was a beginner review panel, not a rules change.
- **A single-move piece preview.** Originally the glossary was text-only; a turntable viewer and a tutor `View in 3D` link were added.
- **Met as a “seed”.** The role was corrected to queen/counsellor in the copy and glossary, while keeping the Thai name.

## 9. Honest deviations and unfinished parts

| Item | State |
| --- | --- |
| Black Khun/Met | **Transposed** relative to standard Makruk: this release starts Black Khun d8, Met e8 instead of Met d8, Khun e8 |
| Thai counting rules | **Not implemented** (64-move board count; bare-king material count) |
| 50-move rule | Not implemented; `state.halfmove` is stored but unused |
| Draw agreement / resignation | Not implemented |
| Threefold / bare kings | Implemented as app conventions |
| AI | Depth 3–8, 0.5–20 s budget, no opening book/tablebase; Black only |
| Save validation | Checks shape and kings, not full legality |
| Browser coverage | Chrome verified; Safari/Firefox/iOS/Android not formally verified |
| Thai copy | Complete but not native-reviewed |
| Offline | Not supported; CDN and web fonts required |
| `.nojekyll` | Absent; Pages works because no published path starts with `_` |
| `STATE.md` | Historical build record, not runtime data |

Do not silently “fix” a listed item in a documentation-only release. If you fix the Black centre transposition, update the starting-array diagram, README rule table, this book and the test matrix in the same change.

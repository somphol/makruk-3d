# Architecture

Makruk 3D is a single-page ES-module application. There is no framework, bundler or package manager. `index.html` is the shell and import map; `style.css` is the visual system; `script.js` contains the rules, AI, Three.js scene, bilingual UI, audio and persistence.

```text
index.html
  ├─ inline preference pre-paint script (theme / text size)
  ├─ Google Fonts + style.css
  ├─ import map: three@0.160.0, three/addons/
  ├─ static shell, modals, data-i18n hooks
  └─ script.js (type="module")
       ├─ content constants (I18N, PIECES, THEMES, ...)
       ├─ state + rules engine
       ├─ AI
       ├─ Three.js scene + procedural models
       ├─ UI rendering and modals
       ├─ audio / speech / pronunciation
       └─ persistence + boot
```

## 1. Load and boot

`index.html` runs a small inline script before first paint to read `makruk3d.prefs.v1` and set `data-theme` / `data-text-size`, avoiding a flash of the wrong palette. It then loads the module.

`boot()` is the only entry point:

1. `loadPreferences()` — validates each stored preference against `THEMES`, `TEXT_SIZES`, `BOARD_STYLES`, `BOARD_MATERIALS`, `PIECE_SETS`, `PIECE_FINISHES`, `AI_LEVELS` and `STAGE_COLORS`; malformed values are ignored.
2. `warmSpeechVoices()` — enumerates browser voices without speaking.
3. `applyTextSize` → `applyTheme` → `applyStageColor` → `applyBoardMaterial` → `applyBoardStyle`. Piece family and opponent finish are read directly from state when meshes are built.
4. `resetGameState()` — creates the board, registers the initial position and evaluates status.
5. `tryRestoreAutoSave()` — parses `localStorage["makruk3d.match.v1"]`; on success restores the full snapshot, on failure keeps the fresh game.
6. `initScene()` — WebGL renderer, scene, camera, OrbitControls, materials, environment, board, dust, camera, resize observer, animation loop. Sets `window.__MAKRUK_READY__ = true` after the first frame and hides the loader.
7. `bindEvents()`, then repeated theme/material application (the board materials do not exist until `initScene`).
8. `rebuildPieceMeshes()`, `renderHighlights()`, `updateAllUI()`.
9. Deferred: AI first move if Black is to move, autosave if history exists, pronunciation preload after 1.2 s, “board ready” toast after 0.95 s.

## 2. Board and rules engine

### Board model

- `state.board` is `Array(64)` of `null | { id, type, color, promoted }`.
- `index = row * 8 + col`; **row 0 is rank 8**, row 7 is rank 1; col 0 is file `a`.
- `coordinateOf(index)` returns `${FILES[col]}${8 - row}`.
- Starting pieces: `createStartingBoard()` uses `["R","N","B","K","M","B","N","R"]` on rows 0 and 7, Bia on rows 2 and 5. White moves toward decreasing rows (`forwardFor("w") = -1`), Black toward increasing rows.
- Promotion rows: White row 2 (rank 6), Black row 5 (rank 3); `promotionRowFor`, `isPromotionRank`.
- A promoted pawn keeps `type: "P"` with `promoted: true`; `pieceMeta` and `pieceViewerKey` map it to Bia Ngua.

### Move generation and legality

`getPseudoMoves(board, from)` is a switch on `piece.type`:

| Type | Movement | Implementation |
| --- | --- | --- |
| `K` | One square in any of 8 directions | `KING_STEPS` + `addTarget` |
| `M` | One diagonal step | `DIAGONALS` |
| `B` (Khon) | One diagonal step in any direction, or one straight forward | `DIAGONALS` + `forwardFor` |
| `N` | L-shaped leap | `KNIGHT_STEPS` |
| `R` | Any distance orthogonally, blocked by the first piece | ray loop over `ORTHOGONALS` |
| `P` | One forward if empty; diagonal capture forward | `forwardFor`, no double step, no en passant |
| promoted `P` | One diagonal step, like a Met | `DIAGONALS` |

`getLegalMoves(color, board)` iterates every friendly piece and every pseudo move. It skips capturing an enemy `K` (`target.type === "K"`), applies the move with `applyMoveRaw`, rejects it if `isInCheck(color, board)`, then undoes it with `undoMoveRaw`. `applyMoveRaw` mutates the moving piece's `promoted` flag and returns `{ captured, promotedNow }`; `undoMoveRaw` reverses both the move and the promotion flag. There is no memoisation; the board is 64 cells and the AI searches at most three plies.

`isSquareAttacked(board, target, byColor)` scans all 64 squares and checks the attacker's geometry directly. It is deliberately separate from `getPseudoMoves` because pawns and the Khon have direction-dependent attacks. `attackersOnSquare` returns the list of attackers and is used by the stalemate review. `findKing` scans for `type === "K"`.

### Move application and status

`performMove(from, to)`:

1. Re-finds the legal move in `getLegalMoves(state.turn)`; returns `false` if absent.
2. Records the moving/captured pieces, applies the move, appends to `state.captured`, flips `state.turn`.
3. Updates `state.halfmove` (reset on a capture or pawn move; otherwise increment).
4. Builds `state.lastMove` and pushes a history object with `{ from, to, color, type, promoted, promotionThisMove, captured, check, mate }`.
5. Calls `registerPosition()` (increments `positionCounts[positionKey()]`), then `updateGameStatus()`.
6. Plays promotion/capture/move sound, schedules check sound, calls `syncPieceMeshes`, `renderHighlights`, `updateAllUI`, autosaves, then schedules the AI or result modal.

`positionKey` is placement + promoted flags + turn. Castling and en passant do not exist, so they are not encoded.

`updateGameStatus()` (and its near-duplicate `evaluateGameState()`, used only for a fresh game) sets:

- `checkmate` when the side to move has no legal move and is in check;
- `stalemate` when it has no legal move and is not in check;
- `draw` / `repetition` when the current position count is ≥ 3;
- `draw` / `bareKings` when no non-K piece remains;
- otherwise `playing`, with `inCheck` set.

There is no 50-move rule and no Thai counting rule. `state.halfmove` is display-neutral and never consulted by status logic.

### Promotion

Promotion is **automatic and compulsory**: any unpromoted Bia reaching its promotion rank becomes a Bia Ngua on the same move. There is no promotion modal and no choice of piece. This matches Makruk, and it is also why the move record appends `↑` instead of `=Q`.

## 3. AI

`chooseAIMove()` is called only for Black, after a 420 ms UI delay in `scheduleAI()`. The thinking budget is `state.thinkTimeMs` (0.5–20 s, default 5 s at Hard); `AI_LEVELS[state.botLevel]` adds a depth cap, quiescence policy, move-pool margin and blunder chance.

- Legal root moves come from `getLegalMoves("b", state.board)`.
- Root moves are ordered by `orderMoves`; depth 1 is shuffled, later depths reuse the ordered list.
- Each root move is searched with a **full window** (`-Infinity, Infinity`). A narrow root window makes every failing move return the same bound, which previously tied unrelated moves and let tie-breaking shuffle.
- `negamax(board, color, depth, alpha, beta, ply, cfg)` uses `MATE_SCORE = 100000`, returns `-MATE_SCORE + ply` for checkmate and `0` for stalemate, and aborts when `performance.now() > searchDeadline`.
- Iterative deepening runs to `cfg.maxDepth` (3/5/8/12) or until the budget expires. A depth result is adopted only if the search was not aborted. It stops early on a mate score.
- `quiesce()` searches captures and promotions for Hard and Super Super Hard, capped at four plies.
- `orderMoves()` is MVV-LVA-like plus two killer moves per ply and a history heuristic.
- `evaluateBoard(board, perspective)`:
  - `PIECE_VALUES = { K: 0, M: 170, B: 305, N: 330, R: 520, P: 100 }`, promoted P = 190.
  - N/B/M gain centre proximity and enemy-Khun pressure.
  - Bia gain `14 × progress` plus promotion-rank bonuses.
  - A Ruea gains centre proximity, an open-file bonus and a cut-off bonus on the enemy Khun's rank/file.
  - In the endgame the Khun centralises; with a material lead an explicit mop-up term drives the enemy Khun to the edge, walks the winning Khun in and rewards a cutting Ruea.
- Root scores are adjusted for repetition when Black is ahead (`rootRepetitionPenalty`) and ties are broken toward captures, promotions, pawn advances and central squares (`rootProgressScore`). This is what makes the bot convert a winning position instead of repeating.

Simple and Medium keep a margin and a blunder chance, so they remain beatable. Hard and Super Super Hard use the exact best score and no randomness. There is no opening book, transposition table or tablebase.

## 4. Three.js scene

`initScene()` creates a `WebGLRenderer` with antialiasing, ACES tone mapping, sRGB output, PCF soft shadows and DPR clamped to 2. The camera is `PerspectiveCamera(40, aspect, 0.1, 80)`; `OrbitControls` enable damping, rotate/dolly/pan, distance 9.5–34, polar angle 0.32–0.455π, target `(0, 0.35, 0)`, rotate speed 0.55 and zoom speed 0.65. `resetCamera()` restores `defaultCameraPosition = (8.6, 9.9, 10.2)`, scaled by `aspectDistanceMultiplier(aspect)`. Full-size mode adds a focus zoom of 0.85 (0.87 in portrait).

### Coordinates and board

`worldPosition(index) = (col − 3.5, 0.455, row − 3.5)`. The board top is `WORLD.boardTop = 0.455`; White is at positive z, near the default camera. `buildBoard()` builds a layered plinth (`9.45 × 0.18`, `9.02`, `8.58`, `8.18` boxes), 64 tiles (`0.985` square, `0.032` thick, y `0.447`), gold trim, corner studs and coordinate labels. An invisible 8×8 plane grid (`pickables`) provides raycast picking; each plane stores `userData.square`.

Board materials:

- Teak textures: `makeWoodTexture` on 384×384 canvases with `seededRandom(42/89/17/71)`; the light square is deliberately raised to `#c29a67` and the dark square to `#5b3a24`.
- Stone textures: `makeStoneTexture` with seeds 601–608 and styles `marble`, `travertine`, `granite`, `jade`, `slate`.
- Five sets in `materials.boardSets`: teak, maple (maple + slate), carrara, travertine, jade. Maple is the default.
- `boardTileMaterial(isLight)` returns the light material for every square in `traditional` mode, and light/dark in `checkered` mode.

### Pieces

Each builder returns `{ group, height }`. All are procedural; no model files. `state.pieceSet` selects the Court or Tournament family through `PIECE_BUILDERS`, and `state.pieceFinish` selects the opponent material (`ruby` or `dark`) through `getSetMaterial`/`getSetAccent`.

| Builder | Court geometry | Height |
| --- | --- | --- |
| `createKhun` | 26-point `LatheGeometry` bell/crown profile + 2 gold torus rings + gold sphere finial | 1.05 |
| `createMet` | 14-point compact bud lathe + gold collar + finial bead | 0.59 |
| `createKhon` | stupa lathe + 3 gold rings + gold cone tip | 0.975 |
| `createMa` | turned base + extruded hand-drawn horse-head `Shape` (bevel 0.018/0.022) + 10 mane cones + eyes + gold torus/cheek | 0.91 |
| `createRuea` | extruded longboat hull `Shape` + deck + rails/posts + cabin + gold bow/stern eyes | 0.32 |
| `createBia` | hemisphere shell scaled flat + gold slit/beads, or inverted shell with gold inlay ring for Bia Ngua | 0.25 / 0.235 |

The Tournament family (`createTournament*`) shares `addTournamentBase`, an eight-sided stepped plinth, and gives each officer a unique crown: five-point crown (Khun), octahedral diamond (Met), wide brimmed helmet (Khon), enlarged horse head with ears and bridle (Ma), crenellated cabin on the barge hull (Ruea), and a spired promoted shell (Bia Ngua).

Materials are `MeshPhysicalMaterial` ivory/ruby/dark for pieces, `MeshStandardMaterial` for board/gold. `createPieceGroup` dispatches by type and stores `visualKey = type + promoted`.

### Reconcile, animate, highlight

`syncPieceMeshes({ animate })` walks `state.board`, reuses meshes by `piece.id`, rebuilds when `visualKey` changes, and marks missing ids as `removing`. `renderFrame` advances:

- Spawn scale from 0.82 to 1 at `delta * 4.8`.
- Move animation: `time += delta * 4.6` (about 217 ms), cubic ease, start→target x/z, sine lift `0.19`, slight x rotation.
- Removal: 0.38 s shrink/spin/drop.
- Dust: slow y rotation and a sine bob.
- All pulsing highlight objects use `sin(elapsed * 3.2 + phase)`.

`renderHighlights()` clears the two overlay groups and draws last-move amber tiles, a selected gold ring, green `addGlowDot` for quiet legal moves, red `addCaptureRing` for captures, and a red ring on a checked Khun. The assist toggle only controls the legal-move overlays.

`resizeScene()` updates renderer/camera and rescales the camera offset only when aspect changes by more than 0.025, so a mobile rotation reframes without snapping during a drag.

## 5. UI, i18n and accessibility

`dom` caches every element by id. `applyStaticTranslations()` sets `<html lang>`, the document title, every `[data-i18n]` text, `[data-i18n-title]`, language-toggle state and the glossary title. `updateAllUI()` then calls, in order: mode, assist, sound, turn, record status, move list, captures, tutor; it re-renders open result/glossary/preview/stalemate/display modals.

`renderGlossary()` rebuilds seven `PIECE_ORDER` cards from `PIECES` and six rule cards from `I18N.rule1…rule6`. Cards are `role="button"`, keyboard-activatable, and carry a `data-pronounce` speaker button plus `data-piece-key` for the 3D preview.

`renderStalemateReview()` builds a 64-cell mini-board from the final position, finds the side to move's Khun, enumerates all eight adjacent squares with `attackersOnSquare`, and classifies each as attacked, blocked by a friendly piece, or open. Only attacked/blocked squares are listed. `showStalemateReview()` is offered only when `status === "stalemate"`.

Modals use `openModal`/`closeModal`, restore focus to `lastFocusedElement`, and a global Tab handler loops focus inside the topmost open dialog. Escape closes preview → display → stalemate → result → glossary, then exits full-size. The promotion dialog of international chess does not exist.

Display preferences:

- `applyTheme` sets `data-theme`, calls `applyStageAppearance`, optionally saves.
- `applyStageAppearance` computes relative luminance and switches the vignette opacity (0.36 on light stages), dust opacity/colour and a flat table material.
- `applyTextSize` sets `data-text-size`; CSS maps small/medium/large/xlarge to `--text-scale` 0.9/1/1.2/1.4, and `body` font-size is `15px × scale`.
- `applyBoardStyle`, `applyBoardMaterial` swap tile materials in place.
- `applyStageColor` accepts `auto` or `#rrggbb`.

Responsive breakpoints are 1240 px (narrower sidebar), 1080 px (single column, two-column sidebar), 780 px (compact header), 540 px (compact stage), plus 850/640 px for the piece-preview modal. `prefers-reduced-motion` disables CSS animation/transition, but the Three.js animation loop still runs.

## 6. Audio and speech

`SoundStudio` lazily creates one `AudioContext` on the first pointer/key gesture. The graph is oscillator/noise → gain → master gain (0.22) → compressor (−18 dB threshold, 18 dB knee, 4:1) → destination. Methods: `click`, `select`, `move`, `capture`, `promote`, `check`, `win`, `lose`, `draw`; the sound toggle sets `audio.enabled`.

Thai pronunciation is a separate system:

- `PRONUNCIATION_FILES` maps the seven keys to `audio/th/*.wav` (22.05 kHz mono WAVs generated from the macOS Kanya voice).
- `preloadPronunciationAudio()` creates one `Audio` per file.
- `playRecordedPronunciation()` stops any previous clip, resets `currentTime`, plays at 0.95 volume, and falls back to browser speech on error or rejected `play()`.
- `speakThaiWithBrowser()` / `playNextThaiUtterance()` queue a Thai utterance at rate 0.82, pitch 1.02, with a 5 s watchdog; this is the fallback only.
- Both paths respect the sound toggle and add/remove `.is-speaking` on the originating button.

## 7. Persistence and data flow

Input flow:

```text
pointerdown/up on #scene
  → raycaster over pickables
  → handleSquareClick(square)
  → selectSquare / performMove
  → applyMoveRaw → updateGameStatus
  → syncPieceMeshes + renderHighlights + updateAllUI
  → saveGameToStorage + savePreferences
  → scheduleAI (if Black bot) or scheduleResult (if terminal)
```

Intents are local and synchronous except the AI timer, result timer and audio callbacks.

Match storage:

```json
{
  "format": "makruk-3d-save",
  "version": 1,
  "savedAt": "ISO-8601",
  "app": "Makruk 3D — Thai Chess Academy & Beginner Studio",
  "credits": { "builtWith": "OpenCode", "model": "DeepSeek V4.1 Flash", "provider": "opencode-go", "modelId": "deepseek-v4.1-flash" },
  "game": {
    "board": [{ "t": "K", "c": "w", "p": false }, null],
    "turn": "w",
    "mode": "ai",
    "assist": true,
    "lang": "en",
    "sound": true,
    "history": [],
    "captured": { "w": [], "b": [] },
    "lastMove": null,
    "status": "playing",
    "statusReason": "",
    "winner": null,
    "halfmove": 0,
    "positionCounts": {},
    "startedAt": 0
  }
}
```

`downloadSave()` serialises this payload to `makruk_save.json`; `handleLoadFile()` parses and validates it, confirms if a match is in progress, then calls `restoreGameFromPayload()`. The same payload is written to `localStorage` after every move and on `beforeunload`.

Preferences (`makruk3d.prefs.v1`) hold `{ lang, sound, assist, mode, theme, textSize, boardStyle, boardMaterial, stageColor }`. They are saved independently from the match, so resetting the board does not reset display choices.

## 8. Extension points

| Change | Touch |
| --- | --- |
| Rules, legality, status | `getPseudoMoves`, `isSquareAttacked`, `getLegalMoves`, `applyMoveRaw`, `updateGameStatus` |
| Starting array / promotion | `createStartingBoard`, `promotionRowFor` |
| AI strength/behaviour | root loop in `chooseAIMove`, `negamax`, `evaluateBoard`, `PIECE_VALUES` |
| Piece shape | the matching `create*` builder; keep `{ group, height }` and `visualKey` |
| Board geometry/material | `buildBoard`, `createMaterials`, `makeWoodTexture`, `makeStoneTexture`, `boardTileMaterial` |
| Camera/framing | `defaultCameraPosition`, `resetCamera`, `aspectDistanceMultiplier`, `resizeScene` |
| Copy/translation | `I18N` (both languages), `PIECES`, `data-i18n` in `index.html` |
| Persistence | `exportPayload`, `restoreGameFromPayload`, `validateLoadedGame`, `SAVE_VERSION` |
| Verification | `scripts/check.mjs`, `docs/TESTING.md` |

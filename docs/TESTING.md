# Testing

Makruk 3D is verified with two layers: the dependency-free repository check and a manual/headless Chrome session. There is no CI workflow and no test runner dependency.

## 1. Repository check

```bash
node --check script.js
node scripts/check.mjs
```

`scripts/check.mjs` parses JSON, checks every local `src`/`href` and Markdown link, runs `node --check` on every JavaScript file, verifies the pinned Three.js import map, compares the English and Thai i18n dictionaries and static/dynamic key coverage, asserts the two piece families, two finishes, four bot levels, quiescence/mop-up/repetition wiring and the contrast defaults, and checks the audio manifest and release identity. It prints `OK <n> checks` on success.

## 2. Browser session — 3 November 2026

Headless Chrome (Playwright/Puppeteer driving the installed Chrome) at 1440×1000 and 390×844, served with `python3 -m http.server`.

Verified:

- The board, loader and all 32 pieces render with no page errors or console errors.
- Both piece families build and rebuild live; the 3D preview follows the selected family.
- **Sigil** and **Monolith** build and rebuild live. In Top view, Sigil shows the crown/diamond/mitre/horse/rook/shell/star seals; Monolith shows the cross gate, diamond obelisk, triangular shrine, horse stele, crenellated keep, hexagon and star-drum tops. Toggling Top view restores the previous camera position and target.
- Maple & Slate, Teak & Ebony, Carrara, Travertine and Jade board sets all render; Ruby and Ebony opponent finishes all render.
- The display modal saves and restores board material, piece set, opponent colour, theme, stage colour and text size.
- In Single Player, changing the level resets the thinking slider to that level's preset; the slider moves independently afterwards.
- The bot panel hides in Pass & Play and returns in Single Player.
- EN ⇄ TH updates the new bot copy and think-time output.
- The thinking chip names the active level and budget and uses an hourglass indicator.
- In Single Player the turn text says “Opponent is thinking…” / “Opponent to move”, never “Black”; the turn stone and move dots are ruby. In Pass & Play the same labels read “Ruby to move” / “Ruby is in check” while the ruby finish is selected.
- Capture labels read “Captured by Opponent” in Single Player and “Captured by Ruby” in Pass & Play.
- The Display button in the stage toolbar opens the modal and is reachable at 390 px.

AI measurements on the opening position (Apple silicon, headless Chrome):

| Level | Budget | Completed depth | Nodes | Wall time |
| --- | ---: | ---: | ---: | ---: |
| Simple | 0.5 s | 3 | ~5.5k | ~20 ms |
| Medium | 1.5 s | 5 | ~607k | ~1.1 s |
| Hard | 5 s | 5 | ~1.9M | 5.0 s |
| Super Super Hard | 8 s (test override) | 5 | ~2.9M | 8.0 s |

Depth is budget-bound in the crowded opening; the completed depth is the last full iteration. Deeper iterations are resumed when the position allows. The search yields a frame roughly every 70 ms, so the wall time includes those yields and the board stays interactive.

Conversion test: a constructed endgame of Black Khun + Ruea + Met versus a lone White Khun, with a scripted passive White. At a 0.5 s budget, Hard played the textbook plan — Ruea to the second rank to cut the Khun, then walked the Khun in — and delivered checkmate on move 9. This specifically guards against the earlier "shuffle instead of convert" failure.

Replay test: after the bot replied, the **Replay** button animated the last move and returned `replayActive` to false; move count, turn and board signature were unchanged. A separate capture position showed the captured-piece ghost. The button is disabled while the bot is thinking and reads `Replay the opponent's last move` in Single Player.

Full-game replay test: loading the 40-ply save and pressing **Replay game** rebuilt the board from the opening, advanced the bar and move record, paused, stepped forward and back, and disabled Save/Load. Exiting restored the exact 25-piece board signature, White-to-move turn and 40-ply history, re-enabled Save and hid the replay bar. No console errors.

Saved-position audit: `makruk_save (3).json` replays legally through all 40 history moves and produces the same 25-piece board that the file stores; the 25 rendered meshes match the 25 board entries with no position mismatches. It is White's turn, so the bot does not move until White moves. Subsequent White moves at Hard produce a reply after the 5 s budget.

Camera-during-search test: with a 5 s budget and the bot thinking, an orbit drag changed the camera position while the search continued; the bot still replied afterwards.

## 3. Not verified

- Safari, Firefox, iOS and Android were not formally tested.
- The 20 s maximum thinking time was not run on a phone. The search yields every ~70 ms, so the camera stays usable, but frame rate drops during deep iterations.
- Thai copy is complete and symmetric but has not been proofread by a native speaker.
- The AI is a heuristic opponent. Hard/Super can convert simple endgames; they have no opening book, transposition table or tablebase and are not tournament strength.
- The Thai endgame counting rules remain unimplemented.

# Project State — Makruk 3D

**Makruk 3D — Thai Chess Academy & Beginner Studio**  
**หมากรุกไทย 3 มิติ · สถาบันหมากรุกไทยและสตูดิโอผู้เริ่มต้น**

> Latest completion snapshot for the build, post-release review features, display themes, and GitHub publication.

## Release 1.9.1 — bigger, clearer Sigil and Monolith

The 1.7.0 timing and token tables below are the historical build record and are not re-measured. This release addresses three pieces of player feedback:

- **Board and piece contrast.** The teak light square was raised to `#c29a67`, Jade & Slate became the default finish, and the opponent defaults to Ivory & Ruby. A camera-side fill light and a slightly higher exposure lift the near faces.
- **Two piece families.** Court keeps the carved lathe set; Tournament adds distinct crowns for the Khun, Met, Khon, Ma, Ruea and promoted Bia. Both are selectable in Display settings.
- **Four bot levels with an adjustable clock.** Simple, Medium, Hard and Super Super Hard start at 0.5 s, 1.5 s, 5 s and 12 s; the slider ranges 0.5–20 s. The search now uses a full-window root, quiescence on Hard/Super, killer moves, a history heuristic, repetition avoidance when ahead and an endgame mop-up term.
- **1.8.1 UI pass.** Jade & Slate became the default board; the bot selector became a set of ranked strength cards with a custom slider; player-facing labels are side-aware ("Opponent" in Single Player, "Ruby" or "Black" in Pass & Play); the thinking chip uses an hourglass; and a Display button now sits in the board toolbar.
- **1.8.2 replay and readability.** Coordinate labels are larger, outlined and repeated on all four edges. The match record carries a **Replay** button that re-animates the last move (with a captured-piece ghost) without touching the position. The AI search yields to the browser every ~70 ms, so orbiting and zooming remain available while the bot thinks.
- **1.8.3 full-game replay.** A **Replay game** button in the actions panel rebuilds the match from the initial position and animates every stored move. A floating bar offers play/pause, previous/next and exit; exiting restores the live board, turn, captures, history and status exactly. Replay is read-only: Save and Load are disabled while it runs.
- **1.9.0 Sigil, Monolith and Top view.** Four piece families now ship. **Sigil** puts a dark wax seal with a gold glyph (crown, diamond, mitre, horse, rook, shell, star) on every crown, so the type is readable from directly above. **Monolith** builds monumental silhouettes (cross gate, diamond obelisk, triangular shrine, horse stele, keep and drums) with gold-capped top faces. A **Top view** button at the bottom-right of the stage tilts the camera to a near-overhead angle and restores the previous 3D view on toggle.
- **1.9.1 contrast pass.** Sigil seals were enlarged and mounted on collars; the Met became a faceted diamond and the Khon a wide brim. Monolith was rebuilt from abstract prisms into monumental silhouettes — cross gate, gold-tipped obelisk, tiled shrine, horse-head stele, crenellated keep, hex drum and octagonal star drum — with thicker gold top plates. Both families now fill more of the square for a stronger side and overhead read.

Verification for this release is recorded in [docs/TESTING.md](docs/TESTING.md).

## Status

| Field | Value |
| --- | --- |
| Project status | ✅ Complete and published |
| App version | `1.9.1` |
| Repository | <https://github.com/somphol/makruk-3d> |
| Live page | <https://somphol.github.io/makruk-3d/> (GitHub Pages deployment enabled) |
| Primary branch | `main` |
| Initial feature commit | `e134a27` — Build Makruk 3D Thai chess academy |
| 3D preview commit | `8d2e1ed` — Add 3D piece preview, Thai pronunciation and correct Met |
| Build type | Static site; no package manager, no build step |
| Source files | `index.html`, `style.css`, `script.js` |
| Source lines | 9,288 |
| Source size | 288,366 bytes |
| Project size | 2.1 MB including README screenshots and bundled Thai audio |

## Build timeline

| Milestone | UTC timestamp |
| --- | --- |
| OpenCode session started | `2026-11-01T18:42:08Z` |
| Initial game published | `2026-11-01T19:07:33Z` |
| Latest completion snapshot | `2026-11-01T22:39:54Z` |
| **Elapsed session time** | **3 hours 57 minutes 46 seconds** |

The elapsed time covers requirements research, design, procedural 3D modeling, rules engine, AI, bilingual copy, audio synthesis, persistence, browser testing, README/screenshot generation, GitHub publication, live-deployment verification, the post-game stalemate review, four display themes, four text sizes, the checkered/traditional board switch, adjustable stage colours, a moveable board view, the interactive 3D piece preview, tutor-to-preview linking, repeatable Thai speech, full-size board mode, and teak/stone board finishes.

## Token consumption

Captured from the OpenCode session database at the latest completion snapshot. This is the authoritative session usage recorded for this build and its post-release revisions.

| Token category | Count |
| --- | ---: |
| Input tokens | 1,451,376 |
| Output tokens | 216,063 |
| Reasoning tokens | 242,198 |
| Cache read tokens | 108,221,568 |
| Cache write tokens | 1,512 |
| **Total tokens processed** | **110,132,717** |
| Non-cache token total (input + output + reasoning) | 1,909,637 |
| Recorded API cost | **$0.00** |

> The total is the sum of input, output, reasoning, cache-read, and cache-write tokens. The completion snapshot is taken just before the final state-file commit; the final commit and closing assistant message may add a small amount after the snapshot.

### Session identity

| Field | Value |
| --- | --- |
| OpenCode session ID | `ses_e6794be9effez6HcdWlzmGAvff` |
| Session title | Makruk 3D chess academy project |
| Build agent | **OpenCode** |
| Model | **DeepSeek V4.1 Flash** |
| Provider | `opencode-go` |
| Model ID | `deepseek-v4.1-flash` |

## Verification completed

Browser-tested with Playwright and Chrome:

- ✅ Three.js scene loads, loader dismisses, no page errors
- ✅ 3D board and all seven procedural piece silhouettes render
- ✅ Canvas click selection and legal-move assist dots
- ✅ 23 legal moves in the authentic Makruk opening position
- ✅ Khon five-direction movement verified
- ✅ Met one-square diagonal movement verified
- ✅ Bia no-double-step movement verified
- ✅ Promotion to Bia Ngua and subsequent Met-like movement verified
- ✅ Checkmate and stalemate detection verified
- ✅ Single-player AI replies and returns control to White
- ✅ Checkmate result overlay and New Game / Review board actions
- ✅ Stalemate review verifies the final move, unchecked Khun and all three covered escape squares from the reported save
- ✅ Checkmate result correctly hides the stalemate-review action
- ✅ EN ⇄ TH switching updates all translated UI bindings plus dynamic copy
- ✅ Illustrated glossary: 7 piece cards and 6 rule cards
- ✅ Beginner Move Assist toggle and tutor statistics
- ✅ Four display themes applied to both the interface and 3D stage
- ✅ Four text sizes verified: 90%, 100%, 120%, 140% (body font 15px → 21px)
- ✅ Checkered and traditional board patterns rendered and restored from preferences
- ✅ Six stage colours plus custom colour verified; light stages switch to a flat, lighter table and softened vignette
- ✅ Move view verified: left-drag pan on desktop/mobile, existing right-drag/two-finger pan, and Reset view recentres
- ✅ Display preferences persist across reload; Reset restores lacquer/medium/checkered/auto-stage
- ✅ Per-piece 3D preview opens from every glossary card and is keyboard accessible
- ✅ Tutor bar **View in 3D** link opens the selected piece, including Bia Ngua, without disturbing the match
- ✅ Repeated **Hear Thai** playback verified across card and preview buttons with a mocked speech engine
- ✅ Scene loader is removed from hit-testing after fading, so it cannot block board clicks
- ✅ Full-size board mode verified on desktop and mobile; sidebar, header, footer and capture tray hide, and Escape exits
- ✅ Four board finishes verified: teak/ebony, Carrara/Marquina, travertine/granite and jade/slate
- ✅ Stone board materials persist, reset correctly, and retain readable piece contrast
- ✅ Honed anti-glare surfaces remove the bright key-light reflection from marble and wood
- ✅ Bundled Thai pronunciation WAVs generated with the macOS **Kanya** voice; all seven pieces load and play
- ✅ Repeated Hear Thai clicks restart the recorded clip immediately; browser speech synthesis remains the fallback
- ✅ Audio output verified in Chrome with advancing media timestamps, loaded resources and no playback errors
- ✅ JSON save download and file restore
- ✅ Auto-save / reload restoration, including language and assist preferences
- ✅ Invalid save rejection
- ✅ Desktop, tablet, and mobile layout screenshots
- ✅ No horizontal viewport overflow at 430px with extra-large text
- ✅ Modal Escape close and focus handling
- ✅ No duplicate DOM IDs; no missing translation keys
- ✅ Live GitHub Pages deployment loads and renders the complete 3D board

## Revision log

- **2026-11-01 · v1.7.0** — Replaced unreliable browser speech synthesis as the primary pronunciation path with seven bundled WAV recordings generated from the macOS **Kanya** Thai voice. Repeated Hear Thai clicks now restart the clip immediately; speech synthesis remains a fallback. Added full-size board framing, stone board finishes, and honed anti-glare surfaces in this release cycle.
- **2026-11-01 · v1.6.0** — Converted all board surfaces to honed, anti-glare materials to remove key-light reflections. Rebuilt Thai pronunciation as a deterministic queue with voice warm-up and strong utterance references; verified three consecutive plays with the real macOS Thai voice. Added full-size board framing and stone finishes from the previous revision.
- **2026-11-01 · v1.5.0** — Added **Full size** board mode with Escape-to-exit and camera framing for desktop/mobile. Added four board finishes inspired by stone table-top boards: Teak & Ebony, Carrara & Marquina, Travertine & Granite, and Jade & Slate, all persisted in display preferences.
- **2026-11-01 · v1.4.0** — Added a **View in 3D** link to the selected-piece tutor, fixed repeat Thai pronunciation playback (utterance retention, cancel/resume timing, and highlight cleanup), and removed the faded scene loader from hit-testing so it can never block board clicks.
- **2026-11-01 · v1.3.0** — Added six stage-colour presets plus a native custom colour picker, automatic lighter table treatment and softened vignette for light stages, and a **Move view** panning mode with a recentring Reset view. Board panning is available by left-drag in Move view, right-drag, or two-finger drag.
- **2026-11-01 · v1.2.0** — Added the beginner stalemate review, four display themes, four text sizes, and the checkered/traditional board switch. Checkered is now the default; traditional single-tone remains available. Sources confirm both styles are used in Thailand.
- **2026-11-01 · v1.0.0** — Initial procedural 3D Makruk game, AI, bilingual academy, glossary, audio, persistence and GitHub Pages publication.

## GitHub authentication note

The existing macOS Keychain credential for GitHub was reused for repository creation and push operations. No repeated user-facing Keychain prompts were triggered.

## Credits

- **Built with:** [OpenCode](https://opencode.ai)
- **Model:** **DeepSeek V4.1 Flash**
- **Provider / model ID:** `opencode-go` / `deepseek-v4.1-flash`
- **3D engine:** [Three.js](https://threejs.org) r160 + OrbitControls
- **Typography:** Cormorant Garamond, Manrope, Noto Sans Thai, Noto Serif Thai
- **Cultural source:** Thai Makruk tradition — Khun, Met, Khon, Ma, Ruea, Bia, and Bia Ngua
- **Author account:** [somphol](https://github.com/somphol)

The same credit is visible in the application footer, the glossary heritage strip, the README, and the save-file metadata.

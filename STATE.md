# Project State — Makruk 3D

**Makruk 3D — Thai Chess Academy & Beginner Studio**  
**หมากรุกไทย 3 มิติ · สถาบันหมากรุกไทยและสตูดิโอผู้เริ่มต้น**

> Latest completion snapshot for the build, post-release review features, display themes, and GitHub publication.

## Status

| Field | Value |
| --- | --- |
| Project status | ✅ Complete and published |
| App version | `1.2.0` |
| Repository | <https://github.com/somphol/makruk-3d> |
| Live page | <https://somphol.github.io/makruk-3d/> (GitHub Pages deployment enabled) |
| Primary branch | `main` |
| Initial feature commit | `e134a27` — Build Makruk 3D Thai chess academy |
| State commit | `56db0ac` — Add live demo link and project state report |
| Build type | Static site; no package manager, no build step |
| Source files | `index.html`, `style.css`, `script.js` |
| Source lines | 7,566 |
| Source size | 231,949 bytes |
| Project size | 784 KB including README screenshots |

## Build timeline

| Milestone | UTC timestamp |
| --- | --- |
| OpenCode session started | `2026-11-01T18:42:08Z` |
| Initial game published | `2026-11-01T19:07:33Z` |
| Latest completion snapshot | `2026-11-01T19:46:11Z` |
| **Elapsed session time** | **1 hour 4 minutes 3 seconds** |

The elapsed time covers requirements research, design, procedural 3D modeling, rules engine, AI, bilingual copy, audio synthesis, persistence, browser testing, README/screenshot generation, GitHub publication, live-deployment verification, the post-game stalemate review, four display themes, four text sizes, and the checkered/traditional board switch.

## Token consumption

Captured from the OpenCode session database at the latest completion snapshot. This is the authoritative session usage recorded for this build and its post-release revisions.

| Token category | Count |
| --- | ---: |
| Input tokens | 530,402 |
| Output tokens | 134,893 |
| Reasoning tokens | 142,616 |
| Cache read tokens | 32,518,400 |
| Cache write tokens | 1,512 |
| **Total tokens processed** | **33,327,823** |
| Non-cache token total (input + output + reasoning) | 807,911 |
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
- ✅ Display preferences persist across reload; Reset restores lacquer/medium/checkered
- ✅ JSON save download and file restore
- ✅ Auto-save / reload restoration, including language and assist preferences
- ✅ Invalid save rejection
- ✅ Desktop, tablet, and mobile layout screenshots
- ✅ No horizontal viewport overflow at 430px with extra-large text
- ✅ Modal Escape close and focus handling
- ✅ No duplicate DOM IDs; no missing translation keys
- ✅ Live GitHub Pages deployment loads and renders the complete 3D board

## Revision log

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

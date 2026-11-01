# Project State — Makruk 3D

**Makruk 3D — Thai Chess Academy & Beginner Studio**  
**หมากรุกไทย 3 มิติ · สถาบันหมากรุกไทยและสตูดิโอผู้เริ่มต้น**

> Completion snapshot for the full build, verification, and GitHub publication.

## Status

| Field | Value |
| --- | --- |
| Project status | ✅ Complete and published |
| Repository | <https://github.com/somphol/makruk-3d> |
| Live page | <https://somphol.github.io/makruk-3d/> (GitHub Pages deployment enabled) |
| Primary branch | `main` |
| Feature commit | `e134a27` — Build Makruk 3D Thai chess academy |
| Build type | Static site; no package manager, no build step |
| Source files | `index.html`, `style.css`, `script.js` |
| Source lines | 5,969 |
| Source size | 179,176 bytes |
| Project size | 640 KB including README screenshots |

## Build timeline

| Milestone | UTC timestamp |
| --- | --- |
| OpenCode session started | `2026-11-01T18:42:08Z` |
| Project completion snapshot | `2026-11-01T19:07:33Z` |
| **Elapsed build time** | **25 minutes 25 seconds** |

The elapsed time covers requirements research, design, procedural 3D modeling, rules engine, AI, bilingual copy, audio synthesis, persistence, browser testing, README/screenshot generation, GitHub publication, and live-deployment verification.

## Token consumption

Captured from the OpenCode session database at the completion snapshot. This is the authoritative session usage recorded for this build.

| Token category | Count |
| --- | ---: |
| Input tokens | 349,623 |
| Output tokens | 82,026 |
| Reasoning tokens | 77,150 |
| Cache read tokens | 9,556,608 |
| Cache write tokens | 1,512 |
| **Total tokens processed** | **10,066,919** |
| Non-cache token total (input + output + reasoning) | 508,799 |
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
- ✅ EN ⇄ TH switching updates all 41 translated UI bindings plus dynamic copy
- ✅ Illustrated glossary: 7 piece cards and 6 rule cards
- ✅ Beginner Move Assist toggle and tutor statistics
- ✅ JSON save download and file restore
- ✅ Auto-save / reload restoration, including language and assist preferences
- ✅ Invalid save rejection
- ✅ Desktop, tablet, and mobile layout screenshots
- ✅ Modal Escape close and focus handling
- ✅ No duplicate DOM IDs; no missing translation keys
- ✅ Live GitHub Pages deployment loads and renders the complete 3D board

## GitHub authentication note

The existing macOS Keychain credential for GitHub was read **once** and reused for repository creation and push operations. No repeated Keychain prompts were triggered.

## Credits

- **Built with:** [OpenCode](https://opencode.ai)
- **Model:** **DeepSeek V4.1 Flash**
- **Provider / model ID:** `opencode-go` / `deepseek-v4.1-flash`
- **3D engine:** [Three.js](https://threejs.org) r160 + OrbitControls
- **Typography:** Cormorant Garamond, Manrope, Noto Sans Thai, Noto Serif Thai
- **Cultural source:** Thai Makruk tradition — Khun, Met, Khon, Ma, Ruea, Bia, and Bia Ngua
- **Author account:** [somphol](https://github.com/somphol)

The same credit is visible in the application footer, the glossary heritage strip, the README, and the save-file metadata.

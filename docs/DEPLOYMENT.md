# Deployment

The app is a static GitHub Pages site. There is no build step, no package manager and no server-side code.

## Repository

- Repository: <https://github.com/somphol/makruk-3d>
- Production branch: `main`
- Pages source: repository root, `/`
- Live URL: <https://somphol.github.io/makruk-3d/>

## Publish a release

```bash
cd ~/Projects/makruk-3d
node --check script.js
node scripts/check.mjs
git push origin main
```

GitHub Pages rebuilds automatically. Confirm the live page returns 200 and that the console has no module or WebGL errors.

## Local preview

```bash
cd ~/Projects/makruk-3d
python3 -m http.server 8080
# http://localhost:8080
```

Serve over HTTP. `script.js` is an ES module, so `file://` is not supported.

## Runtime dependencies

- `three@0.160.0` and `three/addons/` from jsDelivr, pinned in `index.html`'s import map.
- Google Fonts (Cormorant Garamond, Manrope, Noto Sans Thai, Noto Serif Thai).
- Bundled Thai pronunciation WAVs are local.

There is no service worker and no analytics. If the CDN is blocked, the app cannot start; the fallback panel reports the failure.

## Rollback

Pages serves the current `main`. To roll back, revert the offending commit on `main` and push; do not force-push. The previous release remains in Git history.

## Caveats

- Keep the repository public (MIT) and Pages on `main` / `/`.
- Do not commit credentials, `.env` files or downloaded save files.
- If the repository is renamed, update absolute URLs in `index.html` (OG/meta), `README.md`, `AGENTS.md`, this file, and `docs/REPRODUCTION.md`.

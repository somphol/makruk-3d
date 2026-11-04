#!/usr/bin/env node
// Dependency-free release check for Makruk 3D.
//
//   node scripts/check.mjs
//
// Verifies required files, local HTML references, relative Markdown links,
// JavaScript syntax, JSON blocks, i18n parity, feature wiring and the release
// identity. Exit codes: 0 all checks passed, 1 failures.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let checks = 0;
const failures = [];

function ok(condition, label, detail = "") {
  checks += 1;
  if (!condition) failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  return condition;
}

const VERSION = "1.8.2";

const required = [
  "index.html",
  "style.css",
  "script.js",
  "README.md",
  "AGENTS.md",
  "LICENSE",
  "STATE.md",
  "docs/ARCHITECTURE.md",
  "docs/REPRODUCTION.md",
  "docs/hero.webp",
  "docs/mobile.webp",
  "docs/piece-preview.webp",
  "scripts/check.mjs",
  "audio/th/khun.wav",
  "audio/th/met.wav",
  "audio/th/khon.wav",
  "audio/th/ma.wav",
  "audio/th/ruea.wav",
  "audio/th/bia.wav",
  "audio/th/bia-ngua.wav",
];

for (const file of required) {
  ok(existsSync(join(root, file)), "missing required file", file);
}

const isExternal = (target) =>
  /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target) || target.trim() === "";

function localTarget(fromFile, raw) {
  let target = raw.trim().replace(/^<|>$/g, "");
  if (isExternal(target)) return null;
  target = target.split(/\s+/)[0].split("#")[0].split("?")[0];
  if (!target) return null;
  try {
    target = decodeURIComponent(target);
  } catch {
    // Keep the literal path when it is not URL-encoded.
  }
  const base = target.startsWith("/") ? root : dirname(join(root, fromFile));
  const absolute = resolve(base, target.replace(/^\//, ""));
  const relativePath = relative(root, absolute);
  if (relativePath.startsWith("..") || relativePath.split(sep).includes(".git")) return null;
  return absolute;
}

// 1. Local src/href references in index.html.
const html = readFileSync(join(root, "index.html"), "utf8");
for (const match of html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)) {
  const target = match[1];
  const absolute = localTarget("index.html", target);
  if (!absolute) continue;
  ok(existsSync(absolute), "index.html reference does not resolve", target);
  if (target.endsWith(".js")) {
    ok(!/https?:/i.test(target), "app script must be local", target);
  }
}

// 2. Relative Markdown links and images.
function markdownFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...markdownFiles(full));
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

for (const file of markdownFiles(root)) {
  const rel = relative(root, file);
  const body = readFileSync(file, "utf8");
  for (const match of body.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1];
    const absolute = localTarget(rel, target);
    if (!absolute) continue;
    ok(existsSync(absolute), "Markdown link does not resolve", `${rel} → ${target}`);
  }
}

// 3. JavaScript syntax for every .js file.
const jsFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".js")) jsFiles.push(full);
  }
})(root);

for (const file of jsFiles) {
  const rel = relative(root, file);
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    ok(true, "JavaScript syntax", rel);
  } catch (error) {
    ok(false, "JavaScript syntax", `${rel}: ${String(error.stderr || error.message).trim()}`);
  }
}

// 4. JSON files and the inline import map.
const jsonFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".json")) jsonFiles.push(full);
  }
})(root);
for (const file of jsonFiles) {
  try {
    JSON.parse(readFileSync(file, "utf8"));
    ok(true, "JSON parses", relative(root, file));
  } catch (error) {
    ok(false, "JSON does not parse", `${relative(root, file)}: ${error.message}`);
  }
}

const importMap = html.match(/<script\s+type=["']importmap["']>([\s\S]*?)<\/script>/);
if (ok(Boolean(importMap), "index.html has an import map")) {
  try {
    const parsed = JSON.parse(importMap[1]);
    ok(Boolean(parsed.imports?.three), "import map exposes three");
    ok(
      String(parsed.imports.three).includes("three@0.160.0"),
      "Three.js CDN version is pinned to 0.160.0",
      String(parsed.imports.three),
    );
  } catch (error) {
    ok(false, "import map parses", error.message);
  }
}

// 5. Bilingual symmetry and static/dynamic key coverage.
const script = readFileSync(join(root, "script.js"), "utf8");
const i18nStart = script.indexOf("const I18N = {");

function objectBody(source, start, key) {
  // Anchor to the two-space dictionary line. A plain indexOf("th: {") can
  // match a copy string such as "Bot strength: {level}".
  const match = new RegExp(`^ {2}${key}: \\{`, "m").exec(source.slice(start));
  if (!match) return null;
  const open = start + match.index + match[0].length - 1;
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  return null;
}

if (ok(i18nStart >= 0, "script.js defines I18N")) {
  const en = objectBody(script, i18nStart, "en");
  const th = objectBody(script, i18nStart, "th");
  if (ok(Boolean(en && th), "I18N has en and th blocks")) {
    const keysOf = (body) => [...body.matchAll(/^\s{4}([A-Za-z0-9_]+):/gm)].map((m) => m[1]);
    const enKeys = keysOf(en);
    const thKeys = keysOf(th);
    const missingTh = enKeys.filter((key) => !thKeys.includes(key));
    const missingEn = thKeys.filter((key) => !enKeys.includes(key));
    ok(missingTh.length === 0, "Thai is missing keys", missingTh.join(", "));
    ok(missingEn.length === 0, "English is missing keys", missingEn.join(", "));

    const known = new Set(enKeys);
    const attrs = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);
    const missingAttrs = [...new Set(attrs)].filter((key) => !known.has(key));
    ok(missingAttrs.length === 0, "data-i18n key is not in I18N.en", missingAttrs.join(", "));

    const calls = [...script.matchAll(/\bt\(\s*"([^"]+)"/g)].map((m) => m[1]);
    const missingCalls = [...new Set(calls)].filter((key) => !known.has(key));
    ok(missingCalls.length === 0, "t() key is not in I18N.en", missingCalls.join(", "));
  }
}

// 6. Feature wiring: two piece families, two finishes, four bot levels,
//    the adjustable clock and the contrast defaults.
const featured = [
  ["PIECE_SETS", 'court: {'],
  ["PIECE_SETS", 'tournament: {'],
  ["PIECE_FINISHES", 'ruby: {'],
  ["PIECE_FINISHES", 'ebony: {'],
  ["AI_LEVELS", 'easy: {'],
  ["AI_LEVELS", 'medium: {'],
  ["AI_LEVELS", 'hard: {'],
  ["AI_LEVELS", 'super: {'],
  ["AI", "function quiesce("],
  ["AI", "function materialBalance("],
  ["AI", "rootRepetitionPenalty("],
  ["AI", "rootProgressScore("],
  ["AI", "function sideLabel("],
  ["AI", "async function chooseAIMove("],
  ["AI", "function yieldToBrowser("],
  ["AI", "function replayLastMove("],
  ["AI", 'boardMaterial: "jade"'],
  ["AI", 'pieceFinish: "ruby"'],
  ["AI", 'botLevel: "hard"'],
  ["AI", "thinkTimeMs: 5000"],
];
const sections = {
  PIECE_SETS: script.slice(script.indexOf("const PIECE_SETS"), script.indexOf("const PIECE_FINISHES")),
  PIECE_FINISHES: script.slice(script.indexOf("const PIECE_FINISHES"), script.indexOf("const STAGE_COLORS")),
  AI_LEVELS: script.slice(script.indexOf("const AI_LEVELS"), script.indexOf("function activeAILevel")),
  AI: script,
};
for (const [section, needle] of featured) {
  ok(sections[section].includes(needle), `missing feature wiring (${section})`, needle);
}
for (const id of ["pieceSetControl", "pieceFinishControl", "botLevelControl", "thinkTimeInput", "aiChipLevel", "displayButtonStage", "capturedByBlackLabel", "replayLastMove"]) {
  ok(html.includes(`id="${id}"`), "index.html is missing control", id);
  ok(script.includes(`#${id}`), "script.js does not cache control", id);
}
ok(html.includes("thinking-glass"), "index.html is missing the hourglass indicator");
ok(script.includes('t("turnToMove"'), "turn text is not side-aware");
ok(script.includes('t("capturedBy"'), "capture labels are not side-aware");

// 7. Release identity and documentation.
const readme = readFileSync(join(root, "README.md"), "utf8");
ok(
  script.includes(`version: "${VERSION}"`),
  `window.Makruk3D version is ${VERSION}`,
);
ok(
  readFileSync(join(root, "STATE.md"), "utf8").includes(`\`${VERSION}\``),
  `STATE.md records the ${VERSION} release`,
);
ok(readme.includes("## Documentation"), "README has a Documentation section");
for (const link of ["AGENTS.md", "docs/REPRODUCTION.md", "docs/ARCHITECTURE.md"]) {
  ok(readme.includes(`](${link})`), "README Documentation link is missing", link);
}

// 8. Audio manifest: every pronunciation file is declared exactly once.
for (const name of ["khun", "met", "khon", "ma", "ruea", "bia", "bia-ngua"]) {
  ok(script.includes(`"audio/th/${name}.wav"`), "pronunciation file is not wired", name);
}

if (failures.length) {
  console.error(`FAIL ${failures.length} of ${checks} checks`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`OK ${checks} checks`);

// Build: bundle + minify JSX into production files.
// Usage:  node build.mjs   (or npm run build)
// Dev mode (without running this): keep using Babel-in-browser via index.html's
//   type="text/babel" tags. index.html itself switches based on ?dev=1 query.
//
// dist/app.js contains the shell and home pages.
// dist/servitors.js contains the heavy course content and reader, lazy-loaded
// only when a visitor opens the course route.

import { build } from "esbuild";
import { createHash } from "node:crypto";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  statSync,
  rmSync,
  cpSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPrints } from "./tools/prints-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "site");
const DIST = resolve(HERE, "dist");
const PUBLIC = resolve(HERE, "public");
mkdirSync(DIST, { recursive: true });

const APP_FILES = [
  "_effects.jsx",
  "_atoms.jsx",
  "_home-top.jsx",
  "_home-mid.jsx",
  "_community.jsx",
  "_who.jsx",
  "_guides.jsx",
  "_prints.jsx",
  "_app.jsx",
];

const SERVITORS_FILES = [
  "_servitors-catalog.jsx",
  "_servitors-reader.jsx",
  "_servitors.jsx",
];

async function buildBundle({ files, tmpName, outfile, label, prelude }) {
  const parts = files.map((f) => {
    const path = resolve(SITE, f);
    const src = readFileSync(path, "utf-8");
    return `// ====== ${f} ======\n${src}`;
  });
  if (prelude) parts.unshift(prelude);

  const tmpIn = resolve(DIST, tmpName);
  writeFileSync(tmpIn, parts.join("\n\n"));

  const result = await build({
    entryPoints: [tmpIn],
    outfile: resolve(DIST, outfile),
    bundle: false,  // no module resolution — source uses globals
    minify: true,
    target: ["es2019"],
    loader: { ".jsx": "jsx" },
    jsx: "transform",           // classic JSX → React.createElement (no import needed, React is global)
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    format: "iife",
    banner: { js: `/* levorules.com — ${label} */` },
    logLevel: "info",
  });

  rmSync(tmpIn, { force: true });

  const bytes = statSync(resolve(DIST, outfile)).size;
  console.log(`\nWrote dist/${outfile}  (${(bytes / 1024).toFixed(1)} KB minified)`);
  if (result.warnings.length) console.warn(result.warnings);
}

// PRINTS data is validated here and shipped inside the app bundle, so the
// prerendered HTML and the client render read the same object.
const PRINTS = loadPrints(HERE);

await buildBundle({
  files: APP_FILES,
  tmpName: "_source-app.jsx",
  outfile: "app.js",
  label: "app bundle",
  prelude: `window.LR_PRINTS = ${JSON.stringify(PRINTS).replaceAll("<", "\\u003c")};`,
});

await buildBundle({
  files: SERVITORS_FILES,
  tmpName: "_source-servitors.jsx",
  outfile: "servitors.js",
  label: "servitors bundle",
});

const assetVersionHash = createHash("sha256");
for (let n = 0; n <= 10; n++) assetVersionHash.update(readFileSync(resolve(DIST, 'course', `${n}.json`)));
for (const file of [
  resolve(HERE, "index.html"),
  resolve(HERE, "passport-servitora", "index.html"),
  resolve(HERE, "analytics.js"),
  resolve(HERE, "brand", "colors_and_type.css"),
  resolve(HERE, "brand", "effects.css"),
  resolve(HERE, "brand", "prints.css"),
  resolve(DIST, "app.js"),
  resolve(DIST, "servitors.js"),
]) {
  assetVersionHash.update(readFileSync(file));
}
const assetVersion = assetVersionHash.digest("hex").slice(0, 12);

// Cloudflare must receive only runtime assets. Publishing the repository root
// would expose .git, node_modules, source JSX, build tools and design drafts.
rmSync(PUBLIC, { recursive: true, force: true });
mkdirSync(PUBLIC, { recursive: true });

for (const file of [
  "analytics.js",
  "_headers",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml",
]) {
  cpSync(resolve(HERE, file), resolve(PUBLIC, file));
}

const publicIndex = readFileSync(resolve(HERE, "index.html"), "utf-8")
  .replaceAll("__LR_ASSET_VERSION_VALUE__", assetVersion);
writeFileSync(resolve(PUBLIC, "index.html"), publicIndex);

mkdirSync(resolve(PUBLIC, 'vendor'), {recursive: true});
cpSync(resolve(HERE, 'node_modules/react/umd/react.production.min.js'), resolve(PUBLIC, 'vendor/react-18.3.1.min.js'));
cpSync(resolve(HERE, 'node_modules/react-dom/umd/react-dom.production.min.js'), resolve(PUBLIC, 'vendor/react-dom-18.3.1.min.js'));

for (const directory of ["brand", "dist", "media", "passport-servitora", "tiktok", "instagram"]) {
  cpSync(resolve(HERE, directory), resolve(PUBLIC, directory), {
    recursive: true,
  });
}

const publicPassportIndex = readFileSync(
  resolve(HERE, "passport-servitora", "index.html"),
  "utf-8",
).replaceAll("__LR_ASSET_VERSION_VALUE__", assetVersion);
writeFileSync(
  resolve(PUBLIC, "passport-servitora", "index.html"),
  publicPassportIndex,
);

// The feed files are refreshed by a bot. The stop list (same rules as
// tools/feed_stoplist.py) keeps unwanted topics off the home page even if a
// feed was written before the list changed.
const STOP = JSON.parse(readFileSync(resolve(HERE, "content", "feed-stoplist.json"), "utf-8"));
const STOP_WORDS = new RegExp(
  `(?<![\\p{L}\\p{N}_])(${STOP.words.map((w) => w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})[\\p{L}\\p{N}_]{0,3}(?![\\p{L}\\p{N}_])`,
  "u",
);
const STOP_ALLOW = new Set((STOP.allow_ids || []).map(String));
const feedBlocked = (...texts) => texts.some((text) => {
  const low = (text || "").toLowerCase();
  return STOP.substrings.some((s) => low.includes(s.toLowerCase())) || STOP_WORDS.test(low);
});

mkdirSync(resolve(PUBLIC, "site"), { recursive: true });
for (const file of ["shorts.json", "telegram.json"]) {
  const feed = JSON.parse(readFileSync(resolve(SITE, file), "utf-8"));
  const items = feed.items.filter((item) => STOP_ALLOW.has(String(item.id)) || !feedBlocked(item.title, item.body));
  if (items.length !== feed.items.length) {
    console.log(`site/${file}: ${feed.items.length - items.length} item(s) hidden by the stop list`);
  }
  writeFileSync(resolve(PUBLIC, "site", file), JSON.stringify({ ...feed, items }, null, 2));
}

mkdirSync(resolve(PUBLIC, "uploads", "appendices"), { recursive: true });
for (const file of ["og-image.png", "servitors.pdf"]) {
  cpSync(resolve(HERE, "uploads", file), resolve(PUBLIC, "uploads", file));
}
cpSync(
  resolve(HERE, "uploads", "appendices"),
  resolve(PUBLIC, "uploads", "appendices"),
  { recursive: true },
);

console.log("\nWrote public/ production artifact (runtime files only)");

// Each public route contains readable HTML and its own metadata before JS runs.
const { prerender } = await import('./tools/prerender.mjs');
await prerender({root: HERE, publicDir: PUBLIC});

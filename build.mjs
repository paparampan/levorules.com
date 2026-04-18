// Build: bundle + minify all JSX files into dist/app.js for production.
// Usage:  node build.mjs   (or npm run build)
// Dev mode (without running this): keep using Babel-in-browser via Home.html's
//   type="text/babel" tags. Home.html itself switches based on ?dev=1 query.
//
// The source list mirrors the <script type="text/babel"> order in Home.html so
// definitions appear in the same order. We concatenate via esbuild's stdin API
// so JSX from separate files compiles as one script (matches dev behaviour where
// each file's globals land on window).

import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "site");
const DIST = resolve(HERE, "dist");
mkdirSync(DIST, { recursive: true });

const FILES = [
  "_atoms.jsx",
  "_home-top.jsx",
  "_home-mid.jsx",
  "_servitors-content-1.jsx",
  "_servitors-content-2.jsx",
  "_servitors-content-loader.jsx",
  "_servitors-reader.jsx",
  "_servitors.jsx",
  "_who.jsx",
  "_app.jsx",
];

// Concatenate with file markers (source maps on concat aren't great, but good enough here).
const parts = FILES.map((f) => {
  const path = resolve(SITE, f);
  const src = readFileSync(path, "utf-8");
  return `// ====== ${f} ======\n${src}`;
});
const combined = parts.join("\n\n");

// Write a tmp source that esbuild consumes as one unit.
const tmpIn = resolve(DIST, "_source.jsx");
writeFileSync(tmpIn, combined);

const result = await build({
  entryPoints: [tmpIn],
  outfile: resolve(DIST, "app.js"),
  bundle: false,  // no module resolution — source uses globals
  minify: true,
  target: ["es2019"],
  loader: { ".jsx": "jsx" },
  jsx: "transform",           // classic JSX → React.createElement (no import needed, React is global)
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  format: "iife",
  banner: { js: "/* levorules.com — bundled " + new Date().toISOString() + " */" },
  logLevel: "info",
});

const bytes = statSync(resolve(DIST, "app.js")).size;
console.log(`\nWrote dist/app.js  (${(bytes / 1024).toFixed(1)} KB minified)`);
if (result.warnings.length) console.warn(result.warnings);

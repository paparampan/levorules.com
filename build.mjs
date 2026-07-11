// Build: bundle + minify JSX into production files.
// Usage:  node build.mjs   (or npm run build)
// Dev mode (without running this): keep using Babel-in-browser via index.html's
//   type="text/babel" tags. index.html itself switches based on ?dev=1 query.
//
// dist/app.js contains the shell and home pages.
// dist/servitors.js contains the heavy course content and reader, lazy-loaded
// only when a visitor opens the course route.

import { build } from "esbuild";
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

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "site");
const DIST = resolve(HERE, "dist");
const PUBLIC = resolve(HERE, "public");
mkdirSync(DIST, { recursive: true });

const APP_FILES = [
  "_atoms.jsx",
  "_home-top.jsx",
  "_home-mid.jsx",
  "_who.jsx",
  "_guides.jsx",
  "_app.jsx",
];

const SERVITORS_FILES = [
  "_servitors-content-1.jsx",
  "_servitors-content-2.jsx",
  "_servitors-content-loader.jsx",
  "_servitors-reader.jsx",
  "_servitors.jsx",
];

async function buildBundle({ files, tmpName, outfile, label }) {
  const parts = files.map((f) => {
    const path = resolve(SITE, f);
    const src = readFileSync(path, "utf-8");
    return `// ====== ${f} ======\n${src}`;
  });

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

await buildBundle({
  files: APP_FILES,
  tmpName: "_source-app.jsx",
  outfile: "app.js",
  label: "app bundle",
});

await buildBundle({
  files: SERVITORS_FILES,
  tmpName: "_source-servitors.jsx",
  outfile: "servitors.js",
  label: "servitors bundle",
});

// Cloudflare must receive only runtime assets. Publishing the repository root
// would expose .git, node_modules, source JSX, build tools and design drafts.
rmSync(PUBLIC, { recursive: true, force: true });
mkdirSync(PUBLIC, { recursive: true });

for (const file of [
  "index.html",
  "_headers",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml",
]) {
  cpSync(resolve(HERE, file), resolve(PUBLIC, file));
}

for (const directory of ["brand", "dist"]) {
  cpSync(resolve(HERE, directory), resolve(PUBLIC, directory), {
    recursive: true,
  });
}

mkdirSync(resolve(PUBLIC, "site"), { recursive: true });
for (const file of ["shorts.json", "telegram.json"]) {
  cpSync(resolve(SITE, file), resolve(PUBLIC, "site", file));
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

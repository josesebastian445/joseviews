/**
 * Copies the Sveltia CMS bundle out of node_modules into public/admin/ so the
 * editor is served from our own origin.
 *
 * Why not just load it from unpkg, as the docs suggest:
 *   - Publishing is the whole point of this site. If a third-party CDN is down
 *     or blocked, you cannot publish. Self-hosting removes that dependency.
 *   - The version is then pinned by package-lock.json rather than resolved at
 *     runtime, so a CDN "latest" can never break the editor unannounced.
 *   - It keeps the Content-Security-Policy tight: no external script origin
 *     needs allowing at all.
 *
 * Runs as part of `npm run build`. The copied file is gitignored — it is a
 * build artefact, reproducible from the lockfile.
 */

import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * The package defines an `exports` map that does not expose './package.json',
 * so resolve the entry point instead and walk to its sibling. Falls back to the
 * conventional node_modules layout if that ever stops working.
 */
function findBundle() {
  try {
    const entry = require.resolve('@sveltia/cms');
    return resolve(dirname(entry), 'sveltia-cms.js');
  } catch {
    return resolve(root, 'node_modules/@sveltia/cms/dist/sveltia-cms.js');
  }
}

const SOURCE = findBundle();
const DEST = resolve(root, 'public/admin/sveltia-cms.js');

try {
  await stat(SOURCE);
} catch {
  console.error(
    `\n[copy-cms] Could not find the CMS bundle at:\n  ${SOURCE}\n\n` +
      'Run `npm install` first. The editor at /admin will not load without it.\n'
  );
  process.exit(1);
}

await mkdir(dirname(DEST), { recursive: true });
await copyFile(SOURCE, DEST);

const { size } = await stat(DEST);
let version = 'unknown version';
try {
  const pkg = JSON.parse(
    await readFile(resolve(root, 'node_modules/@sveltia/cms/package.json'), 'utf8')
  );
  version = pkg.version;
} catch {
  /* version is cosmetic; the copy is what matters */
}

console.log(
  `[copy-cms] Sveltia CMS ${version} → public/admin/sveltia-cms.js (${Math.round(size / 1024)} KB)`
);

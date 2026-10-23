// Sync of runtime-fetched asset trees (maps/, models/) into dist/.
//
// The game fetches /maps/* and /models/* via relative URLs at runtime, so a
// self-contained dist/ must contain them. This syncs per file: only new,
// resized, or newer-than-dest files are copied; everything else is a
// stat-only skip. Stale dest files (deleted/renamed/excluded in src) are
// pruned. Note: `vite build` syncs only maps/ by default (models/ is gated
// behind GRIM_SYNC_MODELS=1); run `npm run sync-assets` for a full
// self-contained dist. The skip path makes repeat syncs incremental.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HIDDEN_SEGMENT = /(^|\/)\./;

// Junk no runtime fetch needs: editor droppings and hidden files.
export function excludeCommon(relPath, baseName) {
  return baseName === '.DS_Store' || HIDDEN_SEGMENT.test(relPath);
}

// models/ carries conversion leftovers next to the .glb files:
//  - *.tga (~200 MB): no code path loads TGAs from models/ (cursors come from
//    assets/cursor_icons, decals from maps/*/decals); GLBs embed textures.
//  - *.zip: unreferenced archives.
// Keep this an exclude-list (not a .glb allow-list) so future sidecars
// (.json/.bin) sync without a code change.
export function excludeModels(relPath, baseName) {
  if (excludeCommon(relPath, baseName)) return true;
  const lower = baseName.toLowerCase();
  return lower.endsWith('.tga') || lower.endsWith('.zip');
}

// maps/ decals legitimately load .tga/.dds, so only common junk is excluded.
export function excludeMaps(relPath, baseName) {
  return excludeCommon(relPath, baseName);
}

function isNewer(srcMs, destMs) {
  // Copy when src is strictly newer (1s epsilon for coarse filesystems).
  // Equal size + not newer => identical for build purposes.
  return srcMs > destMs + 1000;
}

function* walkFiles(dir, base = '') {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(full, rel);
    } else if (entry.isFile()) {
      yield { rel, full };
    }
    // Symlinks, sockets, etc. are skipped deliberately.
  }
}

// Sync one tree. Returns { copied, skipped, pruned, excluded, bytes }.
export function syncDir(srcRoot, destRoot, exclude = excludeCommon) {
  const stats = { copied: 0, skipped: 0, pruned: 0, excluded: 0, bytes: 0 };
  const srcStat = (() => {
    try {
      return fs.statSync(srcRoot);
    } catch {
      return null;
    }
  })();
  if (!srcStat || !srcStat.isDirectory()) {
    // Refuse to prune dest when src is missing (misconfig must not wipe dist).
    console.warn(`[sync-runtime-assets] src missing, skipping: ${srcRoot}`);
    return stats;
  }
  const seen = new Set();
  for (const { rel, full } of walkFiles(srcRoot)) {
    const baseName = path.posix.basename(rel);
    if (exclude(rel, baseName)) {
      stats.excluded += 1;
      continue;
    }
    seen.add(rel);
    const dest = path.join(destRoot, rel);
    const src = fs.statSync(full);
    let destStat = null;
    try {
      destStat = fs.statSync(dest);
    } catch {
      destStat = null;
    }
    const needsCopy =
      !destStat || src.size !== destStat.size || isNewer(src.mtimeMs, destStat.mtimeMs);
    if (!needsCopy) {
      stats.skipped += 1;
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(full, dest);
    stats.copied += 1;
    stats.bytes += src.size;
  }
  // Prune dest files with no live (non-excluded) src counterpart.
  for (const { rel, full } of walkFiles(destRoot)) {
    if (seen.has(rel)) continue;
    try {
      fs.unlinkSync(full);
      stats.pruned += 1;
    } catch {
      // Best effort: a locked file must not fail the build.
    }
  }
  // Best-effort removal of newly emptied dirs (deepest first).
  const dirs = [];
  const collect = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) collect(path.join(dir, entry.name));
    }
    dirs.push(dir);
  };
  collect(destRoot);
  for (const dir of dirs) {
    if (dir === destRoot) continue;
    try {
      fs.rmdirSync(dir);
    } catch {
      // Non-empty or locked: leave it.
    }
  }
  return stats;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// roots: [{ src, dest, exclude, label }]. Paths resolve from cwd.
export function syncRuntimeAssets(roots) {
  for (const root of roots) {
    const stats = syncDir(root.src, root.dest, root.exclude);
    const label = root.label || root.src;
    console.log(
      `[sync-runtime-assets] ${label}: ${stats.copied} copied` +
        ` (${formatBytes(stats.bytes)}), ${stats.skipped} up-to-date` +
        `, ${stats.excluded} excluded, ${stats.pruned} pruned`,
    );
  }
}

// Manual full sync (`npm run sync-assets`): both trees, incremental against
// an existing dist. The vite build only syncs maps by default.
const _invokedAs = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (_invokedAs === fileURLToPath(import.meta.url)) {
  syncRuntimeAssets([
    { src: 'maps', dest: 'dist/maps', exclude: excludeMaps, label: 'maps' },
    { src: 'models', dest: 'dist/models', exclude: excludeModels, label: 'models' },
  ]);
}

// Analytic before/after for the static merge (src/merge-static.js).
//
// Walks every HQ/structure model of the loaded faction set, parses the GLB
// JSON directly (no renderer) and applies the same rules as the runtime
// merge: hiddenNodes subtrees excluded, animated-node subtrees excluded,
// skinned/multi-material prims skipped, the rest grouped by material.
// Prints a Markdown table + totals for benchmark.md.
// Run: node scripts/merge-benchmark.mjs
import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

register('../tests/node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null, querySelector: () => null };
globalThis.window = globalThis;

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const { FACTIONS, ARENA_POSITION_FACTIONS, getStructureConfig } = await import('../src/factions.js');

const matchHidden = (child, wanted) => {
  child = String(child || '').toLowerCase();
  wanted = String(wanted || '').toLowerCase();
  return !!wanted && (child === wanted || child.startsWith(`${wanted}_inst_`));
};

function analyze(modelPath, hiddenNames) {
  const buf = readFileSync(join(rootDir, modelPath));
  const json = JSON.parse(buf.subarray(20, 20 + buf.readUInt32LE(12)).toString('utf8'));
  const nodes = json.nodes || [];
  const meshes = json.meshes || [];
  const childrenOf = nodes.map((n) => n.children || []);
  const hidden = new Set();
  const animated = new Set();
  const mark = (set, i) => {
    if (set.has(i)) return;
    set.add(i);
    for (const k of childrenOf[i]) mark(set, k);
  };
  nodes.forEach((n, i) => {
    if ((hiddenNames || []).some((h) => matchHidden(n.name, h))) mark(hidden, i);
  });
  for (const a of json.animations || []) {
    for (const ch of a.channels || []) mark(animated, ch.target.node);
  }
  let before = 0;
  let hiddenPrims = 0;
  let animatedPrims = 0;
  let skippedPrims = 0;
  const byMaterial = new Map(); // matIndex -> prim count (mergeable)
  nodes.forEach((n, i) => {
    if (n.mesh === undefined) return;
    const prims = meshes[n.mesh].primitives;
    const np = prims.length;
    if (hidden.has(i)) {
      hiddenPrims += np;
      return;
    }
    before += np;
    if (animated.has(i)) {
      animatedPrims += np;
      return;
    }
    const skinned = prims.some((p) => p.attributes && p.attributes.SKIN_JOINT !== undefined);
    if (skinned) {
      skippedPrims += np;
      return;
    }
    // Multi-material meshes split per primitive into material pools,
    // mirroring the runtime group split.
    for (const p of prims) {
      byMaterial.set(p.material, (byMaterial.get(p.material) || 0) + 1);
    }
  });
  // One merged mesh per material with mergeable prims (single-prim groups
  // stay as-is: still one call either way).
  const after = byMaterial.size + animatedPrims + skippedPrims;
  return { before, after, hiddenPrims, animatedPrims, skippedPrims, materials: (json.materials || []).length };
}

const rows = [];
for (const key of ARENA_POSITION_FACTIONS) {
  const config = FACTIONS[key];
  if (!config) continue;
  const jobs = [{ label: `${config.name} HQ`, model: config.hq, hidden: getStructureConfig(key, 'hq')?.hiddenNodes }];
  for (const s of config.structures || []) {
    jobs.push({ label: `${config.name} / ${s.type}`, model: s.model, hidden: s.hiddenNodes });
  }
  for (const job of jobs) {
    if (!job.model) continue;
    try {
      rows.push({ ...job, ...analyze(job.model, job.hidden) });
    } catch (error) {
      rows.push({ ...job, error: String((error && error.message) || error) });
    }
  }
}

let tBefore = 0;
let tAfter = 0;
console.log('| model | prims before | calls after | saved |');
console.log('|---|---|---|---|');
for (const r of rows.sort((a, b) => (b.before - b.after) - (a.before - a.after))) {
  if (r.error) {
    console.log(`| ${r.label} | ERR ${r.error} | | |`);
    continue;
  }
  tBefore += r.before;
  tAfter += r.after;
  const pct = r.before ? Math.round((100 * (r.before - r.after)) / r.before) : 0;
  console.log(`| ${r.label} | ${r.before} | ${r.after} | ${pct}% |`);
}
console.log(`| **total ${rows.length} models** | **${tBefore}** | **${tAfter}** | **${Math.round((100 * (tBefore - tAfter)) / tBefore)}%** |`);

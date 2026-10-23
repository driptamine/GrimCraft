// Analytic before/after for a FUTURE infantry merge (not implemented).
//
// Walks every infantry model (worker/soldier/units) of the loaded faction
// set and applies soldier-merge rules: config hiddenNodes cost nothing;
// runtime-switched meshes (weapons, planter banner) and meshes found by
// name at runtime (plasmagun for the glow) stay separate; everything else
// visible groups by material (skinned merge needs skin-attribute concat +
// rebind to the shared skeleton). Steady state = default hidden set
// (one weapon shown, banner stowed).
// Run: node scripts/infantry-merge-benchmark.mjs
import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

register('../tests/node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null, querySelector: () => null };
globalThis.window = globalThis;

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const { FACTIONS, ARENA_POSITION_FACTIONS } = await import('../src/factions.js');

// Must stay separate meshes: runtime weapon swaps (entities.js), planter
// banner show/hide (systems.js), plasmagun glow anchor (plasma-glow.js).
// Marker_* nodes are empties (verified), so they are unaffected either way.
const SWITCHED = [
  'guard_banner', 'guard_banner_rod',
  'guardsmen_lasgun', 'guardsmen_plasma_pistol',
  'guardsmen_grenade_launcher', 'guardsmen_flamer',
  'karskin_plasmagun',
];

const matchName = (child, wanted) => {
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
  const separate = new Set();
  const mark = (set, i) => {
    if (set.has(i)) return;
    set.add(i);
    for (const k of childrenOf[i]) mark(set, k);
  };
  nodes.forEach((n, i) => {
    if ((hiddenNames || []).some((h) => matchName(n.name, h))) mark(hidden, i);
    if (SWITCHED.some((s) => matchName(n.name, s))) mark(separate, i);
  });
  let before = 0;
  let separateVisible = 0;
  const byMaterial = new Map();
  nodes.forEach((n, i) => {
    if (n.mesh === undefined) return;
    const prims = meshes[n.mesh].primitives;
    if (hidden.has(i)) return;
    before += prims.length;
    if (separate.has(i)) {
      separateVisible += prims.length;
      return;
    }
    for (const p of prims) {
      byMaterial.set(p.material, (byMaterial.get(p.material) || 0) + 1);
    }
  });
  const after = byMaterial.size + separateVisible;
  return { before, after, materials: (json.materials || []).length, separateVisible };
}

const rows = [];
for (const key of ARENA_POSITION_FACTIONS) {
  const config = FACTIONS[key];
  if (!config) continue;
  const jobs = [];
  const worker = config.infantry?.[0];
  const soldier = config.infantry?.[1];
  if (worker?.model) jobs.push({ label: `${config.name} / ${worker.name}`, model: worker.model, hidden: worker.hiddenNodes });
  if (soldier?.model) jobs.push({ label: `${config.name} / ${soldier.name}`, model: soldier.model, hidden: soldier.hiddenNodes });
  for (const u of config.units || []) {
    if (u.model) jobs.push({ label: `${config.name} / ${u.name}`, model: u.model, hidden: u.hiddenNodes });
  }
  for (const job of jobs) {
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

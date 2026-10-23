import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createChunkReader } from '../src/sgb-reader.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sgbEntities() {
  const buf = fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus.sgb'));
  const r = createChunkReader(buf);
  r.skipChunky();
  r.readHeader('FOLDSCEN');
  const blueprints = [];
  const entities = [];
  while (r.position < buf.length) {
    const h = r.readHeader();
    if (!h) break;
    const p0 = r.position;
    if (h.typeid !== 'FOLDSMEG') { r.skip(h.size); continue; }
    const end = p0 + h.size;
    while (r.position < end) {
      const c = r.readHeader();
      const c0 = r.position;
      if (c.typeid === 'DATAEBPT') {
        const n = r.readU32();
        for (let i = 0; i < n; i++) blueprints.push(r.readString());
      } else if (c.typeid === 'FOLDENTL') {
        const eEnd = c0 + c.size;
        while (r.position < eEnd) {
          const e = r.readHeader();
          const e0 = r.position;
          if (e.typeid !== 'FOLDENTY') { r.skip(e.size); continue; }
          const entEnd = e0 + e.size;
          const ent = {};
          while (r.position < entEnd) {
            const s = r.readHeader();
            const s0 = r.position;
            if (s.typeid === 'DATAENTI') {
              ent.id = r.readU32();
              ent.bp = r.readU32();
              for (let i = 0; i < 9; i++) r.readFloat();
              ent.x = r.readFloat();
              ent.y = r.readFloat();
              ent.z = r.readFloat();
            } else r.skip(s.size);
            if (r.position < s0 + s.size) r.skip(s0 + s.size - r.position);
          }
          entities.push(ent);
          if (r.position < e0 + e.size) r.skip(e0 + e.size - r.position);
        }
      } else r.skip(c.size);
      if (r.position < c0 + c.size) r.skip(c0 + c.size - r.position);
    }
    if (r.position < p0 + h.size) r.skip(p0 + h.size - r.position);
  }
  return { blueprints, entities };
}

// hq_position.json must stay a faithful extract of the SGB starting
// positions (local->world via root yaw90+flipH: x=-lz, z=-lx). The mapping
// itself is pinned by the strategic points+relics, which land exactly on
// the layout.
describe('alvarus hq positions', () => {
  it('local->world mapping lands flags+relics exactly on the layout', () => {
    const { blueprints, entities } = sgbEntities();
    const layout = JSON.parse(fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus.json'), 'utf8'));
    const name = (bp) => (blueprints[bp] || '').split('\\').pop();
    const marks = entities.filter((e) => ['strategic_point_flag.rgd', 'relic_struct.rgd'].includes(name(e.bp)));
    assert.equal(marks.length, 22);
    for (const e of marks) {
      const d = Math.min(...layout.strategicPoints.map((p) => Math.hypot(p.x + e.z, p.z + e.x)));
      assert.ok(d < 0.01, `bp ${e.bp} id ${e.id} delta ${d}`);
    }
  });

  it('hq_position.json matches the 6 SGB starting positions', () => {
    const { blueprints, entities } = sgbEntities();
    const name = (bp) => (blueprints[bp] || '').split('\\').pop();
    const starts = entities.filter((e) => name(e.bp) === 'starting_position.rgd');
    assert.equal(starts.length, 6);
    const hq = JSON.parse(fs.readFileSync(path.join(root, 'maps/6p_alvarus/hq_position.json'), 'utf8'));
    assert.equal(hq.map, '6p_alvarus');
    assert.equal(hq.positions.length, 6);
    assert.deepEqual(hq.positions.map((p) => p.slot).sort(), [0, 1, 2, 3, 4, 5]);
    for (const p of hq.positions) {
      const s = starts.find((e) => e.id === p.sgbId);
      assert.ok(s, `sgb entity ${p.sgbId} exists`);
      assert.ok(Math.abs(p.x + s.z) < 0.01 && Math.abs(p.z + s.x) < 0.01, `slot ${p.slot} world matches sgb`);
      assert.ok(p.team && p.faction, `slot ${p.slot} carries team/faction`);
    }
  });

  it('layout HQ positions equal the extracted world coords, in bounds', () => {
    const hq = JSON.parse(fs.readFileSync(path.join(root, 'maps/6p_alvarus/hq_position.json'), 'utf8'));
    const layout = JSON.parse(fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus.json'), 'utf8'));
    assert.equal(layout.positions.length, hq.positions.length);
    for (const p of hq.positions) {
      const slot = layout.positions[p.slot];
      assert.equal(slot.x, p.x, `slot ${p.slot} x placed as extracted`);
      assert.equal(slot.z, p.z, `slot ${p.slot} z placed as extracted`);
      assert.equal(slot.team, p.team, `slot ${p.slot} team kept`);
      assert.equal(slot.faction, p.faction, `slot ${p.slot} faction kept`);
      assert.ok(Math.abs(slot.x) <= layout.bounds && Math.abs(slot.z) <= layout.bounds, `slot ${p.slot} in bounds`);
    }
  });
});

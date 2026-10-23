import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { ALVARUS_DECAL_STORE, decalBaseSize, decalFlatRotation, decalStoreDirs, drapeDecalLocalZ, isChaosDecal } from '../src/decal-size.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CHAOS = 'art/decals/z_all/chaos_taint_02';
const OTHERS = [
  'art/decals/jungle/jungle_rubble01',
  'art/decals/urban/urban_rubble03',
  'art/decals/z_all/crater_02',
  'art/decals/z_all/crater_dust_01',
  'art/decals/jungle/jungle_mud_02',
  'art/decals/jungle/stone_cliff_05',
  'art/decals/z_all/crater_charred_01',
];

describe('sgb decal sizes', () => {
  it('detects only the chaos taint ref', () => {
    assert.equal(isChaosDecal(CHAOS), true);
    for (const ref of OTHERS) {
      assert.equal(isChaosDecal(ref), false, ref);
    }
    assert.equal(isChaosDecal(''), false);
    assert.equal(isChaosDecal(null), false);
  });

  it('chaos keeps the legacy flat size for any stored size', () => {
    for (const size of [0.02, 0.0397, 0.05, 0.075, 0.11]) {
      assert.equal(decalBaseSize(CHAOS, size), 10, `size ${size}`);
    }
  });

  it('other decals map proportionally (0.05 -> 50u at scale 12)', () => {
    for (const ref of OTHERS) {
      assert.equal(decalBaseSize(ref, 0.05), 0.05 * 1000 / 12, ref);
      // distinct stored sizes -> distinct world sizes
      const a = decalBaseSize(ref, 0.03);
      const b = decalBaseSize(ref, 0.06);
      assert.ok(Math.abs(b - a) > 1e-9, `${ref} varies with size`);
      assert.ok(b > a, `${ref} grows with size`);
    }
  });

  it('real alvarus sizes spread the seven groups, chaos stays flat', () => {
    const layout = JSON.parse(
      fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus_layout_upd.json'), 'utf8'),
    );
    const byRef = new Map();
    for (const d of layout.decals) {
      if (!byRef.has(d.ref)) byRef.set(d.ref, new Set());
      byRef.get(d.ref).add(decalBaseSize(d.ref, d.size_raw));
    }
    assert.equal(byRef.get(CHAOS).size, 1, 'chaos one flat size');
    assert.equal([...byRef.get(CHAOS)][0], 10);
    for (const ref of OTHERS) {
      assert.ok((byRef.get(ref) || new Set()).size > 1, `${ref} has spread sizes`);
    }
  });

  it('sgb path uses the helper, layout path keeps its own formula', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /import \{ decalBaseSize, decalFlatRotation, drapeDecalLocalZ, decalStoreDirs, decalLayer \} from '\.\/decal-size\.js';/);
    assert.match(src, /const baseSize = decalBaseSize\(path, decal\.size\);/);
    // layout-driven builder untouched: same inline calibration, no chaos branch
    assert.match(src, /const baseSize = decal\.sizeRaw \* 1000 \/ 12;/);
  });
});

describe('sgb decal orientation', () => {
  it('returns flat-ground euler with yaw in Z', () => {
    const rot = decalFlatRotation(-4.6542);
    assert.equal(rot.x, -Math.PI / 2);
    assert.equal(rot.y, 0);
    assert.ok(Math.abs(rot.z - (-4.6542 + Math.PI)) < 1e-12);
  });

  it('falls back to +PI spin for missing angles', () => {
    assert.equal(decalFlatRotation(undefined).z, Math.PI);
    assert.equal(decalFlatRotation(NaN).z, Math.PI);
  });

  it('composes to an up-facing normal for every angle (regression: Y-yaw tilted decals into the sky)', () => {
    const angles = [];
    for (let i = 0; i < 16; i += 1) angles.push((i * Math.PI) / 8);
    angles.push(-4.6542, -2.4734, -1.0251); // real alvarus taint angles
    for (const angle of angles) {
      const rot = decalFlatRotation(angle);
      const normal = new THREE.Vector3(0, 0, 1).applyEuler(
        new THREE.Euler(rot.x, rot.y, rot.z, 'XYZ'),
      );
      assert.ok(Math.abs(normal.x) < 1e-6, `x≈0 at ${angle}`);
      assert.ok(Math.abs(normal.y - 1) < 1e-6, `y≈1 at ${angle}`);
      assert.ok(Math.abs(normal.z) < 1e-6, `z≈0 at ${angle}`);
    }
  });

  it('both builders use the flat helper, no Y-yaw left', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.equal((src.match(/decalFlatRotation\(decal\.angle\)/g) || []).length, 2);
    assert.doesNotMatch(src, /rotation\.y = decal\.angle/);
  });
});

describe('sgb decal drape', () => {
  it('flat field -> uniform lift', () => {
    const params = {
      scaleX: 2, scaleY: 2, yaw: 1.2, centerX: 5, centerZ: -3,
      centerH: 10, sampleHeight: () => 10,
    };
    for (const [lx, ly] of [[-8, -8], [8, 8], [0, 0], [-8, 8], [3.5, -2.25]]) {
      assert.equal(drapeDecalLocalZ(lx, ly, params), 0.08);
    }
    // explicit lift (the builder passes 0: mesh origin carries +0.08)
    assert.equal(drapeDecalLocalZ(0, 0, { ...params, lift: 0 }), 0);
  });

  it('linear slope maps exactly', () => {
    const h = (x, z) => 2 * x + 3 * z + 5;
    const params = {
      scaleX: 2, scaleY: 3, yaw: 0, centerX: 10, centerZ: 20,
      centerH: h(10, 20), sampleHeight: h,
    };
    // yaw=0: worldX = cx + lx*sx, worldZ = cz - ly*sy
    const expect = (lx, ly) => 2 * lx * 2 - 3 * ly * 3 + 0.08;
    for (const [lx, ly] of [[1, 1], [-4, 2], [0, 0], [7.5, -6.25]]) {
      assert.ok(Math.abs(drapeDecalLocalZ(lx, ly, params) - expect(lx, ly)) < 1e-9, `${lx},${ly}`);
    }
  });

  it('sampling rotates with the decal yaw', () => {
    const h = (x) => x; // ramps in +x only
    const params = (yaw) => ({
      scaleX: 2, scaleY: 2, yaw, centerX: 0, centerZ: 0, centerH: 0, sampleHeight: h,
    });
    assert.ok(Math.abs(drapeDecalLocalZ(1, 0, params(0)) - (2 + 0.08)) < 1e-9);
    assert.ok(Math.abs(drapeDecalLocalZ(0, 1, params(Math.PI / 2)) - (-2 + 0.08)) < 1e-9);
    assert.ok(Math.abs(drapeDecalLocalZ(1, 0, params(Math.PI)) - (-2 + 0.08)) < 1e-9);
  });

  it('layout builder drapes sheets onto the relief', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /new THREE\.PlaneGeometry\(side, side, DECAL_DRAPE_SEGMENTS, DECAL_DRAPE_SEGMENTS\)/);
    assert.match(src, /_drapeDecalPlane\(plane\)/);
    assert.match(src, /userData\.drape/);
  });
});

describe('sgb decal stores', () => {
  it('own map dir first, alvarus store second', () => {
    assert.deepEqual(
      decalStoreDirs('maps/6p_parmenie/6p_parmenie.sgb'),
      ['/maps/6p_parmenie/decals/', ALVARUS_DECAL_STORE],
    );
  });

  it('alvarus resolves to its own store only (no duplicate)', () => {
    assert.deepEqual(
      decalStoreDirs('maps/6p_alvarus/6p_alvarus.sgb'),
      [ALVARUS_DECAL_STORE],
    );
  });

  it('missing map key falls back to the shared alvarus pool', () => {
    assert.deepEqual(decalStoreDirs(''), [ALVARUS_DECAL_STORE]);
    assert.deepEqual(decalStoreDirs(undefined), [ALVARUS_DECAL_STORE]);
  });
});

describe('sgb decal default scale', () => {
  it('defaults to 6 in code and slider (12 rendered oversized on scene)', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /let _decalScale = 6;/);
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.match(html, /id="terrain-decal-scale"[^>]*value="6"/);
    assert.match(html, /<span id="terrain-decal-scale-val">6<\/span>/);
  });
});

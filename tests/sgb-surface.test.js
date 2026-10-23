import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSystemsSource } from './systems-src.mjs';
import { sgbSurfaceSnapY, POINT_SNAP_HALF, POINT_SNAP_LIFT } from '../src/sgb-surface.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const identity = (tx, tz, out) => { out.x = tx; out.z = tz; return out; };

// Regression: strategic points spawn at y=0 while the rendered SGB surface
// sits at sampleHeight+rootY (alvarus hill points bury 3-7 deep and read as
// "hidden by decals"). A fixed lift cannot work; each point seats onto the
// max surface height under its own footprint.
describe('sgb surface snap', () => {
  it('flat field + offset seats at surface + lift', () => {
    assert.equal(sgbSurfaceSnapY(identity, -10, () => 10, 4, 5), 0.15);
  });

  it('takes the max over the footprint, not the center', () => {
    // ramp in +x: the +x corners win over center by POINT_SNAP_HALF
    const y = sgbSurfaceSnapY(identity, 0, (x) => x, 100, 0);
    assert.ok(Math.abs(y - (100 + POINT_SNAP_HALF + POINT_SNAP_LIFT)) < 1e-9, y);
  });

  it('samples through the world->local mapper (root yaw/mirror)', () => {
    // 90-degree root: world (10, 20) reads local (-20, 10)
    const rot90 = (tx, tz, out) => { out.x = -tz; out.z = tx; return out; };
    const y = sgbSurfaceSnapY(rot90, 5, (x) => x, 10, 20);
    // max tap: world corner (10+3.2, 20-3.2) -> local x -(20-3.2) = -16.8
    assert.ok(Math.abs(y - (-16.8 + 5 + POINT_SNAP_LIFT)) < 1e-9, y);
  });

  it('locks footprint half-width and resting lift', () => {
    assert.equal(POINT_SNAP_HALF, 3.2);
    assert.equal(POINT_SNAP_LIFT, 0.15);
  });

  it('point system snaps mesh roots every frame, logic untouched', () => {
    const src = readSystemsSource();
    assert.ok(src.includes("from '../sgb-surface.js'"), 'helper imported');
    const body = src.slice(
      src.indexOf('export function systemStrategicPoint'),
      src.indexOf('function _strategicPointUpdateOwner'),
    );
    assert.ok(body.includes('_snapTerrainBegin();'), 'snap context per frame');
    assert.ok(body.includes('_snapMeshToTerrain(meshComponent);'), 'each point seated');
    assert.ok(!body.includes('strategicPoint.position.y'), 'logic position stays flat');
  });

  it('buildings, structures and airfields seat onto the surface too', () => {
    const src = readSystemsSource();
    for (const fn of ['systemBuilding', 'systemStructure', 'systemAirfield']) {
      const nextFn = src.indexOf('export function ', src.indexOf(`export function ${fn}`) + 1);
      const body = src.slice(src.indexOf(`export function ${fn}`), nextFn === -1 ? undefined : nextFn);
      assert.ok(body.includes('_snapTerrainBegin();'), `${fn} prepares snap context`);
      assert.ok(body.includes('_snapMeshToTerrain(meshComponent);'), `${fn} seats meshes`);
    }
  });

  it('sgb load stashes the terrain root, clear drops it', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-upload.js'), 'utf8');
    assert.ok(src.includes('window.__sgbTerrainRoot = root;'), 'stashed on load');
    assert.ok(src.includes('window.__sgbTerrainRoot = null;'), 'cleared with the map');
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { ghostUsesConfigModel } = await import('../src/meshes.js');

describe('ghost model routing', () => {
  it('routes faction grid types to their real config models', () => {
    // HQ + production structure per faction build grid (barracks/turret live
    // in the legacy set below — their factories resolve the same containers).
    for (const type of [
      'desecrated_stronghold', 'chaos_temple',
      'command_hq', 'land_mine',
      'monolith', 'obelisk',
      'settlement', 'da_boyz_hut',
      'tau_hq', 'tau_barracks',
      'webway_assembly', 'aspect_portal',
    ]) {
      assert.equal(ghostUsesConfigModel(type), true, `${type} uses a real-model ghost`);
    }
  });

  it('keeps bespoke container-aware ghosts for legacy types', () => {
    // NOTE: barracks/turret/hq collide with real faction structure types on
    // purpose — their dedicated factories (makeBarracksMesh/makeTowerMesh/
    // makeHQMesh) resolve the same faction containers.
    for (const type of ['barracks', 'infantry_command', 'hq', 'tower', 'turret', 'towerBase', 'thermoGen', 'gunTurret', 'apc', 'mechanized', 'airfield']) {
      assert.equal(ghostUsesConfigModel(type), false, `${type} keeps its legacy ghost`);
    }
  });
});

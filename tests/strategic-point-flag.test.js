import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const {
  STRATEGIC_POINT_BANNERS, shouldShowCaptureFlag, _wirePointFlagNodes, updatePointFlag,
} = await import('../src/meshes.js');
const { ARENA_POSITION_FACTIONS } = await import('../src/factions.js');

function glbNodeNames(url) {
  const buf = readFileSync(url);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  return new Set((json.nodes || []).map((n) => n.name));
}

function fakeNode() {
  return { visible: false };
}

describe('capture flag', () => {
  it('maps every arena faction to banner nodes present in the point glb', () => {
    const names = glbNodeNames(new URL('../models/points/strategic_point.glb', import.meta.url));
    for (const faction of ARENA_POSITION_FACTIONS) {
      assert.ok(STRATEGIC_POINT_BANNERS[faction], `${faction} has a banner entry`);
      for (const node of STRATEGIC_POINT_BANNERS[faction]) {
        assert.ok(names.has(node), `${node} exists in strategic_point.glb`);
      }
    }
  });

  it('finds banner pairs in the relic glb', () => {
    const names = glbNodeNames(new URL('../models/points/relic.glb', import.meta.url));
    for (const node of [...STRATEGIC_POINT_BANNERS.ig, ...STRATEGIC_POINT_BANNERS.orks]) {
      assert.ok(names.has(node), `${node} exists in relic.glb`);
    }
  });

  it('shows the flag while engaged, owned, or part-capped', () => {
    assert.equal(shouldShowCaptureFlag({ engaged: true, owner: null, progress: 0, planted: true }), true);
    assert.equal(shouldShowCaptureFlag({ engaged: false, owner: 'blue', progress: 1 }), true);
    assert.equal(shouldShowCaptureFlag({ engaged: false, owner: null, progress: 0.5, planted: true }), true);
    assert.equal(shouldShowCaptureFlag({ engaged: false, owner: null, progress: 0, planted: true }), false);
    assert.equal(shouldShowCaptureFlag({ engaged: false, owner: null, progress: -0.5, planted: true }), true);
  });

  it('holds the flag until the planter seats it (engaged but unplanted)', () => {
    assert.equal(shouldShowCaptureFlag({ engaged: true, owner: null, progress: 0, planted: false }), false);
    assert.equal(shouldShowCaptureFlag({ engaged: true, owner: null, progress: 0 }), false);
    assert.equal(shouldShowCaptureFlag({ engaged: true, owner: null, progress: 0.2, planted: false }), false);
  });

  it('guard rod base sits exactly on the centerpost top (socketed, no offsets)', () => {
    const buf = readFileSync(new URL('../models/points/strategic_point.glb', import.meta.url));
    const jsonLen = buf.readUInt32LE(12);
    const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
    const bounds = (meshName) => {
      const mesh = json.meshes.find((m) => m.name === meshName);
      return json.accessors[mesh.primitives[0].attributes.POSITION];
    };
    const rod = bounds('guard_banner_rod');
    const post = bounds('stratetgic_point_centerpost');
    assert.ok(Math.abs(rod.min[1] - post.max[1]) < 0.01, 'rod continues the post');
  });

  it('wires mesh nodes only, with dedupe suffixes', () => {
    const root = new THREE.Group();
    const banner = new THREE.Mesh(new THREE.BufferGeometry());
    banner.name = 'guard_banner';
    const rod = new THREE.Mesh(new THREE.BufferGeometry());
    rod.name = 'guard_banner_rod_1';
    const bone = new THREE.Group();
    bone.name = 'guard_banner_rod';
    const ork = new THREE.Mesh(new THREE.BufferGeometry());
    ork.name = 'ork_flag';
    root.add(banner, rod, bone, ork);
    _wirePointFlagNodes(root);
    assert.deepEqual(root._flagNodes.banners.ig.map((n) => n.name).sort(), ['guard_banner', 'guard_banner_rod_1']);
    assert.deepEqual(root._flagNodes.banners.orks.map((n) => n.name), ['ork_flag']);
  });

  it('shows only the capturer flag', () => {
    const model = {
      _flagNodes: {
        banners: { ig: [fakeNode()], orks: [fakeNode()] },
      },
    };
    updatePointFlag(model, { faction: 'ig', show: true });
    assert.equal(model._flagNodes.banners.ig[0].visible, true);
    assert.equal(model._flagNodes.banners.orks[0].visible, false);
    updatePointFlag(model, { faction: 'orks', show: true });
    assert.equal(model._flagNodes.banners.ig[0].visible, false);
    assert.equal(model._flagNodes.banners.orks[0].visible, true);
    updatePointFlag(model, { faction: 'ig', show: false });
    assert.equal(model._flagNodes.banners.ig[0].visible, false);
    updatePointFlag(model, { faction: null, show: true });
    assert.equal(model._flagNodes.banners.orks[0].visible, false);
    updatePointFlag(null, { faction: 'ig', show: true });
    updatePointFlag({}, { faction: 'ig', show: true });
  });
});

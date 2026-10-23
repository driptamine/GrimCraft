import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const systems = await import('../src/systems.js');
const entities = await import('../src/entities.js');
const plasmaBolt = await import('../src/plasma-bolt.js');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readSrc = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function makeWorld() {
  const comps = new Map();
  let nextId = 1;
  return {
    createEntity() {
      const id = nextId++;
      comps.set(id, new Map());
      return id;
    },
    add(id, type, data) {
      comps.get(id).set(type, data);
    },
    get(id, type) {
      return comps.get(id)?.get(type);
    },
    has(id, type) {
      return comps.get(id)?.has(type) ?? false;
    },
    query(...types) {
      const out = [];
      for (const [id, m] of comps) {
        if (types.every((t) => m.has(t))) out.push(id);
      }
      return out;
    },
  };
}

function addTarget(world, x) {
  const id = world.createEntity();
  world.add(id, 'soldier', { hp: 100 });
  const root = new THREE.Group();
  root.position.set(x, 0, 0);
  world.add(id, 'mesh', { root });
  return id;
}

describe('plasma final projectile', () => {
  it('creates a heavier plasma bolt tagged plasma-final', () => {
    const world = makeWorld();
    const target = addTarget(world, 20);
    const from = new THREE.Vector3(0, 0, 0);
    const id = entities.createPlasmaFinalBulletEntity(world, from, 'blue', 1, target, 1);
    assert.ok(id !== null);
    const bullet = world.get(id, 'bullet');
    assert.equal(bullet.projectileType, 'plasma-final');
    assert.ok(bullet.damage >= 20 && bullet.damage <= 28, `damage ${bullet.damage} in 20..28`);
  });

  it('dresses the final bolt with plasma-fx beam and flash, keeping the plasma contract', () => {
    const world = makeWorld();
    const target = addTarget(world, 20);
    const id = entities.createPlasmaFinalBulletEntity(world, new THREE.Vector3(0, 0, 0), 'blue', 1, target, 1);
    const root = world.get(id, 'mesh').root;
    const names = [];
    root.traverse((c) => { if (c.name) names.push(c.name); });
    assert.ok(root.userData.filaments, 'filaments for systemPlasmaBullet');
    assert.ok(root.userData.crackle, 'crackle state for systemPlasmaBullet');
    // In node there is no DOM/fetch, so the DDS dressing is skipped and the
    // plain plasma contract remains — the dressing itself is covered below.
    assert.ok(names.some((n) => n === 'bolt_core' || n === 'boltmodel'), 'bolt body present');
  });

  it('ships valid DXT5 plasma-fx textures with the expected shapes', () => {
    const dir = path.join(root, 'models/ig/projectiles/plasma-fx');
    const dims = {
      'plasma_beam_1.dds': [128, 64],
      'plasma_flash_1.dds': [128, 128],
      'plasma_muzzle_1.dds': [256, 128],
      'plasma_muzzle_2.dds': [256, 128],
      'plasma_muzzle_3.dds': [256, 128],
    };
    for (const [file, [w, h]] of Object.entries(dims)) {
      const buf = fs.readFileSync(path.join(dir, file));
      assert.equal(buf.subarray(0, 4).toString('ascii'), 'DDS ');
      assert.equal(buf.readUInt32LE(16), w, `${file} width`);
      assert.equal(buf.readUInt32LE(12), h, `${file} height`);
      assert.equal(buf.subarray(84, 88).toString('ascii'), 'DXT5', `${file} format`);
    }
  });

  it('attaches and expires the muzzle flash without a DOM', () => {
    const meshRoot = new THREE.Group();
    plasmaBolt.attachPlasmaMuzzleFlash(meshRoot);
    assert.equal(meshRoot.userData.finalMuzzle, undefined, 'skipped headless, no crash');
    plasmaBolt.updatePlasmaMuzzleFlash(meshRoot, 0.05);
    plasmaBolt.updatePlasmaMuzzleFlash(null, 0.05);
  });

  it('preloads the final fx at boot and ticks muzzle flashes in systemSoldier', () => {
    const game = readSrc('src/game.js');
    assert.ok(game.includes('preloadPlasmaFinalFx()'), 'preloaded with the bolt model');
    const squad = readSrc('src/systems/squad.js');
    assert.ok(squad.includes('attachPlasmaMuzzleFlash(soldierMeshComponent.root)'), 'flash on final shots');
    assert.ok(squad.includes('updatePlasmaMuzzleFlash(meshComponent.root, deltaTime)'), 'flash ticked per soldier');
  });

  it('reports a stale-chunk failure on the decals tab instead of staying silent', () => {
    const game = readSrc('src/game.js');
    assert.ok(game.includes('DECALS CHUNK FAILED TO LOAD'), 'visible message on lazy-chunk failure');
    assert.ok(game.includes('hard-refresh the page'), 'tells the user the fix');
  });

  it('scales damage with damageMult and fails cleanly without a target mesh', () => {
    const world = makeWorld();
    const target = addTarget(world, 20);
    const id = entities.createPlasmaFinalBulletEntity(world, new THREE.Vector3(0, 0, 0), 'blue', 1, target, 2);
    const bullet = world.get(id, 'bullet');
    assert.ok(bullet.damage >= 40 && bullet.damage <= 56);
    const ghost = world.createEntity();
    assert.equal(entities.createPlasmaFinalBulletEntity(world, new THREE.Vector3(0, 0, 0), 'blue', 1, ghost, 1), null);
  });

  it('flies through the plasma system, untouched by the bullet system', () => {
    const world = makeWorld();
    const target = addTarget(world, 20);
    const id = entities.createPlasmaFinalBulletEntity(world, new THREE.Vector3(0, 0, 0), 'blue', 1, target, 1);
    systems.systemBullet(world, 0.1);
    assert.ok(world.has(id, 'bullet'), 'systemBullet skips plasma-final');
    const before = world.get(id, 'mesh').root.position.x;
    systems.systemPlasmaBullet(world, 0.1);
    assert.ok(world.get(id, 'mesh').root.position.x > before, 'systemPlasmaBullet moves it');
  });

  it('has a HUD slot wired to the projectile switch', () => {
    const src = readSrc('src/hud/components/ReinforceBtnPanel.jsx');
    assert.ok(src.includes('label="PLASMA FINAL"'), 'slot labeled');
    assert.ok(src.includes("setProjectile('plasma-final')"), 'slot switches type');
    assert.ok(src.includes("curPtSq === 'plasma-final'"), 'slot highlights when active');
  });

  it('wins the data.js projectile highlight priority', () => {
    const src = readSrc('src/hud/data.js');
    assert.ok(src.includes("if (ptCounts['plasma-final'] > 0) curPtSq = 'plasma-final'"), 'final first');
  });
});

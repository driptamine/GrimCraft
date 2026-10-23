import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const sceneMod = await import('../src/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const {
  makePlasmaBoltMesh,
  updatePlasmaBoltFx,
  updatePlasmaBoltCrackle,
  PLASMA_BOLT_PATH,
  BOLT_CORE_NAME,
  BOLT_SHELL_NAME,
  BOLT_HALO_NAME,
} = await import('../src/plasma-bolt.js');
const { disposeObj } = await import('../src/three-helpers.js');

const here = dirname(fileURLToPath(import.meta.url));

function collectByName(root) {
  const found = {};
  root.traverse((child) => {
    if (child.name) {
      found[child.name] = child;
    }
  });
  return found;
}

describe('plasma bolt', () => {
  it('builds the layered fallback bolt without a preloaded GLB', () => {
    const bolt = makePlasmaBoltMesh();
    assert.equal(bolt.name, 'plasmabolt');
    const found = collectByName(bolt);
    assert.ok(found[BOLT_CORE_NAME], 'core mesh present');
    assert.ok(found[BOLT_SHELL_NAME], 'shell mesh present');
    assert.ok(found[BOLT_HALO_NAME], 'halo mesh present');
    assert.equal(found[BOLT_HALO_NAME].visible, false, 'halo mesh hidden');
    const tendrils = ['tendril_01', 'tendril_02', 'tendril_03'].map((n) => found[n]);
    assert.ok(tendrils.every(Boolean), 'three tendril lines present');
    assert.ok(tendrils.every((t) => t.isLine), 'tendrils are lines');
    // White-hot blue core, turbulent electric shell, additive halo + tendrils.
    assert.equal(found[BOLT_CORE_NAME].material.color.getHex(), 0xeaf6ff);
    assert.equal(found[BOLT_HALO_NAME].material.color.getHex(), 0x1e56ff);
    assert.equal(tendrils[0].material.color.getHex(), 0x4fb8ff);
    assert.ok(found[BOLT_SHELL_NAME].material.isShaderMaterial);
    assert.ok('uTime' in found[BOLT_SHELL_NAME].material.uniforms);
    assert.ok('uFlicker' in found[BOLT_SHELL_NAME].material.uniforms);
    assert.equal(found[BOLT_SHELL_NAME].material.blending, THREE.AdditiveBlending);
    assert.equal(found[BOLT_HALO_NAME].material.blending, THREE.AdditiveBlending);
    assert.equal(tendrils[0].material.blending, THREE.AdditiveBlending);
    // Shell encloses the core but stays translucent so the core reads through.
    assert.ok(found[BOLT_SHELL_NAME].material.transparent);
    assert.ok(found[BOLT_HALO_NAME].material.transparent);
    // Tablet/capsule along the flight axis (+Z): elongated, with a straight
    // cylindrical mid-section (many vertices share the max radius).
    for (const name of [BOLT_CORE_NAME, BOLT_SHELL_NAME, BOLT_HALO_NAME]) {
      const geo = found[name].geometry;
      geo.computeBoundingBox();
      const size = geo.boundingBox.getSize(new THREE.Vector3());
      assert.ok(size.z > size.x * 1.6, `${name} elongated along Z`);
      const pos = geo.attributes.position;
      let maxR = 0;
      for (let i = 0; i < pos.count; i++) {
        maxR = Math.max(maxR, Math.hypot(pos.getX(i), pos.getY(i)));
      }
      let atMax = 0;
      for (let i = 0; i < pos.count; i++) {
        if (Math.abs(Math.hypot(pos.getX(i), pos.getY(i)) - maxR) < maxR * 0.01) {
          atMax++;
        }
      }
      assert.ok(atMax / pos.count > 0.15, `${name} has a cylindrical mid-section`);
    }
    assert.ok(bolt.userData.filaments, 'filament group exposed for the system tick');
  });

  it('shares geometry and materials across bolts', () => {
    const a = makePlasmaBoltMesh();
    const b = makePlasmaBoltMesh();
    const fa = collectByName(a);
    const fb = collectByName(b);
    assert.equal(fa[BOLT_CORE_NAME].geometry, fb[BOLT_CORE_NAME].geometry);
    assert.equal(fa[BOLT_SHELL_NAME].material, fb[BOLT_SHELL_NAME].material);
    assert.equal(fa[BOLT_CORE_NAME].material, fb[BOLT_CORE_NAME].material);
    assert.equal(fa.tendril_01.material, fb.tendril_01.material);
  });

  it('disposeObj keeps shared bolt geometry alive', () => {
    const a = makePlasmaBoltMesh();
    const b = makePlasmaBoltMesh();
    const geo = collectByName(a)[BOLT_CORE_NAME].geometry;
    disposeObj(a);
    assert.equal(collectByName(b)[BOLT_CORE_NAME].geometry, geo);
    assert.ok(geo.attributes.position.count > 0);
  });

  it('updatePlasmaBoltFx advances turbulence time with a bounded pulse', () => {
    const bolt = makePlasmaBoltMesh();
    const shellMat = collectByName(bolt)[BOLT_SHELL_NAME].material;
    updatePlasmaBoltFx(1.0);
    const first = shellMat.uniforms.uTime.value;
    const flickerA = shellMat.uniforms.uFlicker.value;
    updatePlasmaBoltFx(2.5);
    assert.equal(shellMat.uniforms.uTime.value, 2.5);
    assert.notEqual(first, 2.5);
    assert.ok(flickerA > 0.6 && flickerA < 1.2, `flicker in range, got ${flickerA}`);
    // Second bolt sees the same shared uniforms (single update per frame).
    const other = collectByName(makePlasmaBoltMesh())[BOLT_SHELL_NAME].material;
    assert.equal(other.uniforms.uTime.value, 2.5);
  });

  it('keeps tendril geometry per-bolt so crackle stays independent', () => {
    const a = collectByName(makePlasmaBoltMesh());
    const b = collectByName(makePlasmaBoltMesh());
    assert.notEqual(a.tendril_01.geometry, b.tendril_01.geometry);
    assert.ok(!a.tendril_01.geometry.userData.shared, 'tendril geo is disposed with its bolt');
    // ...while capsules and materials stay shared.
    assert.equal(a[BOLT_CORE_NAME].geometry, b[BOLT_CORE_NAME].geometry);
    assert.equal(a.tendril_01.material, b.tendril_01.material);
  });

  it('updatePlasmaBoltCrackle rewrites discharges in place on a timer', () => {
    const bolt = makePlasmaBoltMesh();
    const line = collectByName(bolt).tendril_01;
    const geo = line.geometry;
    const before = Array.from(geo.attributes.position.array);
    updatePlasmaBoltCrackle(bolt, 1.0);
    const after = Array.from(geo.attributes.position.array);
    assert.equal(line.geometry, geo, 'no reallocation on crackle');
    assert.notDeepEqual(after, before, 'discharge path re-rolled');
    // Interval respected: a tick before the next slot changes nothing.
    updatePlasmaBoltCrackle(bolt, 1.01);
    assert.deepEqual(Array.from(geo.attributes.position.array), after);
    // ...but a later tick re-rolls again.
    updatePlasmaBoltCrackle(bolt, 2.0);
    assert.notDeepEqual(Array.from(geo.attributes.position.array), after);
  });

  it('ships a layered plasma_bolt.glb asset', () => {
    const file = readFileSync(join(here, '..', PLASMA_BOLT_PATH));
    assert.equal(file.readUInt32LE(0), 0x46546c67);
    const jsonLength = file.readUInt32LE(12);
    const gltf = JSON.parse(file.subarray(20, 20 + jsonLength).toString('utf8'));
    const names = gltf.nodes.map((n) => n.name);
    for (const want of [BOLT_CORE_NAME, BOLT_SHELL_NAME, BOLT_HALO_NAME, 'tendril_01', 'tendril_02', 'tendril_03']) {
      assert.ok(names.includes(want), `GLB node ${want}`);
    }
    const tendrilMeshes = gltf.meshes.filter((m) => m.name.startsWith('tendril_'));
    assert.equal(tendrilMeshes.length, 3);
    assert.ok(tendrilMeshes.every((m) => m.primitives[0].mode === 1), 'tendrils are line strips');
    const coreMat = gltf.materials.find((m) => m.name === 'bolt_core_mat');
    assert.ok(coreMat.emissiveFactor[0] > 1.5, 'HDR-ish white-hot core emissive');
  });
});

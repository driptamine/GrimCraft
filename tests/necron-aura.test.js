import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const sceneMod = await import('../src/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const { addNecronAura, updateNecronAura, AURA_GROUP, SHELL_SUFFIX } = await import('../src/necron-aura.js');
const { makeSoldierMesh } = await import('../src/meshes.js');
const { factionContainers } = await import('../src/factions.js');

function skinnedBody() {
  const geo = new THREE.BoxGeometry(0.5, 1.2, 0.3);
  const count = geo.attributes.position.count;
  const weight = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    weight[i * 4] = 1;
  }
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(count * 4), 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weight, 4));
  const bone = new THREE.Bone();
  bone.name = 'bip01_spine';
  const mesh = new THREE.SkinnedMesh(geo, new THREE.MeshStandardMaterial({ color: 0x2a2d31 }));
  mesh.name = 'necron_body';
  mesh.add(bone);
  mesh.bind(new THREE.Skeleton([bone]));
  return mesh;
}

function warriorModel() {
  const root = new THREE.Group();
  root.name = 'soldier_clone';
  const body = skinnedBody();
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x3a3d42 }),
  );
  plate.name = 'necron_plate';
  plate.position.y = 1.1;
  const conduit = new THREE.Group();
  conduit.name = 'gauss_conduit';
  const stream = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1));
  stream.name = 'conduit_stream';
  conduit.add(stream);
  root.add(body, plate, conduit);
  return { root, body, plate };
}

function shellsOf(root) {
  const out = [];
  root.traverse((child) => {
    if (child.name.endsWith(SHELL_SUFFIX)) {
      out.push(child);
    }
  });
  return out;
}

function fogOf(root) {
  const out = [];
  root.traverse((child) => {
    if (child.name === 'necron_aura_fog') {
      out.push(child);
    }
  });
  return out;
}

describe('necron warrior aura', () => {
  it('wraps body meshes in a wispy gas shell, touching nothing', () => {
    const { root, body, plate } = warriorModel();
    const bodyMat = body.material;
    const bodyGeo = body.geometry;
    const group = addNecronAura(root);
    assert.ok(group, 'marker group returned');
    assert.equal(group.name, AURA_GROUP);
    const shells = shellsOf(root);
    assert.equal(shells.length, 2, 'body + plate wrapped, conduit stream skipped');
    assert.equal(body.material, bodyMat);
    assert.equal(body.geometry, bodyGeo);
    assert.equal(bodyMat.emissive.getHex(), 0x000000);
    for (const shell of shells) {
      assert.ok(shell.material.isShaderMaterial, 'gas shader');
      assert.equal(shell.material.blending, THREE.AdditiveBlending);
      assert.equal(shell.material.depthWrite, false);
      assert.equal(shell.castShadow, false);
      assert.equal(shell.userData.pickable, false);
    }
    const bodyShell = root.getObjectByName(`necron_body${SHELL_SUFFIX}`);
    assert.equal(bodyShell.geometry, bodyGeo);
    assert.ok(bodyShell.isSkinnedMesh, 'skinned shell follows the bones');
    assert.equal(bodyShell.skeleton, body.skeleton);
    assert.equal(bodyShell.material, root.getObjectByName(`necron_plate${SHELL_SUFFIX}`).material);
    assert.ok('uTime' in bodyShell.material.uniforms);
    assert.ok('uInflate' in bodyShell.material.uniforms);
  });

  it('pools soft fog billboards at the feet', () => {
    const { root } = warriorModel();
    addNecronAura(root);
    const fog = fogOf(root);
    assert.equal(fog.length, 3, 'three foot fog puffs');
    for (const puff of fog) {
      assert.ok(puff.isSprite);
      assert.equal(puff.material.blending, THREE.AdditiveBlending);
      assert.ok(puff.position.y <= 0.3, 'fog stays low');
    }
    assert.notEqual(fog[0].material, fog[1].material, 'alternating churn materials');
  });

  it('is idempotent across re-applies', () => {
    const { root } = warriorModel();
    const a = addNecronAura(root);
    const b = addNecronAura(root);
    assert.equal(b, a, 're-apply returns the same group');
    assert.equal(shellsOf(root).length, 2, 'no duplicate shells');
    assert.equal(fogOf(root).length, 3, 'no duplicate fog');
  });

  it('updateNecronAura advances gas and fog animation', () => {
    const { root } = warriorModel();
    addNecronAura(root);
    const mat = shellsOf(root)[0].material;
    updateNecronAura(1.0);
    assert.equal(mat.uniforms.uTime.value, 1.0);
    const first = mat.uniforms.uIntensity.value;
    updateNecronAura(1.7);
    assert.equal(mat.uniforms.uTime.value, 1.7);
    assert.notEqual(mat.uniforms.uIntensity.value, first);
    const fog = fogOf(root);
    assert.notEqual(fog[0].material.rotation, 0, 'fog swirls');
    assert.ok(fog[0].material.rotation > 0 && fog[1].material.rotation < 0, 'fog counter-rotates');
  });

  it('null-safe without a model', () => {
    assert.equal(addNecronAura(null), null);
    updateNecronAura(1.0); // must not throw before any install
  });

  it('necron soldiers spawn with the aura, others without', () => {
    factionContainers.necrons = factionContainers.necrons || {};
    factionContainers.necrons.soldier = {
      scene: warriorModel().root, animations: [], _hiddenNodes: null,
    };
    const necronRoot = makeSoldierMesh('red', { faction: 'necrons' });
    assert.ok(necronRoot.getObjectByName(AURA_GROUP), 'warrior carries the aura');
    assert.ok(shellsOf(necronRoot).length > 0, 'warrior meshes wrapped');

    factionContainers.tau = factionContainers.tau || {};
    factionContainers.tau.soldier = {
      scene: warriorModel().root, animations: [], _hiddenNodes: null,
    };
    const tauRoot = makeSoldierMesh('blue', { faction: 'tau' });
    assert.equal(tauRoot.getObjectByName(AURA_GROUP), undefined, 'no aura off-faction');
  });
});

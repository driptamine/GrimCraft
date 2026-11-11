import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

// Teach node the Vite-isms in the import chain (bare JSON imports,
// import.meta.env) before the dynamic imports below run.
register('./node-esm-hooks.mjs', import.meta.url);
// scene.js reads the render canvas once at module top level; stub the DOM
// so the real scene/entities modules can load in node (browser unaffected).
globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };
const sceneMod = await import('../src/core/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const { World } = await import('../src/core/ecs.js');

const {
  INFANTRY_MODEL_NEW,
  INFANTRY_MODEL_CLASSIC,
  resolveInfantryVariant,
  getInfantryModelVariant,
  useNewInfantryModel,
  setInfantryModelVariant,
  toggleInfantryModelVariant,
  resolveInfantryModel,
  infantryModelUnitForPath,
  isSwappableInfantryModel,
} = await import('../src/render/infantry-model-variant.js');

const {
  FACTIONS,
  factionContainers,
  loadFactionModels,
  reloadInfantryVariantContainers,
} = await import('../src/factions.js');

const { swapInfantryVariantMeshes } = await import('../src/entities/entities.js');

const MARINE_CLASSIC = 'models/space marines/troops/space_marine.glb';
const MARINE_NEW = 'models/space-marine.glb';
const GUARD_CLASSIC = 'models/ig/infantry/guardsmen.glb';
const GUARD_NEW = 'models/guardsmen.glb';

function resetVariants() {
  setInfantryModelVariant('marine', INFANTRY_MODEL_CLASSIC);
  setInfantryModelVariant('guardsman', INFANTRY_MODEL_CLASSIC);
}

describe('infantry model variant resolution', () => {
  it('defaults both units to classic', () => {
    resetVariants();
    assert.equal(resolveInfantryVariant(), INFANTRY_MODEL_CLASSIC);
    assert.equal(resolveInfantryVariant({}), INFANTRY_MODEL_CLASSIC);
    assert.equal(resolveInfantryVariant({ query: '', stored: '' }), INFANTRY_MODEL_CLASSIC);
    assert.equal(getInfantryModelVariant('marine'), INFANTRY_MODEL_CLASSIC);
    assert.equal(getInfantryModelVariant('guardsman'), INFANTRY_MODEL_CLASSIC);
  });

  it('prefers stored over default and query over stored', () => {
    assert.equal(resolveInfantryVariant({ stored: 'new' }), INFANTRY_MODEL_NEW);
    assert.equal(resolveInfantryVariant({ query: 'new', stored: 'classic' }), INFANTRY_MODEL_NEW);
    assert.equal(resolveInfantryVariant({ query: 'classic', stored: 'new' }), INFANTRY_MODEL_CLASSIC);
  });

  it('ignores unknown values and matches case-insensitively', () => {
    assert.equal(resolveInfantryVariant({ query: 'banana' }), INFANTRY_MODEL_CLASSIC);
    assert.equal(resolveInfantryVariant({ stored: 'banana' }), INFANTRY_MODEL_CLASSIC);
    assert.equal(resolveInfantryVariant({ query: 'New' }), INFANTRY_MODEL_NEW);
    assert.equal(resolveInfantryVariant({ stored: 'CLASSIC' }), INFANTRY_MODEL_CLASSIC);
  });

  it('maps classic paths to the new GLBs only when that unit is new', () => {
    resetVariants();
    assert.equal(resolveInfantryModel(MARINE_CLASSIC), MARINE_CLASSIC);
    assert.equal(resolveInfantryModel(GUARD_CLASSIC), GUARD_CLASSIC);

    setInfantryModelVariant('marine', INFANTRY_MODEL_NEW);
    assert.equal(resolveInfantryModel(MARINE_CLASSIC), MARINE_NEW);
    assert.equal(useNewInfantryModel('marine'), true);
    // The other unit is unaffected.
    assert.equal(resolveInfantryModel(GUARD_CLASSIC), GUARD_CLASSIC);
    assert.equal(useNewInfantryModel('guardsman'), false);

    setInfantryModelVariant('guardsman', INFANTRY_MODEL_NEW);
    assert.equal(resolveInfantryModel(GUARD_CLASSIC), GUARD_NEW);
    resetVariants();
  });

  it('leaves new, sergeant and unrelated paths untouched', () => {
    resetVariants();
    setInfantryModelVariant('marine', INFANTRY_MODEL_NEW);
    setInfantryModelVariant('guardsman', INFANTRY_MODEL_NEW);
    assert.equal(resolveInfantryModel(MARINE_NEW), MARINE_NEW);
    assert.equal(resolveInfantryModel(GUARD_NEW), GUARD_NEW);
    assert.equal(resolveInfantryModel('models/ig/infantry/guardsmen_sergeant.glb'), 'models/ig/infantry/guardsmen_sergeant.glb');
    assert.equal(resolveInfantryModel('models/orks/boyz.glb'), 'models/orks/boyz.glb');
    assert.equal(resolveInfantryModel(null), '');
    resetVariants();
  });

  it('toggles and identifies swappable paths per unit', () => {
    resetVariants();
    assert.equal(toggleInfantryModelVariant('marine'), INFANTRY_MODEL_NEW);
    assert.equal(toggleInfantryModelVariant('marine'), INFANTRY_MODEL_CLASSIC);
    assert.equal(infantryModelUnitForPath(MARINE_CLASSIC), 'marine');
    assert.equal(infantryModelUnitForPath(MARINE_NEW), 'marine');
    assert.equal(infantryModelUnitForPath(GUARD_CLASSIC), 'guardsman');
    assert.equal(infantryModelUnitForPath(GUARD_NEW), 'guardsman');
    assert.equal(infantryModelUnitForPath('models/ig/infantry/guardsmen_sergeant.glb'), null);
    assert.equal(isSwappableInfantryModel(MARINE_CLASSIC), true);
    assert.equal(isSwappableInfantryModel(GUARD_NEW), true);
    assert.equal(isSwappableInfantryModel('models/orks/boyz.glb'), false);
  });
});

describe('infantry variant container reload', () => {
  const stubLoader = (seen) => async (url) => {
    seen.push(url);
    return { stub: url };
  };

  it('boots through the variant resolver and reloads per unit', async () => {
    resetVariants();
    assert.equal(FACTIONS.ig.infantry[1].model, GUARD_CLASSIC);
    assert.equal(FACTIONS['space marines'].infantry[1].model, MARINE_CLASSIC);

    // Boot with the guardsman variant set: the loader must receive the new path.
    setInfantryModelVariant('guardsman', INFANTRY_MODEL_NEW);
    const bootSeen = [];
    await loadFactionModels(undefined, ['ig', 'space marines'], { loadModel: stubLoader(bootSeen) });
    assert.ok(bootSeen.some((u) => String(u).endsWith(GUARD_NEW)), `boot should load ${GUARD_NEW}`);
    assert.ok(bootSeen.some((u) => String(u).endsWith(MARINE_CLASSIC)), 'marine stays classic');

    // Flip the marine, reload, and only its container changes.
    setInfantryModelVariant('marine', INFANTRY_MODEL_NEW);
    const seen = [];
    const reloaded = await reloadInfantryVariantContainers({ loadModel: stubLoader(seen) });
    assert.ok(reloaded.includes('ig'), 'ig container reloaded');
    assert.ok(reloaded.includes('space marines'), 'space marines container reloaded');
    assert.ok(String(factionContainers.ig.soldier.stub).endsWith(GUARD_NEW));
    assert.ok(String(factionContainers['space marines'].soldier.stub).endsWith(MARINE_NEW));

    // Back to classic for both.
    resetVariants();
    const seenClassic = [];
    await reloadInfantryVariantContainers({ loadModel: stubLoader(seenClassic) });
    assert.ok(String(factionContainers.ig.soldier.stub).endsWith(GUARD_CLASSIC));
    assert.ok(String(factionContainers['space marines'].soldier.stub).endsWith(MARINE_CLASSIC));
  });
});

// Real ECS world, like the melee/squad suites use.
function makeTestWorld() {
  return new World();
}

describe('infantry variant live mesh swap', () => {
  it('swaps tagged meshes in place, skips sergeants and the dead', () => {
    // No faction containers: makeSoldierMesh falls back to the procedural
    // box-man mesh, which is enough to exercise the swap mechanics.
    factionContainers.ig.soldier = null;
    factionContainers['space marines'].soldier = null;
    resetVariants();

    const fw = makeTestWorld();
    const squadId = fw.createEntity([]);
    const sidTagged = fw.createEntity([]);
    const sidSergeant = fw.createEntity([]);
    const sidDead = fw.createEntity([]);
    fw.add(squadId, 'squad', {
      team: 'blue',
      faction: 'ig',
      soldiers: [sidTagged, sidSergeant, sidDead],
      projectileType: 'bullet',
      selected: true,
    });

    const parent = new THREE.Group();
    const tagged = new THREE.Group();
    tagged._variantSoldier = true;
    tagged.position.set(4, 0, 7);
    parent.add(tagged);
    fw.add(sidTagged, 'soldier', { squadId, unitType: 'guardsmen', hp: 100, maxHp: 100, isSuperior: false, isGrenadier: false });
    const mesh10 = { root: tagged };
    fw.add(sidTagged, 'mesh', mesh10);

    // Untagged (sergeant-style named-unit mesh): must be left alone.
    const sergeantRoot = new THREE.Group();
    parent.add(sergeantRoot);
    fw.add(sidSergeant, 'soldier', { squadId, unitType: 'sergeant', hp: 100, maxHp: 100, isSuperior: true, isGrenadier: false });
    const mesh11 = { root: sergeantRoot };
    fw.add(sidSergeant, 'mesh', mesh11);

    // Dead tagged soldier: the death animation must not be rebuilt.
    const deadRoot = new THREE.Group();
    deadRoot._variantSoldier = true;
    parent.add(deadRoot);
    fw.add(sidDead, 'soldier', { squadId, unitType: 'guardsmen', hp: 0, maxHp: 100, isSuperior: false, isGrenadier: false });
    const mesh12 = { root: deadRoot };
    fw.add(sidDead, 'mesh', mesh12);

    const swapped = swapInfantryVariantMeshes(fw);
    assert.equal(swapped, 1);
    assert.notEqual(mesh10.root, tagged, 'mesh component points at the new root');
    assert.ok(!parent.children.includes(tagged), 'old root removed from its parent');
    assert.ok(parent.children.includes(mesh10.root), 'new root keeps the same parent');
    assert.deepEqual([mesh10.root.position.x, mesh10.root.position.z], [4, 7], 'transform carried over');
    assert.equal(mesh11.root, sergeantRoot, 'sergeant mesh untouched');
    assert.equal(mesh12.root, deadRoot, 'dead soldier mesh untouched');
  });
});

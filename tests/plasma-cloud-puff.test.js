import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';
import { PLASMA_CLOUD_PUFF, PLASMA_CLOUD_PUFF_COUNT, PLASMA_CLOUD_PUFF_SIZES, makePlasmaCloudPuffMesh, updatePlasmaCloudPuff } from '../src/fx/plasma-cloud-puff.js';

globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };
const scene = await import('../src/core/scene.js');
const headless = new THREE.Scene();
headless._registerShadows = () => {};
scene.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
const { createPlasmaCloudPuffVolley, getSoldierMuzzlePos, applySquadWeaponVisuals, createSoldierEntity } = await import('../src/entities/entities.js');
const { systemBullet, systemPlasmaBullet } = await import('../src/systems/projectiles.js');
const { _squadFireAll } = await import('../src/systems/squad.js');

beforeEach(() => {
  headless.clear();
  scene.particles.length = 0;
  window._multiplayerMode = false;
});

function fixture() {
  const world = new World();
  const add = (kind, component, position = new THREE.Vector3()) => {
    const id = world.createEntity([]);
    world.add(id, kind, component);
    const root = new THREE.Group();
    root.position.copy(position);
    world.add(id, 'mesh', { root });
    headless.add(root);
    return id;
  };
  const target = add('soldier', { hp: 500, maxHp: 500 }, new THREE.Vector3(10, 0, 0));
  const squad = add('squad', { team: 'blue', faction: 'ig', unitType: 'guardsmen', projectileType: PLASMA_CLOUD_PUFF, soldiers: [] });
  const shooter = add('soldier', {
    hp: 100, maxHp: 100, squadId: squad, unitType: 'guardsmen', weapon: 'lasgun',
    attackRate: 2, attackCooldown: 0, damageMult: 1,
    projectileType: 'plasma', isGrenadier: false,
  });
  world.get(squad, 'squad').soldiers.push(shooter);
  const root = world.get(shooter, 'mesh').root;
  const bone = new THREE.Group();
  bone.name = 'bone_ig_hand_weapon_r';
  const muzzle = new THREE.Object3D();
  muzzle.name = 'marker_plasma_muzzle';
  muzzle.position.set(0.4, 1.4, 0.2);
  bone.add(muzzle);
  root.add(bone);
  return { world, add, target, squad, shooter, bone, muzzle };
}

describe('plasma cloud puff projectiles', () => {
  it('has seven distinct small cloud sizes with soft transparency and shared sprite resources', () => {
    assert.equal(PLASMA_CLOUD_PUFF_COUNT, 7);
    assert.equal(new Set(PLASMA_CLOUD_PUFF_SIZES).size, 7);
    assert.ok(PLASMA_CLOUD_PUFF_SIZES.every((size) => size >= 0.1 && size <= 0.3));
    for (let variant = 0; variant < 7; variant++) {
      const first = makePlasmaCloudPuffMesh(variant);
      const second = makePlasmaCloudPuffMesh(variant);
      const cloud = first.children[0];
      assert.equal(first.children.length, 3, 'each projectile contains three gaseous wisps');
      assert.equal(first.name, 'plasma_cloud_puff');
      assert.equal(cloud.isSprite, true);
      assert.equal(cloud.scale.x, PLASMA_CLOUD_PUFF_SIZES[variant]);
      assert.equal(cloud.material, second.children[0].material);
      assert.equal(cloud.material.blending, THREE.AdditiveBlending);
      assert.equal(cloud.material.depthWrite, false);
      assert.equal(cloud.geometry.userData.shared, true);
      const pixels = cloud.material.map.image.data;
      assert.equal(pixels[3], 0, 'cloud corners are transparent');
      const alpha = pixels.filter((_, index) => index % 4 === 3);
      assert.ok(Math.max(...alpha) <= 150, 'even dense gas stays translucent');
      assert.ok(new Set(alpha).size > 60, 'many soft density levels instead of a solid silhouette');
      assert.ok(pixels[(32 * 64 + 32) * 4 + 3] > 20, 'cloud center remains visible');
      assert.equal(cloud.material.map.magFilter, THREE.LinearFilter, 'smooth edges at close camera range');
    }
  });

  it('swirls and expands the gaseous wisps without changing other projectiles or growing large', () => {
    const first = makePlasmaCloudPuffMesh(6);
    const other = makePlasmaCloudPuffMesh(6);
    const otherScale = other.children[0].scale.clone();
    updatePlasmaCloudPuff(first, 0.1);
    const positions = first.children.map((sprite) => sprite.position.clone());
    const earlyScale = first.scale.x;
    updatePlasmaCloudPuff(first, 0.8);
    assert.ok(first.scale.x > earlyScale, 'gas expands gradually during flight');
    assert.ok(first.children.every((sprite, index) => sprite.position.distanceTo(positions[index]) > 0.001), 'layers drift independently');
    assert.ok(first.children.every((sprite) => sprite.scale.x * first.scale.x < 0.4), 'clouds retain their small size');
    assert.deepEqual(other.children[0].scale, otherScale, 'shared resources do not couple per-projectile animation');
    assert.equal(other.scale.x, 1);
    assert.equal(first.children[0].material.opacity, other.children[0].material.opacity);
  });

  it('launches exactly seven independent projectiles at the animated plasma muzzle and splits total damage', () => {
    const f = fixture();
    f.bone.position.set(1, 2, 3);
    const origin = getSoldierMuzzlePos(f.world, f.shooter, PLASMA_CLOUD_PUFF);
    assert.ok(origin.distanceTo(new THREE.Vector3(1.4, 3.4, 3.2)) < 1e-10);
    const ids = createPlasmaCloudPuffVolley(f.world, origin, 'blue', f.shooter, f.target, 2, 28);
    assert.equal(ids.length, 7);
    assert.equal(f.world.query('bullet').length, 7);
    let damage = 0;
    for (const [index, id] of ids.entries()) {
      const bullet = f.world.get(id, 'bullet');
      const root = f.world.get(id, 'mesh').root;
      assert.equal(bullet.projectileType, PLASMA_CLOUD_PUFF);
      assert.equal(bullet.puffVariant, index);
      assert.equal(bullet.targetId, f.target);
      assert.equal(bullet.ownerRef, f.shooter);
      assert.ok(root.position.distanceTo(origin) < 0.05, 'spawn stays at the muzzle without a fixed Y override');
      assert.equal(root.parent, headless);
      damage += bullet.damage;
    }
    assert.equal(damage, 28, 'seven puffs share the damage of one shot');
  });

  it('fires the new weapon even for a guardsman with a personal plasma upgrade', () => {
    const f = fixture();
    _squadFireAll(f.world, f.squad, f.world.get(f.squad, 'squad'), [f.shooter], 1 / 60, { soldierEntityId: f.target });
    const bullets = f.world.query('bullet');
    assert.equal(bullets.length, 7);
    assert.ok(bullets.every((id) => f.world.get(id, 'bullet').projectileType === PLASMA_CLOUD_PUFF));
    const total = bullets.reduce((sum, id) => sum + f.world.get(id, 'bullet').damage, 0);
    assert.ok(total >= 14 && total <= 20, 'total damage remains within one normal plasma shot');
  });

  it('moves once per tick and registers every hit even when a frame passes beyond the target', () => {
    const f = fixture();
    const ids = createPlasmaCloudPuffVolley(f.world, new THREE.Vector3(0, 1, 0), 'blue', f.shooter, f.target, 1, 21);
    const root = f.world.get(ids[0], 'mesh').root;
    const start = root.position.clone();
    systemBullet(f.world, 0.1);
    assert.equal(f.world.get(ids[0], 'bullet').age, 0);
    assert.deepEqual(root.position, start, 'ordinary bullet physics skip the new type');
    systemPlasmaBullet(f.world, 0.1);
    assert.equal(f.world.get(ids[0], 'bullet').age, 0.1);
    assert.ok(root.position.distanceTo(start) > 3);
    systemPlasmaBullet(f.world, 0.5);
    f.world._flushDestroyed();
    assert.equal(f.world.query('bullet').length, 0);
    assert.ok(Math.abs(f.world.get(f.target, 'soldier').hp - 479) < 1e-9);
    assert.equal(root.parent, null, 'impacted clouds are removed');
    assert.equal(scene.particles.length, 0, 'cloud impacts no longer spawn blue or white cube particles');
  });

  it('moves one bounded blue beam with the seven clouds without extra damage', () => {
    const f = fixture();
    const ids = createPlasmaCloudPuffVolley(f.world, new THREE.Vector3(0, 1, 0), 'blue', f.shooter, f.target, 1, 21);
    const carrier = f.world.get(ids[0], 'mesh').root;
    const beam = carrier.getObjectByName('plasma_cloud_blaster');
    assert.ok(beam);
    assert.equal(beam.visible, true, 'beam is visible immediately on spawn');
    assert.equal(ids.filter((id) => f.world.get(id, 'mesh').root.getObjectByName('plasma_cloud_blaster')).length, 1);
    systemPlasmaBullet(f.world, 0.08);
    assert.equal(beam.visible, true, 'no 30% visibility delay');
    systemPlasmaBullet(f.world, 0.01);
    assert.equal(beam.visible, true);
    systemPlasmaBullet(f.world, 0.05);
    carrier.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(beam);
    assert.ok(Math.abs(bounds.min.x - carrier.position.x) < 0.025, 'beam travels with the clouds');
    assert.ok(bounds.max.x - bounds.min.x < 1.85 * 0.6 + 0.025, 'beam never stretches beyond 60% of soldier height');
    assert.equal(f.world.query('bullet').length, 7, 'visual beam creates no extra damaging projectile');
    assert.equal(f.world.get(f.target, 'soldier').hp, 500);
    systemPlasmaBullet(f.world, 0.5);
    f.world._flushDestroyed();
    assert.ok(Math.abs(f.world.get(f.target, 'soldier').hp - 479) < 1e-9);
    assert.equal(beam.parent.parent, null, 'beam is cleaned up with its cloud carrier');
    assert.equal(scene.particles.length, 0);
  });

  it('expires missed clouds and allocates nothing when the target is missing', () => {
    const f = fixture();
    const count = f.world.query('mesh').length;
    assert.deepEqual(createPlasmaCloudPuffVolley(f.world, new THREE.Vector3(), 'blue', f.shooter, 999), []);
    assert.equal(f.world.query('mesh').length, count);
    const ids = createPlasmaCloudPuffVolley(f.world, new THREE.Vector3(0, 1, 0), 'blue', f.shooter, f.target);
    const roots = ids.map((id) => f.world.get(id, 'mesh').root);
    f.world.remove(f.target, 'soldier');
    systemPlasmaBullet(f.world, 2.6);
    f.world._flushDestroyed();
    assert.equal(f.world.query('bullet').length, 0);
    assert.ok(roots.every((root) => !root.parent));
  });

  it('uses plasma weapon visuals, including on reinforced guardsmen', () => {
    const f = fixture();
    const root = f.world.get(f.shooter, 'mesh').root;
    for (const name of ['guardsmen_lasgun', 'guardsmen_plasma_pistol', 'plasma_pistol_glow']) {
      const node = new THREE.Group();
      node.name = name;
      root.add(node);
    }
    applySquadWeaponVisuals(f.world, f.squad);
    assert.equal(root.getObjectByName('guardsmen_lasgun').visible, false);
    assert.equal(root.getObjectByName('guardsmen_plasma_pistol').visible, true);
    assert.equal(root.getObjectByName('plasma_pistol_glow').visible, true);
    const added = createSoldierEntity(f.world, f.squad, 2, 'guardsmen');
    assert.ok(f.world.has(added, 'soldier'));
    _squadFireAll(f.world, f.squad, f.world.get(f.squad, 'squad'), [added], 1 / 60, { soldierEntityId: f.target });
    assert.equal(f.world.query('bullet').length, 7, 'reinforcements inherit the selected projectile');
  });
});

describe('plasma cloud puff weapon icon', () => {
  it('offers the weapon for guardsmen and only applies it to eligible squads in a mixed selection', () => {
    const f = fixture();
    const kasrkin = f.add('squad', { team: 'blue', faction: 'ig', unitType: 'kasrkin', projectileType: 'beam' });
    const enemy = f.add('squad', { team: 'red', faction: 'ig', unitType: 'guardsmen', projectileType: 'bullet' });
    const source = readFileSync(new URL('../src/hud/components/ReinforceBtnPanel.tsx', import.meta.url), 'utf8');
    const ast = ts.createSourceFile('panel.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const fn = ast.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === 'AmmoSubPanel');
    const compiled = ts.transpileModule(`export ${fn.getText(ast)}`, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const context = vm.createContext({
      exports: {}, require: () => jsxRuntime, world: f.world,
      canCommand: (team) => team === 'blue', PLASMA_CLOUD_PUFF,
      plasmaCloudPuffIcon: '/bundled/plasma_cloud_puff.svg',
      AmmoButton: 'button', AmmoPanel: 'panel', applySquadWeaponVisuals,
      isPlasmaPuffPreviewOpen: () => false, togglePlasmaPuffPreview() {},
      updateHUD() {}, window: { _multiplayerMode: false },
    });
    vm.runInContext(compiled, context);
    const render = (alive, curPtSq = 'beam') => context.exports.AmmoSubPanel({ data: { alive, curPtSq } });
    const find = (panel) => panel.props.children.find((child) => child?.props?.label === 'PLASMA CLOUD PUFF');
    const button = find(render([f.squad, kasrkin, enemy]));
    assert.ok(button);
    assert.equal(button.props.icon, '/bundled/plasma_cloud_puff.svg');
    button.props.onClick();
    assert.equal(f.world.get(f.squad, 'squad').projectileType, PLASMA_CLOUD_PUFF);
    assert.equal(f.world.get(kasrkin, 'squad').projectileType, 'beam');
    assert.equal(f.world.get(enemy, 'squad').projectileType, 'bullet');
    assert.equal(find(render([f.squad], PLASMA_CLOUD_PUFF)).props.style.opacity, 1);
    assert.equal(find(render([kasrkin, enemy])), undefined, 'icon is restricted to commandable guardsmen');
  });
});

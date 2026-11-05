import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';
import { createUnitHover, syncUnitHealthBars, faceHealthBarsToCamera } from '../src/render/unit-indicators.js';

const controllers = [];
afterEach(() => { for (const controller of controllers.splice(0)) controller.dispose(); });

function fixture() {
  const world = new World();
  const scene = new THREE.Scene();
  const hover = createUnitHover(scene, (x, z) => x * 0.1 + z * 0.2);
  controllers.push(hover);
  const add = (kind, team = 'blue', x = 0) => {
    const id = world.createEntity([]);
    const unit = { team, hp: 100, selected: false };
    world.add(id, kind, unit);
    const root = new THREE.Group();
    root.position.set(x, 0, 0);
    root._selDisc = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.025), new THREE.MeshBasicMaterial({ opacity: 0.9, transparent: true }));
    root._selDisc.visible = false;
    root._selMat = root._selDisc.material;
    root.add(root._selDisc);
    const hpBar = new THREE.Group();
    hpBar.visible = false;
    world.add(id, 'mesh', { root, hpBar });
    scene.add(root, hpBar);
    return { id, unit, root, hpBar };
  };
  const squad = (team = 'blue', count = 3) => {
    const id = world.createEntity([]);
    const members = Array.from({ length: count }, (_, i) => add('soldier', team, i * 2));
    for (const member of members) member.unit.squadId = id;
    const unit = { team, selected: false, soldiers: members.map((member) => member.id) };
    world.add(id, 'squad', unit);
    const hpBar = new THREE.Group();
    world.add(id, 'mesh', { hpBar });
    return { id, unit, members, hpBar };
  };
  return { world, scene, hover, add, squad, rings: () => scene.children.filter((child) => child.name.startsWith('unit_hover_')) };
}

describe('unit hover torus', () => {
  it('appears under every member of friendly, allied, and enemy squads without revealing health bars', () => {
    const f = fixture();
    for (const [team, faction] of [['blue', 'ig'], ['blue', 'eldar'], ['red', 'chaos']]) {
      const squad = f.squad(team);
      squad.unit.faction = faction;
      f.hover.update(f.world, { soldierEntityId: squad.members[0].id }, (_, unitTeam) => unitTeam === 'red');
      assert.equal(f.rings().length, 3);
      for (const ring of f.rings()) {
        assert.ok(ring.geometry instanceof THREE.TorusGeometry);
        assert.equal(ring.userData.pickable, false);
        assert.equal(ring.material.color.getHex(), team === 'red' ? 0xff5544 : 0x44ff88);
        const bounds = new THREE.Box3().setFromObject(ring);
        assert.ok(bounds.max.y - bounds.min.y < 0.08, 'torus lies flat at the feet');
      }
      assert.ok(squad.members.every((member) => !member.hpBar.visible));
      const previous = f.rings();
      f.hover.update(f.world, { soldierEntityId: squad.members[1].id });
      assert.deepEqual(f.rings(), previous, 'moving between squadmates reuses the rings');
      f.hover.clear();
    }
  });

  it('supports engineers, vehicles, APCs, and aircraft independently of selection', () => {
    const f = fixture();
    for (const [kind, key] of [['builder', 'builderEntityId'], ['vehicle', 'vehicleEntityId'], ['apc', 'apcEntityId'], ['jet', 'jetEntityId']]) {
      const unit = f.add(kind, 'blue');
      unit.root._selDisc.visible = true;
      f.hover.update(f.world, { [key]: unit.id });
      assert.equal(f.rings().length, 1, kind);
      f.hover.clear();
      assert.equal(f.rings().length, 0);
      assert.equal(unit.root._selDisc.visible, true, 'selected ring stays visible after hover ends');
      assert.equal(unit.root._selMat.opacity, 0.9);
      assert.equal(unit.hpBar.visible, false);
    }
  });

  it('follows motion at terrain height and removes stale rings on death, hiding, and world reset', () => {
    const f = fixture();
    const squad = f.squad();
    f.hover.update(f.world, { squadEntityId: squad.id });
    const member = squad.members[0];
    member.root.position.set(4, 12, 6);
    f.hover.refresh(f.world);
    const ring = f.scene.getObjectByName(`unit_hover_${member.id}`);
    assert.equal(ring.position.x, 4);
    assert.equal(ring.position.z, 6);
    assert.ok(Math.abs(ring.position.y - 1.7) < 1e-9, 'hover stays on the ground beneath the moving model');
    member.unit.hp = 0;
    squad.members[1].root.visible = false;
    f.hover.refresh(f.world);
    assert.equal(f.rings().length, 1);
    f.hover.refresh(new World());
    assert.equal(f.rings().length, 0, 'old world cannot leave hover rings behind');
  });

  it('clears on empty ground without changing the selected unit’s ring or health', () => {
    const f = fixture();
    const squad = f.squad();
    for (const member of squad.members) {
      member.root._selDisc.visible = true;
      member.hpBar.visible = true;
    }
    f.hover.update(f.world, { squadEntityId: squad.id });
    f.hover.update(f.world, null);
    assert.equal(f.rings().length, 0);
    assert.ok(squad.members.every((member) => member.root._selDisc.visible && member.hpBar.visible));
  });
});

describe('health bar camera alignment', () => {
  function addBar(f, kind = 'soldier') {
    const unit = f.add(kind);
    unit.root.position.set(2, 0, 1);
    const bar = unit.hpBar;
    bar.visible = true;
    bar.position.set(2, 0.06, 1);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.22));
    plane.rotation.x = -Math.PI / 2;
    bar.add(plane);
    const fg = plane.clone();
    fg.position.y = 0.005;
    fg.scale.x = 0.25;
    bar.add(fg);
    bar._fg = fg;
    bar._width = 4;
    return { bar, plane, unit };
  }

  function assertAligned(f, camera, plane) {
    faceHealthBarsToCamera(f.world, camera);
    f.scene.updateMatrixWorld(true);
    const left = plane.localToWorld(new THREE.Vector3(-2, 0, 0)).project(camera);
    const right = plane.localToWorld(new THREE.Vector3(2, 0, 0)).project(camera);
    assert.ok(Math.abs(left.y - right.y) < 1e-10, 'ends stay horizontally aligned on screen');
    assert.ok(left.x < right.x, 'local +X stays screen-right');
    const normal = new THREE.Vector3(0, 0, 1).transformDirection(plane.matrixWorld);
    const cameraNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
    assert.ok(normal.dot(cameraNormal) > 0.999999, 'bar faces the camera at every pitch');
  }

  it('orbits about the torus center through camera orbit, pitch, and roll while remaining horizontal', () => {
    const f = fixture();
    const { bar, plane, unit } = addBar(f);
    const camera = new THREE.PerspectiveCamera(60, 1.6, 0.1, 1000);
    for (const height of [2, 20, 80]) {
      for (const angle of [-Math.PI, -Math.PI / 2, 0, Math.PI / 3, Math.PI]) {
        camera.position.set(Math.cos(angle) * 30, height, Math.sin(angle) * 30);
        camera.lookAt(0, 0, 0);
        camera.rotateZ(0.15);
        assertAligned(f, camera, plane);
        const offset = bar.position.clone().sub(unit.root.position).setY(0);
        assert.ok(Math.abs(offset.length() - 1.1) < 1e-10, 'constant orbit radius around the torus');
        const rotation = camera.getWorldQuaternion(new THREE.Quaternion());
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(rotation);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(rotation);
        assert.ok(Math.abs(offset.dot(right)) < 1e-10, 'orbit stays centered below the torus relative to camera');
        assert.ok(offset.dot(up) < 0, 'bar stays on the lower side of the torus');
        assert.equal(bar.position.y, 0.1);
        const position = bar.position.clone();
        faceHealthBarsToCamera(f.world, camera);
        assert.ok(bar.position.distanceTo(position) < 1e-10, 'repeated frames cannot accumulate orbit drift');
        const filledLeft = bar._fg.position.x - bar._fg.scale.x * bar._width / 2;
        assert.equal(filledLeft, -2, 'filled portion remains pinned to screen-left');
      }
    }
  });

  it('follows unit movement and terrain for troops, engineers, transports, vehicles, and aircraft', () => {
    const f = fixture();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 20, -30);
    camera.lookAt(0, 0, 0);
    for (const kind of ['soldier', 'builder', 'apc', 'vehicle', 'jet']) {
      const { bar, unit } = addBar(f, kind);
      const terrain = (x, z) => x * 0.1 + z * 0.2;
      faceHealthBarsToCamera(f.world, camera, terrain);
      const first = bar.position.clone();
      unit.root.position.add(new THREE.Vector3(5, 12, 7));
      unit.root.rotation.y = 1.3;
      faceHealthBarsToCamera(f.world, camera, terrain);
      assert.ok(Math.abs(bar.position.x - first.x - 5) < 1e-10, kind);
      assert.ok(Math.abs(bar.position.z - first.z - 7) < 1e-10, kind);
      assert.equal(bar.position.y, terrain(bar.position.x, bar.position.z) + 0.1, 'height follows the torus terrain, including flying units');
      unit.root._selDisc.geometry = new THREE.TorusGeometry(3, 0.05);
      faceHealthBarsToCamera(f.world, camera, terrain);
      const offset = bar.position.clone().sub(unit.root.position).setY(0);
      assert.ok(Math.abs(offset.length() - (3 * 1.12 + 0.26)) < 1e-10, 'orbit radius accounts for torus size');
    }
    const { bar } = addBar(f, 'building');
    const position = bar.position.clone();
    faceHealthBarsToCamera(f.world, camera);
    assert.deepEqual(bar.position, position, 'building bars retain their existing location');
  });

  it('handles transformed parents and leaves hidden bars untouched', () => {
    const f = fixture();
    const { bar, plane } = addBar(f);
    const parent = new THREE.Group();
    parent.rotation.set(0.3, -0.8, 0.1);
    f.scene.add(parent);
    parent.add(bar);
    const cameraRig = new THREE.Group();
    cameraRig.rotation.set(0, 0.7, 0.2);
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(20, 30, 40);
    camera.lookAt(0, 0, 0);
    cameraRig.add(camera);
    assertAligned(f, camera, plane);
    bar.visible = false;
    const rotation = bar.quaternion.clone();
    camera.rotateY(1);
    faceHealthBarsToCamera(f.world, camera);
    assert.ok(bar.quaternion.equals(rotation));
  });
});

describe('selected and hovered unit health bars', () => {
  it('shows only the hovered soldier until its squad is selected, for own, allied, and enemy squads', () => {
    const f = fixture();
    for (const [team, faction] of [['blue', 'ig'], ['blue', 'eldar'], ['red', 'chaos']]) {
      const squad = f.squad(team);
      squad.unit.faction = faction;
      const sync = (selection = {}) => syncUnitHealthBars(f.world, { ...selection, hoveredUnitId: f.hover.hoveredUnitId });
      f.hover.update(f.world, { soldierEntityId: squad.members[0].id, squadEntityId: squad.id });
      sync();
      assert.deepEqual(squad.members.map((member) => member.hpBar.visible), [true, false, false]);
      f.hover.update(f.world, { soldierEntityId: squad.members[1].id, squadEntityId: squad.id });
      sync();
      assert.deepEqual(squad.members.map((member) => member.hpBar.visible), [false, true, false]);
      const selection = team === 'red' ? { enemySquadId: squad.id } : { unitIds: [squad.id] };
      sync(selection);
      assert.ok(squad.members.every((member) => member.hpBar.visible), 'click selection reveals the whole squad');
      f.hover.clear();
      sync(selection);
      assert.ok(squad.members.every((member) => member.hpBar.visible), 'leaving the unit keeps selected squad HP visible');
      sync();
      assert.ok(squad.members.every((member) => !member.hpBar.visible), 'deselecting and leaving hides HP');
    }
  });

  it('keeps selected squad HP visible while hovering a single enemy and hides hover HP on leaving or world reset', () => {
    const f = fixture();
    const own = f.squad();
    const enemy = f.squad('red');
    f.hover.update(f.world, { soldierEntityId: enemy.members[1].id });
    const sync = () => syncUnitHealthBars(f.world, { unitIds: [own.id], enemySquadId: enemy.id, hoveredUnitId: f.hover.hoveredUnitId });
    sync();
    assert.ok(own.members.every((member) => member.hpBar.visible));
    assert.deepEqual(enemy.members.map((member) => member.hpBar.visible), [false, true, false]);
    f.hover.update(f.world, null);
    sync();
    assert.ok(enemy.members.every((member) => !member.hpBar.visible));
    f.hover.update(f.world, { soldierEntityId: enemy.members[1].id });
    f.hover.refresh(new World());
    assert.equal(f.hover.hoveredUnitId, null);
    sync();
    assert.ok(enemy.members.every((member) => !member.hpBar.visible));
  });

  it('supports direct hover HP for engineers and vehicles while excluding dead or hidden units and squad-only hits', () => {
    const f = fixture();
    for (const [kind, key] of [['builder', 'builderEntityId'], ['vehicle', 'vehicleEntityId'], ['apc', 'apcEntityId'], ['jet', 'jetEntityId']]) {
      const unit = f.add(kind);
      f.hover.update(f.world, { [key]: unit.id });
      const sync = () => syncUnitHealthBars(f.world, { hoveredUnitId: f.hover.hoveredUnitId });
      sync();
      assert.equal(unit.hpBar.visible, true, kind);
      unit.root.visible = false;
      sync();
      assert.equal(unit.hpBar.visible, false);
      unit.root.visible = true;
      unit.unit.hp = 0;
      sync();
      assert.equal(unit.hpBar.visible, false);
    }
    const squad = f.squad();
    f.hover.update(f.world, { squadEntityId: squad.id });
    assert.equal(f.hover.hoveredUnitId, null, 'a squad hit alone does not identify an individual soldier');
    syncUnitHealthBars(f.world, { hoveredUnitId: f.hover.hoveredUnitId });
    assert.ok(squad.members.every((member) => !member.hpBar.visible));
  });

  it('shows HP only for selected troops, engineers, and an explicitly inspected enemy squad', () => {
    const f = fixture();
    const own = f.squad();
    const enemy = f.squad('red');
    const builder = f.add('builder');
    const vehicles = ['apc', 'vehicle', 'jet'].map((kind) => f.add(kind));
    syncUnitHealthBars(f.world);
    assert.ok([...own.members, ...enemy.members, builder, ...vehicles].every((unit) => !unit.hpBar.visible));
    syncUnitHealthBars(f.world, { unitIds: [own.id, ...vehicles.map((unit) => unit.id)], builderId: builder.id, enemySquadId: enemy.id });
    assert.ok([...own.members, builder, ...vehicles].every((unit) => unit.hpBar.visible));
    assert.ok(enemy.members.every((unit) => !unit.hpBar.visible), 'attack target is not a selected enemy');
    assert.equal(own.hpBar.visible, false, 'no duplicate squad HP bar');
    syncUnitHealthBars(f.world, { enemySquadId: enemy.id });
    assert.ok(enemy.members.every((unit) => unit.hpBar.visible));
    assert.ok([...own.members, builder, ...vehicles].every((unit) => !unit.hpBar.visible));
    syncUnitHealthBars(f.world);
    assert.ok(enemy.members.every((unit) => !unit.hpBar.visible));
  });

  it('keeps HP hidden for passengers and after unselected reinforcements, landings, or unloads', () => {
    const f = fixture();
    const squad = f.squad();
    squad.members[0].root.visible = false;
    syncUnitHealthBars(f.world, { unitIds: [squad.id] });
    assert.equal(squad.members[0].hpBar.visible, false);
    assert.equal(squad.members[1].hpBar.visible, true);
    squad.members[0].root.visible = true;
    for (const member of squad.members) member.hpBar.visible = true;
    squad.hpBar.visible = true;
    syncUnitHealthBars(f.world);
    assert.ok(squad.members.every((member) => !member.hpBar.visible));
    assert.equal(squad.hpBar.visible, false);
    syncUnitHealthBars(f.world, { unitIds: [squad.id] });
    assert.ok(squad.members.every((member) => member.hpBar.visible), 'selected units regain HP bars after unloading');
  });

  it('leaves building health bars and non-health progress bars unchanged', () => {
    const f = fixture();
    const building = f.add('building');
    building.hpBar.visible = true;
    const squad = f.squad();
    const mesh = f.world.get(squad.members[0].id, 'mesh');
    mesh.reloadBar = new THREE.Group();
    syncUnitHealthBars(f.world);
    assert.equal(building.hpBar.visible, true);
    assert.equal(mesh.reloadBar.visible, true);
  });
});

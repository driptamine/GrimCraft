import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
await import('../src/scene.js');
const scene = await import('../src/scene.js');
const selection = await import('../src/input/selection.js');
const { World } = await import('../src/ecs.js');
const { alphaForFacing, attachViewmodel, copyGunPose, detachViewmodel, fpsAimPoint, fpsLook, fpsShotTarget, getCameraMode, getRideInfo, getViewmodelMuzzleWorldPos, gunPoseSnapshot, hasViewmodel, initGunPosePanel, isGunEditMode, isShooterMode, readGunPosePanel, resolveFpsTarget, setCameraMode, staticizeViewmodelTemplate, syncGunPosePanel, tickFirstPerson, toggleCameraFps, toggleGunEditMode, updateFirstPersonCamera, updateThirdPersonCamera, yieldSlotBehind, _setGunPoseForTests, _setLasgunTemplateForTests } = await import('../src/camera-fps.js');

function fakeWorld() {
  const store = new Map();
  return {
    get: (id, comp) => (store.get(id) || {})[comp],
    has: (id, comp) => store.get(id) !== undefined && store.get(id)[comp] !== undefined,
    _put: (id, comp, value) => {
      if (!store.has(id)) store.set(id, {});
      store.get(id)[comp] = value;
    },
  };
}

describe('first-person camera', () => {
  it('maps facing to orbit yaw so the initial view matches', () => {
    for (const [fx, fz] of [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1]]) {
      const a = alphaForFacing(fx, fz);
      const len = Math.hypot(fx, fz);
      assert.ok(Math.abs(-Math.cos(a) - fx / len) < 1e-9, `x ${fx},${fz}`);
      assert.ok(Math.abs(-Math.sin(a) - fz / len) < 1e-9, `z ${fx},${fz}`);
    }
  });

  it('resolves the first living soldier with a mesh', () => {
    const w = fakeWorld();
    w._put('sq', 'squad', { soldiers: [null, 'dead', 'live'], facing: { x: 0, z: 1 } });
    w._put('live', 'soldier', {});
    w._put('live', 'mesh', { root: { position: { x: 5, y: 0, z: 7 } } });
    const t = resolveFpsTarget(w, ['sq']);
    assert.equal(t.soldierId, 'live');
    assert.deepEqual([t.pos.x, t.pos.z], [5, 7]);
    assert.equal(resolveFpsTarget(w, []), null);
    assert.equal(resolveFpsTarget(w, ['missing']), null);
  });

  it('refuses fps without a soldier and accepts orbit always', () => {
    assert.equal(getCameraMode(), 'orbit');
    assert.equal(setCameraMode('fps'), 'orbit');
    assert.equal(setCameraMode('nope'), 'orbit');
    assert.equal(getCameraMode(), 'orbit');
  });

  it('clones the lasgun onto the camera, unpickable, detachable', () => {
    const root = new THREE.Group();
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1));
    gun.name = 'guardsmen_lasgun';
    gun.rotation.y = 0.5;
    root.add(gun);
    root.position.set(10, 0, 20);
    root.updateMatrixWorld(true);
    const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    cam.position.set(10, 1.6, 20);
    cam.lookAt(11, 1.5, 21);
    assert.equal(attachViewmodel(cam, root), true);
    assert.equal(cam.children.length, 1);
    const vm = cam.children[0];
    assert.deepEqual([vm.position.x, vm.position.y, vm.position.z], [0.331, -0.108, -0.994]);
    let pickable = 0;
    vm.traverse((child) => {
      if (child.userData.pickable !== false) pickable++;
    });
    assert.equal(pickable, 0);
    // World aim preserved through the camera-relative mount, plus the
    // fixed CS toe-in on top.
    const gunQ = gun.getWorldQuaternion(new THREE.Quaternion());
    const mount = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.259, 0.068, -0.552));
    const expected = cam.quaternion.clone().invert().multiply(gunQ).multiply(mount);
    assert.ok(expected.angleTo(vm.quaternion) < 1e-6, 'aim preserved with mount yaw');
    detachViewmodel();
    assert.equal(cam.children.length, 0);
    assert.equal(attachViewmodel(cam, new THREE.Group()), false);
  });

  it('shows alternate and procedural guns, even when hidden', () => {
    // Grenadier layout: hidden lasgun, visible grenade launcher.
    const root = new THREE.Group();
    const lasgun = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1), new THREE.MeshBasicMaterial());
    lasgun.name = 'guardsmen_lasgun';
    lasgun.visible = false;
    const launcher = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.9), new THREE.MeshBasicMaterial());
    launcher.name = 'guardsmen_grenade_launcher';
    root.add(lasgun, launcher);
    root.updateMatrixWorld(true);
    const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    assert.equal(attachViewmodel(cam, root), true);
    assert.equal(cam.children.length, 1);
    assert.equal(cam.children[0].visible, true, 'hidden source still shows a gun');
    detachViewmodel();
    // Procedural layout: no lasgun node at all, gun parts under gun_root.
    const proot = new THREE.Group();
    const gunRoot = new THREE.Group();
    gunRoot.name = 'gun_root';
    const gb = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.055, 0.65), new THREE.MeshBasicMaterial());
    gb.name = 'gb';
    gunRoot.add(gb);
    proot.add(gunRoot);
    proot.updateMatrixWorld(true);
    assert.equal(attachViewmodel(cam, proot), true);
    assert.equal(cam.children.length, 1);
    assert.equal(cam.children[0].visible, true);
    detachViewmodel();
    assert.equal(cam.children.length, 0);
  });

  it('keeps the gun on the camera for the whole ride, even at idle', () => {
    const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    cam.alpha = 0;
    cam.beta = 1;
    scene.__setSceneCameraForTests(new THREE.Scene(), cam);
    const w = new World();
    scene.setWorld(w);
    const qid = w.createEntity(['squad']);
    const sid = w.createEntity(['soldier']);
    const root = new THREE.Group();
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1), new THREE.MeshBasicMaterial());
    gun.name = 'guardsmen_lasgun';
    root.add(gun);
    root.position.set(0, 0, 0);
    root.updateMatrixWorld(true);
    w.add(qid, 'squad', {
      position: new THREE.Vector3(0, 0, 0),
      facing: { x: 0, z: 1 },
      soldiers: [sid],
      team: 'blue',
    });
    w.add(sid, 'soldier', {});
    w.add(sid, 'mesh', { root });
    scene.setSelSquads([qid]);
    try {
      assert.equal(setCameraMode('fps'), 'fps');
      assert.equal(updateFirstPersonCamera(), true);
      assert.equal(hasViewmodel(cam), true);
      detachViewmodel();
      assert.equal(hasViewmodel(cam), false);
      assert.equal(updateFirstPersonCamera(), true);
      assert.equal(hasViewmodel(cam), true, 'gun re-attached after loss');
      assert.equal(tickFirstPerson(0.016, {}), true, 'idle keeps riding');
      assert.equal(hasViewmodel(cam), true, 'gun stays at idle');
    } finally {
      setCameraMode('orbit');
      scene.setSelSquads([]);
      detachViewmodel();
    }
  });

  it('maps picks to attack orders, rejecting ground/friends/self', () => {
    const w = fakeWorld();
    w._put('me', 'squad', { team: 'blue' });
    w._put('foe', 'squad', { team: 'red' });
    w._put('pal', 'squad', { team: 'blue' });
    w._put('es', 'soldier', { squadId: 'foe' });
    assert.deepEqual(fpsShotTarget(w, { soldierEntityId: 'es' }, 'me', 'blue'), { sid: 'foe', targetSoldierId: 'es' });
    assert.deepEqual(fpsShotTarget(w, { squadEntityId: 'foe' }, 'me', 'blue'), { sid: 'foe', targetSoldierId: null });
    assert.equal(fpsShotTarget(w, { squadEntityId: 'pal' }, 'me', 'blue'), null, 'no friendly fire');
    assert.equal(fpsShotTarget(w, { squadEntityId: 'me' }, 'me', 'blue'), null, 'not self');
    assert.equal(fpsShotTarget(w, null, 'me', 'blue'), null, 'ground is no shot');
    assert.equal(fpsShotTarget(w, { soldierEntityId: 'gone' }, 'me', 'blue'), null, 'dead soldier is no shot');
  });

  it('sees past the ridden soldier to the enemy behind it', () => {
    const fakeScene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, 800 / 600, 0.05, 100);
    cam.position.set(0, 1.6, 0);
    cam.lookAt(0, 1.2, 10);
    cam.updateMatrixWorld(true);
    const scope = {
      scene: fakeScene,
      camera: cam,
      canvas: { getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }) },
    };
    const own = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
    own.position.set(0, 1.5, 5);
    own.userData = { soldierEntityId: 'own-sol', squadEntityId: 'own-sq' };
    const foe = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
    foe.position.set(0, 1.5, 10);
    foe.userData = { soldierEntityId: 'foe-sol', squadEntityId: 'foe-sq' };
    fakeScene.add(own, foe);
    fakeScene.updateMatrixWorld(true);

    const raw = scene.pickAt(400, 300, () => true, scope);
    assert.equal(raw.pickedMesh.userData.squadEntityId, 'own-sq', 'center ray strikes the shooter first');
    const hit = selection.pickFpsTargetMesh(400, 300, 'own-sq', scope);
    assert.equal(hit.meta.squadEntityId, 'foe-sq', 'fps pick skips the ridden squad');

    const w = fakeWorld();
    w._put('own-sq', 'squad', { team: 'blue' });
    w._put('foe-sq', 'squad', { team: 'red' });
    w._put('foe-sol', 'soldier', { squadId: 'foe-sq' });
    assert.deepEqual(fpsShotTarget(w, hit.meta, 'own-sq', 'blue'), { sid: 'foe-sq', targetSoldierId: 'foe-sol' });
  });

  it('toggles orbit/fps through one shared entry (TAB and button)', () => {
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cam.alpha = 0;
    cam.beta = 1;
    scene.__setSceneCameraForTests(new THREE.Scene(), cam);
    const w = new World();
    scene.setWorld(w);
    const qid = w.createEntity(['squad']);
    const sid = w.createEntity(['soldier']);
    w.add(qid, 'squad', {
      position: new THREE.Vector3(0, 0, 0),
      facing: { x: 0, z: 1 },
      speed: 6,
      soldiers: [sid],
      moveOrder: null,
      stopped: true,
      flyOrder: null,
      forcedTarget: null,
      forcedSoldierId: null,
      team: 'blue',
    });
    w.add(sid, 'soldier', {});
    w.add(sid, 'mesh', { root: { position: new THREE.Vector3(0, 0, 0) } });
    scene.setSelSquads([qid]);
    try {
      assert.equal(getCameraMode(), 'orbit');
      assert.equal(isShooterMode(), false);
      assert.equal(toggleCameraFps(), 'fps');
      assert.equal(getCameraMode(), 'fps');
      assert.equal(toggleCameraFps(), 'third');
      assert.equal(getCameraMode(), 'third');
      assert.equal(isShooterMode(), true);
      assert.equal(toggleCameraFps(), 'orbit');
      assert.equal(getCameraMode(), 'orbit');
    } finally {
      setCameraMode('orbit');
      scene.setSelSquads([]);
    }
  });

  it('aims through the centered crosshair while pointer-locked', () => {
    const rect = { left: 40, top: 80, width: 800, height: 600 };
    assert.deepEqual(fpsAimPoint(123, 456, true, rect), { x: 440, y: 380 });
    assert.deepEqual(fpsAimPoint(123, 456, false, rect), { x: 123, y: 456 });
    assert.deepEqual(fpsAimPoint(123, 456, true, null), { x: 123, y: 456 });
    assert.deepEqual(fpsAimPoint(123, 456, true, { left: 0, top: 0, width: NaN, height: 600 }), { x: 123, y: 456 });
  });

  it('looks with cursor deltas only under pointer lock', () => {
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cam.alpha = 1;
    cam.beta = 1;
    scene.__setSceneCameraForTests(new THREE.Scene(), cam);
    assert.equal(fpsLook(100, 50), false, 'orbit mode ignores look');
    assert.equal(cam.alpha, 1);
    globalThis.document.pointerLockElement = {};
    scene.setSelSquads([]);
    assert.equal(fpsLook(100, 50), false, 'still orbit without fps');
    delete globalThis.document.pointerLockElement;
  });

  it('drives the ridden squad with WASD through short orders', () => {
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cam.alpha = 0;
    cam.beta = 1;
    scene.__setSceneCameraForTests(new THREE.Scene(), cam);
    const w = new World();
    scene.setWorld(w);
    const qid = w.createEntity(['squad']);
    const sid = w.createEntity(['soldier']);
    w.add(qid, 'squad', {
      position: new THREE.Vector3(0, 0, 0),
      facing: new THREE.Vector3(0, 0, 1),
      speed: 6,
      soldiers: [sid],
      moveOrder: null,
      stopped: true,
      flyOrder: null,
      forcedTarget: 'x',
      forcedSoldierId: 'y',
    });
    w.add(sid, 'soldier', {});
    w.add(sid, 'mesh', { root: { position: new THREE.Vector3(0, 0, 0) } });
    scene.setSelSquads([qid]);
    assert.equal(setCameraMode('fps'), 'fps');
    const driveKeys = {};
    globalThis.document.pointerLockElement = {};
    const lookFrom = cam.alpha;
    const pitchFrom = cam.beta;
    assert.equal(fpsLook(100, -50), true);
    assert.ok(Math.abs(cam.alpha - (lookFrom + 0.28)) < 1e-9, `look yaw ${cam.alpha}`);
    assert.ok(Math.abs(cam.beta - (pitchFrom + 0.11)) < 1e-9, `look pitch ${cam.beta}`);
    delete globalThis.document.pointerLockElement;
    cam.alpha = 0;
    driveKeys['KeyW'] = true;
    try {
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      const squad = w.get(qid, 'squad');
      // alpha 0 faces -X: order 7 units ahead that way.
      assert.ok(Math.abs(squad.moveOrder.x + 7) < 1e-9, `order x ${squad.moveOrder.x}`);
      assert.ok(Math.abs(squad.moveOrder.z) < 1e-9, `order z ${squad.moveOrder.z}`);
      assert.equal(squad.stopped, false);
      assert.equal(squad.forcedTarget, null);
      assert.equal(squad.forcedSoldierId, null);
      const first = squad.moveOrder;
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      assert.equal(squad.moveOrder, first, 'no per-frame churn');
      squad.position.set(-6, 0, 0);
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      assert.notEqual(squad.moveOrder, first, 'reissued near arrival');
      // Releasing the key cancels the drive order instead of walking it out.
      delete driveKeys['KeyW'];
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      assert.equal(squad.moveOrder, null, 'drive order cancelled on release');
      assert.equal(squad.stopped, true, 'squad halts on release');
      assert.equal(squad._fpsDriveAngle, undefined, 'drive angle reset');
      // Foreign (non-drive) orders survive key release untouched.
      const foreign = new THREE.Vector3(10, 0, 0);
      squad.moveOrder = foreign;
      squad.stopped = false;
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      assert.equal(squad.moveOrder, foreign, 'foreign order preserved');
      assert.equal(squad.stopped, false, 'foreign order keeps running');
      // IJKL mirrors WASD: I/K forward/back, J/L strafe, WASD untouched.
      const px = squad.position.x;
      const pz = squad.position.z;
      driveKeys['KeyI'] = true;
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      assert.ok(Math.abs(squad.moveOrder.x - (px - 7)) < 1e-9, `I forward x ${squad.moveOrder.x}`);
      assert.equal(squad.moveOrder._fpsDrive, true, 'drive order tagged');
      delete driveKeys['KeyI'];
      driveKeys['KeyK'] = true;
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      assert.ok(Math.abs(squad.moveOrder.x - (px + 7)) < 1e-9, `K back x ${squad.moveOrder.x}`);
      delete driveKeys['KeyK'];
      driveKeys['KeyJ'] = true;
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      assert.ok(Math.abs(squad.moveOrder.z - (pz + 7)) < 1e-9, `J left z ${squad.moveOrder.z}`);
      delete driveKeys['KeyJ'];
      driveKeys['KeyL'] = true;
      assert.equal(tickFirstPerson(0.016, driveKeys), true);
      assert.ok(Math.abs(squad.moveOrder.z - (pz - 7)) < 1e-9, `L right z ${squad.moveOrder.z}`);
      delete driveKeys['KeyL'];
    } finally {
      setCameraMode('orbit');
      scene.setSelSquads([]);
    }
  });

  it('reports the viewmodel muzzle in world space', () => {
    const template = new THREE.Group();
    const part = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.5), new THREE.MeshBasicMaterial());
    part.position.set(0, 0, -0.5);
    template.add(part);
    template.updateMatrixWorld(true);
    _setLasgunTemplateForTests(template);
    const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    try {
      assert.equal(attachViewmodel(cam, null), true);
      cam.updateMatrixWorld(true);
      const muzzle = getViewmodelMuzzleWorldPos();
      assert.ok(muzzle, 'muzzle reported');
      assert.ok(Math.abs(muzzle.x - 0.331) < 0.05, `muzzle x ${muzzle.x}`);
      assert.ok(muzzle.z < -0.9, `muzzle forward ${muzzle.z}`);
      detachViewmodel();
      assert.equal(getViewmodelMuzzleWorldPos(), null, 'no gun, no muzzle');
    } finally {
      _setLasgunTemplateForTests(null);
      detachViewmodel();
    }
  });

  it('rides third person behind the soldier, dropping to orbit without one', () => {
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cam.alpha = 0;
    cam.beta = 1;
    scene.__setSceneCameraForTests(new THREE.Scene(), cam);
    const w = new World();
    scene.setWorld(w);
    const qid = w.createEntity(['squad']);
    const sid = w.createEntity(['soldier']);
    w.add(qid, 'squad', {
      position: new THREE.Vector3(0, 0, 0),
      facing: { x: 0, z: 1 },
      soldiers: [sid],
      team: 'blue',
    });
    w.add(sid, 'soldier', {});
    w.add(sid, 'mesh', { root: { position: new THREE.Vector3(0, 0, 0) } });
    scene.setSelSquads([qid]);
    try {
      assert.equal(setCameraMode('third'), 'third');
      assert.equal(updateThirdPersonCamera(), true);
      // Facing +Z: the camera sits behind (negative Z of the soldier).
      assert.ok(cam.position.z < 0, `camera behind, z ${cam.position.z}`);
      assert.ok(cam.position.y > 1.5, `camera above, y ${cam.position.y}`);
      assert.equal(hasViewmodel(cam), false, 'third person shows the real soldier');
      // GTA-style aim: the whole head sits below the screen-center ray, so
      // the crosshair clears the soldier instead of lying on his torso.
      cam.updateMatrixWorld(true);
      const headTop = new THREE.Vector3(0, 2.0, 0);
      cam.worldToLocal(headTop);
      assert.ok(headTop.y < 0, `crosshair above the head, local y ${headTop.y}`);
      assert.ok(headTop.y > -3, `crosshair still near the action, local y ${headTop.y}`);
      scene.setSelSquads([]);
      assert.equal(updateThirdPersonCamera(), false, 'no soldier drops out');
      assert.equal(getCameraMode(), 'orbit');
    } finally {
      setCameraMode('orbit');
      scene.setSelSquads([]);
    }
  });

  it('de-skins the lasgun template so the clone renders bind-pose', () => {
    const template = new THREE.Group();
    const bone = new THREE.Bone();
    bone.name = 'bone_ig_hand_weapon_r';
    template.add(bone);
    const skinned = new THREE.SkinnedMesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.5),
      new THREE.MeshBasicMaterial(),
    );
    skinned.name = 'guardsmen_lasgun';
    skinned.position.set(0, 0.1, 0);
    bone.add(skinned);
    template.updateMatrixWorld(true);
    const out = staticizeViewmodelTemplate(template);
    let skinnedCount = 0;
    let staticCount = 0;
    out.traverse((c) => {
      if (c.isSkinnedMesh) skinnedCount++;
      else if (c.isMesh) staticCount++;
    });
    assert.equal(skinnedCount, 0, 'no skinned meshes left');
    assert.equal(staticCount, 1, 'one static lasgun');
    const gun = out.getObjectByName('guardsmen_lasgun');
    assert.ok(gun && !gun.isSkinnedMesh, 'name and transform preserved');
    assert.ok(Math.abs(gun.position.y - 0.1) < 1e-9, 'local transform preserved');
    // The converted template mounts as the viewmodel.
    _setLasgunTemplateForTests(out);
    const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    try {
      assert.equal(attachViewmodel(cam, null), true);
      assert.equal(cam.children.length, 1);
      assert.equal(cam.children[0].isSkinnedMesh || false, false);
    } finally {
      _setLasgunTemplateForTests(null);
      detachViewmodel();
    }
  });

  it('reports ride info and yields squadmates behind the ridden soldier', () => {
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cam.alpha = 0;
    cam.beta = 1;
    scene.__setSceneCameraForTests(new THREE.Scene(), cam);
    const w = new World();
    scene.setWorld(w);
    const qid = w.createEntity(['squad']);
    const sid = w.createEntity(['soldier']);
    w.add(qid, 'squad', {
      position: new THREE.Vector3(0, 0, 0),
      facing: { x: 0, z: 1 },
      soldiers: [sid],
      team: 'blue',
    });
    w.add(sid, 'soldier', {});
    w.add(sid, 'mesh', { root: { position: new THREE.Vector3(0, 0, 0) } });
    scene.setSelSquads([qid]);
    try {
      assert.equal(getRideInfo(), null, 'no ride in orbit');
      assert.equal(setCameraMode('fps'), 'fps');
      const ride = getRideInfo();
      assert.equal(ride.squadId, qid);
      assert.equal(ride.soldierId, sid);
      // Facing +Z realigns alpha: ride direction matches facing.
      assert.ok(Math.abs(ride.dx) < 1e-9, `ride dx ${ride.dx}`);
      assert.ok(Math.abs(ride.dz - 1) < 1e-9, `ride dz ${ride.dz}`);
      // Squadmate 5 ahead lands 2.5 behind, fanned sideways.
      const ahead = yieldSlotBehind(5, 0, 0, 0, 1, 0, 1);
      assert.ok(ahead, 'ahead slot yields');
      assert.ok(ahead[0] < 0, `behind the rider, got ${ahead[0]}`);
      assert.notEqual(ahead[1], 0, 'sideways fan');
      assert.equal(yieldSlotBehind(-5, 0, 0, 0, 1, 0, 1), null, 'behind stays');
      assert.equal(yieldSlotBehind(5, 5, 0, 0, 1, 0, 1), null, 'wide stays');
      assert.equal(yieldSlotBehind(40, 0, 0, 0, 1, 0, 1), null, 'far stays');
    } finally {
      setCameraMode('orbit');
      scene.setSelSquads([]);
    }
  });

  it('mounts the dedicated lasgun file with no soldier root needed', () => {
    const template = new THREE.Group();
    template.name = 'guardsmen_lasgun';
    template.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.5), new THREE.MeshBasicMaterial()));
    template.updateMatrixWorld(true);
    _setLasgunTemplateForTests(template);
    const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    try {
      assert.equal(attachViewmodel(cam, null), true, 'template needs no soldier root');
      assert.equal(cam.children.length, 1);
      const vm = cam.children[0];
      assert.deepEqual([vm.position.x, vm.position.y, vm.position.z], [0.331, -0.108, -0.994]);
      const mount = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.259, 0.068, -0.552));
      assert.ok(Math.abs(vm.quaternion.y - mount.y) < 1e-9, `CS toe-in yaw, got ${vm.quaternion.y}`);
      assert.ok(Math.abs(vm.quaternion.w - mount.w) < 1e-9, 'upright mount');
      assert.equal(vm.visible, true);
    } finally {
      _setLasgunTemplateForTests(null);
      detachViewmodel();
    }
  });

  it('poses the gun live in game, then copies the pose', () => {
    const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    cam.alpha = 0;
    cam.beta = 1;
    scene.__setSceneCameraForTests(new THREE.Scene(), cam);
    const w = new World();
    scene.setWorld(w);
    const qid = w.createEntity(['squad']);
    const sid = w.createEntity(['soldier']);
    const root = new THREE.Group();
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.5), new THREE.MeshBasicMaterial());
    gun.name = 'guardsmen_lasgun';
    root.add(gun);
    root.position.set(0, 0, 0);
    root.updateMatrixWorld(true);
    w.add(qid, 'squad', {
      position: new THREE.Vector3(0, 0, 0),
      facing: { x: 0, z: 1 },
      soldiers: [sid],
      team: 'blue',
    });
    w.add(sid, 'soldier', {});
    w.add(sid, 'mesh', { root });
    scene.setSelSquads([qid]);
    _setGunPoseForTests([0.331, -0.108, -0.994], [0.259, 0.068, -0.552]);
    const template = new THREE.Group();
    template.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.5), new THREE.MeshBasicMaterial()));
    template.updateMatrixWorld(true);
    _setLasgunTemplateForTests(template);
    const panelHandlers = {};
    const panelEls = { gunPosePanel: { style: {} } };
    for (const id of ['gunPosX', 'gunPosY', 'gunPosZ', 'gunRotX', 'gunRotY', 'gunRotZ', 'gunScale']) {
      panelEls[id] = {
        value: '',
        addEventListener: (event, fn) => { panelHandlers[`${id}:${event}`] = fn; },
      };
      panelEls[`${id}v`] = { textContent: '' };
    }
    const origGetById = globalThis.document.getElementById;
    globalThis.document.getElementById = (id) => panelEls[id] || null;
    try {
      assert.equal(setCameraMode('fps'), 'fps');
      assert.equal(isGunEditMode(), false);
      assert.equal(toggleGunEditMode(), true, 'P enters edit mode');
      assert.equal(initGunPosePanel(), false, 'wiring is idempotent');
      assert.equal(updateFirstPersonCamera(), true);
      assert.equal(hasViewmodel(cam), true);
      const y0 = cam.children[0].position.y;
      // I lifts the gun, squad stands still (no drive order issued).
      assert.equal(tickFirstPerson(0.5, { KeyI: true }), true);
      assert.ok(Math.abs(cam.children[0].position.y - (y0 + 0.3)) < 1e-9, 'gun lifted live');
      assert.equal(w.get(qid, 'squad').moveOrder ?? null, null, 'no driving while editing');
      // Shift+J yaws the gun.
      const yaw0 = gunPoseSnapshot().rot[1];
      assert.equal(tickFirstPerson(0.5, { ShiftLeft: true, KeyJ: true }), true);
      assert.ok(Math.abs(gunPoseSnapshot().rot[1] - (yaw0 + 0.7)) < 1e-9, 'gun yawed live');
      const copied = copyGunPose();
      assert.ok(copied.includes('"pos"') && copied.includes('"rot"'), 'pose copied as JSON');
      // Slider -> state: drag pos X to 0.55, state follows.
      panelEls.gunPosX.value = '0.55';
      assert.equal(readGunPosePanel(), true);
      assert.ok(Math.abs(gunPoseSnapshot().pos[0] - 0.55) < 1e-9, 'slider drives mount');
      // State -> slider: keyboard nudge then sync pushes values out.
      assert.equal(tickFirstPerson(0.5, { KeyK: true }), true);
      syncGunPosePanel();
      assert.equal(panelEls.gunPosX.value, 0.55, 'untouched slider keeps value');
      assert.ok(panelEls.gunPosYv.textContent.includes('-'), 'value labels refresh');
      assert.equal(toggleGunEditMode(), false, 'P exits edit mode');
      assert.equal(isGunEditMode(), false);
      assert.equal(panelEls.gunPosePanel.style.display, 'none', 'panel hides on exit');
    } finally {
      globalThis.document.getElementById = origGetById;
      if (isGunEditMode()) toggleGunEditMode();
      _setLasgunTemplateForTests(null);
      _setGunPoseForTests([0.331, -0.108, -0.994], [0.259, 0.068, -0.552]);
      setCameraMode('orbit');
      scene.setSelSquads([]);
      detachViewmodel();
    }
  });
});
